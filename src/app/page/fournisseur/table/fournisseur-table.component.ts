import {Component} from '@angular/core';
import {Column} from '../../../common/table/column/column';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {Model} from '../../../common/model';
import {FournisseurService} from '../fournisseur.service';
import {AutomaticSearchQuery} from '../../../common/search/automatic/automatic-search-query';
import {Observable} from 'rxjs';
import {SearchResult} from '../../../common/search/search-result';
import {TableComponent} from '../../../common/table/table.component';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {MethodColumn} from '../../../common/table/column/method-column';
import {FournisseurDialogComponent} from '../dialog/fournisseur-dialog.component';
import {LinkColumn} from '../../../common/table/column/link-column';
import {Fournisseur} from '../fournisseur.model';
import {Adresse} from '../../adresse/adresse';
import {Roles} from '../../../security/roles';
import {AutomaticSearchField, FilterType} from '../../../common/search/automatic/automatic-search-field';
import {Direction} from '../../../common/search/api/search-field';

@Component({
  selector: 'app-fournisseur-table',
  imports: [
    TableComponent
  ],
  templateUrl: './fournisseur-table.component.html',
  styleUrl: './fournisseur-table.component.scss'
})
export class FournisseurTableComponent {
  // Définition des colonnes
  protected columns: Column<AutomaticSearchQuery>[] = [
    ClassicColumn
      .of<AutomaticSearchQuery>(Fournisseur.IDENTITE_LABEL, Fournisseur.IDENTITE_DESIGNATION, 25)
      .sort(searchQuery => searchQuery.getFilter(Fournisseur.IDENTITE_DESIGNATION))
      .inputFilter(searchQuery => searchQuery.getFilter(Fournisseur.IDENTITE_DESIGNATION)),
    ClassicColumn
      .of<AutomaticSearchQuery>(Fournisseur.DESCRIPTION_LABEL, Fournisseur.DESCRIPTION, 25),
    LinkColumn
      .of<AutomaticSearchQuery>(Fournisseur.URL_LABEL, Fournisseur.URL, 15, (fournisseur: Fournisseur) => fournisseur.url ?? ""),
    MethodColumn
      .of<AutomaticSearchQuery>(Fournisseur.ADRESSE_LABEL, Fournisseur.IDENTITE_ADRESSE, 25, Adresse.adresseToString)
      .setStylePreWrap(),
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: FournisseurDialogComponent,
    idField: Model.ID,
    clicOnLine: true,
    created: true,
    delete: true,
    modify: true,
    read: true
  };

  constructor(private readonly fournisseurService: FournisseurService) {
  }

  /**
   * Récupère une nouvelle AutomaticSearchQuery
   */
  protected getSearchQueryMethod(): AutomaticSearchQuery {
    const fieldIdentiteDesignation = new AutomaticSearchField(Fournisseur.IDENTITE_DESIGNATION, FilterType.EQUAL);

    fieldIdentiteDesignation.order = Direction.ASC;

    return new AutomaticSearchQuery([
      fieldIdentiteDesignation,
    ]);
  }

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: AutomaticSearchQuery): Observable<SearchResult<Fournisseur>> {
    return this.fournisseurService.search(searchRequest);
  }

  protected readonly Roles = Roles;
}
