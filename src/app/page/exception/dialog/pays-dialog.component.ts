import {Component} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {AbstractFormDialogComponent} from '../../../common/form/dialog/abstract-form-dialog.component';
import {FormComponent} from '../../../common/form/form.component';
import {FormField} from '../../../common/form/field/form-field';
import {ExceptionService} from '../exception.service';
import {Observable} from 'rxjs';
import {PAYS_ABREVIATION, PAYS_ABREVIATION_LABEL, PAYS_NOM, PAYS_NOM_LABEL, ThrownException} from '../exception.model';
import {MODEL_ID, PANEL_DONNEES_GENERALES} from '../../../common/model';
import {InputFormField} from "../../../common/form/field/input-form-field";

@Component({
  selector: 'app-dialog',
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
export class PaysDialogComponent extends AbstractFormDialogComponent<PaysDialogComponent, ThrownException> {
  // Constantes
  protected readonly ID_FIELD: string = MODEL_ID;

  // Définition des champs de formulaire
  protected formsMap: Map<string, FormField[]> = new Map([
    [
      PANEL_DONNEES_GENERALES,
      [
        InputFormField
          .ofValue(PAYS_NOM_LABEL, PAYS_NOM)
          .setColspan(2),
        InputFormField
          .ofValue(PAYS_ABREVIATION_LABEL, PAYS_ABREVIATION)
          .setColspan(2),
      ]
    ]
  ]);

  constructor(private readonly paysService: ExceptionService) {
    super();
  }

  protected getDataMethod(id: number): Observable<ThrownException> {
    return this.paysService.get(id);
  }

  protected deleteDataMethod(id: number): Observable<void> {
    return this.paysService.delete(id);
  }

  protected createDataMethod(pays: ThrownException): Observable<ThrownException> {
    return this.paysService.create(pays);
  }

  protected modifyDataMethod(pays: ThrownException): Observable<ThrownException> {
    return this.paysService.modify(pays);
  }
}
