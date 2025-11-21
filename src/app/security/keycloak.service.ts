import {effect, inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import Keycloak from 'keycloak-js';
import {KEYCLOAK_EVENT_SIGNAL, KeycloakEventType} from 'keycloak-angular';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  constructor(private readonly keycloak: Keycloak,
              private readonly router: Router) {
    effect(() => {
      if (this.keycloakSignal().type === KeycloakEventType.AuthRefreshError) {
        this.router.navigate(['/', 'logout']).then();
      }
    });
  }

  public isLoggedIn(): boolean {
    return this.keycloak.authenticated;
  }

  public hasRole(role: string): boolean {
    if (this.isLoggedIn()) {
      if (this.keycloak.realmAccess) {
        return this.keycloak.realmAccess.roles.includes(role);
      }
    }
    return false;
  }

  public hasRoles(roles: string[]): boolean {
    if (this.isLoggedIn()) {
      if (this.keycloak.realmAccess) {
        for (const role in roles) {
          if (!this.keycloak.realmAccess.roles.includes(role)) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }

  public logout(): void {
    this.keycloak.logout().then();
  }

  public login(): void {
    this.keycloak.login().then();
  }
}
