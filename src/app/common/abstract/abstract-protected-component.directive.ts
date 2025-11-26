import {Directive, effect, inject} from '@angular/core';
import {Roles} from '../../security/roles';
import {AuthentificationService} from '../../security/authentification.service';
import {Router} from '@angular/router';

@Directive()
export abstract class AbstractProtectedComponent {
  protected constructor() {
    const authentificationService: AuthentificationService = inject(AuthentificationService);

    effect((): void => {
      let canAccess: boolean = false;

      if (authentificationService.authenticated()) {
        canAccess = this.hasAccess(authentificationService.roles());
      }

      if (!canAccess) {
        this.noAcessAction();
      }
    })
  }

  protected abstract readAccess(): Roles;
  protected abstract editAccess(): Roles;

  protected hasAccess(roles: string[]): boolean {
    return roles.includes(this.readAccess().toString());
  }

  protected noAcessAction(): void {
    inject(Router)
      .navigate(['/'])
      .then();
  }
}
