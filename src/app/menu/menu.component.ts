import {Component, computed, Signal} from '@angular/core';
import {MatNavList} from '@angular/material/list';
import {Link} from './link';
import {MenuItemComponent} from './menu-item/menu-item.component';
import {MenuService} from './menu.service';

@Component({
  selector: 'app-menu',
  imports: [
    MatNavList,
    MenuItemComponent
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  protected readonly links: Signal<Link[]> = computed(() => this.menuService.links());

  constructor(private readonly menuService: MenuService) {}
}
