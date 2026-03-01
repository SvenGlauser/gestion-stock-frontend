import {Component, Signal, viewChild} from '@angular/core';
import {ExceptionService} from '../exception.service';
import {AutomaticSearchQuery} from '../../../common/search/automatic/automatic-search-query';
import {TableComponent} from '../../../common/table/table.component';
import {map, Observable} from 'rxjs';
import {Column} from '../../../common/table/column/column';
import {SearchResult} from '../../../common/search/search-result';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {MethodColumn} from '../../../common/table/column/method-column';
import {convertBooleanToString} from '../../../common/utils/lambda.utils';
import {CustomColumn} from '../../../common/table/column/custom-column';
import {Machine} from '../../machine/machine.model';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatRow,
  MatRowDef
} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {DateColumn} from '../../../common/table/column/date-column';
import {ThrownException} from '../exception.model';
import {Model} from '../../../common/model';
import {Roles} from '../../../security/roles';
import {Direction} from '../../../common/search/api/search-field';
import {AutomaticSearchField, FilterType} from '../../../common/search/automatic/automatic-search-field';

@Component({
  selector: 'app-exception-table',
  imports: [
    TableComponent,
    MatCell,
    MatCellDef,
    MatHeaderCell,
    MatIcon,
    MatIconButton,
    MatRow,
    MatRowDef,
    MatColumnDef,
    MatHeaderCellDef
  ],
  templateUrl: './exception-table.component.html',
  styleUrl: './exception-table.component.scss'
})
export class ExceptionTableComponent {
  // Définition des colonnes
  protected columns: Column<AutomaticSearchQuery>[] = [
    CustomColumn
      .of<AutomaticSearchQuery>("", ThrownException.ROW_EXTENDER, 5),
    ClassicColumn
      .of<AutomaticSearchQuery>(ThrownException.CLASS_NAME_LABEL, ThrownException.CLASS_NAME, 35)
      .inputFilter(searchQuery => searchQuery.getFilter(ThrownException.CLASS_NAME))
      .sort(searchQuery => searchQuery.getFilter(ThrownException.CLASS_NAME)),
    ClassicColumn
      .of<AutomaticSearchQuery>(ThrownException.MESSAGE_LABEL, ThrownException.MESSAGE, 25)
      .inputFilter(searchQuery => searchQuery.getFilter(ThrownException.MESSAGE))
      .sort(searchQuery => searchQuery.getFilter(ThrownException.MESSAGE)),
    DateColumn
      .of<AutomaticSearchQuery>(ThrownException.TIMESTAMP_LABEL, ThrownException.TIMESTAMP, 15)
      .withTime()
      .sort(searchQuery => searchQuery.getFilter(ThrownException.TIMESTAMP)),
    MethodColumn
      .of<AutomaticSearchQuery>(ThrownException.ACTIF_LABEL, ThrownException.ACTIF, 10, convertBooleanToString)
      .autocompleteEnumFilter(
        searchQuery => searchQuery.getFilter(ThrownException.ACTIF),
        new Map([
          [true, "Oui"],
          [false, "Non"],
        ]))
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: null,
    idField: Model.ID,
    clicOnLine: false,
    created: false,
    delete: false,
    modify: false,
    read: false,
    actions: [
      {
        name: "Désactiver l'exception",
        action: this.hideException.bind(this),
        condition: (element: ThrownException) => !!element.actif
      }, {
        name: "Activer l'exception",
        action: this.viewException.bind(this),
        condition: (element: ThrownException) => !element.actif
      }
    ]
  };

  // Utilisé pour udpate la dataTable
  private readonly matTable: Signal<TableComponent<Machine, AutomaticSearchQuery>> = viewChild.required<TableComponent<Machine, AutomaticSearchQuery>>(TableComponent);

  protected extendedRowId: number | null = null;

  constructor(private readonly exceptionService: ExceptionService) {
  }

  /**
   * Affiche / Cache le tableau des pieces pour cet élément
   * @param element ThrownException en question
   */
  protected toggleStacktrace(element: ThrownException): void {
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
   * @param rowData ThrownException
   */
  protected viewRow(_index: number, rowData: ThrownException): boolean {
    return this.extendedRowId === rowData.id;
  }

  /**
   * Récupère une nouvelle AutomaticSearchQuery
   */
  protected getSearchQueryMethod(): AutomaticSearchQuery {
    const fieldClassName = new AutomaticSearchField(ThrownException.CLASS_NAME, FilterType.STRING_LIKE);
    const fieldMessage = new AutomaticSearchField(ThrownException.MESSAGE, FilterType.STRING_LIKE);
    const fieldTimestamp = new AutomaticSearchField(ThrownException.TIMESTAMP, FilterType.EQUAL);
    const fieldActif = new AutomaticSearchField(ThrownException.ACTIF, FilterType.EQUAL);

    fieldActif.value = true;
    fieldTimestamp.order = Direction.DESC;

    return new AutomaticSearchQuery([
      fieldClassName,
      fieldMessage,
      fieldTimestamp,
      fieldActif,
    ]);
  }

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: AutomaticSearchQuery): Observable<SearchResult<ThrownException>> {
    return this.exceptionService.search(searchRequest);
  }

  private hideException(element: ThrownException): Observable<boolean> {
    return this.exceptionService.changeStatus(element.id!, false).pipe(map(() => true));
  }

  private viewException(element: ThrownException): Observable<boolean> {
    return this.exceptionService.changeStatus(element.id!, true).pipe(map(() => true));
  }

  protected readonly Roles = Roles;
}
