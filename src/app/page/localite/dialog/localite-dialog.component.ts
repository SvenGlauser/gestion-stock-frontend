import {Component} from '@angular/core';
import {AbstractDialogComponent} from '../../../common/dialog/abstract-dialog.component';
import {
  Localite,
  LOCALITE_NOM,
  LOCALITE_NOM_LABEL,
  LOCALITE_NPA,
  LOCALITE_NPA_LABEL,
  LOCALITE_PAYS,
  LOCALITE_PAYS_LABEL
} from '../localite.model';
import {MODEL_ID} from '../../../common/model';
import {AutocompleteFormField, FormField, InputFormField} from '../../../common/form/form-field';
import {PaysService} from '../../pays/pays.service';
import {Observable} from 'rxjs';
import {LocaliteService} from '../localite.service';
import {Pays, PAYS_NOM} from '../../pays/pays.model';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {FormComponent} from '../../../common/form/form.component';

@Component({
  selector: 'app-localite-dialog',
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
export class LocaliteDialogComponent extends AbstractDialogComponent<LocaliteDialogComponent, Localite> {
  // Constantes
  protected readonly ID_FIELD: string = MODEL_ID;

  // Définition des champs de formulaire
  protected forms: FormField[];

  constructor(private readonly localiteService: LocaliteService,
              private readonly paysService: PaysService) {
    super();

    this.forms = [
      InputFormField.ofValue(LOCALITE_NOM_LABEL, LOCALITE_NOM),
      InputFormField.ofValue(LOCALITE_NPA_LABEL, LOCALITE_NPA),
      AutocompleteFormField.ofValue(
        LOCALITE_PAYS_LABEL,
        LOCALITE_PAYS,
        this.autocompletePays.bind(this),
        MODEL_ID,
        PAYS_NOM,
      ),
    ]
  }

  /**
   * Méthode d'autocomplétion des pays
   * @param value Valeur de recherche
   */
  protected autocompletePays(value: string): Observable<Pays[]> {
    return this.paysService.autocomplete(value);
  }

  protected getDataMethod(id: number): Observable<Localite> {
    return this.localiteService.get(id);
  }

  protected deleteDataMethod(id: number): Observable<void> {
    return this.localiteService.delete(id);
  }

  protected createDataMethod(localite: Localite): Observable<Localite> {
    return this.localiteService.create(localite);
  }

  protected modifyDataMethod(localite: Localite): Observable<Localite> {
    return this.localiteService.modify(localite);
  }
}
