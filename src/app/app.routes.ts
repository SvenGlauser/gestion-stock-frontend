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
import {PieceStatistiqueComponent} from './page/piece/statistique/piece-statistique.component';

export const routes: Routes = [
  {
    path: '',
    component: AccueilComponent,
    children: [],
    title: 'Gestion des stocks'
  }, {
    path: 'pieces',
    children: [
      {
        path: '',
        component: PieceTableComponent,
        title: 'Pièces'
      }, {
        path: 'statistiques',
        component: PieceStatistiqueComponent,
        title: 'Statistiques'
      }, {
        path: 'historique/:id',
        component: PieceHistoriqueTableComponent,
        children: [],
        title: 'Historique du stock'
      },
    ],
  }, {
    path: 'machines/:typeIdentite/:id',
    component: MachineTableComponent,
    children: [],
    title: 'Machines'
  }, {
    path: 'identites',
    component: IdentiteTableComponent,
    children: [],
    title: 'Identités'
  }, {
    path: 'fournisseurs',
    component: FournisseurTableComponent,
    children: [],
    title: 'Fournisseurs'
  }, {
    path: 'categories',
    component: CategorieTableComponent,
    children: [],
    title: 'Catégories'
  }, {
    path: 'localites',
    component: LocaliteTableComponent,
    children: [],
    title: 'Localites'
  }, {
    path: 'pays',
    component: PaysTableComponent,
    children: [],
    title: 'Pays'
  }, {
    path: 'technique',
    children: [
      {
        path: '',
        component: TechniqueComponent,
        children: [],
        title: 'Technique'
      }, {
        path: 'exceptions',
        component: ExceptionTableComponent,
        children: [],
        title: 'Exceptions'
      }
    ],
  },
];
