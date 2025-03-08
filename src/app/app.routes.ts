import {Routes} from '@angular/router';
import {AccueilComponent} from './accueil/accueil.component';
import {PaysComponent} from './pays/pays.component';
import {LocaliteComponent} from './localite/localite.component';

export const routes: Routes = [
  {
    path: '',
    component: AccueilComponent,
    children: [],
  }, {
    path: 'localites',
    component: LocaliteComponent,
    children: [],
  }, {
    path: 'pays',
    component: PaysComponent,
    children: [],
  }
];
