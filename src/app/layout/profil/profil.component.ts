import {Component, computed, Signal} from '@angular/core';
import {AuthentificationService} from '../../security/authentification.service';
import {MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from '@angular/material/list';

@Component({
  selector: 'app-profil',
  imports: [
    MatIconButton,
    MatMenu,
    MatIcon,
    MatMenuItem,
    MatMenuTrigger,
    MatDivider
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss',
})
export class ProfilComponent {
  protected prenom: Signal<string | undefined> = computed(() => this.authentificationService.profil()?.firstName);
  protected nom: Signal<string | undefined> = computed(() => this.authentificationService.profil()?.lastName);
  protected initiales: Signal<string | undefined> = computed(() => this.updateInitiales());

  constructor(private readonly authentificationService: AuthentificationService) {}

  private updateInitiales(): string | undefined {
    const nom: string | undefined = this.nom();
    const prenom: string | undefined = this.prenom();

    if (nom === undefined && prenom === undefined) {
      return undefined;
    }

    return (nom?.charAt(0).toUpperCase() ?? "")
      + (prenom?.charAt(0).toUpperCase() ?? "");
  }

  protected logout(): void {
    this.authentificationService.logout();
  }

  protected openAccountConfiguration(): void {
    this.authentificationService.openAccountConfiguration();
  }
}
