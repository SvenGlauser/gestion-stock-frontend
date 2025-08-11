import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {IdentiteLight} from './identite.model';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {BASE_URL} from '../../common/utils/http-client.configuration';

@Injectable({
  providedIn: 'root'
})
export class IdentiteService {
  private readonly URL: string = BASE_URL + 'identite';
  private readonly URL_WITH_SLASH: string = this.URL + '/';

  constructor(private readonly http: HttpClient) {
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<IdentiteLight>> {
    return this.http
      .post<SearchResult<IdentiteLight>>(this.URL_WITH_SLASH + "search", searchRequest)
      .pipe(map(result => {
        result.elements = result.elements.map(identiteLight => new IdentiteLight(identiteLight));
        return result;
      }));
  }
}
