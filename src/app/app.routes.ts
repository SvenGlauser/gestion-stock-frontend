import {Route} from '@angular/router';
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
import {authGuard} from './security/auth.guard';
import {MenuLinkGroup} from './menu/menu-link';

export interface AppRoute extends Route {
  data?: {
    security?: {
      roles: string[];
    },
    menu?: {
      name: string;
      icon: string;
      onHomePage?: boolean;
      disabled?: boolean;
      disabledLabel?: string;
      group: MenuLinkGroup;
      order: number;
    }
  },
}

export const routes: AppRoute[] = [
  {
    path: '',
    component: AccueilComponent,
    children: [],
    title: 'Gestion des stocks',
    data: {
      menu: {
        name: "Accueil",
        icon: "home",
        group: MenuLinkGroup.DEFAULT,
        order: 0,
      }
    },
  }, {
    path: 'pieces',
    children: [
      {
        path: '',
        component: PieceTableComponent,
        title: 'Pièces',
        data: {
          menu: {
            name: "Pièces",
            icon: "settings_suggest",
            group: MenuLinkGroup.ACTIONS_PRINCIPALES,
            order: 0,
            onHomePage: true,
          }
        },
      }, {
        path: 'statistiques',
        component: PieceStatistiqueComponent,
        title: 'Statistiques',
        data: {
          menu: {
            name: "Statistiques des pièces",
            icon: "bar_chart",
            group: MenuLinkGroup.ACTIONS_PRINCIPALES,
            order: 1,
          }
        },
      }, {
        path: 'historique/:id',
        component: PieceHistoriqueTableComponent,
        children: [],
        title: 'Historique du stock'
      },
    ],
    canActivate: [authGuard],
  }, {
    path: 'machines/:typeIdentite/:id',
    component: MachineTableComponent,
    children: [],
    title: 'Machines',
    canActivate: [authGuard],
    data: {
      menu: {
        name: "Machines",
        icon: "agriculture",
        group: MenuLinkGroup.ACTIONS_PRINCIPALES,
        order: 2,
        disabled: true,
        disabledLabel: "Pour accéder à cette page, utilisez la page des identités",
      }
    },
  }, {
    path: 'identites',
    component: IdentiteTableComponent,
    children: [],
    title: 'Identités',
    canActivate: [authGuard],
    data: {
      menu: {
        name: "Identités",
        icon: "person_apron",
        group: MenuLinkGroup.ACTIONS_PRINCIPALES,
        order: 3,
        onHomePage: true,
      }
    },
  }, {
    path: 'fournisseurs',
    component: FournisseurTableComponent,
    children: [],
    title: 'Fournisseurs',
    canActivate: [authGuard],
    data: {
      menu: {
        name: "Fournisseurs",
        icon: "local_shipping",
        group: MenuLinkGroup.ACTIONS_PRINCIPALES,
        order: 4,
        onHomePage: true,
      }
    },
  }, {
    path: 'categories',
    component: CategorieTableComponent,
    children: [],
    title: 'Catégories',
    canActivate: [authGuard],
    data: {
      menu: {
        name: "Catégories",
        icon: "category",
        group: MenuLinkGroup.CONFIGURATION,
        order: 0,
        onHomePage: true,
      }
    },
  }, {
    path: 'localites',
    component: LocaliteTableComponent,
    children: [],
    title: 'Localites',
    canActivate: [authGuard],
    data: {
      menu: {
        name: "Localités",
        icon: "location_city",
        group: MenuLinkGroup.CONFIGURATION,
        order: 1,
        onHomePage: true,
      }
    },
  }, {
    path: 'pays',
    component: PaysTableComponent,
    children: [],
    title: 'Pays',
    canActivate: [authGuard],
    data: {
      menu: {
        name: "Pays",
        icon: "flag",
        group: MenuLinkGroup.CONFIGURATION,
        order: 2,
        onHomePage: true,
      }
    },
  }, {
    path: 'technique',
    children: [
      {
        path: '',
        component: TechniqueComponent,
        children: [],
        title: 'Technique',
        data: {
          menu: {
            name: "Technique",
            icon: "build",
            group: MenuLinkGroup.TECHNIQUE,
            order: 0,
          }
        },
      }, {
        path: 'exceptions',
        component: ExceptionTableComponent,
        children: [],
        title: 'Exceptions',
        data: {
          menu: {
            name: "Exceptions",
            icon: "bug_report",
            group: MenuLinkGroup.TECHNIQUE,
            order: 1,
          }
        },
      }
    ],
    canActivate: [authGuard],
  },
];
