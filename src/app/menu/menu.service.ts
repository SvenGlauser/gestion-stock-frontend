import {Injectable, signal, WritableSignal} from '@angular/core';
import {Link} from './link';
import {NavigationStart, Router} from '@angular/router';
import {filter} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  public readonly links: WritableSignal<Link[]> = signal([
    {
      name: "Accueil",
      icon: "home",
      url: "/",
    }, {
      name: "Pièces",
      icon: "settings_suggest",
      url: "/pieces",
      onHomePage: true,
      separatorBefore: "Actions principales",
      children: [
        {
          name: "Statistiques des pièces",
          icon: "bar_chart",
          url: "/pieces/statistiques",
        }
      ]
    }, {
      name: "Machines",
      icon: "agriculture",
      disabled: true,
      disabledLabel: "Pour accéder à cette page, utilisez la page des identités",
      url: "/machines/",
    }, {
      name: "Identités",
      icon: "person_apron",
      onHomePage: true,
      url: "/identites",
    }, {
      name: "Fournisseurs",
      icon: "local_shipping",
      onHomePage: true,
      url: "/fournisseurs",
    }, {
      name: "Catégories",
      icon: "category",
      onHomePage: true,
      url: "/categories",
      separatorBefore: "Configuration",
    }, {
      name: "Localités",
      icon: "location_city",
      onHomePage: true,
      url: "/localites",
    }, {
      name: "Pays",
      icon: "flag",
      onHomePage: true,
      url: "/pays",
    },
    {
      name: "Technique",
      icon: "build",
      url: "/technique",
      separatorBefore: "Technique",
      children: [
        {
          name: "Exceptions",
          icon: "bug_report",
          url: "/technique/exceptions",
        }
      ]
    },
  ]);

  constructor(private readonly router: Router) {
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
    let bestItem: Link | null = null;
    let lastLength: number = 0;

    const links: Link[] = structuredClone(this.links());

    for (const item of this.getLinksInCasacade(links)) {
      if(url.startsWith(item.url)) {
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

  private getLinksInCasacade(links: Link[]): Link[] {
    if (links.length === 0) {
      return [];
    }

    let linksWithChildren: Link[] = [...links];
    for (const link of links) {
      linksWithChildren.push(link);
      linksWithChildren.push(...this.getLinksInCasacade(link.children ?? []));
    }
    return linksWithChildren;
  }
}
