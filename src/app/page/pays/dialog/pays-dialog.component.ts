import {Component} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {AbstractFormDialogComponent} from '../../../common/form/dialog/abstract-form-dialog.component';
import {FormComponent} from '../../../common/form/form.component';
import {FormField} from '../../../common/form/field/form-field';
import {PaysService} from '../pays.service';
import {Observable} from 'rxjs';
import {InputFormField} from "../../../common/form/field/input-form-field";
import {Pays} from '../pays.model';
import {Roles} from '../../../security/roles';
import {DatePipe} from '@angular/common';

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
    FormComponent,
    DatePipe
  ],
  templateUrl: '../../../common/form/dialog/abstract-form-dialog.component.html',
  styleUrl: '../../../common/form/dialog/abstract-form-dialog.component.scss'
})
export class PaysDialogComponent extends AbstractFormDialogComponent<PaysDialogComponent, Pays> {
  // Définition des champs de formulaire
  protected readonly formsMap: Map<string, FormField[]> = new Map([
    [
      Pays.PANEL_DONNEES_GENERALES,
      [
        InputFormField
          .ofValue(Pays.NOM_LABEL, Pays.NOM)
          .setColspan(2),
        InputFormField
          .ofValue(Pays.ABREVIATION_LABEL, Pays.ABREVIATION)
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

  protected override readAccess(): Roles {
    return Roles.R_PAYS_LECTEUR;
  }

  protected override editAccess(): Roles {
    return Roles.R_PAYS_EDITEUR;
  }
}
