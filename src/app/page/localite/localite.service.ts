import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {BASE_URL} from '../../common/utils/http-client.configuration';
import {Localite, LOCALITE_NOM} from './localite.model';
import {Order, Type} from '../../common/search/filter';

@Injectable({
  providedIn: 'root'
})
export class LocaliteService {
  private readonly URL: string = BASE_URL + 'localite';
  private readonly URL_WITH_SLASH: string = this.URL + '/';

  constructor(private readonly http: HttpClient) {}

  public get(id: number): Observable<Localite> {
    return this.http.get<Localite>(this.URL_WITH_SLASH + id);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(this.URL_WITH_SLASH + id);
  }

  public create(pays: Localite): Observable<Localite> {
    return this.http.post<Localite>(this.URL, pays);
  }

  public modify(pays: Localite): Observable<Localite> {
    return this.http.put<Localite>(this.URL, pays);
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<Localite>> {
    return this.http.post<SearchResult<Localite>>(this.URL_WITH_SLASH + "search", searchRequest);
  }

  public autocomplete(value: string): Observable<Localite[]> {
    return this.search({
      page: 0,
      pageSize: 25,
      filters: [{
        field: LOCALITE_NOM,
        value: value,
        type: Type.STRING_LIKE,
        order: Order.ASC
      }]
    }).pipe(map((result: SearchResult<Localite>) => result.elements));
  }
}
