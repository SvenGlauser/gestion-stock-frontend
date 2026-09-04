import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthentificationService} from '../../security/authentification.service';

@Component({
  selector: 'app-logout',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '',
})
export class LogoutComponent {
  constructor(private readonly authentificationService: AuthentificationService) {
    this.authentificationService.logout();
  }
}
