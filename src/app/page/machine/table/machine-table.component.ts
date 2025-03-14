import {Component, OnInit} from '@angular/core';
import {Column} from '../../../common/table/column/column';
import {
  Machine,
  MACHINE_CONTACT,
  MACHINE_CONTACT_LABEL,
  MACHINE_DESCRIPTION,
  MACHINE_DESCRIPTION_LABEL,
  MACHINE_NOM,
  MACHINE_NOM_LABEL
} from '../machine.model';
import {Filter, Order, Type} from '../../../common/search/filter';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {MODEL_ID} from '../../../common/model';
import {MachineService} from '../machine.service';
import {SearchRequest} from '../../../common/search/searchRequest';
import {Observable, of} from 'rxjs';
import {SearchResult} from '../../../common/search/searchResult';
import {TableComponent} from '../../../common/table/table.component';
import {MachineDialogComponent} from '../dialog/machine-dialog.component';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {MethodColumn} from '../../../common/table/column/method-column';
import {Contact, contactToString} from '../../contact/contact.model';
import {ContactService} from '../../contact/contact.service';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-machine-table',
  imports: [
    TableComponent
  ],
  templateUrl: './machine-table.component.html',
  styleUrl: './machine-table.component.scss'
})
export class MachineTableComponent implements OnInit {
  // Définition des colonnes
  protected readonly columns: Column[] = [
    ClassicColumn
      .of(MACHINE_NOM_LABEL, MACHINE_NOM, "25%")
      .sort(Order.ASC)
      .inputFilterOnSameField(),
    ClassicColumn.of(MACHINE_DESCRIPTION_LABEL, MACHINE_DESCRIPTION, "45%"),
    MethodColumn.of(MACHINE_CONTACT_LABEL, MACHINE_CONTACT, "20%", contactToString),
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: MachineDialogComponent,
    dialogSpecificData: { contact: null },
    idField: MODEL_ID,
    clicOnLine: true,
    created: true,
    delete: true,
    modify: true,
    read: true
  };

  private currentContactId: number | null = null;
  protected contact: Contact | null = null;

  constructor(private readonly machineService: MachineService,
              private readonly contactService: ContactService,
              private readonly route: ActivatedRoute) {}

  /**
   * Récupère le contact
   */
  public ngOnInit(): void {
    // For subscribing to the observable paramMap...
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.currentContactId = Number.parseInt(params.get('id') ?? "");

      this.contactService.get(this.currentContactId).subscribe(contact => {
        this.contact = contact;
        this.actionColumnInfo.dialogSpecificData.contact = this.contact;
      });
    });
  }

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: SearchRequest): Observable<SearchResult<Machine>> {
    if (!this.contact) {
      return of(<SearchResult<Machine>>{
        currentPage: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        elements: <Machine[]>[]
      });
    }

    let searchRequestModified: SearchRequest = structuredClone(searchRequest);
    searchRequestModified.filters.push(<Filter>{
      field: MACHINE_CONTACT.concat(".", MODEL_ID),
      value: this.contact.id,
      type: Type.EQUAL,
      order: undefined,
    })
    return this.machineService.search(searchRequestModified);
  }

  /**
   * Récupère le nom du tableau
   */
  protected getTableTitle(): string {
    let title: string = 'Liste des machines';

    if (this.contact) {
      title += " - ";
      title += this.contact.prenom + " " + this.contact.nom;
    }

    return title;
  }
}
