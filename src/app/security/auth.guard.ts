import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot} from '@angular/router';
import {KeycloakService} from './keycloak.service';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const keycloakService: KeycloakService = inject(KeycloakService);

  if (keycloakService.isLoggedIn()) {
    return true;
  }

  keycloakService.login();

  return false;
};
