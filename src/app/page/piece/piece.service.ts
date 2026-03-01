import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/search-result';
import {Piece} from './piece.model';
import {map, Observable} from 'rxjs';
import {PieceStatistique} from './statistique/piece-statistique';
import {AutomaticSearchFieldCombinaison} from '../../common/search/automatic/automatic-search-field-combinaison';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';
import {PieceSearchQuery} from './piece.searchquery';
import {PieceWithHistoriqueSearchQuery} from './piece-with-historique.searchquery';
import {PieceWithHistorique} from './piece-with-historique.model';

@Injectable({
  providedIn: 'root'
})
export class PieceService extends GestionStockApiService<Piece> {
  constructor(http: HttpClient) {
    super(http, 'piece');
  }

  public get(id: number): Observable<Piece> {
    return this.internalGet('', id);
  }

  public delete(id: number): Observable<void> {
    return this.internalDelete('', id);
  }

  public create(piece: Piece): Observable<Piece> {
    return this.internalCreate('', piece);
  }

  public modify(piece: Piece): Observable<Piece> {
    return this.internalModify('', piece);
  }

  public search(searchQuery: PieceSearchQuery): Observable<SearchResult<Piece>> {
    return this.internalSearch('search', searchQuery);
  }

  public searchWithHistorique(searchQuery: PieceWithHistoriqueSearchQuery): Observable<SearchResult<PieceWithHistorique>> {
    return this.http
      .post<SearchResult<PieceWithHistorique>>(GestionStockApiService.separateWithSlash(this.URL, 'search/historique'), searchQuery)
      .pipe(map(result => {
        result.elements = result.elements.map((object: PieceWithHistorique): PieceWithHistorique => new PieceWithHistorique(object));
        return result;
      }))
  }

  public statistiques(filters: AutomaticSearchFieldCombinaison[]): Observable<PieceStatistique[]> {
    return this.http
      .post<PieceStatistique[]>(PieceService.separateWithSlash(this.URL, 'statistiques'), filters)
      .pipe(map(piecesStat => piecesStat.map(pieceStat => new PieceStatistique(pieceStat))));
  }

  public autocomplete(value: string): Observable<Piece[]> {
    return this.http
      .get<SearchResult<Piece>>(PieceService.separateWithSlash(this.URL, "autocomplete?searchValue=" + value))
      .pipe(map(result => {
        return result.elements.map(piece => new Piece(piece));
      }));
  }
  protected override mapToClassMethod(): (object: Piece) => Piece {
    return (piece: Piece): Piece => new Piece(piece);
  }
}
