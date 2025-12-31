import {Component} from '@angular/core';
import {TableComponent} from "../../../common/table/table.component";
import {Order} from '../../../common/search/filter';
import {PaysService} from '../../pays/pays.service';
import {SearchRequest} from '../../../common/search/searchRequest';
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
  protected readonly columns: Column[] = [
    ClassicColumn
      .of(Localite.NOM_LABEL, Localite.NOM, "40%")
      .sort(Order.ASC)
      .inputFilterOnSameField(),
    ClassicColumn
      .of(Localite.NPA_LABEL, Localite.NPA, "25%")
      .sort()
      .inputFilterOnSameField(),
    ClassicColumn
      .of(Localite.PAYS_LABEL, Localite.PAYS_NOM, "25%")
      .sort()
      .autocompleteFilter(
        Localite.PAYS_ID,
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

  protected readonly Roles = Roles;
}
