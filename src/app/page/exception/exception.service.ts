import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {ThrownException} from './exception.model';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {BASE_URL} from '../../common/utils/http-client.configuration';

@Injectable({
  providedIn: 'root'
})
export class ExceptionService {
  private readonly URL: string = BASE_URL + 'exception';
  private readonly URL_WITH_SLASH: string = this.URL + '/';

  constructor(private readonly http: HttpClient) {
  }

  public changeStatus(id: number, actif: boolean): Observable<void> {
    return this.http.put<void>(this.URL_WITH_SLASH + id + "/" + actif, null);
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<ThrownException>> {
    return this.http
      .post<SearchResult<ThrownException>>(this.URL_WITH_SLASH + "search", searchRequest)
      .pipe(
        map(result => {
          result.elements = result.elements.map(exception => new ThrownException(exception));
          return result;
        })
      );
  }
}
