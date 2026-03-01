import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/search-result';
import {Pays} from './pays.model';
import {map, Observable} from 'rxjs';
import {AutomaticSearchQuery} from '../../common/search/automatic/automatic-search-query';
import {FilterCombinatorType} from '../../common/search/automatic/automatic-search-field-combinaison';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';
import {AutomaticSearchField, FilterType} from '../../common/search/automatic/automatic-search-field';
import {Direction} from '../../common/search/api/search-field';

@Injectable({
  providedIn: 'root'
})
export class PaysService extends GestionStockApiService<Pays> {
  constructor(http: HttpClient) {
    super(http, 'pays');
  }

  public get(id: number): Observable<Pays> {
    return this.internalGet('', id);
  }

  public delete(id: number): Observable<void> {
    return this.internalDelete('', id);
  }

  public create(pays: Pays): Observable<Pays> {
    return this.internalCreate('', pays);
  }

  public modify(pays: Pays): Observable<Pays> {
    return this.internalModify('', pays);
  }

  public search(searchRequest: AutomaticSearchQuery): Observable<SearchResult<Pays>> {
    return this.internalSearch('search', searchRequest);
  }

  public autocomplete(value: string): Observable<Pays[]> {
    const fieldNom = new AutomaticSearchField(Pays.NOM, FilterType.STRING_LIKE);
    fieldNom.value = value;
    fieldNom.order = Direction.ASC

    const searchQuery = new AutomaticSearchQuery([fieldNom]);
    searchQuery.page = 0;
    searchQuery.pageSize = 25;

    return this
      .search(searchQuery)
      .pipe(map((result: SearchResult<Pays>) => result.elements));
  }

  protected override mapToClassMethod(): (object: Pays) => Pays {
    return (pays: Pays): Pays => new Pays(pays);
  }
}
