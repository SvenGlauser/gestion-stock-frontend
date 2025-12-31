import {Component} from '@angular/core';
import {LocaliteTableComponent} from '../table/localite-table.component';
import {AbstractProtectedComponent} from '../../../common/abstract/abstract-protected-component.directive';
import {Roles} from '../../../security/roles';

@Component({
  selector: 'app-localite-page',
  imports: [
    LocaliteTableComponent
  ],
  templateUrl: './localite-page.component.html',
  styleUrl: './localite-page.component.scss',
})
export class LocalitePageComponent extends AbstractProtectedComponent {
  constructor() {
    super();
  }

  protected override readAccess(): Roles {
    return Roles.R_LOCALITE_LECTEUR;
  }

  protected override editAccess(): Roles {
    return Roles.R_LOCALITE_EDITEUR;
  }
}
