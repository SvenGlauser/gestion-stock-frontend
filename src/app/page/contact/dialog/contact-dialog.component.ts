import {Component} from '@angular/core';
import {AbstractFormDialogComponent} from '../../../common/form/dialog/abstract-form-dialog.component';
import {Model} from '../../../common/model';
import {FormField} from '../../../common/form/field/form-field';
import {Observable} from 'rxjs';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {FormComponent} from '../../../common/form/form.component';
import {Contact} from '../contact.model';
import {ContactService} from '../contact.service';
import {LocaliteService} from '../../localite/localite.service';
import {Localite} from '../../localite/localite.model';
import {Adresse} from '../../adresse/adresse';
import {InputFormField} from '../../../common/form/field/input-form-field';
import {AutocompleteFormField} from '../../../common/form/field/autocomplete-form-field';
import {AutocompleteEnumFormField} from '../../../common/form/field/autocomplete-enum-form-field';
import {TitreEnumValuesForAutocomplete} from '../titre.enum';

@Component({
  selector: 'app-contact-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    FormsModule,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    ReactiveFormsModule,
    FormComponent
  ],
  templateUrl: '../../../common/form/dialog/abstract-form-dialog.component.html',
  styleUrl: '../../../common/form/dialog/abstract-form-dialog.component.scss'
})
export class ContactDialogComponent extends AbstractFormDialogComponent<ContactDialogComponent, Contact> {
  // Constantes
  protected readonly ID_FIELD: string = Model.ID;

  // Définition des champs de formulaire
  protected formsMap: Map<string, FormField[]> = new Map([
    [
      Contact.PANEL_DONNEES_GENERALES,
      [
        AutocompleteEnumFormField
          .ofValue(Contact.TITRE_LABEL, Contact.TITRE)
          .addValues(TitreEnumValuesForAutocomplete)
          .setColspan(2),
        InputFormField.ofValue(Contact.NOM_LABEL, Contact.NOM),
        InputFormField.ofValue(Contact.PRENOM_LABEL, Contact.PRENOM),
      ],
    ], [
      Contact.PANEL_INFORMATIONS_CONTACT,
      [
        InputFormField.ofValue(Contact.EMAIL_LABEL, Contact.EMAIL),
        InputFormField.ofValue(Contact.TELEPHONE_LABEL, Contact.TELEPHONE),
      ],
    ], [
      Adresse.PANEL_ADRESSE,
      [
        InputFormField.ofValue(Adresse.RUE_LABEL, Contact.ADRESSE_RUE),
        InputFormField.ofValue(Adresse.NUMERO_LABEL, Contact.ADRESSE_NUMERO),
        AutocompleteFormField
          .ofValue(
            Adresse.LOCALILTE_LABEL,
            Contact.ADRESSE_LOCALITE,
            this.autocompleteLocalite.bind(this),
            Model.ID,
            Localite.NOM,
          )
          .setColspan(2),
      ],
    ], [
      Contact.PANEL_INFORMATIONS_SUPPLEMENTAIRES,
      [
        InputFormField
          .ofValue(Contact.REMARQUES_LABEL, Contact.REMARQUES)
          .setColspan(2),
      ]
    ]
  ]);

  constructor(private readonly categorieService: ContactService,
              private readonly localiteService: LocaliteService) {
    super();
  }

  protected getDataMethod(id: number): Observable<Contact> {
    return this.categorieService.get(id);
  }

  protected deleteDataMethod(id: number): Observable<void> {
    return this.categorieService.delete(id);
  }

  protected createDataMethod(categorie: Contact): Observable<Contact> {
    return this.categorieService.create(categorie);
  }

  protected modifyDataMethod(categorie: Contact): Observable<Contact> {
    return this.categorieService.modify(categorie);
  }

  /**
   * Méthode d'autocomplétion des localités
   * @param value Valeur de recherche
   */
  protected autocompleteLocalite(value: string): Observable<Localite[]> {
    return this.localiteService.autocomplete(value);
  }
}
