import {Component} from '@angular/core';
import {AbstractFormDialogComponent} from '../../../common/form/dialog/abstract-form-dialog.component';
import {FormField} from '../../../common/form/field/form-field';
import {Observable} from 'rxjs';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {FormComponent} from '../../../common/form/form.component';
import {FournisseurService} from '../fournisseur.service';
import {LocaliteService} from '../../localite/localite.service';
import {InputFormField} from '../../../common/form/field/input-form-field';
import {AutocompleteFormField} from '../../../common/form/field/autocomplete-form-field';
import {Fournisseur} from '../fournisseur.model';
import {Adresse} from '../../adresse/adresse';
import {Localite} from '../../localite/localite.model';
import {Model} from '../../../common/model';

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
  templateUrl: '../../../common/form/dialog/abstract-form-dialog.component.html',
  styleUrl: '../../../common/form/dialog/abstract-form-dialog.component.scss'
})
export class FournisseurDialogComponent extends AbstractFormDialogComponent<FournisseurDialogComponent, Fournisseur> {
  // Définition des champs de formulaire
  protected readonly formsMap: Map<string, FormField[]> = new Map([
    [
      Fournisseur.PANEL_DONNEES_GENERALES,
      [
        InputFormField
          .ofValue(Fournisseur.NOM_LABEL, Fournisseur.NOM)
          .setColspan(2),
        InputFormField
          .ofValue(Fournisseur.DESCRIPTION_LABEL, Fournisseur.DESCRIPTION)
          .setColspan(2),
        InputFormField
          .ofValue(Fournisseur.URL_LABEL, Fournisseur.URL)
          .setColspan(2),
      ],
    ], [
      Adresse.PANEL_ADRESSE,
      [
        InputFormField.ofValue(Adresse.RUE_LABEL, Fournisseur.ADRESSE_RUE),
        InputFormField.ofValue(Adresse.NUMERO_LABEL, Fournisseur.ADRESSE_NUMERO),
        AutocompleteFormField
          .ofValue(
            Adresse.LOCALILTE_LABEL,
            Fournisseur.ADRESSE_LOCALITE,
            this.autocompleteLocalite.bind(this),
            Model.ID,
            Localite.NOM,
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
