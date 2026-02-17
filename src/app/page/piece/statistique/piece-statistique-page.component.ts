import {Component, effect, signal, WritableSignal} from '@angular/core';
import {NgxEchartsDirective} from 'ngx-echarts';
import * as echarts from 'echarts/core';
import {PieceService} from '../piece.service';
import {AutocompleteComponent} from '../../../common/form/input/autocomplete/autocomplete.component';
import {Categorie} from '../../categorie/categorie.model';
import {Fournisseur} from '../../fournisseur/fournisseur.model';
import {FilterCombinatorType} from '../../../common/search/automatic/automatic-search-field-combinaison';
import {Piece} from '../piece.model';
import {CategorieService} from '../../categorie/categorie.service';
import {FournisseurService} from '../../fournisseur/fournisseur.service';
import {Observable} from 'rxjs';
import {PieceStatistique} from './piece-statistique';
import {AbstractProtectedComponent} from '../../../common/abstract/abstract-protected-component.directive';
import {Roles} from '../../../security/roles';
import {FilterType} from '../../../common/search/automatic/automatic-search-field';

@Component({
  selector: 'app-piece-statistique-page',
  imports: [NgxEchartsDirective, AutocompleteComponent],
  templateUrl: './piece-statistique-page.component.html',
  styleUrl: './piece-statistique-page.component.scss'
})
export class PieceStatistiquePageComponent extends AbstractProtectedComponent {

  protected readonly Categorie: typeof Categorie = Categorie;
  protected readonly Fournisseur: typeof Fournisseur = Fournisseur;

  protected readonly loading: WritableSignal<boolean> = signal(true);
  protected readonly categorie: WritableSignal<Categorie | null> = signal(null);
  protected readonly fournisseur: WritableSignal<Fournisseur | null> = signal(null);

  protected readonly options: WritableSignal<any> = signal({
    tooltip: {
      trigger: 'axis'
    },
    title: {
      left: 'center',
      text: 'Nombre de pièces en stock'
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: []
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%']
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 10
      },
      {
        start: 0,
        end: 10
      }
    ],
    series: [
      {
        name: 'Nombre de pièces',
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: 'rgb(135, 0, 157)'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 0, 135)'
            },
            {
              offset: 1,
              color: 'rgb(135, 0, 157)'
            }
          ])
        },
        data: []
      }, {
        name: 'Montant total',
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: 'rgb(224, 62, 76)'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 191, 0)'
            },
            {
              offset: 1,
              color: 'rgb(224, 62, 76)'
            }
          ])
        },
        data: []
      }
    ]
  });

  constructor(private readonly pieceService: PieceService,
              private readonly categorieService: CategorieService,
              private readonly fournisseurService: FournisseurService) {
    super();

    effect((): void => {
      const categorie: Categorie | null = this.categorie();
      const fournisseur: Fournisseur | null = this.fournisseur();

      this.search(categorie, fournisseur);
    });
  }

  private search(categorie: Categorie | null, fournisseur: Fournisseur | null): void {
    this.loading.set(true);

    this.pieceService.statistiques([{
      fields: [{
        field: Piece.CATEGORIE_ID,
        order: null,
        value: categorie?.id ?? null,
        type: FilterType.EQUAL
      }, {
        field: Piece.FOURNISSEUR_ID,
        order: null,
        value: fournisseur?.id ?? null,
        type: FilterType.EQUAL
      }],
      type: FilterCombinatorType.AND
    }]).subscribe((statistiques: PieceStatistique[]): void => {
      const options: any = this.options();
      options.series[0].data = statistiques.map(stat => stat.quantite);
      options.series[1].data = statistiques.map(stat => stat.montantTotal);
      options.xAxis.data = statistiques.map(stat => stat.date?.toLocaleDateString());
      this.options.set(structuredClone(options));

      this.loading.set(false);
    })
  }

  protected autocompleteCategories(value: string): Observable<Categorie[]> {
    return this.categorieService.autocomplete(value);
  }

  protected autocompleteFournisseurs(value: string): Observable<Fournisseur[]> {
    return this.fournisseurService.autocomplete(value);
  }

  protected override readAccess(): Roles {
    return Roles.R_PIECE_STATISTIQUE_LECTEUR;
  }

  protected override editAccess(): Roles {
    return Roles.R_PIECE_STATISTIQUE_EDITEUR;
  }
}
