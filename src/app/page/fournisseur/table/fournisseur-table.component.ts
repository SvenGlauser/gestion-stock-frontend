import {Component} from '@angular/core';
import {Column} from '../../../common/table/column/column';
import {Order} from '../../../common/search/filter';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {Model} from '../../../common/model';
import {FournisseurService} from '../fournisseur.service';
import {SearchRequest} from '../../../common/search/searchRequest';
import {Observable} from 'rxjs';
import {SearchResult} from '../../../common/search/searchResult';
import {TableComponent} from '../../../common/table/table.component';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {MethodColumn} from '../../../common/table/column/method-column';
import {FournisseurDialogComponent} from '../dialog/fournisseur-dialog.component';
import {LinkColumn} from '../../../common/table/column/link-column';
import {Fournisseur} from '../fournisseur.model';
import {Adresse} from '../../adresse/adresse';

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
      .of(Fournisseur.NOM_LABEL, Fournisseur.NOM, "25%")
      .sort(Order.ASC)
      .inputFilterOnSameField(),
    ClassicColumn.of(Fournisseur.DESCRIPTION_LABEL, Fournisseur.DESCRIPTION, "25%"),
    LinkColumn.of(Fournisseur.URL_LABEL, Fournisseur.URL, "15%", (fournisseur: Fournisseur) => fournisseur.url ?? ""),
    MethodColumn
      .of(Fournisseur.ADRESSE_LABEL, Fournisseur.ADRESSE, "25%", Adresse.adresseToString)
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

  constructor(private readonly fournisseurService: FournisseurService) {}

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: SearchRequest): Observable<SearchResult<Fournisseur>> {
    return this.fournisseurService.search(searchRequest);
  }
}
