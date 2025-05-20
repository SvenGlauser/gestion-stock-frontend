import {Routes} from '@angular/router';
import {AccueilComponent} from './page/accueil/accueil.component';
import {PaysTableComponent} from './page/pays/table/pays-table.component';
import {LocaliteTableComponent} from './page/localite/table/localite-table.component';
import {CategorieTableComponent} from './page/categorie/table/categorie-table.component';
import {FournisseurTableComponent} from './page/fournisseur/table/fournisseur-table.component';
import {IdentiteTableComponent} from './page/identite/table/identite-table.component';
import {PieceTableComponent} from './page/piece/table/piece-table.component';
import {MachineTableComponent} from './page/machine/table/machine-table.component';
import {ExceptionTableComponent} from './page/exception/table/exception-table.component';
import {PieceHistoriqueTableComponent} from './page/piece-historique/table/piece-historique-table.component';
import {TechniqueComponent} from './page/technique/technique.component';

export const routes: Routes = [
  {
    path: '',
    component: AccueilComponent,
    children: [],
  }, {
    path: 'pieces',
    children: [
      {
        path: '',
        component: PieceTableComponent,
      }, {
        path: 'historique/:id',
        component: PieceHistoriqueTableComponent,
        children: [],
      },
    ],
  }, {
    path: 'machines/:typeIdentite/:id',
    component: MachineTableComponent,
    children: [],
  }, {
    path: 'identites',
    component: IdentiteTableComponent,
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
  }, {
    path: 'technique',
    children: [
      {
        path: '',
        component: TechniqueComponent,
        children: [],
      }, {
        path: 'exceptions',
        component: ExceptionTableComponent,
        children: [],
      }
    ],
  },
];
