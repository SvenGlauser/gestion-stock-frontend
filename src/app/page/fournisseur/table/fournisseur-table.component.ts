import {Component} from '@angular/core';
import {Column} from '../../../common/table/column/column';
import {
  Fournisseur,
  FOURNISSEUR_ADRESSE,
  FOURNISSEUR_ADRESSE_LABEL,
  FOURNISSEUR_DESCRIPTION,
  FOURNISSEUR_DESCRIPTION_LABEL,
  FOURNISSEUR_NOM,
  FOURNISSEUR_NOM_LABEL,
  FOURNISSEUR_URL,
  FOURNISSEUR_URL_LABEL
} from '../fournisseur.model';
import {Order} from '../../../common/search/filter';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {MODEL_ID} from '../../../common/model';
import {FournisseurService} from '../fournisseur.service';
import {SearchRequest} from '../../../common/search/searchRequest';
import {Observable} from 'rxjs';
import {SearchResult} from '../../../common/search/searchResult';
import {TableComponent} from '../../../common/table/table.component';
import {adresseToString} from '../../adresse/adresse';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {MethodColumn} from '../../../common/table/column/method-column';
import {FournisseurDialogComponent} from '../dialog/fournisseur-dialog.component';
import {LinkColumn} from '../../../common/table/column/link-column';

@Component({
  selector: 'app-categorie-table',
  imports: [
    TableComponent
  ],
  templateUrl: './fournisseur-table.component.html',
  styleUrl: './fournisseur-table.component.scss'
})
export class FournisseurTableComponent {
  // Définition des colonnes
  protected readonly columns: Column[] = [
    ClassicColumn
      .of(FOURNISSEUR_NOM_LABEL, FOURNISSEUR_NOM, "25%")
      .sort(Order.ASC)
      .inputFilterOnSameField(),
    ClassicColumn.of(FOURNISSEUR_DESCRIPTION_LABEL, FOURNISSEUR_DESCRIPTION, "25%"),
    LinkColumn.of(FOURNISSEUR_URL_LABEL, FOURNISSEUR_URL, "15%", (fournisseur: Fournisseur) => fournisseur.url ?? ""),
    MethodColumn.of(FOURNISSEUR_ADRESSE_LABEL, FOURNISSEUR_ADRESSE, "25%", adresseToString),
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: FournisseurDialogComponent,
    idField: MODEL_ID,
    clicOnLine: true,
    created: true,
    delete: true,
    modify: true,
    read: true
  };

  constructor(private readonly fournisseurService: FournisseurService) {}

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: SearchRequest): Observable<SearchResult<Fournisseur>> {
    return this.fournisseurService.search(searchRequest);
  }
}
