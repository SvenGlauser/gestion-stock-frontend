import {Routes} from '@angular/router';
import {AccueilComponent} from './accueil/accueil.component';
import {PaysTableComponent} from './page/pays/table/pays-table.component';
import {LocaliteTableComponent} from './page/localite/table/localite-table.component';
import {CategorieTableComponent} from './page/categorie/table/categorie-table.component';

export const routes: Routes = [
  {
    path: '',
    component: AccueilComponent,
    children: [],
  }, {
    path: 'categories',
    component: CategorieTableComponent,
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
