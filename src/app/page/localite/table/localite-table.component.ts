import {Component} from '@angular/core';
import {TableComponent} from "../../../common/table/table.component";
import {PaysService} from '../../pays/pays.service';
import {AutomaticSearchQuery} from '../../../common/search/automatic/automatic-search-query';
import {Observable} from 'rxjs';
import {SearchResult} from '../../../common/search/searchResult';
import {Pays} from '../../pays/pays.model';
import {LocaliteService} from '../localite.service';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {Model} from '../../../common/model';
import {LocaliteDialogComponent} from '../dialog/localite-dialog.component';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {Localite} from '../localite.model';
import {Column} from '../../../common/table/column/column';
import {Roles} from '../../../security/roles';
import {AutomaticSearchField, FilterType} from '../../../common/search/automatic/automatic-search-field';
import {Machine} from '../../machine/machine.model';

@Component({
  selector: 'app-localite-table',
  imports: [
    TableComponent
  ],
  templateUrl: './localite-table.component.html',
  styleUrl: './localite-table.component.scss'
})
export class LocaliteTableComponent {
  // Définition des colonnes
  protected readonly columns: Column<AutomaticSearchQuery>[] = [
    ClassicColumn
      .of<AutomaticSearchQuery>(Localite.NOM_LABEL, Localite.NOM, "40%")
      .sort(searchQuery => searchQuery.getFilter(Localite.NOM))
      .inputFilter(searchQuery => searchQuery.getFilter(Localite.NOM)),
    ClassicColumn
      .of<AutomaticSearchQuery>(Localite.NPA_LABEL, Localite.NPA, "25%")
      .sort(searchQuery => searchQuery.getFilter(Localite.NPA))
      .inputFilter(searchQuery => searchQuery.getFilter(Localite.NPA)),
    ClassicColumn
      .of<AutomaticSearchQuery>(Localite.PAYS_LABEL, Localite.PAYS_NOM, "25%")
      .sort(searchQuery => searchQuery.getFilter(Localite.PAYS_NOM))
      .autocompleteFilter(
        searchQuery => searchQuery.getFilter(Localite.PAYS_ID),
        this.autocompletePays.bind(this),
        Model.ID,
        Pays.NOM),
  ];

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: LocaliteDialogComponent,
    idField: Model.ID,
    clicOnLine: true,
    created: true,
    delete: true,
    modify: true,
    read: true
  };

  constructor(private readonly localiteService: LocaliteService,
              private readonly paysService: PaysService) {
  }

  /**
   * Récupère une nouvelle AutomaticSearchQuery
   */
  protected getSearchQueryMethod(): AutomaticSearchQuery {
    const fieldNom = new AutomaticSearchField(Localite.NOM, FilterType.STRING_LIKE);
    const fieldNpa = new AutomaticSearchField(Localite.NPA, FilterType.EQUAL);
    const fieldPaysNom = new AutomaticSearchField(Localite.PAYS_NOM, FilterType.EQUAL);
    const fieldPaysId = new AutomaticSearchField(Localite.PAYS_ID, FilterType.EQUAL);

    return new AutomaticSearchQuery([
      fieldNom,
      fieldNpa,
      fieldPaysNom,
      fieldPaysId
    ]);
  }

  /**
   * Méthode de recherche pour le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: AutomaticSearchQuery): Observable<SearchResult<Localite>> {
    return this.localiteService.search(searchRequest);
  }

  /**
   * Méthode d'autocomplétion des pays
   * @param value Valeur de recherche
   */
  protected autocompletePays(value: string): Observable<Pays[]> {
    return this.paysService.autocomplete(value);
  }

  protected readonly Roles = Roles;
}
