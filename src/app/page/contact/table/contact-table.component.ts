import {Component} from '@angular/core';
import {Column} from '../../../common/table/column/column';
import {
  Contact,
  CONTACT_ADRESSE,
  CONTACT_ADRESSE_LABEL,
  CONTACT_MACHINES,
  CONTACT_MACHINES_LABEL,
  CONTACT_NOM,
  CONTACT_NOM_LABEL,
  CONTACT_PRENOM,
  CONTACT_PRENOM_LABEL,
  CONTACT_TELEPHONE,
  CONTACT_TELEPHONE_LABEL
} from '../contact.model';
import {Order} from '../../../common/search/filter';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {MODEL_ID} from '../../../common/model';
import {ContactService} from '../contact.service';
import {SearchRequest} from '../../../common/search/searchRequest';
import {Observable} from 'rxjs';
import {SearchResult} from '../../../common/search/searchResult';
import {TableComponent} from '../../../common/table/table.component';
import {adresseToString} from '../../adresse/adresse';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {MethodColumn} from '../../../common/table/column/method-column';
import {ContactDialogComponent} from '../dialog/contact-dialog.component';
import {LinkColumn} from '../../../common/table/column/link-column';

@Component({
  selector: 'app-categorie-table',
  imports: [
    TableComponent
  ],
  templateUrl: './contact-table.component.html',
  styleUrl: './contact-table.component.scss'
})
export class ContactTableComponent {
  // Définition des colonnes
  protected readonly columns: Column[] = [
    ClassicColumn
      .of(CONTACT_NOM_LABEL, CONTACT_NOM, "20%")
      .sort(Order.ASC)
      .inputFilterOnSameField(),
    ClassicColumn
      .of(CONTACT_PRENOM_LABEL, CONTACT_PRENOM, "20%")
      .sort(Order.ASC)
      .inputFilterOnSameField(),
    ClassicColumn
      .of(CONTACT_TELEPHONE_LABEL, CONTACT_TELEPHONE, "20%")
      .inputFilterOnSameField(),
    MethodColumn.of(CONTACT_ADRESSE_LABEL, CONTACT_ADRESSE, "20%", adresseToString),
    LinkColumn
      .of(CONTACT_MACHINES_LABEL, CONTACT_MACHINES, "10%", (contact: Contact) => "/machines/" + contact.id)
      .withIcon("agriculture"),
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: ContactDialogComponent,
    idField: MODEL_ID,
    clicOnLine: true,
    created: true,
    delete: true,
    modify: true,
    read: true
  };

  constructor(private readonly contactService: ContactService) {}

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: SearchRequest): Observable<SearchResult<Contact>> {
    return this.contactService.search(searchRequest);
  }
}
