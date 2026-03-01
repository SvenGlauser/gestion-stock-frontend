import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/search-result';
import {IdentiteLight} from './identite.model';
import {map, Observable} from 'rxjs';
import {AutomaticSearchQuery} from '../../common/search/automatic/automatic-search-query';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';
import {AutomaticSearchField, FilterType} from '../../common/search/automatic/automatic-search-field';
import {Direction} from '../../common/search/api/search-field';

@Injectable({
  providedIn: 'root'
})
export class IdentiteService extends GestionStockApiService<IdentiteLight> {
  constructor(http: HttpClient) {
    super(http, 'identite');
  }

  public search(searchRequest: AutomaticSearchQuery): Observable<SearchResult<IdentiteLight>> {
    return this.internalSearch('search', searchRequest);
  }

  public autocomplete(value: string): Observable<IdentiteLight[]> {
    const fieldNom = new AutomaticSearchField(IdentiteLight.DESIGNATION, FilterType.STRING_LIKE);
    fieldNom.value = value;
    fieldNom.order = Direction.ASC

    const searchQuery = new AutomaticSearchQuery([fieldNom]);
    searchQuery.page = 0;
    searchQuery.pageSize = 25;

    return this
      .search(searchQuery)
      .pipe(map((result: SearchResult<IdentiteLight>) => result.elements));
  }

  protected override mapToClassMethod(): (object: IdentiteLight) => IdentiteLight {
    return (identiteLight: IdentiteLight): IdentiteLight => new IdentiteLight(identiteLight);
  }
}
