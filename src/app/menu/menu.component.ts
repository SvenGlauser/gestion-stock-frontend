import {Component, OnInit} from '@angular/core';
import {MatListItem, MatNavList} from '@angular/material/list';
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
    RouterLink
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  protected links: Link[] = [];

  constructor(private readonly router: Router) {}

  public ngOnInit(): void {
    this.links = [
      {
        name: "Accueil",
        icon: "home",
        isActive: false,
        url: "/",
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

    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(event => {
        this.updateActivated(event.url);
      });

    this.updateActivated(this.router.url);
  }

  private updateActivated(url: string): void {
    this.links = this.links.map(item => {
      item.isActive = item.url === url;
      return item;
    });
  }
}
