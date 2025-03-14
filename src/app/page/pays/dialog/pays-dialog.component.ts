import {Component} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {AbstractDialogComponent} from '../../../common/dialog/abstract-dialog.component';
import {FormComponent} from '../../../common/form/form.component';
import {FormField} from '../../../common/form/field/form-field';
import {PaysService} from '../pays.service';
import {Observable} from 'rxjs';
import {Pays, PAYS_ABREVIATION, PAYS_ABREVIATION_LABEL, PAYS_NOM, PAYS_NOM_LABEL} from '../pays.model';
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
  templateUrl: '../../../common/dialog/abstract-dialog.component.html',
  styleUrl: '../../../common/dialog/abstract-dialog.component.scss'
})
export class PaysDialogComponent extends AbstractDialogComponent<PaysDialogComponent, Pays> {
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

  constructor(private readonly paysService: PaysService) {
    super();
  }

  protected getDataMethod(id: number): Observable<Pays> {
    return this.paysService.get(id);
  }

  protected deleteDataMethod(id: number): Observable<void> {
    return this.paysService.delete(id);
  }

  protected createDataMethod(pays: Pays): Observable<Pays> {
    return this.paysService.create(pays);
  }

  protected modifyDataMethod(pays: Pays): Observable<Pays> {
    return this.paysService.modify(pays);
  }
}
