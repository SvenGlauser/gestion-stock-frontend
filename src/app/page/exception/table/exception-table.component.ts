import {Component, ViewChild} from '@angular/core';
import {
  THROWN_EXCEPTION_ACTIF,
  THROWN_EXCEPTION_ACTIF_LABEL,
  THROWN_EXCEPTION_CLASS_NAME,
  THROWN_EXCEPTION_CLASS_NAME_LABEL,
  THROWN_EXCEPTION_MESSAGE,
  THROWN_EXCEPTION_MESSAGE_LABEL,
  THROWN_EXCEPTION_ROW_EXTENDER,
  THROWN_EXCEPTION_TIMESTAMP,
  THROWN_EXCEPTION_TIMESTAMP_LABEL,
  ThrownException
} from '../exception.model';
import {ExceptionService} from '../exception.service';
import {SearchRequest} from '../../../common/search/searchRequest';
import {TableComponent} from '../../../common/table/table.component';
import {map, Observable} from 'rxjs';
import {Column} from '../../../common/table/column/column';
import {SearchResult} from '../../../common/search/searchResult';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {MODEL_ID} from '../../../common/model';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {MethodColumn} from '../../../common/table/column/method-column';
import {convertBooleanToString} from '../../../common/utils/lambda.utils';
import {Order} from '../../../common/search/filter';
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

@Component({
  selector: 'app-pays',
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
  protected readonly columns: Column[] = [
    CustomColumn
      .of("", THROWN_EXCEPTION_ROW_EXTENDER, "5%"),
    ClassicColumn
      .of(THROWN_EXCEPTION_CLASS_NAME_LABEL, THROWN_EXCEPTION_CLASS_NAME, "35%")
      .inputFilterOnSameField()
      .sort(),
    ClassicColumn
      .of(THROWN_EXCEPTION_MESSAGE_LABEL, THROWN_EXCEPTION_MESSAGE, "25%")
      .inputFilterOnSameField(),
    DateColumn
      .of(THROWN_EXCEPTION_TIMESTAMP_LABEL, THROWN_EXCEPTION_TIMESTAMP, "15%")
      .withTime()
      .sort(Order.ASC),
    MethodColumn
      .of(THROWN_EXCEPTION_ACTIF_LABEL, THROWN_EXCEPTION_ACTIF, "10%", convertBooleanToString)
      .autocompleteEnumFilter(THROWN_EXCEPTION_ACTIF, new Map([
        [true, "Oui"],
        [false, "Non"],
      ]), true)
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: null,
    idField: MODEL_ID,
    clicOnLine: false,
    created: false,
    delete: false,
    modify: false,
    read: false,
    actions: [
      {
        name: "Désactiver l'exception",
        action: this.hideException.bind(this),
        condition: (element: ThrownException) => element.actif
      }, {
        name: "Activer l'exception",
        action: this.viewException.bind(this),
        condition: (element: ThrownException) => !element.actif
      }
    ]
  };

  // Utilisé pour udpate la dataTable
  @ViewChild(TableComponent)
  public matTable: TableComponent<Machine> | null = null;

  protected extendedRowId: number | null = null;

  constructor(private readonly exceptionService: ExceptionService) {}

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
    this.matTable?.table?.renderRows();
  }

  /**
   * Indique si la ligne supplémentaire doit s'afficher ou non
   * @param index Index de l'élément
   * @param rowData ThrownException
   */
  protected viewRow(index: number, rowData: ThrownException): boolean {
    return this.extendedRowId === rowData.id;
  }

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: SearchRequest): Observable<SearchResult<ThrownException>> {
    return this.exceptionService.search(searchRequest);
  }

  private hideException(element: ThrownException): Observable<boolean> {
    return this.exceptionService.changeStatus(element.id, false).pipe(map(() => true));
  }

  private viewException(element: ThrownException): Observable<boolean> {
    return this.exceptionService.changeStatus(element.id, true).pipe(map(() => true));
  }
}
