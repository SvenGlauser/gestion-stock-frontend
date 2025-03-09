import {Component} from '@angular/core';
import {TableComponent} from "../../../common/table/table.component";
import {Order} from '../../../common/search/filter';
import {PaysService} from '../../pays/pays.service';
import {SearchRequest} from '../../../common/search/searchRequest';
import {Observable} from 'rxjs';
import {SearchResult} from '../../../common/search/searchResult';
import {Pays, PAYS_NOM} from '../../pays/pays.model';
import {LocaliteService} from '../localite.service';
import {
  Localite,
  LOCALITE_NOM,
  LOCALITE_NOM_LABEL,
  LOCALITE_NPA,
  LOCALITE_NPA_LABEL,
  LOCALITE_PAYS,
  LOCALITE_PAYS_LABEL
} from '../localite.model';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {MODEL_ID} from '../../../common/model';
import {LocaliteDialogComponent} from '../dialog/localite-dialog.component';
import {ClassicColumn} from '../../../common/table/column/classic-column';

@Component({
  selector: 'app-localite',
    imports: [
        TableComponent
    ],
  templateUrl: './localite-table.component.html',
  styleUrl: './localite-table.component.scss'
})
export class LocaliteTableComponent {
  // Définition des colonnes
  protected columns = [
    ClassicColumn
      .of(LOCALITE_NOM_LABEL, LOCALITE_NOM, "40%")
      .sort(Order.ASC)
      .inputFilterOnSameField(),
    ClassicColumn
      .of(LOCALITE_NPA_LABEL, LOCALITE_NPA, "25%")
      .sort()
      .inputFilterOnSameField(),
    ClassicColumn
      .of(LOCALITE_PAYS_LABEL, LOCALITE_PAYS.concat(".", PAYS_NOM), "25%")
      .sort()
      .autocompleteFilter(
        LOCALITE_PAYS.concat(".", MODEL_ID),
        this.autocompletePays.bind(this),
        MODEL_ID,
        PAYS_NOM),
  ];

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: LocaliteDialogComponent,
    idField: MODEL_ID,
    clicOnLine: true,
    created: true,
    delete: true,
    modify: true,
    read: true
  };

  constructor(private readonly localiteService: LocaliteService,
              private readonly paysService: PaysService) {}

  /**
   * Méthode de recherche pour le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: SearchRequest): Observable<SearchResult<Localite>> {
    return this.localiteService.search(searchRequest);
  }

  /**
   * Méthode d'autocomplétion des pays
   * @param value Valeur de recherche
   */
  protected autocompletePays(value: string): Observable<Pays[]> {
    return this.paysService.autocomplete(value);
  }
}
