import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {Machine} from './machine.model';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {BASE_URL} from '../../common/utils/http-client.configuration';
import {FilterType, Order} from '../../common/search/filter';
import {FilterCombinatorType} from '../../common/search/filter-combinator';

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  private readonly URL: string = BASE_URL + 'machine';
  private readonly URL_WITH_SLASH: string = this.URL + '/';

  constructor(private readonly http: HttpClient) {}

  public get(id: number): Observable<Machine> {
    return this.http
      .get<Machine>(this.URL_WITH_SLASH + id)
      .pipe(map(machine => new Machine(machine)));
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(this.URL_WITH_SLASH + id);
  }

  public create(machine: Machine): Observable<Machine> {
    return this.http
      .post<Machine>(this.URL, machine)
      .pipe(map(machine => new Machine(machine)));
  }

  public modify(machine: Machine): Observable<Machine> {
    return this.http
      .put<Machine>(this.URL, machine)
      .pipe(map(machine => new Machine(machine)));
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<Machine>> {
    return this.http
      .post<SearchResult<Machine>>(this.URL_WITH_SLASH + "search", searchRequest)
      .pipe(map(result => {
        result.elements = result.elements.map(machine => new Machine(machine));
        return result;
      }))
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
}
