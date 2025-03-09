import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../common/search/searchResult';
import {Pays, PAYS_NOM} from './pays.model';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../common/search/searchRequest';
import {BASE_URL} from '../common/http-client.configuration';
import {Order, Type} from '../common/search/filter';

@Injectable({
  providedIn: 'root'
})
export class PaysService {
  private readonly URL: string = BASE_URL + 'pays';
  private readonly URL_WITH_SLASH: string = this.URL + '/';

  constructor(private readonly http: HttpClient) {}

  public get(id: number): Observable<Pays> {
    return this.http.get<Pays>(this.URL_WITH_SLASH + id);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(this.URL_WITH_SLASH + id);
  }

  public create(pays: Pays): Observable<Pays> {
    return this.http.post<Pays>(this.URL, pays);
  }

  public modify(pays: Pays): Observable<Pays> {
    return this.http.put<Pays>(this.URL, pays);
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<Pays>> {
    return this.http.post<SearchResult<Pays>>(this.URL_WITH_SLASH + "search", searchRequest);
  }

  public autocomplete(value: string): Observable<Pays[]> {
    return this.search({
      page: 0,
      pageSize: 25,
      filters: [{
        field: PAYS_NOM,
        value: value,
        type: Type.STRING_LIKE,
        order: Order.ASC
      }]
    }).pipe(map((result: SearchResult<Pays>) => result.elements));
  }
}
