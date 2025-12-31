import {Component} from '@angular/core';
import {PaysService} from '../pays.service';
import {SearchRequest} from '../../../common/search/searchRequest';
import {TableComponent} from '../../../common/table/table.component';
import {Observable} from 'rxjs';
import {Column} from '../../../common/table/column/column';
import {SearchResult} from '../../../common/search/searchResult';
import {Order} from '../../../common/search/filter';
import {PaysDialogComponent} from '../dialog/pays-dialog.component';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {Model} from '../../../common/model';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {Pays} from '../pays.model';
import {Roles} from '../../../security/roles';

@Component({
  selector: 'app-pays-table',
  imports: [
    TableComponent
  ],
  templateUrl: './pays-table.component.html',
  styleUrl: './pays-table.component.scss'
})
export class PaysTableComponent {
  // Définition des colonnes
  protected readonly columns: Column[] = [
    ClassicColumn
      .of(Pays.NOM_LABEL, Pays.NOM, "45%")
      .sort(Order.ASC)
      .inputFilterOnSameField(),
    ClassicColumn
      .of(Pays.ABREVIATION_LABEL, Pays.ABREVIATION, "45%")
      .sort()
      .inputFilterOnSameField(),
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: PaysDialogComponent,
    idField: Model.ID,
    clicOnLine: true,
    created: true,
    delete: true,
    modify: true,
    read: true
  };

  constructor(private readonly paysService: PaysService) {
  }

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: SearchRequest): Observable<SearchResult<Pays>> {
    return this.paysService.search(searchRequest);
  }

  protected readonly Roles = Roles;
}
