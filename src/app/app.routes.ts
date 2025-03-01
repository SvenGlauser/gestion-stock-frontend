import { Routes } from '@angular/router';
import {AccueilComponent} from './accueil/accueil.component';

export const routes: Routes = [
  {
    path: '',
    component: AccueilComponent,
    children: [],
  }, {
    path: 'localites',
    component: AccueilComponent,
    children: [],
  }
];
