import {Component} from '@angular/core';
import {Column} from '../../../common/table/column/column';
import {Filter, FilterType, Order} from '../../../common/search/filter';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {PieceHistoriqueService} from '../piece-historique.service';
import {SearchRequest} from '../../../common/search/searchRequest';
import {Observable, of} from 'rxjs';
import {SearchResult} from '../../../common/search/searchResult';
import {TableComponent} from '../../../common/table/table.component';
import {PieceHistoriqueDialogComponent} from '../dialog/piece-historique-dialog.component';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {MethodColumn} from '../../../common/table/column/method-column';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Model} from '../../../common/model';
import {PieceHistorique} from '../piece-historique.model';
import {PieceHistoriqueType, PieceHistoriqueTypeEnumValuesForAutocomplete} from '../piece-historique-type.enum';
import {DateColumn} from '../../../common/table/column/date-column';
import {PieceHistoriqueSource, PieceHistoriqueSourceEnumValuesForAutocomplete} from '../piece-historique-source.enum';
import {Piece} from '../../piece/piece.model';
import {PieceService} from '../../piece/piece.service';
import {FilterCombinatorType} from '../../../common/search/filter-combinator';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-categorie-table',
  imports: [
    TableComponent
  ],
  templateUrl: './piece-historique-table.component.html',
  styleUrl: './piece-historique-table.component.scss'
})
export class PieceHistoriqueTableComponent {
  // Définition des colonnes
  protected readonly columns: Column[] = [
    DateColumn
      .of(PieceHistorique.HEURE_LABEL, PieceHistorique.HEURE, "20%")
      .sort(Order.ASC),
    MethodColumn
      .of(
        PieceHistorique.TYPE_LABEL,
        PieceHistorique.TYPE,
        "25%",
        (type: PieceHistoriqueType) => PieceHistoriqueTypeEnumValuesForAutocomplete.get(type) ?? "")
      .autocompleteEnumFilter(PieceHistorique.TYPE, PieceHistoriqueTypeEnumValuesForAutocomplete),
    ClassicColumn.of(PieceHistorique.DIFFERENCE_LABEL, PieceHistorique.DIFFERENCE, "20%"),
    MethodColumn
      .of(
        PieceHistorique.SOURCE_LABEL,
        PieceHistorique.SOURCE,
        "25%",
        (source: PieceHistoriqueSource) => PieceHistoriqueSourceEnumValuesForAutocomplete.get(source) ?? "")
      .autocompleteEnumFilter(PieceHistorique.SOURCE, PieceHistoriqueSourceEnumValuesForAutocomplete),
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: PieceHistoriqueDialogComponent,
    idField: Model.ID,
    clicOnLine: true,
    created: false,
    delete: true,
    modify: false,
    read: true
  };

  private piece: Piece | null = null;

  constructor(private readonly pieceHistoriqueService: PieceHistoriqueService,
              private readonly pieceService: PieceService,
              private readonly route: ActivatedRoute) {
    // For subscribing to the observable paramMap...
    this.route
      .paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params: ParamMap): void => {
        let currentPieceId = Number.parseInt(params.get('id') ?? "");

        this.pieceService.get(currentPieceId).subscribe((piece: Piece): void => {
          this.piece = piece;
        });
      });
  }

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: SearchRequest): Observable<SearchResult<PieceHistorique>> {
    if (!this.piece) {
      return of(<SearchResult<PieceHistorique>>{
        currentPage: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        elements: <PieceHistorique[]>[]
      });
    }

    let searchRequestModified: SearchRequest = structuredClone(searchRequest);
    searchRequestModified.combinators.push({
      type: FilterCombinatorType.AND,
      filters: [<Filter>{
        field: PieceHistorique.PIECE_ID,
        value: this.piece.id,
        type: FilterType.EQUAL,
        order: undefined,
      }]
    })
    return this.pieceHistoriqueService.search(searchRequestModified);
  }

  /**
   * Récupère le nom du tableau
   */
  protected getTableTitle(): string {
    let title: string = 'Historique des modifications du stock';

    if (this.piece) {
      title += " - ";
      title += this.piece.numeroInventaire;
      title += " - ";
      title += this.piece.nom;
    }

    return title;
  }
}
