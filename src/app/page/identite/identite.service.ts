import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {Identite, IdentiteLight} from './identite.model';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {FilterCombinatorType} from '../../common/search/filter-combinator';
import {FilterType, Order} from '../../common/search/filter';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';

@Injectable({
  providedIn: 'root'
})
export class IdentiteService extends GestionStockApiService<IdentiteLight> {
  constructor(http: HttpClient) {
    super(http, 'identite');
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<IdentiteLight>> {
    return this.internalSearch('search', searchRequest);
  }

  public autocomplete(value: string): Observable<IdentiteLight[]> {
    return this.search({
      page: 0,
      pageSize: 25,
      combinators: [{
        type: FilterCombinatorType.AND,
        filters: [{
          field: IdentiteLight.DESIGNATION,
          value: value,
          type: FilterType.STRING_LIKE,
          order: Order.ASC
        }]
      }]
    }).pipe(map((result: SearchResult<IdentiteLight>) => result.elements));
  }

  protected override mapToClassMethod(): (object: IdentiteLight) => IdentiteLight {
    return (identiteLight: IdentiteLight): IdentiteLight => new IdentiteLight(identiteLight);
  }
}
