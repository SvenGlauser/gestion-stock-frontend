import {Component} from '@angular/core';
import {AbstractProtectedComponent} from '../../../common/abstract/abstract-protected-component.directive';
import {Roles} from '../../../security/roles';
import {PieceHistoriqueTableComponent} from '../table/piece-historique-table.component';

@Component({
  selector: 'app-piece-historique-page',
  imports: [
    PieceHistoriqueTableComponent
  ],
  templateUrl: './piece-historique-page.component.html',
  styleUrl: './piece-historique-page.component.scss',
})
export class PieceHistoriquePageComponent extends AbstractProtectedComponent {
  constructor() {
    super();
  }

  protected override readAccess(): Roles {
    return Roles.R_PIECE_HISTORIQUE_LECTEUR;
  }

  protected override editAccess(): Roles {
    return Roles.R_PIECE_HISTORIQUE_EDITEUR;
  }
}
