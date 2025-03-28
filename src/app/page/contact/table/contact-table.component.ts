import {Component} from '@angular/core';
import {Column} from '../../../common/table/column/column';
import {Order} from '../../../common/search/filter';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {ContactService} from '../contact.service';
import {SearchRequest} from '../../../common/search/searchRequest';
import {Observable} from 'rxjs';
import {SearchResult} from '../../../common/search/searchResult';
import {TableComponent} from '../../../common/table/table.component';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {MethodColumn} from '../../../common/table/column/method-column';
import {ContactDialogComponent} from '../dialog/contact-dialog.component';
import {LinkColumn} from '../../../common/table/column/link-column';
import {Contact} from '../contact.model';
import {Adresse} from '../../adresse/adresse';
import {Model} from '../../../common/model';

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
      .of(Contact.NOM_LABEL, Contact.NOM, "20%")
      .sort(Order.ASC)
      .inputFilterOnSameField(),
    ClassicColumn
      .of(Contact.PRENOM_LABEL, Contact.PRENOM, "20%")
      .sort(Order.ASC)
      .inputFilterOnSameField(),
    ClassicColumn
      .of(Contact.TELEPHONE_LABEL, Contact.TELEPHONE, "20%")
      .inputFilterOnSameField(),
    MethodColumn
      .of(Contact.ADRESSE_LABEL, Contact.ADRESSE, "20%", Adresse.adresseToString)
      .setStylePreWrap(),
    LinkColumn
      .of(Contact.MACHINES_LABEL, Contact.MACHINES, "10%", (contact: Contact) => "/machines/" + contact.id)
      .withIcon("agriculture"),
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: ContactDialogComponent,
    idField: Model.ID,
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
