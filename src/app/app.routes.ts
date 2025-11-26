import {CanActivateFn, Route} from '@angular/router';
import {AccueilComponent} from './page/accueil/accueil.component';
import {TechniquePageComponent} from './page/technique/technique-page.component';
import {PieceStatistiquePageComponent} from './page/piece/statistique/piece-statistique-page.component';
import {adminChildGuard, authGuard} from './security/auth.guard';
import {MenuLinkGroup} from './menu/menu-link';
import {LogoutComponent} from './page/logout/logout.component';
import {Roles} from './security/roles';
import {CategoriePageComponent} from './page/categorie/page/categorie-page.component';
import {PiecePageComponent} from './page/piece/page/piece-page.component';
import {PieceHistoriquePageComponent} from './page/piece-historique/page/piece-historique-page.component';
import {MachinePageComponent} from './page/machine/page/machine-page.component';
import {IdentitePageComponent} from './page/identite/page/identite-page.component';
import {FournisseurPageComponent} from './page/fournisseur/page/fournisseur-page.component';
import {LocalitePageComponent} from './page/localite/page/localite-page.component';
import {PaysPageComponent} from './page/pays/page/pays-page.component';
import {ExceptionPageComponent} from './page/exception/page/exception-page.component';

export interface AppRoute extends Route {
  data?: {
    security?: {
      roles: Roles[];
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
  canActivate: Array<CanActivateFn>,
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
    canActivate: [],
  }, {
    path: 'pieces',
    children: [
      {
        path: '',
        component: PiecePageComponent,
        title: 'Pièces',
        data: {
          menu: {
            name: "Pièces",
            icon: "settings_suggest",
            group: MenuLinkGroup.ACTIONS_PRINCIPALES,
            order: 0,
            onHomePage: true,
          },
          security: {
            roles: [Roles.R_PIECE_LECTEUR],
          }
        },
      }, {
        path: 'statistiques',
        component: PieceStatistiquePageComponent,
        title: 'Statistiques',
        data: {
          menu: {
            name: "Statistiques des pièces",
            icon: "bar_chart",
            group: MenuLinkGroup.ACTIONS_PRINCIPALES,
            order: 1,
          },
          security: {
            roles: [Roles.R_PIECE_STATISTIQUE_LECTEUR],
          }
        },
      }, {
        path: 'historique/:id',
        component: PieceHistoriquePageComponent,
        children: [],
        title: 'Historique du stock',
        data: {
          security: {
            roles: [Roles.R_PIECE_HISTORIQUE_LECTEUR],
          }
        },
      },
    ],
    canActivate: [authGuard],
    canActivateChild: [adminChildGuard],
  }, {
    path: 'machines/:typeIdentite/:id',
    component: MachinePageComponent,
    children: [],
    title: 'Machines',
    data: {
      menu: {
        name: "Machines",
        icon: "agriculture",
        group: MenuLinkGroup.ACTIONS_PRINCIPALES,
        order: 2,
        disabled: true,
        disabledLabel: "Pour accéder à cette page, utilisez la page des identités",
      },
      security: {
        roles: [Roles.R_MACHINE_LECTEUR],
      }
    },
    canActivate: [authGuard],
    canActivateChild: [adminChildGuard],
  }, {
    path: 'identites',
    component: IdentitePageComponent,
    children: [],
    title: 'Identités',
    data: {
      menu: {
        name: "Identités",
        icon: "person_apron",
        group: MenuLinkGroup.ACTIONS_PRINCIPALES,
        order: 3,
        onHomePage: true,
      },
      security: {
        roles: [Roles.R_IDENTITE_LECTEUR],
      }
    },
    canActivate: [authGuard],
    canActivateChild: [adminChildGuard],
  }, {
    path: 'fournisseurs',
    component: FournisseurPageComponent,
    children: [],
    title: 'Fournisseurs',
    data: {
      menu: {
        name: "Fournisseurs",
        icon: "local_shipping",
        group: MenuLinkGroup.ACTIONS_PRINCIPALES,
        order: 4,
        onHomePage: true,
      },
      security: {
        roles: [Roles.R_FOURNISSEUR_LECTEUR],
      }
    },
    canActivate: [authGuard],
    canActivateChild: [adminChildGuard],
  }, {
    path: 'categories',
    component: CategoriePageComponent,
    children: [],
    title: 'Catégories',
    data: {
      menu: {
        name: "Catégories",
        icon: "category",
        group: MenuLinkGroup.CONFIGURATION,
        order: 0,
        onHomePage: true,
      },
      security: {
        roles: [Roles.R_CATEGORIE_LECTEUR],
      }
    },
    canActivate: [authGuard],
    canActivateChild: [adminChildGuard],
  }, {
    path: 'localites',
    component: LocalitePageComponent,
    children: [],
    title: 'Localites',
    data: {
      menu: {
        name: "Localités",
        icon: "location_city",
        group: MenuLinkGroup.CONFIGURATION,
        order: 1,
        onHomePage: true,
      },
      security: {
        roles: [Roles.R_LOCALITE_LECTEUR],
      }
    },
    canActivate: [authGuard],
    canActivateChild: [adminChildGuard],
  }, {
    path: 'pays',
    component: PaysPageComponent,
    children: [],
    title: 'Pays',
    data: {
      menu: {
        name: "Pays",
        icon: "flag",
        group: MenuLinkGroup.CONFIGURATION,
        order: 2,
        onHomePage: true,
      },
      security: {
        roles: [Roles.R_PAYS_LECTEUR],
      }
    },
    canActivate: [authGuard],
    canActivateChild: [adminChildGuard],
  }, {
    path: 'technique',
    children: [
      {
        path: '',
        component: TechniquePageComponent,
        children: [],
        title: 'Technique',
        data: {
          menu: {
            name: "Technique",
            icon: "build",
            group: MenuLinkGroup.TECHNIQUE,
            order: 0,
          },
          security: {
            roles: [Roles.R_TECHNIQUE_LECTEUR],
          }
        },
      }, {
        path: 'exceptions',
        component: ExceptionPageComponent,
        children: [],
        title: 'Exceptions',
        data: {
          menu: {
            name: "Exceptions",
            icon: "bug_report",
            group: MenuLinkGroup.TECHNIQUE,
            order: 1,
          },
          security: {
            roles: [Roles.R_EXCEPTION_LECTEUR],
          },
        },
      }
    ],
    canActivate: [authGuard],
    canActivateChild: [adminChildGuard],
  },
  {
    path: 'logout',
    component: LogoutComponent,
    children: [],
    title: 'Logout',
    canActivate: [authGuard],
  }
];
