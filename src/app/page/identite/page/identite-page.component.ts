import {Component} from '@angular/core';
import {IdentiteTableComponent} from '../table/identite-table.component';
import {AbstractProtectedComponent} from '../../../common/abstract/abstract-protected-component.directive';
import {Roles} from '../../../security/roles';

@Component({
  selector: 'app-identite-page',
  imports: [
    IdentiteTableComponent
  ],
  templateUrl: './identite-page.component.html',
  styleUrl: './identite-page.component.scss',
})
export class IdentitePageComponent extends AbstractProtectedComponent {
  constructor() {
    super();
  }

  protected override readAccess(): Roles {
    return Roles.R_IDENTITE_LECTEUR;
  }

  protected override editAccess(): Roles {
    return Roles.R_IDENTITE_EDITEUR;
  }
}
