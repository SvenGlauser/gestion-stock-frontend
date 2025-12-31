import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {Localite} from './localite.model';
import {FilterType, Order} from '../../common/search/filter';
import {FilterCombinatorType} from '../../common/search/filter-combinator';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';

@Injectable({
  providedIn: 'root'
})
export class LocaliteService extends GestionStockApiService<Localite> {
  constructor(http: HttpClient) {
    super(http, 'localite');
  }

  public get(id: number): Observable<Localite> {
    return this.internalGet('', id);
  }

  public delete(id: number): Observable<void> {
    return this.internalDelete('', id);
  }

  public create(localite: Localite): Observable<Localite> {
    return this.internalCreate('', localite);
  }

  public modify(localite: Localite): Observable<Localite> {
    return this.internalModify('', localite);
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<Localite>> {
    return this.internalSearch('search', searchRequest);
  }

  public autocomplete(value: string): Observable<Localite[]> {
    return this.search({
      page: 0,
      pageSize: 25,
      combinators: [{
        type: FilterCombinatorType.AND,
        filters: [{
          field: Localite.NOM,
          value: value,
          type: FilterType.STRING_LIKE,
          order: Order.ASC
        }]
      }]
    }).pipe(map((result: SearchResult<Localite>) => result.elements));
  }

  protected override mapToClassMethod(): (object: Localite) => Localite {
    return (localite: Localite): Localite => new Localite(localite);
  }
}
