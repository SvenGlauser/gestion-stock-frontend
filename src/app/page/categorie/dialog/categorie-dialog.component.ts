import {Component} from '@angular/core';
import {AbstractFormDialogComponent} from '../../../common/form/dialog/abstract-form-dialog.component';
import {FormField} from '../../../common/form/field/form-field';
import {Observable} from 'rxjs';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {FormComponent} from '../../../common/form/form.component';
import {Categorie} from '../categorie.model';
import {CategorieService} from '../categorie.service';
import {InputFormField} from '../../../common/form/field/input-form-field';
import {AutocompleteEnumFormField} from '../../../common/form/field/autocomplete-enum-form-field';

@Component({
  selector: 'app-categorie-dialog',
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
export class CategorieDialogComponent extends AbstractFormDialogComponent<CategorieDialogComponent, Categorie> {
  // Définition des champs de formulaire
  protected formsMap: Map<string, FormField[]> = new Map([
    [
      Categorie.PANEL_DONNEES_GENERALES,
      [
        InputFormField.ofValue(Categorie.NOM_LABEL, Categorie.NOM),
        AutocompleteEnumFormField
          .ofValue(Categorie.ACTIF_LABEL, Categorie.ACTIF)
          .addValue(true, "Oui")
          .addValue(false, "Non"),
        InputFormField
          .ofValue(Categorie.DESCRIPTION_LABEL, Categorie.DESCRIPTION)
          .setColspan(2),
      ]
    ]
  ]);

  constructor(private readonly categorieService: CategorieService) {
    super();
  }

  protected getDataMethod(id: number): Observable<Categorie> {
    return this.categorieService.get(id);
  }

  protected deleteDataMethod(id: number): Observable<void> {
    return this.categorieService.delete(id);
  }

  protected createDataMethod(categorie: Categorie): Observable<Categorie> {
    return this.categorieService.create(categorie);
  }

  protected modifyDataMethod(categorie: Categorie): Observable<Categorie> {
    return this.categorieService.modify(categorie);
  }
}
