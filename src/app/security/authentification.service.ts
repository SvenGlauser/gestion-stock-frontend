import {effect, inject, Injectable, signal, Signal, WritableSignal} from '@angular/core';
import Keycloak, {KeycloakProfile} from 'keycloak-js';
import {KEYCLOAK_EVENT_SIGNAL, KeycloakEvent, KeycloakEventType, ReadyArgs, typeEventArgs} from 'keycloak-angular';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private readonly keycloakSignal: Signal<KeycloakEvent> = inject(KEYCLOAK_EVENT_SIGNAL);

  public authenticated: WritableSignal<boolean> = signal(false);
  public roles: WritableSignal<string[]> = signal([]);
  public profil: WritableSignal<KeycloakProfile | undefined> = signal(undefined);

  constructor(private readonly keycloak: Keycloak,
              private readonly router: Router) {
    effect((): void => {
      let keycloakEvent = this.keycloakSignal();

      switch (keycloakEvent.type) {
        case KeycloakEventType.KeycloakAngularNotInitialized:
          console.debug("Keycloak n'est initialisé")
          break;
        case KeycloakEventType.KeycloakAngularInit:
          console.debug("Keycloak est en cours d'initialisation")
          break;
        case KeycloakEventType.AuthError:
          console.debug("Erreur lors de l'authentification")
          break;
        case KeycloakEventType.AuthLogout:
          console.debug("Déconnexion de l'utilisateur")
          break;
        case KeycloakEventType.AuthRefreshError:
          console.debug("Erreur lors du rafraichissement de token")
          this.logout();
          break;
        case KeycloakEventType.AuthRefreshSuccess:
          console.debug("Succès lors du rafraichissement de token")
          break;
        case KeycloakEventType.AuthSuccess:
          console.debug("Connexion de l'utilisateur")
          break;
        case KeycloakEventType.Ready:
          console.debug("Initialisation réussi de l'adaptateur Keycloak")
          break;
        case KeycloakEventType.TokenExpired:
          console.debug("Token expiré")
          break;
        case KeycloakEventType.ActionUpdate:
          console.debug("Demande d'authentification")
          break;
      }

      if (keycloakEvent.type === KeycloakEventType.Ready) {
        this.authenticated.set(typeEventArgs<ReadyArgs>(keycloakEvent.args));
        this.keycloak
          .loadUserProfile()
          .then((profil: KeycloakProfile) => {
            this.profil.set(profil);
          })
          .catch(() => this.profil.set(undefined));
        this.roles.set(this.keycloak.realmAccess?.roles ?? []);
      }

      if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
        this.authenticated.set(false);
        this.profil.set(undefined)
        this.roles.set([]);
      }
    });
  }

  public hasRole(role: string): boolean {
    if (this.authenticated()) {
      return this.roles().includes(role);
    }
    return false;
  }

  public hasRoles(roles: string[]): boolean {
    if (this.authenticated()) {
      for (const role of roles) {
        if (!this.roles().includes(role)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  public logout(): void {
    this.keycloak.logout().then();
  }

  public login(): void {
    this.keycloak.login().then();
  }

  public openAccountConfiguration(): void {
    this.keycloak.accountManagement().then();
  }
}
