import {Routes} from '@angular/router';
import {AccueilComponent} from './accueil/accueil.component';
import {PaysTableComponent} from './pays/table/pays-table.component';
import {LocaliteTableComponent} from './localite/table/localite-table.component';

export const routes: Routes = [
  {
    path: '',
    component: AccueilComponent,
    children: [],
  }, {
    path: 'localites',
    component: LocaliteTableComponent,
    children: [],
  }, {
    path: 'pays',
    component: PaysTableComponent,
    children: [],
  }
];
