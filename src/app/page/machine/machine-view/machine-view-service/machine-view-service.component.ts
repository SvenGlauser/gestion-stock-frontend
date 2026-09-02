import {Component, effect, input, InputSignal, Signal, viewChild, viewChildren} from '@angular/core';
import {Column} from '../../../../common/table/column/column';
import {ActionColumnInfo} from '../../../../common/table/action-column.info';
import {map, Observable, of, tap} from 'rxjs';
import {SearchResult} from '../../../../common/search/search-result';
import {TableComponent} from '../../../../common/table/table.component';
import {ClassicColumn} from '../../../../common/table/column/classic-column';
import {Machine} from '../../machine.model';
import {MatDialog} from '@angular/material/dialog';
import {Model} from '../../../../common/model';
import {Roles} from '../../../../security/roles';
import {Service} from '../../../service/service.model';
import {AutomaticSearchQuery} from '../../../../common/search/automatic/automatic-search-query';
import {AutomaticSearchField, FilterType} from '../../../../common/search/automatic/automatic-search-field';
import {Direction} from '../../../../common/search/api/search-field';
import {ServiceService} from '../../../service/service.service';
import {FilterCombinatorType} from '../../../../common/search/automatic/automatic-search-field-combinaison';
import {CustomColumn} from '../../../../common/table/column/custom-column';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatRow,
  MatRowDef
} from '@angular/material/table';
import {MatBadge} from '@angular/material/badge';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ServiceDialogComponent} from '../../../service/dialog/service-dialog.component';
import {
  ChangementPieceTableComponent
} from '../../../changement-piece/changement-piece-table/changement-piece-table.component';
import {
  ChangementPieceDialogComponent
} from '../../../changement-piece/changement-piece-dialog/changement-piece-dialog.component';

@Component({
  selector: 'app-machine-view-service',
  imports: [
    TableComponent,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatBadge,
    MatIconButton,
    MatIcon,
    MatRowDef,
    MatRow,
    ChangementPieceTableComponent
  ],
  templateUrl: './machine-view-service.component.html',
  styleUrl: './machine-view-service.component.scss'
})
export class MachineViewServiceComponent {
  // Définition des colonnes
  protected columns: Column<AutomaticSearchQuery>[] = [
    CustomColumn.ofWithoutChooser("", Machine.ROW_EXTENDER, 10),
    ClassicColumn
      .of(Service.DATE_LABEL, Service.DATE, 15),
    ClassicColumn
      .of(Service.DUREE_LABEL, Service.DUREE, 15),
    ClassicColumn
      .of(Service.DESCRIPTION_TRAVAUX_LABEL, Service.DESCRIPTION_TRAVAUX, 25),
    ClassicColumn
      .of(Service.DIVERS_LABEL, Service.DIVERS, 25),
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: ServiceDialogComponent,
    idField: Model.ID,
    clicOnLine: true,
    read: true,
    created: true,
    modify: true,
    delete: true,
    actions: [
      {
        name: "Ajouter une pièce",
        action: this.linkPiece.bind(this),
        condition: _ => this.canEdit()
      }
    ],
    dialogSpecificData: {
      machine: null,
    }
  };

  public readonly machine: InputSignal<Machine> = input.required();
  public readonly canEdit: InputSignal<boolean> = input.required();

  protected extendedRowId: number | null = null;

  private readonly matTable: Signal<TableComponent<Service, AutomaticSearchQuery>> = viewChild.required<TableComponent<Service, AutomaticSearchQuery>>(TableComponent);
  private readonly changementPiecesTables: Signal<readonly ChangementPieceTableComponent[]> = viewChildren<ChangementPieceTableComponent>(ChangementPieceTableComponent);

  constructor(private readonly serviceService: ServiceService,
              private readonly matDialog: MatDialog) {
    effect(() => {
      this.actionColumnInfo.dialogSpecificData.machine = this.machine();
    })
  }

  /**
   * Récupère une nouvelle AutomaticSearchQuery
   */
  protected getSearchQueryMethod(): AutomaticSearchQuery {
    const fieldDate = new AutomaticSearchField(Service.DATE, FilterType.EQUAL);

    fieldDate.order = Direction.ASC;

    return new AutomaticSearchQuery([
      fieldDate,
    ]);
  }

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: AutomaticSearchQuery): Observable<SearchResult<Service>> {
    let machine = this.machine();
    if (!machine) {
      return of(<SearchResult<Service>>{
        currentPage: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        elements: []
      });
    }

    let searchRequestModified: AutomaticSearchQuery = structuredClone(searchRequest);
    let machineIdField: AutomaticSearchField<number | null> = new AutomaticSearchField(Service.MACHINE_ID, FilterType.EQUAL);
    machineIdField.value = machine.id;

    searchRequestModified.combinators.push({
      type: FilterCombinatorType.AND,
      fields: [machineIdField]
    })
    return this.serviceService.search(searchRequestModified);
  }

  /**
   * Affiche / Cache le tableau des pieces pour cet élément
   * @param element Machine en question
   */
  protected togglePieces(element: Machine): void {
    if (this.extendedRowId === element.id) {
      this.extendedRowId = null;
    } else {
      this.extendedRowId = element.id;
    }
    this.matTable().renderRows();
  }

  /**
   * Indique si la ligne supplémentaire doit s'afficher ou non
   * @param _index Index de l'élément
   * @param rowData Machine
   */
  protected viewRow(_index: number, rowData: Machine): boolean {
    return this.extendedRowId === rowData.id;
  }

  /**
   * Ajoute une pièce à un service
   * @param service Service auquel ajouter la pièce
   */
  protected linkPiece(service: Service): Observable<boolean> {
    return this.matDialog
      .open(ChangementPieceDialogComponent, {
        maxWidth: 1000,
        data: service.id,
      })
      .afterClosed()
      .pipe(
        tap((returnedService: Service | null) => {
          if (returnedService) {
            service.machine = returnedService.machine;
            service.date = returnedService.date;
            service.descriptionTravaux = returnedService.descriptionTravaux;
            service.divers = returnedService.divers;
            service.duree = returnedService.duree;
            service.changementPieces = returnedService.changementPieces;
            service.creationUser = returnedService.creationUser;
            service.creationDate = returnedService.creationDate;
            service.modificationUser = returnedService.modificationUser;
            service.modificationDate = returnedService.modificationDate;

            for (const table of this.changementPiecesTables()) {
              if (table.service().id === service.id) {
                table.table().update();
              }
            }
          }
        }),
        map(() => false));
  }

  protected readonly Roles = Roles;
}
