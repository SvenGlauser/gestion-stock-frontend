import {Component, OnInit} from '@angular/core';
import {MatListItem, MatListItemTitle, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {Link} from './link';
import {NavigationStart, Router, RouterLink} from '@angular/router';
import {filter} from 'rxjs';

@Component({
  selector: 'app-menu',
  imports: [
    MatNavList,
    MatListItem,
    MatIcon,
    RouterLink,
    MatListItemTitle
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  protected links: Link[] = [
    {
      name: "Accueil",
      icon: "home",
      isActive: false,
      url: "/",
    }, {
      name: "Pièces",
      icon: "settings_suggest",
      isActive: false,
      url: "/pieces",
      separatorBefore: "Actions principales",
    }, {
      name: "Machines",
      icon: "agriculture",
      isActive: false,
      url: "/machines",
    }, {
      name: "Clients",
      icon: "person_apron",
      isActive: false,
      url: "/clients",
    }, {
      name: "Fournisseurs",
      icon: "local_shipping",
      isActive: false,
      url: "/fournisseurs",
    }, {
      name: "Catégories",
      icon: "category",
      isActive: false,
      url: "/categories",
      separatorBefore: "Configuration",
    }, {
      name: "Localités",
      icon: "location_city",
      isActive: false,
      url: "/localites",
    }, {
      name: "Pays",
      icon: "flag",
      isActive: false,
      url: "/pays",
    },
  ];

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
    this.links = this.links.map(item => {
      item.isActive = item.url === url;
      return item;
    });
  }
}
