import {Component} from '@angular/core';
import {AbstractProtectedComponent} from '../../../common/abstract/abstract-protected-component.directive';
import {Roles} from '../../../security/roles';
import {PaysTableComponent} from '../table/pays-table.component';

@Component({
  selector: 'app-pays-page',
  imports: [
    PaysTableComponent
  ],
  templateUrl: './pays-page.component.html',
  styleUrl: './pays-page.component.scss',
})
export class PaysPageComponent extends AbstractProtectedComponent {
  constructor() {
    super();
  }

  protected override readAccess(): Roles {
    return Roles.R_PAYS_LECTEUR;
  }

  protected override editAccess(): Roles {
    return Roles.R_PAYS_EDITEUR;
  }
}
