import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {Pays} from './pays.model';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {BASE_URL} from '../../common/utils/http-client.configuration';
import {Order, Type} from '../../common/search/filter';

@Injectable({
  providedIn: 'root'
})
export class PaysService {
  private readonly URL: string = BASE_URL + 'pays';
  private readonly URL_WITH_SLASH: string = this.URL + '/';

  constructor(private readonly http: HttpClient) {}

  public get(id: number): Observable<Pays> {
    return this.http
      .get<Pays>(this.URL_WITH_SLASH + id)
      .pipe(map(pays => new Pays(pays)));
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(this.URL_WITH_SLASH + id);
  }

  public create(pays: Pays): Observable<Pays> {
    return this.http
      .post<Pays>(this.URL, pays)
      .pipe(map(pays => new Pays(pays)));
  }

  public modify(pays: Pays): Observable<Pays> {
    return this.http
      .put<Pays>(this.URL, pays)
      .pipe(map(pays => new Pays(pays)));
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<Pays>> {
    return this.http
      .post<SearchResult<Pays>>(this.URL_WITH_SLASH + "search", searchRequest)
      .pipe(map(result => {
        result.elements = result.elements.map(pays => new Pays(pays));
        return result;
      }));
  }

  public autocomplete(value: string): Observable<Pays[]> {
    return this.search({
      page: 0,
      pageSize: 25,
      filters: [{
        field: Pays.NOM,
        value: value,
        type: Type.STRING_LIKE,
        order: Order.ASC
      }]
    }).pipe(map((result: SearchResult<Pays>) => result.elements));
  }
}
