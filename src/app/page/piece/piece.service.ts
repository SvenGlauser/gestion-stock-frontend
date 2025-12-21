import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {Piece} from './piece.model';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {PieceStatistique} from './statistique/piece-statistique';
import {FilterCombinator} from '../../common/search/filter-combinator';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';

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

  public search(searchRequest: SearchRequest): Observable<SearchResult<Piece>> {
    return this.internalSearch('search', searchRequest);
  }

  public statistiques(filters: FilterCombinator[]): Observable<PieceStatistique[]> {
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
