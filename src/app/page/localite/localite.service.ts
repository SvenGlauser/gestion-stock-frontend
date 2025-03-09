import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {BASE_URL} from '../../common/utils/http-client.configuration';
import {Localite} from './localite.model';

@Injectable({
  providedIn: 'root'
})
export class LocaliteService {
  private readonly URL: string = BASE_URL + 'localite';
  private readonly URL_WITH_SLASH: string = this.URL + '/';

  constructor(private readonly http: HttpClient) {}

  public get(id: number): Observable<Localite> {
    return this.http.get<Localite>(this.URL_WITH_SLASH + id);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(this.URL_WITH_SLASH + id);
  }

  public create(pays: Localite): Observable<Localite> {
    return this.http.post<Localite>(this.URL, pays);
  }

  public modify(pays: Localite): Observable<Localite> {
    return this.http.put<Localite>(this.URL, pays);
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<Localite>> {
    return this.http.post<SearchResult<Localite>>(this.URL_WITH_SLASH + "search", searchRequest);
  }
}
