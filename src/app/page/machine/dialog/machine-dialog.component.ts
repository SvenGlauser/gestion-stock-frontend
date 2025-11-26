import {Component} from '@angular/core';
import {AbstractFormDialogComponent} from '../../../common/form/dialog/abstract-form-dialog.component';
import {FormField} from '../../../common/form/field/form-field';
import {Observable} from 'rxjs';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {FormComponent} from '../../../common/form/form.component';
import {MachineService} from '../machine.service';
import {InputFormField} from '../../../common/form/field/input-form-field';
import {Machine} from '../machine.model';
import {Roles} from '../../../security/roles';

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
  // Définition des champs de formulaire
  protected readonly formsMap: Map<string, FormField[]> = new Map([
    [
      Machine.PANEL_DONNEES_GENERALES,
      [
        InputFormField
          .ofValue(Machine.NOM_LABEL, Machine.NOM)
          .setColspan(2),
        InputFormField
          .ofValue(Machine.DESCRIPTION_LABEL, Machine.DESCRIPTION)
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
    machine.proprietaire = this.data.specificData.proprietaire;
    return this.machineService.create(machine);
  }

  protected modifyDataMethod(machine: Machine): Observable<Machine> {
    return this.machineService.modify(machine);
  }

  protected override readAccess(): Roles {
    return Roles.R_MACHINE_LECTEUR;
  }

  protected override editAccess(): Roles {
    return Roles.R_MACHINE_EDITEUR;
  }
}
