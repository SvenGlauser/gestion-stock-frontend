import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {Categorie} from './categorie.model';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {BASE_URL} from '../../common/utils/http-client.configuration';
import {Order, Type} from '../../common/search/filter';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private readonly URL: string = BASE_URL + 'categorie';
  private readonly URL_WITH_SLASH: string = this.URL + '/';

  constructor(private readonly http: HttpClient) {}

  public get(id: number): Observable<Categorie> {
    return this.http
      .get<Categorie>(this.URL_WITH_SLASH + id)
      .pipe(map(categorie => new Categorie(categorie)));
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(this.URL_WITH_SLASH + id);
  }

  public create(categorie: Categorie): Observable<Categorie> {
    return this.http
      .post<Categorie>(this.URL, categorie)
      .pipe(map(categorie => new Categorie(categorie)));
  }

  public modify(categorie: Categorie): Observable<Categorie> {
    return this.http
      .put<Categorie>(this.URL, categorie)
      .pipe(map(categorie => new Categorie(categorie)));
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<Categorie>> {
    return this.http
      .post<SearchResult<Categorie>>(this.URL_WITH_SLASH + "search", searchRequest)
      .pipe(
        map(result => {
          result.elements = result.elements.map(categorie => new Categorie(categorie))
          return result;
        })
      );
  }

  public autocomplete(value: string): Observable<Categorie[]> {
    return this.search({
      page: 0,
      pageSize: 25,
      filters: [{
        field: Categorie.NOM,
        value: value,
        type: Type.STRING_LIKE,
        order: Order.ASC
      }]
    }).pipe(map((result: SearchResult<Categorie>) => result.elements.map(categorie => new Categorie(categorie))));
  }
}
