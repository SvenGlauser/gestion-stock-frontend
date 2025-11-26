import {Component} from '@angular/core';
import {AbstractProtectedComponent} from '../../../common/abstract/abstract-protected-component.directive';
import {Roles} from '../../../security/roles';
import {FournisseurTableComponent} from '../table/fournisseur-table.component';

@Component({
  selector: 'app-fournisseur-page',
  imports: [
    FournisseurTableComponent
  ],
  templateUrl: './fournisseur-page.component.html',
  styleUrl: './fournisseur-page.component.scss',
})
export class FournisseurPageComponent extends AbstractProtectedComponent {
  constructor() {
    super();
  }

  protected override readAccess(): Roles {
    return Roles.R_FOURNISSEUR_LECTEUR;
  }

  protected override editAccess(): Roles {
    return Roles.R_FOURNISSEUR_EDITEUR;
  }
}
