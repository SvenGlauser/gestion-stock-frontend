import {Component} from '@angular/core';
import {Column} from '../../../common/table/column/column';
import {Categorie} from '../categorie.model';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {Model} from '../../../common/model';
import {CategorieService} from '../categorie.service';
import {AutomaticSearchQuery} from '../../../common/search/automatic/automatic-search-query';
import {Observable} from 'rxjs';
import {SearchResult} from '../../../common/search/searchResult';
import {TableComponent} from '../../../common/table/table.component';
import {CategorieDialogComponent} from '../dialog/categorie-dialog.component';
import {convertBooleanToString} from '../../../common/utils/lambda.utils';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {MethodColumn} from '../../../common/table/column/method-column';
import {Roles} from '../../../security/roles';
import {AutomaticSearchField, FilterType} from '../../../common/search/automatic/automatic-search-field';

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
  protected readonly columns: Column<AutomaticSearchQuery>[] = [
    ClassicColumn
      .of<AutomaticSearchQuery>(Categorie.NOM_LABEL, Categorie.NOM, "25%")
      .sort(searchQuery => searchQuery.getFilter(Categorie.NOM))
      .inputFilter(searchQuery => searchQuery.getFilter(Categorie.NOM)),
    ClassicColumn
      .of<AutomaticSearchQuery>(Categorie.DESCRIPTION_LABEL, Categorie.DESCRIPTION, "55%"),
    MethodColumn
      .of<AutomaticSearchQuery>(Categorie.ACTIF_LABEL, Categorie.ACTIF, "10%", convertBooleanToString),
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

  constructor(private readonly categorieService: CategorieService) {
  }

  /**
   * Récupère une nouvelle AutomaticSearchQuery
   */
  protected getSearchQueryMethod(): AutomaticSearchQuery {
    const fieldNom = new AutomaticSearchField(Categorie.NOM, FilterType.EQUAL);

    return new AutomaticSearchQuery([
      fieldNom,
    ]);
  }

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: AutomaticSearchQuery): Observable<SearchResult<Categorie>> {
    return this.categorieService.search(searchRequest);
  }

  protected readonly Roles = Roles;
}
