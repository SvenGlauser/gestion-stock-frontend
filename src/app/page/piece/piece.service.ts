import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {Piece, PIECE_NOM} from './piece.model';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {BASE_URL} from '../../common/utils/http-client.configuration';
import {Order, Type} from '../../common/search/filter';

@Injectable({
  providedIn: 'root'
})
export class PieceService {
  private readonly URL: string = BASE_URL + 'piece';
  private readonly URL_WITH_SLASH: string = this.URL + '/';

  constructor(private readonly http: HttpClient) {}

  public get(id: number): Observable<Piece> {
    return this.http.get<Piece>(this.URL_WITH_SLASH + id);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(this.URL_WITH_SLASH + id);
  }

  public create(Piece: Piece): Observable<Piece> {
    return this.http.post<Piece>(this.URL, Piece);
  }

  public modify(Piece: Piece): Observable<Piece> {
    return this.http.put<Piece>(this.URL, Piece);
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<Piece>> {
    return this.http.post<SearchResult<Piece>>(this.URL_WITH_SLASH + "search", searchRequest);
  }

  public autocomplete(value: string): Observable<Piece[]> {
    return this.search({
      page: 0,
      pageSize: 25,
      filters: [{
        field: PIECE_NOM,
        value: value,
        type: Type.STRING_LIKE,
        order: Order.ASC
      }]
    }).pipe(map((result: SearchResult<Piece>) => result.elements));
  }
}
