import {Component} from '@angular/core';
import {AbstractDialogComponent} from '../../../common/dialog/abstract-dialog.component';
import {MODEL_ID, PANEL_DONNEES_GENERALES} from '../../../common/model';
import {FormField} from '../../../common/form/field/form-field';
import {Observable} from 'rxjs';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {FormComponent} from '../../../common/form/form.component';
import {
  Contact,
  CONTACT_ADRESSE,
  CONTACT_EMAIL,
  CONTACT_EMAIL_LABEL,
  CONTACT_NOM,
  CONTACT_NOM_LABEL,
  CONTACT_PRENOM,
  CONTACT_PRENOM_LABEL,
  CONTACT_REMARQUES,
  CONTACT_REMARQUES_LABEL,
  CONTACT_TELEPHONE,
  CONTACT_TELEPHONE_LABEL,
  CONTACT_TITRE,
  CONTACT_TITRE_LABEL,
  PANEL_INFORMATIONS_CONTACT,
  PANEL_INFORMATIONS_SUPPLEMENTAIRES
} from '../contact.model';
import {ContactService} from '../contact.service';
import {LocaliteService} from '../../localite/localite.service';
import {Localite, LOCALITE_NOM} from '../../localite/localite.model';
import {
  ADRESSE_LOCALILTE,
  ADRESSE_LOCALILTE_LABEL,
  ADRESSE_NUMERO,
  ADRESSE_NUMERO_LABEL,
  ADRESSE_RUE,
  ADRESSE_RUE_LABEL,
  PANEL_ADRESSE
} from '../../adresse/adresse';
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
  templateUrl: '../../../common/dialog/abstract-dialog.component.html',
  styleUrl: '../../../common/dialog/abstract-dialog.component.scss'
})
export class ContactDialogComponent extends AbstractDialogComponent<ContactDialogComponent, Contact> {
  // Constantes
  protected readonly ID_FIELD: string = MODEL_ID;

  // Définition des champs de formulaire
  protected formsMap: Map<string, FormField[]> = new Map([
    [
      PANEL_DONNEES_GENERALES,
      [
        AutocompleteEnumFormField
          .ofValue(CONTACT_TITRE_LABEL, CONTACT_TITRE)
          .addValues(TitreEnumValuesForAutocomplete)
          .setColspan(2),
        InputFormField.ofValue(CONTACT_NOM_LABEL, CONTACT_NOM),
        InputFormField.ofValue(CONTACT_PRENOM_LABEL, CONTACT_PRENOM),
      ],
    ], [
      PANEL_INFORMATIONS_CONTACT,
      [
        InputFormField.ofValue(CONTACT_EMAIL_LABEL, CONTACT_EMAIL),
        InputFormField.ofValue(CONTACT_TELEPHONE_LABEL, CONTACT_TELEPHONE),
      ],
    ], [
      PANEL_ADRESSE,
      [
        InputFormField.ofValue(ADRESSE_RUE_LABEL, CONTACT_ADRESSE.concat(".", ADRESSE_RUE)),
        InputFormField.ofValue(ADRESSE_NUMERO_LABEL, CONTACT_ADRESSE.concat(".", ADRESSE_NUMERO)),
        AutocompleteFormField
          .ofValue(
            ADRESSE_LOCALILTE_LABEL,
            CONTACT_ADRESSE.concat(".", ADRESSE_LOCALILTE),
            this.autocompleteLocalite.bind(this),
            MODEL_ID,
            LOCALITE_NOM,
          )
          .setColspan(2),
      ],
    ], [
      PANEL_INFORMATIONS_SUPPLEMENTAIRES,
      [
        InputFormField
          .ofValue(CONTACT_REMARQUES_LABEL, CONTACT_REMARQUES)
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
