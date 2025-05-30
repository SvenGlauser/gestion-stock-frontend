import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {Piece} from './piece.model';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {BASE_URL} from '../../common/utils/http-client.configuration';
import {PieceStatistique} from './statistique/piece-statistique';
import {FilterCombinator} from '../../common/search/filter-combinator';

@Injectable({
  providedIn: 'root'
})
export class PieceService {
  private readonly URL: string = BASE_URL + 'piece';
  private readonly URL_WITH_SLASH: string = this.URL + '/';

  constructor(private readonly http: HttpClient) {}

  public get(id: number): Observable<Piece> {
    return this.http
      .get<Piece>(this.URL_WITH_SLASH + id)
      .pipe(map(piece => new Piece(piece)));
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(this.URL_WITH_SLASH + id);
  }

  public create(piece: Piece): Observable<Piece> {
    return this.http
      .post<Piece>(this.URL, piece)
      .pipe(map(piece => new Piece(piece)));
  }

  public modify(piece: Piece): Observable<Piece> {
    return this.http
      .put<Piece>(this.URL, piece)
      .pipe(map(piece => new Piece(piece)));
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<Piece>> {
    return this.http
      .post<SearchResult<Piece>>(this.URL_WITH_SLASH + "search", searchRequest)
      .pipe(map(result => {
        result.elements = result.elements.map(piece => new Piece(piece));
        return result;
      }))
  }

  public statistiques(filters: FilterCombinator[]): Observable<PieceStatistique[]> {
    return this.http
      .post<PieceStatistique[]>(this.URL_WITH_SLASH + "statistiques", filters)
      .pipe(map(piecesStat => piecesStat.map(pieceStat => new PieceStatistique(pieceStat))));
  }

  public autocomplete(value: string): Observable<Piece[]> {
    return this.http
      .get<SearchResult<Piece>>(this.URL_WITH_SLASH + "autocomplete?searchValue="+value)
      .pipe(map(result => {
        return result.elements.map(piece => new Piece(piece));
      }));
  }
}
