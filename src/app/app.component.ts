import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDrawer, MatDrawerContainer, MatSidenavModule} from '@angular/material/sidenav';
import {MenuComponent} from './menu/menu.component';
import {KeycloakService} from './security/keycloak.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbar, MatIconButton, MatIcon, MatSidenavModule, MatDrawerContainer, MatDrawer, MenuComponent, MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private readonly keycloakService: KeycloakService) {}

  protected logout(): void {
    this.keycloakService.logout();
  }

  protected login(): void {
    this.keycloakService.login();
  }

  protected isLoggedIn(): boolean {
    return this.keycloakService.isLoggedIn();
  }
}
