import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {Pays} from './pays.model';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {FilterType, Order} from '../../common/search/filter';
import {FilterCombinatorType} from '../../common/search/filter-combinator';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';
import {PieceHistorique} from '../piece-historique/piece-historique.model';

@Injectable({
  providedIn: 'root'
})
export class PaysService extends GestionStockApiService<Pays> {
  constructor(http: HttpClient) {
    super(http, 'pays');
  }

  public get(id: number): Observable<Pays> {
    return this.internalGet('', id);
  }

  public delete(id: number): Observable<void> {
    return this.internalDelete('', id);
  }

  public create(pays: Pays): Observable<Pays> {
    return this.internalCreate('', pays);
  }

  public modify(pays: Pays): Observable<Pays> {
    return this.internalModify('', pays);
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<Pays>> {
    return this.internalSearch('search', searchRequest);
  }

  public autocomplete(value: string): Observable<Pays[]> {
    return this.search({
      page: 0,
      pageSize: 25,
      combinators: [{
        type: FilterCombinatorType.AND,
        filters: [{
          field: Pays.NOM,
          value: value,
          type: FilterType.STRING_LIKE,
          order: Order.ASC
        }]
      }]
    }).pipe(map((result: SearchResult<Pays>) => result.elements));
  }

  protected override mapToClassMethod(): (object: Pays) => Pays {
    return (pays: Pays): Pays => new Pays(pays);
  }
}
