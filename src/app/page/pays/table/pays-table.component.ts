import {Component} from '@angular/core';
import {Pays, PAYS_ABREVIATION, PAYS_ABREVIATION_LABEL, PAYS_NOM, PAYS_NOM_LABEL} from '../pays.model';
import {PaysService} from '../pays.service';
import {SearchRequest} from '../../../common/search/searchRequest';
import {TableComponent} from '../../../common/table/table.component';
import {Observable} from 'rxjs';
import {Column} from '../../../common/table/column';
import {SearchResult} from '../../../common/search/searchResult';
import {Order} from '../../../common/search/filter';
import {PaysDialogComponent} from '../dialog/pays-dialog.component';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {MODEL_ID} from '../../../common/model';

@Component({
  selector: 'app-pays',
  imports: [
    TableComponent
  ],
  templateUrl: './pays-table.component.html',
  styleUrl: './pays-table.component.scss'
})
export class PaysTableComponent {
  // Définition des colonnes
  protected readonly columns: Column[] = [
    Column
      .of(PAYS_NOM_LABEL, PAYS_NOM, "45%")
      .sort(Order.ASC)
      .inputFilterOnSameField(),
    Column.of(PAYS_ABREVIATION_LABEL, PAYS_ABREVIATION, "45%"),
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: PaysDialogComponent,
    idField: MODEL_ID,
    clicOnLine: true,
    created: true,
    delete: true,
    modify: true,
    read: true
  };

  constructor(private readonly paysService: PaysService) {}

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: SearchRequest): Observable<SearchResult<Pays>> {
    return this.paysService.search(searchRequest);
  }
}
