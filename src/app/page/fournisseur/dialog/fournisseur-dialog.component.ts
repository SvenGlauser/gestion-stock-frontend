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
  Fournisseur,
  FOURNISSEUR_ADRESSE,
  FOURNISSEUR_DESCRIPTION,
  FOURNISSEUR_DESCRIPTION_LABEL,
  FOURNISSEUR_NOM,
  FOURNISSEUR_NOM_LABEL,
  FOURNISSEUR_URL,
  FOURNISSEUR_URL_LABEL
} from '../fournisseur.model';
import {FournisseurService} from '../fournisseur.service';
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

@Component({
  selector: 'app-fournisseur-dialog',
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
export class FournisseurDialogComponent extends AbstractDialogComponent<FournisseurDialogComponent, Fournisseur> {
  // Constantes
  protected readonly ID_FIELD: string = MODEL_ID;

  // Définition des champs de formulaire
  protected formsMap: Map<string, FormField[]> = new Map([
    [
      PANEL_DONNEES_GENERALES,
      [
        InputFormField
          .ofValue(FOURNISSEUR_NOM_LABEL, FOURNISSEUR_NOM)
          .setColspan(2),
        InputFormField
          .ofValue(FOURNISSEUR_DESCRIPTION_LABEL, FOURNISSEUR_DESCRIPTION)
          .setColspan(2),
        InputFormField
          .ofValue(FOURNISSEUR_URL_LABEL, FOURNISSEUR_URL)
          .setColspan(2),
      ],
    ], [
      PANEL_ADRESSE,
      [
        InputFormField.ofValue(ADRESSE_RUE_LABEL, FOURNISSEUR_ADRESSE.concat(".", ADRESSE_RUE)),
        InputFormField.ofValue(ADRESSE_NUMERO_LABEL, FOURNISSEUR_ADRESSE.concat(".", ADRESSE_NUMERO)),
        AutocompleteFormField
          .ofValue(
            ADRESSE_LOCALILTE_LABEL,
            FOURNISSEUR_ADRESSE.concat(".", ADRESSE_LOCALILTE),
            this.autocompleteLocalite.bind(this),
            MODEL_ID,
            LOCALITE_NOM,
          )
          .setColspan(2),
      ]
    ]
  ]);

  constructor(private readonly categorieService: FournisseurService,
              private readonly localiteService: LocaliteService) {
    super();
  }

  protected getDataMethod(id: number): Observable<Fournisseur> {
    return this.categorieService.get(id);
  }

  protected deleteDataMethod(id: number): Observable<void> {
    return this.categorieService.delete(id);
  }

  protected createDataMethod(categorie: Fournisseur): Observable<Fournisseur> {
    return this.categorieService.create(categorie);
  }

  protected modifyDataMethod(categorie: Fournisseur): Observable<Fournisseur> {
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
