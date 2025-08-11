import {Component, computed, Signal} from '@angular/core';
import {WidgetComponent} from '../../common/widget/widget.component';
import {Link} from '../../menu/link';
import {MenuService} from '../../menu/menu.service';

@Component({
  selector: 'app-accueil',
  imports: [
    WidgetComponent
  ],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss'
})
export class AccueilComponent {
  protected readonly links: Signal<Link[]> = computed((): Link[] => {
    return this.menuService
      .links()
      .filter(link => link.onHomePage)
  });

  constructor(private readonly menuService: MenuService) {}
}
