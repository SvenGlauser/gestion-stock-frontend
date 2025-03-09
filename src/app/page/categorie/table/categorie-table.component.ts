import {Component} from '@angular/core';
import {Column} from '../../../common/table/column';
import {
  Categorie,
  CATEGORIE_ACTIF,
  CATEGORIE_ACTIF_LABEL,
  CATEGORIE_DESCRIPTION,
  CATEGORIE_DESCRIPTION_LABEL,
  CATEGORIE_NOM,
  CATEGORIE_NOM_LABEL
} from '../categorie.model';
import {Order} from '../../../common/search/filter';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {MODEL_ID} from '../../../common/model';
import {CategorieService} from '../categorie.service';
import {SearchRequest} from '../../../common/search/searchRequest';
import {Observable} from 'rxjs';
import {SearchResult} from '../../../common/search/searchResult';
import {TableComponent} from '../../../common/table/table.component';
import {CategorieDialogComponent} from '../dialog/categorie-dialog.component';
import {ConvertBooleanToString} from '../../../common/utils/lambda.utils';

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
    Column
      .of(CATEGORIE_NOM_LABEL, CATEGORIE_NOM, "25%")
      .sort(Order.ASC)
      .inputFilterOnSameField(),
    Column.of(CATEGORIE_DESCRIPTION_LABEL, CATEGORIE_DESCRIPTION, "55%"),
    Column
      .of(CATEGORIE_ACTIF_LABEL, CATEGORIE_ACTIF, "10%")
      .valueMethod(ConvertBooleanToString, CATEGORIE_ACTIF),
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: CategorieDialogComponent,
    idField: MODEL_ID,
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
