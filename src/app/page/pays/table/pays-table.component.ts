import {Component} from '@angular/core';
import {PaysService} from '../pays.service';
import {AutomaticSearchQuery} from '../../../common/search/automatic/automatic-search-query';
import {TableComponent} from '../../../common/table/table.component';
import {Observable} from 'rxjs';
import {Column} from '../../../common/table/column/column';
import {SearchResult} from '../../../common/search/searchResult';
import {PaysDialogComponent} from '../dialog/pays-dialog.component';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {Model} from '../../../common/model';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {Pays} from '../pays.model';
import {Roles} from '../../../security/roles';
import {Direction} from '../../../common/search/api/search-field';
import {AutomaticSearchField, FilterType} from '../../../common/search/automatic/automatic-search-field';

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
  protected readonly columns: Column<AutomaticSearchQuery>[] = [
    ClassicColumn
      .of<AutomaticSearchQuery>(Pays.NOM_LABEL, Pays.NOM, "45%")
      .sort(searchQuery => searchQuery.getFilter(Pays.NOM))
      .inputFilter(searchQuery => searchQuery.getFilter(Pays.NOM)),
    ClassicColumn
      .of<AutomaticSearchQuery>(Pays.ABREVIATION_LABEL, Pays.ABREVIATION, "45%")
      .sort(searchQuery => searchQuery.getFilter(Pays.ABREVIATION))
      .inputFilter(searchQuery => searchQuery.getFilter(Pays.ABREVIATION)),
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
   * Récupère une nouvelle AutomaticSearchQuery
   */
  protected getSearchQueryMethod(): AutomaticSearchQuery {
    const fieldNom = new AutomaticSearchField(Pays.NOM, FilterType.STRING_LIKE);
    const fieldAbreviation = new AutomaticSearchField(Pays.ABREVIATION, FilterType.STRING_LIKE);

    fieldNom.order = Direction.ASC;

    return new AutomaticSearchQuery([
      fieldNom,
      fieldAbreviation,
    ]);
  }

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: AutomaticSearchQuery): Observable<SearchResult<Pays>> {
    return this.paysService.search(searchRequest);
  }

  protected readonly Roles = Roles;
}
