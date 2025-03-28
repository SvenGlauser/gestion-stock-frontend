import {Component} from '@angular/core';
import {Column} from '../../../common/table/column/column';
import {Categorie} from '../categorie.model';
import {Order} from '../../../common/search/filter';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {Model} from '../../../common/model';
import {CategorieService} from '../categorie.service';
import {SearchRequest} from '../../../common/search/searchRequest';
import {Observable} from 'rxjs';
import {SearchResult} from '../../../common/search/searchResult';
import {TableComponent} from '../../../common/table/table.component';
import {CategorieDialogComponent} from '../dialog/categorie-dialog.component';
import {convertBooleanToString} from '../../../common/utils/lambda.utils';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {MethodColumn} from '../../../common/table/column/method-column';

@Component({
  selector: 'app-categorie-table',
  imports: [
    TableComponent
  ],
  templateUrl: './categorie-table.component.html',
  styleUrl: './categorie-table.component.scss'
})
export class CategorieTableComponent {
  // Définition des colonnes
  protected readonly columns: Column[] = [
    ClassicColumn
      .of(Categorie.NOM_LABEL, Categorie.NOM, "25%")
      .sort(Order.ASC)
      .inputFilterOnSameField(),
    ClassicColumn.of(Categorie.DESCRIPTION_LABEL, Categorie.DESCRIPTION, "55%"),
    MethodColumn.of(Categorie.ACTIF_LABEL, Categorie.ACTIF, "10%", convertBooleanToString),
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: CategorieDialogComponent,
    idField: Model.ID,
    clicOnLine: true,
    created: true,
    delete: true,
    modify: true,
    read: true
  };

  constructor(private readonly categorieService: CategorieService) {}

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: SearchRequest): Observable<SearchResult<Categorie>> {
    return this.categorieService.search(searchRequest);
  }
}
