import {ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, RouterStateSnapshot} from '@angular/router';
import {AuthentificationService} from './authentification.service';
import {inject} from '@angular/core';
import {AppRoute} from '../app.routes';
import {Roles} from './roles';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authentificationService: AuthentificationService = inject(AuthentificationService);

  if (authentificationService.authenticated()) {
    const requiredRole: Roles[] = [...(<AppRoute>route.routeConfig).data?.security?.roles ?? []]

    return authentificationService.hasRoles(requiredRole);
  }

  authentificationService.login();

  return false;
};

export const adminChildGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return authGuard(childRoute, state);
};
