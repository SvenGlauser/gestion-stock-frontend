import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {Machine} from './machine.model';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {FilterType, Order} from '../../common/search/filter';
import {FilterCombinatorType} from '../../common/search/filter-combinator';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';

@Injectable({
  providedIn: 'root'
})
export class MachineService extends GestionStockApiService<Machine> {
  constructor(http: HttpClient) {
    super(http, 'machine');
  }

  public get(id: number): Observable<Machine> {
    return this.internalGet('', id);
  }

  public delete(id: number): Observable<void> {
    return this.internalDelete('', id);
  }

  public create(machine: Machine): Observable<Machine> {
    return this.internalCreate('', machine);
  }

  public modify(machine: Machine): Observable<Machine> {
    return this.internalModify('', machine);
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<Machine>> {
    return this.internalSearch('search', searchRequest);
  }

  public autocomplete(value: string): Observable<Machine[]> {
    return this.search({
      page: 0,
      pageSize: 25,
      combinators: [{
        type: FilterCombinatorType.AND,
        filters: [{
          field: Machine.NOM,
          value: value,
          type: FilterType.STRING_LIKE,
          order: Order.ASC
        }]
      }]
    }).pipe(map((result: SearchResult<Machine>) => result.elements));
  }

  protected override mapToClassMethod(): (object: Machine) => Machine {
    return (machine: Machine): Machine => new Machine(machine);
  }
}
