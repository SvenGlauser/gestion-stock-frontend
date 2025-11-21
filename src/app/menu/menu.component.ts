import {Component, computed, Signal} from '@angular/core';
import {MatNavList} from '@angular/material/list';
import {MenuLink, menuLinkGroupNameMapper} from './menu-link';
import {MenuItemComponent} from './menu-item/menu-item.component';
import {MenuService} from './menu.service';
import {KeyValuePipe} from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [
    MatNavList,
    MenuItemComponent,
    KeyValuePipe
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  protected readonly linksGrouped: Signal<Map<string, MenuLink[]>> = computed(() => this.loadLinks());

  constructor(private readonly menuService: MenuService) {
  }

  private loadLinks(): Map<string, MenuLink[]> {
    let linksGrouped = new Map<string, MenuLink[]>();

    const links = this.menuService
      .links()
      .sort((link1, link2) => link1.order - link2.order);

    for (const link of links) {
      const groupName = menuLinkGroupNameMapper.get(link.group) ?? "";

      let links: MenuLink[] | undefined = linksGrouped.get(groupName);
      if (links === undefined) {
        links = [];
        linksGrouped.set(groupName, links);
      }

      links.push(link);
    }

    return linksGrouped;
  }
}
