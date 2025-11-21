import {Injectable, signal, WritableSignal} from '@angular/core';
import {MenuLink, MenuLinkGroup} from './menu-link';
import {NavigationStart, Route, Router} from '@angular/router';
import {filter} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AppRoute} from '../app.routes';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  public readonly links: WritableSignal<MenuLink[]> = signal([]);

  constructor(private readonly router: Router) {
    // Load all routes
    this.links.set(this.loadRoutes(router.config));

    // Catch les changements de page
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
        takeUntilDestroyed())
      .subscribe(event => {
        this.updateActivated(event.url);
      });

    this.updateActivated(this.router.url);
  }

  /**
   * Met à jour l'item actif dans le menu
   * @param url Nouvelle URL
   */
  private updateActivated(url: string): void {
    let bestItem: MenuLink | null = null;
    let lastLength: number = 0;

    const links: MenuLink[] = structuredClone(this.links());

    for (const item of links) {
      if (url.startsWith(item.url)) {
        let length = item.url.length;

        if (length > lastLength) {
          bestItem = item;
          lastLength = length;
        }
      }

      item.activated = false;
    }

    if (bestItem) {
      bestItem.activated = true;
    }

    this.links.set(links);
  }

  private loadRoutes(routes: Route[], parentUrl: string = ""): MenuLink[] {
    let menuLinks: MenuLink[] = [];

    for (const route of routes) {
      const appRoute: AppRoute = <AppRoute>route;

      let url: string = parentUrl;
      let currentUrl: string = appRoute.path?.split(":")[0] ?? "";
      if (currentUrl.endsWith("/")) {
        currentUrl = currentUrl.substring(0, currentUrl.length - 2);
      }

      if (currentUrl != "") {
        url += "/" + currentUrl;
      }

      if (appRoute.data?.menu) {
        const menu = appRoute.data.menu;

        const link: MenuLink = {
          name: menu.name,
          icon: menu.icon,
          url: url,

          onHomePage: menu.onHomePage,

          group: menu.group,
          order: menu.order,

          disabled: menu.disabled,
          disabledLabel: menu.disabledLabel,
        };

        menuLinks.push(link);
      }

      if (appRoute.children) {
        menuLinks.push(...this.loadRoutes(appRoute.children, url));
      }
    }

    return menuLinks;
  }
}
