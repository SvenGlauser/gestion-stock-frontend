import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../common/search/searchRequest';
import {SearchResult} from '../common/search/searchResult';
import {environment} from '../../environments/environment';
import {buildUrl, buildUrlFromInterface} from '../common/utils/function.utils';

export abstract class GestionStockApiService<T extends Record<string, any>> {
  protected readonly URL: string;

  protected constructor(protected http: HttpClient, url: string) {
    this.URL = GestionStockApiService.separateWithSlash(buildUrlFromInterface(environment.api), url);
  }

  protected internalGet(url: string, id: number): Observable<T> {
    return this.http
      .get<T>(GestionStockApiService.separateWithSlash(this.URL, url, id))
      .pipe(map((object: T): T => this.mapToClass(object)));
  }

  protected internalCreate(url: string, object: T): Observable<T> {
    return this.http
      .post<T>(GestionStockApiService.separateWithSlash(this.URL, url), object)
      .pipe(map((object: T): T => this.mapToClass(object)));
  }

  protected internalModify(url: string, object: T): Observable<T> {
    return this.http
      .put<T>(GestionStockApiService.separateWithSlash(this.URL, url), object)
      .pipe(map((object: T): T => this.mapToClass(object)));
  }

  protected internalDelete(url: string, id: number): Observable<void> {
    return this.http.delete<void>(GestionStockApiService.separateWithSlash(this.URL, url, id));
  }

  public internalSearch(url: string, searchRequest: SearchRequest): Observable<SearchResult<T>> {
    return this.http
      .post<SearchResult<T>>(GestionStockApiService.separateWithSlash(this.URL, url), searchRequest)
      .pipe(map(result => {
        result.elements = result.elements.map((object: T): T => this.mapToClass(object));
        return result;
      }))
  }

  protected mapToClass(object: T): T {
    return this.mapToClassMethod()(object);
  }

  protected abstract mapToClassMethod(): (object: T) => T;

  protected static separateWithSlash(...urlParts: any[]): string {
    return urlParts
      .filter(part => part !== '')
      .filter(part => String(part))
      .join('/');
  }
}
