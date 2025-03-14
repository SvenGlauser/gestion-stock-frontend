import {Routes} from '@angular/router';
import {AccueilComponent} from './accueil/accueil.component';
import {PaysTableComponent} from './page/pays/table/pays-table.component';
import {LocaliteTableComponent} from './page/localite/table/localite-table.component';
import {CategorieTableComponent} from './page/categorie/table/categorie-table.component';
import {FournisseurTableComponent} from './page/fournisseur/table/fournisseur-table.component';
import {ContactTableComponent} from './page/contact/table/contact-table.component';
import {PieceTableComponent} from './page/piece/table/piece-table.component';

export const routes: Routes = [
  {
    path: '',
    component: AccueilComponent,
    children: [],
  }, {
    path: 'pieces',
    component: PieceTableComponent,
    children: [],
  }, {
    path: 'machines/:id',
    component: AccueilComponent,
    children: [],
  }, {
    path: 'contacts',
    component: ContactTableComponent,
    children: [],
  }, {
    path: 'fournisseurs',
    component: FournisseurTableComponent,
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
