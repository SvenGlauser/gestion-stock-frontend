import {Component, OnInit} from '@angular/core';
import {MatListItem, MatListItemTitle, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {Link} from './link';
import {NavigationStart, Router, RouterLink} from '@angular/router';
import {filter} from 'rxjs';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-menu',
  imports: [
    MatNavList,
    MatListItem,
    MatIcon,
    RouterLink,
    MatListItemTitle,
    MatTooltip
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  private static readonly _links: Link[] = [
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
    }, {
      name: "Historique des pièces",
      icon: "history",
      disabled: true,
      disabledLabel: "Pour accéder à cette page, utilisez la page des pièces",
      url: "/pieces/historique/",
    }, {
      name: "Machines",
      icon: "agriculture",
      disabled: true,
      disabledLabel: "Pour accéder à cette page, utilisez la page des contacts",
      url: "/machines/",
    }, {
      name: "Contacts",
      icon: "person_apron",
      onHomePage: true,
      url: "/contacts",
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
      name: "Exceptions",
      icon: "bug_report",
      url: "/exceptions",
      separatorBefore: "Technique"
    },
  ];

  static get links(): Link[] {
    return this._links;
  }

  get links(): Link[] {
    return MenuComponent._links;
  }

  constructor(private readonly router: Router) {}

  /**
   * Instancie le composant
   */
  public ngOnInit(): void {
    // Catch les changements de page
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
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

    for (const item of this.links) {
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
  }
}
