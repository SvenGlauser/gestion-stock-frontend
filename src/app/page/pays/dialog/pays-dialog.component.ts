import {Component} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {DialogType} from '../../../common/dialog/dialog-data';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {AbstractDialogComponent} from '../../../common/dialog/abstract-dialog.component';
import {FormComponent} from '../../../common/form/form.component';
import {FormField, InputFormField} from '../../../common/form/form-field';
import {PaysService} from '../pays.service';
import {Observable} from 'rxjs';
import {Pays, PAYS_ABREVIATION, PAYS_ABREVIATION_LABEL, PAYS_NOM, PAYS_NOM_LABEL} from '../pays.model';
import {MODEL_ID} from '../../../common/model';

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
  protected forms: FormField[] = [
    InputFormField.ofValue(PAYS_NOM_LABEL, PAYS_NOM),
    InputFormField.ofValue(PAYS_ABREVIATION_LABEL, PAYS_ABREVIATION),
  ];

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
