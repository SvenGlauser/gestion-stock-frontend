import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {Machine, MACHINE_NOM} from './machine.model';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {BASE_URL} from '../../common/utils/http-client.configuration';
import {Order, Type} from '../../common/search/filter';

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  private readonly URL: string = BASE_URL + 'machine';
  private readonly URL_WITH_SLASH: string = this.URL + '/';

  constructor(private readonly http: HttpClient) {}

  public get(id: number): Observable<Machine> {
    return this.http.get<Machine>(this.URL_WITH_SLASH + id);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(this.URL_WITH_SLASH + id);
  }

  public create(Machine: Machine): Observable<Machine> {
    return this.http.post<Machine>(this.URL, Machine);
  }

  public modify(Machine: Machine): Observable<Machine> {
    return this.http.put<Machine>(this.URL, Machine);
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<Machine>> {
    return this.http.post<SearchResult<Machine>>(this.URL_WITH_SLASH + "search", searchRequest);
  }

  public autocomplete(value: string): Observable<Machine[]> {
    return this.search({
      page: 0,
      pageSize: 25,
      filters: [{
        field: MACHINE_NOM,
        value: value,
        type: Type.STRING_LIKE,
        order: Order.ASC
      }]
    }).pipe(map((result: SearchResult<Machine>) => result.elements));
  }
}
