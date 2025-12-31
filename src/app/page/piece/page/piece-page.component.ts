import {Component} from '@angular/core';
import {AbstractProtectedComponent} from '../../../common/abstract/abstract-protected-component.directive';
import {Roles} from '../../../security/roles';
import {PieceTableComponent} from '../table/piece-table.component';

@Component({
  selector: 'app-piece-page',
  imports: [
    PieceTableComponent
  ],
  templateUrl: './piece-page.component.html',
  styleUrl: './piece-page.component.scss',
})
export class PiecePageComponent extends AbstractProtectedComponent {
  constructor() {
    super();
  }

  protected override readAccess(): Roles {
    return Roles.R_PIECE_LECTEUR;
  }

  protected override editAccess(): Roles {
    return Roles.R_PIECE_EDITEUR;
  }
}
