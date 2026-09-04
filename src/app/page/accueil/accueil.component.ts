import {ChangeDetectionStrategy, Component, computed, Signal} from '@angular/core';
import {WidgetComponent} from '../../common/widget/widget.component';
import {MenuLink} from '../../menu/menu-link';
import {MenuService} from '../../menu/menu.service';

@Component({
  selector: 'app-accueil',
  imports: [
    WidgetComponent
  ],
  templateUrl: './accueil.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './accueil.component.scss'
})
export class AccueilComponent {
  protected readonly links: Signal<MenuLink[]> = computed((): MenuLink[] => {
    return this.menuService
      .links()
      .filter(link => link.onHomePage)
  });

  constructor(private readonly menuService: MenuService) {
  }
}
