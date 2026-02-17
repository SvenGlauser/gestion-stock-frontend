import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {Machine} from './machine.model';
import {map, Observable} from 'rxjs';
import {AutomaticSearchQuery} from '../../common/search/automatic/automatic-search-query';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';
import {AutomaticSearchField, FilterType} from '../../common/search/automatic/automatic-search-field';
import {Direction} from '../../common/search/api/search-field';

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

  public search(searchRequest: AutomaticSearchQuery): Observable<SearchResult<Machine>> {
    return this.internalSearch('search', searchRequest);
  }

  public autocomplete(value: string): Observable<Machine[]> {
    const fieldNom = new AutomaticSearchField(Machine.NOM, FilterType.STRING_LIKE);
    fieldNom.value = value;
    fieldNom.order = Direction.ASC

    const searchQuery = new AutomaticSearchQuery([fieldNom]);
    searchQuery.page = 0;
    searchQuery.pageSize = 25;

    return this
      .search(searchQuery)
      .pipe(map((result: SearchResult<Machine>) => result.elements));
  }

  protected override mapToClassMethod(): (object: Machine) => Machine {
    return (machine: Machine): Machine => new Machine(machine);
  }
}
