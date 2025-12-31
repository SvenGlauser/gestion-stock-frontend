import {Component} from '@angular/core';
import {AuthentificationService} from '../../security/authentification.service';

@Component({
  selector: 'app-logout',
  imports: [],
  template: '',
})
export class LogoutComponent {
  constructor(private readonly authentificationService: AuthentificationService) {
    this.authentificationService.logout();
  }
}
