import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {Fournisseur, FOURNISSEUR_NOM} from './fournisseur.model';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {BASE_URL} from '../../common/utils/http-client.configuration';
import {Order, Type} from '../../common/search/filter';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private readonly URL: string = BASE_URL + 'fournisseur';
  private readonly URL_WITH_SLASH: string = this.URL + '/';

  constructor(private readonly http: HttpClient) {}

  public get(id: number): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(this.URL_WITH_SLASH + id);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(this.URL_WITH_SLASH + id);
  }

  public create(Categorie: Fournisseur): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(this.URL, Categorie);
  }

  public modify(Categorie: Fournisseur): Observable<Fournisseur> {
    return this.http.put<Fournisseur>(this.URL, Categorie);
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<Fournisseur>> {
    return this.http.post<SearchResult<Fournisseur>>(this.URL_WITH_SLASH + "search", searchRequest);
  }

  public autocomplete(value: string): Observable<Fournisseur[]> {
    return this.search({
      page: 0,
      pageSize: 25,
      filters: [{
        field: FOURNISSEUR_NOM,
        value: value,
        type: Type.STRING_LIKE,
        order: Order.ASC
      }]
    }).pipe(map((result: SearchResult<Fournisseur>) => result.elements));
  }
}
