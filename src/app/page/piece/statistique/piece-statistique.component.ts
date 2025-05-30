import {Component, OnInit} from '@angular/core';
import {NgxEchartsDirective} from 'ngx-echarts';
import * as echarts from 'echarts/core';
import {PieceService} from '../piece.service';
import {AutocompleteComponent} from '../../../common/form/input/autocomplete/autocomplete.component';
import {Categorie} from '../../categorie/categorie.model';
import {Fournisseur} from '../../fournisseur/fournisseur.model';
import {FilterCombinatorType} from '../../../common/search/filter-combinator';
import {FilterType} from '../../../common/search/filter';
import {Piece} from '../piece.model';
import {CategorieService} from '../../categorie/categorie.service';
import {FournisseurService} from '../../fournisseur/fournisseur.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-statistique',
  imports: [NgxEchartsDirective, AutocompleteComponent],
  templateUrl: './piece-statistique.component.html',
  styleUrl: './piece-statistique.component.scss'
})
export class PieceStatistiqueComponent implements OnInit {

  protected readonly Categorie = Categorie;
  protected readonly Fournisseur = Fournisseur;

  protected loaded: boolean = false;
  protected categorie: Categorie | null = null;
  protected fournisseur: Fournisseur | null = null;

  protected options: any = {
    tooltip: {
      trigger: 'axis',
      position: function (pt: any) {
        return [pt[0], '10%'];
      }
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
  };

  private chart: any;

  constructor(private readonly pieceService: PieceService,
              private readonly categorieService: CategorieService,
              private readonly fournisseurService: FournisseurService) {}

  public ngOnInit(): void {
    this.search();
  }

  protected search(): void {
    this.loaded = false;

    this.pieceService.statistiques([{
      filters: [{
        field: Piece.CATEGORIE_ID,
        value: this.categorie?.id,
        type: FilterType.EQUAL
      }, {
        field: Piece.FOURNISSEUR_ID,
        value: this.fournisseur?.id,
        type: FilterType.EQUAL
      }],
      type: FilterCombinatorType.AND
    }]).subscribe(statistiques => {
      this.options.series[0].data = statistiques.map(stat => stat.quantite);
      this.options.series[1].data = statistiques.map(stat => stat.montantTotal);
      this.options.xAxis.data = statistiques.map(stat => stat.date?.toLocaleDateString());

      this.chart.setOption(this.options);

      this.loaded = true;
    })
  }

  protected autocompleteCategories(value: string): Observable<Categorie[]> {
    return this.categorieService.autocomplete(value);
  }

  protected autocompleteFournisseurs(value: string): Observable<Fournisseur[]> {
    return this.fournisseurService.autocomplete(value);
  }

  protected storeChart(chart: any) {
    this.chart = chart;
  }
}
