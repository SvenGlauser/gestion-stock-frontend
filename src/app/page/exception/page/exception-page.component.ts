import {Component} from '@angular/core';
import {AbstractProtectedComponent} from '../../../common/abstract/abstract-protected-component.directive';
import {Roles} from '../../../security/roles';
import {ExceptionTableComponent} from '../table/exception-table.component';

@Component({
  selector: 'app-exception-page',
  imports: [
    ExceptionTableComponent
  ],
  templateUrl: './exception-page.component.html',
  styleUrl: './exception-page.component.scss',
})
export class ExceptionPageComponent extends AbstractProtectedComponent {
  constructor() {
    super();
  }

  protected override readAccess(): Roles {
    return Roles.R_EXCEPTION_LECTEUR;
  }

  protected override editAccess(): Roles {
    return Roles.R_EXCEPTION_EDITEUR;
  }
}
