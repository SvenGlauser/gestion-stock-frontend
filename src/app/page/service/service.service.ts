import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/search-result';
import {Observable} from 'rxjs';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';
import {AutomaticSearchQuery} from '../../common/search/automatic/automatic-search-query';
import {Service} from './service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService extends GestionStockApiService<Service> {
  constructor(http: HttpClient) {
    super(http, 'service');
  }

  public get(id: number): Observable<Service> {
    return this.internalGet('', id);
  }

  public delete(id: number): Observable<void> {
    return this.internalDelete('', id);
  }

  public create(service: Service): Observable<Service> {
    return this.internalCreate('', service);
  }

  public modify(service: Service): Observable<Service> {
    return this.internalModify('', service);
  }

  public search(searchQuery: AutomaticSearchQuery): Observable<SearchResult<Service>> {
    return this.internalSearch('search', searchQuery);
  }

  protected override mapToClassMethod(): (object: Service) => Service {
    return (service: Service): Service => new Service(service);
  }
}
