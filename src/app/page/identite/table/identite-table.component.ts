import {Component, signal, Signal, viewChild, WritableSignal} from '@angular/core';
import {Column} from '../../../common/table/column/column';
import {Order} from '../../../common/search/filter';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {IdentiteService} from '../identite.service';
import {SearchRequest} from '../../../common/search/searchRequest';
import {Observable} from 'rxjs';
import {SearchResult} from '../../../common/search/searchResult';
import {TableComponent} from '../../../common/table/table.component';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {MethodColumn} from '../../../common/table/column/method-column';
import {PersonnePhysiqueDialogComponent} from '../dialog/personne-physique-dialog.component';
import {LinkColumn} from '../../../common/table/column/link-column';
import {IdentiteLight, IdentiteType} from '../identite.model';
import {Adresse} from '../../adresse/adresse';
import {Model} from '../../../common/model';
import {PersonneMoraleDialogComponent} from '../dialog/personne-morale-dialog.component';
import {MatButton} from '@angular/material/button';
import {DialogData, DialogType} from '../../../common/form/dialog/dialog-data';
import {Machine} from '../../machine/machine.model';
import {MatDialog} from '@angular/material/dialog';
import {AbstractFormDialogComponent} from '../../../common/form/dialog/abstract-form-dialog.component';
import {ComponentType} from '@angular/cdk/portal';
import {Roles} from '../../../security/roles';
import {AuthentificationService} from '../../../security/authentification.service';

@Component({
  selector: 'app-identite-table',
  imports: [
    TableComponent,
    MatButton
  ],
  templateUrl: './identite-table.component.html',
  styleUrl: './identite-table.component.scss'
})
export class IdentiteTableComponent {
  protected readonly haveEditAccessRole: WritableSignal<boolean> = signal(false);

  // Définition des colonnes
  protected readonly columns: Column[] = [
    ClassicColumn
      .of(IdentiteLight.DESIGNATION_LABEL, IdentiteLight.DESIGNATION, "40%")
      .sort(Order.ASC)
      .inputFilterOnSameField(),
    ClassicColumn
      .of(IdentiteLight.TELEPHONE_LABEL, IdentiteLight.TELEPHONE, "20%")
      .inputFilterOnSameField(),
    MethodColumn
      .of(IdentiteLight.ADRESSE_LABEL, IdentiteLight.ADRESSE, "20%", Adresse.adresseToString)
      .setStylePreWrap(),
    LinkColumn
      .of(IdentiteLight.MACHINES_LABEL, IdentiteLight.MACHINES, "10%", (identite: IdentiteLight) => {
        let url = "/machines/";
        if (identite.identiteType == IdentiteType.PERSONNE_MORALE) {
          url += "morale/";
        } else if (identite.identiteType == IdentiteType.PERSONNE_PHYSIQUE) {
          url += "physique/";
        } else {
          throw new Error("Type d'identité non implémenté")
        }
        url += identite.id;
        return url;
      })
      .withIcon("agriculture"),
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponentMethod: (identite: IdentiteLight) => {
      if (identite.identiteType == IdentiteType.PERSONNE_PHYSIQUE) {
        return PersonnePhysiqueDialogComponent;
      }
      if (identite.identiteType == IdentiteType.PERSONNE_MORALE) {
        return PersonneMoraleDialogComponent;
      }
      return null;
    },
    idField: Model.ID,
    clicOnLine: true,
    created: false,
    delete: true,
    modify: true,
    read: true
  };

  private readonly matTable: Signal<TableComponent<Machine>> = viewChild.required<TableComponent<Machine>>(TableComponent);

  constructor(private readonly identiteService: IdentiteService,
              private readonly matDialog: MatDialog,
              private readonly authentificationService: AuthentificationService) {
    this.haveEditAccessRole.set(this.authentificationService.hasRole(Roles.R_IDENTITE_EDITEUR));
  }

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: SearchRequest): Observable<SearchResult<IdentiteLight>> {
    return this.identiteService.search(searchRequest);
  }

  protected createPersonneMorale(): void {
    this.createPersonne(PersonneMoraleDialogComponent);
  }

  protected createPersonnePhysique(): void {
    this.createPersonne(PersonnePhysiqueDialogComponent);
  }

  private createPersonne(dialog: ComponentType<AbstractFormDialogComponent<any, any>>) {
    const dialogRef = this.matDialog.open(dialog, {
      maxWidth: 1000,
      data: <DialogData>{
        type: DialogType.CREATE,
        id: null,
        specificData: this.actionColumnInfo.dialogSpecificData,
      },
    });

    dialogRef.afterClosed().subscribe(modification => {
      if (modification) {
        this.matTable().update();
      }
    });
  }

  protected readonly Roles = Roles;
}
