import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {PieceHistorique} from './piece-historique.model';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {BASE_URL} from '../../common/utils/http-client.configuration';

@Injectable({
  providedIn: 'root'
})
export class PieceHistoriqueService {
  private readonly URL: string = BASE_URL + 'piece/historique';
  private readonly URL_WITH_SLASH: string = this.URL + '/';

  constructor(private readonly http: HttpClient) {
  }

  public get(id: number): Observable<PieceHistorique> {
    return this.http
      .get<PieceHistorique>(this.URL_WITH_SLASH + id)
      .pipe(map(pieceHistorique => new PieceHistorique(pieceHistorique)));
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<PieceHistorique>> {
    return this.http
      .post<SearchResult<PieceHistorique>>(this.URL_WITH_SLASH + "search", searchRequest)
      .pipe(map(result => {
        result.elements = result.elements.map(pieceHistorique => new PieceHistorique(pieceHistorique));
        return result;
      }))
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(this.URL_WITH_SLASH + id);
  }
}
