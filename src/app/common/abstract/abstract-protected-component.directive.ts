import {Directive, effect, inject} from '@angular/core';
import {Roles} from '../../security/roles';
import {AuthentificationService} from '../../security/authentification.service';
import {Router} from '@angular/router';

@Directive()
export abstract class AbstractProtectedComponent {
  private authentificationService: AuthentificationService = inject(AuthentificationService);

  protected constructor() {
    effect((): void => {
      let canAccess: boolean = false;

      if (this.authentificationService.authenticated()) {
        canAccess = this.hasAccess();
      }

      if (!canAccess) {
        this.noAcessAction();
      }
    })
  }

  protected abstract readAccess(): Roles;
  protected abstract editAccess(): Roles;

  protected hasAccess(): boolean {
    return this.hasReadAccess();
  }

  protected hasReadAccess(): boolean {
    return this.authentificationService
      .roles()
      .includes(this.readAccess().toString());
  }

  protected hasEditAccess(): boolean {
    return this.authentificationService
      .roles()
      .includes(this.editAccess().toString());
  }

  protected noAcessAction(): void {
    inject(Router)
      .navigate(['/'])
      .then();
  }
}
