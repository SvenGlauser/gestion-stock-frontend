import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {Fournisseur} from './fournisseur.model';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {BASE_URL} from '../../common/utils/http-client.configuration';
import {FilterType, Order} from '../../common/search/filter';
import {FilterCombinatorType} from '../../common/search/filter-combinator';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private readonly URL: string = BASE_URL + 'fournisseur';
  private readonly URL_WITH_SLASH: string = this.URL + '/';

  constructor(private readonly http: HttpClient) {}

  public get(id: number): Observable<Fournisseur> {
    return this.http
      .get<Fournisseur>(this.URL_WITH_SLASH + id)
      .pipe(map(fournisseur => new Fournisseur(fournisseur)));
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(this.URL_WITH_SLASH + id);
  }

  public create(fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http
      .post<Fournisseur>(this.URL, fournisseur)
      .pipe(map(fournisseur => new Fournisseur(fournisseur)));
  }

  public modify(fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http
      .put<Fournisseur>(this.URL, fournisseur)
      .pipe(map(fournisseur => new Fournisseur(fournisseur)));
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<Fournisseur>> {
    return this.http
      .post<SearchResult<Fournisseur>>(this.URL_WITH_SLASH + "search", searchRequest)
      .pipe(map(result => {
        result.elements = result.elements.map(fournisseur => new Fournisseur(fournisseur));
        return result;
      }));
  }

  public autocomplete(value: string): Observable<Fournisseur[]> {
    return this.search({
      page: 0,
      pageSize: 25,
      combinators: [{
        type: FilterCombinatorType.AND,
        filters: [{
          field: Fournisseur.NOM,
          value: value,
          type: FilterType.STRING_LIKE,
          order: Order.ASC
        }]
      }]
    }).pipe(map((result: SearchResult<Fournisseur>) => result.elements));
  }
}
