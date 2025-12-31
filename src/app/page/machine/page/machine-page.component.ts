import {Component} from '@angular/core';
import {AbstractProtectedComponent} from '../../../common/abstract/abstract-protected-component.directive';
import {Roles} from '../../../security/roles';
import {MachineTableComponent} from '../table/machine-table.component';

@Component({
  selector: 'app-page',
  imports: [
    MachineTableComponent
  ],
  templateUrl: './machine-page.component.html',
  styleUrl: './machine-page.component.scss',
})
export class MachinePageComponent extends AbstractProtectedComponent {
  constructor() {
    super();
  }

  protected override readAccess(): Roles {
    return Roles.R_MACHINE_LECTEUR;
  }

  protected override editAccess(): Roles {
    return Roles.R_MACHINE_EDITEUR;
  }
}
