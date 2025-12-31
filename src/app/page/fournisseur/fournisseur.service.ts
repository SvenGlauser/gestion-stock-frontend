import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {Fournisseur} from './fournisseur.model';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {FilterType, Order} from '../../common/search/filter';
import {FilterCombinatorType} from '../../common/search/filter-combinator';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService extends GestionStockApiService<Fournisseur>{
  constructor(http: HttpClient) {
    super(http, 'fournisseur');
  }

  public get(id: number): Observable<Fournisseur> {
    return this.internalGet('', id);
  }

  public delete(id: number): Observable<void> {
    return this.internalDelete('', id);
  }

  public create(fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.internalCreate('', fournisseur);
  }

  public modify(fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.internalModify('', fournisseur);
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<Fournisseur>> {
    return this.internalSearch('search', searchRequest);
  }

  public autocomplete(value: string): Observable<Fournisseur[]> {
    return this.search({
      page: 0,
      pageSize: 25,
      combinators: [{
        type: FilterCombinatorType.AND,
        filters: [{
          field: Fournisseur.IDENTITE_DESIGNATION,
          value: value,
          type: FilterType.STRING_LIKE,
          order: Order.ASC
        }]
      }]
    }).pipe(map((result: SearchResult<Fournisseur>) => result.elements));
  }

  protected override mapToClassMethod(): (object: Fournisseur) => Fournisseur {
    return (fournisseur: Fournisseur): Fournisseur => new Fournisseur(fournisseur);
  }
}
