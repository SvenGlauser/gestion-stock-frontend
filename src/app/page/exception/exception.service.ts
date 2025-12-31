import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {ThrownException} from './exception.model';
import {Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';

@Injectable({
  providedIn: 'root'
})
export class ExceptionService extends GestionStockApiService<ThrownException> {
  constructor(http: HttpClient) {
    super(http, 'exception');
  }

  public changeStatus(id: number, actif: boolean): Observable<void> {
    return this.http.put<void>(ExceptionService.separateWithSlash(this.URL, id, actif), null);
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<ThrownException>> {
    return this.internalSearch('search', searchRequest);
  }

  protected override mapToClassMethod(): (object: ThrownException) => ThrownException {
    return (exception: ThrownException): ThrownException => new ThrownException(exception);
  }
}
