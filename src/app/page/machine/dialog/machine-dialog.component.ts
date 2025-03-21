import {Component} from '@angular/core';
import {AbstractFormDialogComponent} from '../../../common/form/dialog/abstract-form-dialog.component';
import {MODEL_ID, PANEL_DONNEES_GENERALES} from '../../../common/model';
import {FormField} from '../../../common/form/field/form-field';
import {Observable} from 'rxjs';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {FormComponent} from '../../../common/form/form.component';
import {
  Machine,
  MACHINE_DESCRIPTION,
  MACHINE_DESCRIPTION_LABEL,
  MACHINE_NOM,
  MACHINE_NOM_LABEL
} from '../machine.model';
import {MachineService} from '../machine.service';
import {InputFormField} from '../../../common/form/field/input-form-field';

@Component({
  selector: 'app-machine-dialog',
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
export class MachineDialogComponent extends AbstractFormDialogComponent<MachineDialogComponent, Machine> {
  // Constantes
  protected readonly ID_FIELD: string = MODEL_ID;

  // Définition des champs de formulaire
  protected formsMap: Map<string, FormField[]> = new Map([
    [
      PANEL_DONNEES_GENERALES,
      [
        InputFormField
          .ofValue(MACHINE_NOM_LABEL, MACHINE_NOM)
          .setColspan(2),
        InputFormField
          .ofValue(MACHINE_DESCRIPTION_LABEL, MACHINE_DESCRIPTION)
          .setColspan(2),
      ]
    ]
  ]);

  constructor(private readonly machineService: MachineService) {
    super();
  }

  protected getDataMethod(id: number): Observable<Machine> {
    return this.machineService.get(id);
  }

  protected deleteDataMethod(id: number): Observable<void> {
    return this.machineService.delete(id);
  }

  protected createDataMethod(machine: Machine): Observable<Machine> {
    machine.contact = this.data.specificData.contact;
    return this.machineService.create(machine);
  }

  protected modifyDataMethod(machine: Machine): Observable<Machine> {
    return this.machineService.modify(machine);
  }
}
