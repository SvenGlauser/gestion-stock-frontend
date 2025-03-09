import {Component} from '@angular/core';
import {AbstractDialogComponent} from '../../../common/dialog/abstract-dialog.component';
import {MODEL_ID} from '../../../common/model';
import {FormField} from '../../../common/form/field/form-field';
import {Observable} from 'rxjs';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {FormComponent} from '../../../common/form/form.component';
import {
  Categorie,
  CATEGORIE_ACTIF,
  CATEGORIE_ACTIF_LABEL,
  CATEGORIE_DESCRIPTION,
  CATEGORIE_DESCRIPTION_LABEL,
  CATEGORIE_NOM,
  CATEGORIE_NOM_LABEL
} from '../categorie.model';
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
  templateUrl: '../../../common/dialog/abstract-dialog.component.html',
  styleUrl: '../../../common/dialog/abstract-dialog.component.scss'
})
export class CategorieDialogComponent extends AbstractDialogComponent<CategorieDialogComponent, Categorie> {
  // Constantes
  protected readonly ID_FIELD: string = MODEL_ID;

  // Définition des champs de formulaire
  protected forms: FormField[] = [
    InputFormField.ofValue(CATEGORIE_NOM_LABEL, CATEGORIE_NOM),
    InputFormField.ofValue(CATEGORIE_DESCRIPTION_LABEL, CATEGORIE_DESCRIPTION),
    AutocompleteEnumFormField
      .ofValue(CATEGORIE_ACTIF_LABEL, CATEGORIE_ACTIF)
      .addValue(true, "Oui")
      .addValue(false, "Non"),
  ];

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
