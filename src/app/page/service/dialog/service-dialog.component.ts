import {Component} from '@angular/core';
import {AbstractFormDialogComponent} from '../../../common/form/dialog/abstract-form-dialog.component';
import {FormField} from '../../../common/form/field/form-field';
import {Observable} from 'rxjs';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {FormComponent} from '../../../common/form/form.component';
import {NumberFormField} from '../../../common/form/field/number-form-field';
import {Roles} from '../../../security/roles';
import {DatePipe} from '@angular/common';
import {TextAreaFormField} from '../../../common/form/field/textarea-form-field';
import {Service} from '../service.model';
import {ServiceService} from '../service.service';
import {DateFormField} from '../../../common/form/field/date-form-field';

@Component({
  selector: 'app-service-dialog',
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
export class ServiceDialogComponent extends AbstractFormDialogComponent<ServiceDialogComponent, Service> {
  // Définition des champs de formulaire
  protected readonly formsMap: Map<string, FormField[]> = new Map([
    [
      Service.PANEL_DONNEES_GENERALES,
      [
        DateFormField
          .ofValue(Service.DATE_LABEL, Service.DATE),
        NumberFormField
          .ofValue(Service.DUREE_LABEL, Service.DUREE),
        TextAreaFormField
          .ofValue(Service.DESCRIPTION_TRAVAUX_LABEL, Service.DESCRIPTION_TRAVAUX)
          .setColspan(2),
        TextAreaFormField
          .ofValue(Service.DIVERS_LABEL, Service.DIVERS)
          .setColspan(2),
      ],
    ]
  ]);

  constructor(private readonly serviceService: ServiceService) {
    super();
  }

  protected getDataMethod(id: number): Observable<Service> {
    return this.serviceService.get(id);
  }

  protected deleteDataMethod(id: number): Observable<void> {
    return this.serviceService.delete(id);
  }

  protected createDataMethod(service: Service): Observable<Service> {
    service.machine = this.data.specificData.machine;
    return this.serviceService.create(service);
  }

  protected modifyDataMethod(service: Service): Observable<Service> {
    return this.serviceService.modify(service);
  }

  protected override readAccess(): Roles {
    return Roles.R_SERVICE_LECTEUR;
  }

  protected override editAccess(): Roles {
    return Roles.R_SERVICE_EDITEUR;
  }
}
