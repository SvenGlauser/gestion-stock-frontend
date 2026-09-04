import {ChangeDetectionStrategy, Component, computed, Signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDrawer, MatDrawerContainer, MatSidenavModule} from '@angular/material/sidenav';
import {MenuComponent} from './menu/menu.component';
import {AuthentificationService} from './security/authentification.service';
import {ProfilComponent} from './layout/profil/profil.component';
import {LayoutService} from './layout/service/layout.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbar, MatIconButton, MatIcon, MatSidenavModule, MatDrawerContainer, MatDrawer, MenuComponent, MatButton, ProfilComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected isLoggedIn: Signal<boolean> = computed((): boolean => this.authentificationService.authenticated());

  constructor(private readonly authentificationService: AuthentificationService,
              protected readonly layoutService: LayoutService) {}

  protected login(): void {
    this.authentificationService.login();
  }
}
