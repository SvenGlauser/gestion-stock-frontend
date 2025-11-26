import {Component} from '@angular/core';
import {AbstractFormDialogComponent} from '../../../common/form/dialog/abstract-form-dialog.component';
import {FormField} from '../../../common/form/field/form-field';
import {Observable} from 'rxjs';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {FormComponent} from '../../../common/form/form.component';
import {FournisseurService} from '../fournisseur.service';
import {InputFormField} from '../../../common/form/field/input-form-field';
import {AutocompleteFormField} from '../../../common/form/field/autocomplete-form-field';
import {Fournisseur} from '../fournisseur.model';
import {Model} from '../../../common/model';
import {IdentiteService} from '../../identite/identite.service';
import {Identite, IdentiteLight} from '../../identite/identite.model';
import {Roles} from '../../../security/roles';

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
        AutocompleteFormField
          .ofValue(
            Fournisseur.IDENTITE_LABEL,
            Fournisseur.IDENTITE,
            this.autocompleteIdentite.bind(this),
            Model.ID,
            Identite.DESIGNATION,
          )
          .setColspan(2),
        InputFormField
          .ofValue(Fournisseur.DESCRIPTION_LABEL, Fournisseur.DESCRIPTION)
          .setColspan(2),
        InputFormField
          .ofValue(Fournisseur.URL_LABEL, Fournisseur.URL)
          .setColspan(2),
      ],
    ]
  ]);

  constructor(private readonly fournisseurService: FournisseurService,
              private readonly identiteService: IdentiteService) {
    super();
  }

  protected getDataMethod(id: number): Observable<Fournisseur> {
    return this.fournisseurService.get(id);
  }

  protected deleteDataMethod(id: number): Observable<void> {
    return this.fournisseurService.delete(id);
  }

  protected createDataMethod(categorie: Fournisseur): Observable<Fournisseur> {
    return this.fournisseurService.create(categorie);
  }

  protected modifyDataMethod(categorie: Fournisseur): Observable<Fournisseur> {
    return this.fournisseurService.modify(categorie);
  }

  /**
   * Méthode d'autocomplétion des identités
   * @param value Valeur de recherche
   */
  private autocompleteIdentite(value: string): Observable<IdentiteLight[]> {
    return this.identiteService.autocomplete(value);
  }

  protected override readAccess(): Roles {
    return Roles.R_FOURNISSEUR_LECTEUR;
  }

  protected override editAccess(): Roles {
    return Roles.R_FOURNISSEUR_EDITEUR;
  }
}
