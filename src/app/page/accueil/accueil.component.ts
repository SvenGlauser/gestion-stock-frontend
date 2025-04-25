import {Component} from '@angular/core';
import {WidgetComponent} from '../../common/widget/widget.component';
import {Link} from '../../menu/link';
import {MenuComponent} from '../../menu/menu.component';

@Component({
  selector: 'app-accueil',
  imports: [
    WidgetComponent
  ],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss'
})
export class AccueilComponent {

  /**
   * Retourne tous les liens à afficher sur la page d'accueil
   */
  public getAllWidgetLinks(): Link[] {
    return MenuComponent.links.filter(link => link.onHomePage);
  }
}
