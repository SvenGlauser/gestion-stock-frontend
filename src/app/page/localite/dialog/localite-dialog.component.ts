import {Component} from '@angular/core';
import {AbstractFormDialogComponent} from '../../../common/form/dialog/abstract-form-dialog.component';
import {FormField} from '../../../common/form/field/form-field';
import {PaysService} from '../../pays/pays.service';
import {Observable} from 'rxjs';
import {LocaliteService} from '../localite.service';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {FormComponent} from '../../../common/form/form.component';
import {InputFormField} from '../../../common/form/field/input-form-field';
import {AutocompleteFormField} from '../../../common/form/field/autocomplete-form-field';
import {Localite} from '../localite.model';
import {Model} from '../../../common/model';
import {Pays} from '../../pays/pays.model';
import {Roles} from '../../../security/roles';

@Component({
  selector: 'app-localite-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    FormsModule,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    ReactiveFormsModule,
    FormComponent
  ],
  templateUrl: '../../../common/form/dialog/abstract-form-dialog.component.html',
  styleUrl: '../../../common/form/dialog/abstract-form-dialog.component.scss'
})
export class LocaliteDialogComponent extends AbstractFormDialogComponent<LocaliteDialogComponent, Localite> {
  // Définition des champs de formulaire
  protected readonly formsMap: Map<string, FormField[]> = new Map([
    [
      Localite.PANEL_DONNEES_GENERALES,
      [
        InputFormField.ofValue(Localite.NOM_LABEL, Localite.NOM),
        InputFormField.ofValue(Localite.NPA_LABEL, Localite.NPA),
        AutocompleteFormField
          .ofValue(
            Localite.PAYS_LABEL,
            Localite.PAYS,
            this.autocompletePays.bind(this),
            Model.ID,
            Pays.NOM,
          )
          .setColspan(2),
      ],
    ]
  ]);

  constructor(private readonly localiteService: LocaliteService,
              private readonly paysService: PaysService) {
    super();
  }

  /**
   * Méthode d'autocomplétion des pays
   * @param value Valeur de recherche
   */
  protected autocompletePays(value: string): Observable<Pays[]> {
    return this.paysService.autocomplete(value);
  }

  protected getDataMethod(id: number): Observable<Localite> {
    return this.localiteService.get(id);
  }

  protected deleteDataMethod(id: number): Observable<void> {
    return this.localiteService.delete(id);
  }

  protected createDataMethod(localite: Localite): Observable<Localite> {
    return this.localiteService.create(localite);
  }

  protected modifyDataMethod(localite: Localite): Observable<Localite> {
    return this.localiteService.modify(localite);
  }

  protected override readAccess(): Roles {
    return Roles.R_LOCALITE_LECTEUR;
  }

  protected override editAccess(): Roles {
    return Roles.R_LOCALITE_EDITEUR;
  }
}
