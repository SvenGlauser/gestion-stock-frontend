import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/search-result';
import {map, Observable} from 'rxjs';
import {AutomaticSearchQuery} from '../../common/search/automatic/automatic-search-query';
import {Localite} from './localite.model';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';
import {AutomaticSearchField, FilterType} from '../../common/search/automatic/automatic-search-field';
import {Direction} from '../../common/search/api/search-field';

@Injectable({
  providedIn: 'root'
})
export class LocaliteService extends GestionStockApiService<Localite> {
  constructor(http: HttpClient) {
    super(http, 'localite');
  }

  public get(id: number): Observable<Localite> {
    return this.internalGet('', id);
  }

  public delete(id: number): Observable<void> {
    return this.internalDelete('', id);
  }

  public create(localite: Localite): Observable<Localite> {
    return this.internalCreate('', localite);
  }

  public modify(localite: Localite): Observable<Localite> {
    return this.internalModify('', localite);
  }

  public search(searchRequest: AutomaticSearchQuery): Observable<SearchResult<Localite>> {
    return this.internalSearch('search', searchRequest);
  }

  public autocomplete(value: string): Observable<Localite[]> {
    const fieldNom = new AutomaticSearchField(Localite.NOM, FilterType.STRING_LIKE);
    fieldNom.value = value;
    fieldNom.order = Direction.ASC

    const searchQuery = new AutomaticSearchQuery([fieldNom]);
    searchQuery.page = 0;
    searchQuery.pageSize = 25;

    return this
      .search(searchQuery)
      .pipe(map((result: SearchResult<Localite>) => result.elements));
  }

  protected override mapToClassMethod(): (object: Localite) => Localite {
    return (localite: Localite): Localite => new Localite(localite);
  }
}
