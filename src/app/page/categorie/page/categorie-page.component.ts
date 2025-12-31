import {Component} from '@angular/core';
import {CategorieTableComponent} from '../table/categorie-table.component';
import {AbstractProtectedComponent} from '../../../common/abstract/abstract-protected-component.directive';
import {Roles} from '../../../security/roles';

@Component({
  selector: 'app-categorie-page',
  imports: [
    CategorieTableComponent
  ],
  templateUrl: './categorie-page.component.html',
  styleUrl: './categorie-page.component.scss',
})
export class CategoriePageComponent extends AbstractProtectedComponent {

  constructor() {
    super();
  }

  protected override readAccess(): Roles {
    return Roles.R_CATEGORIE_LECTEUR;
  }

  protected override editAccess(): Roles {
    return Roles.R_CATEGORIE_EDITEUR;
  }
}
