import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {Categorie} from './categorie.model';
import {map, Observable} from 'rxjs';
import {AutomaticSearchQuery} from '../../common/search/automatic/automatic-search-query';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';
import {AutomaticSearchField, FilterType} from '../../common/search/automatic/automatic-search-field';
import {Direction} from '../../common/search/api/search-field';

@Injectable({
  providedIn: 'root'
})
export class CategorieService extends GestionStockApiService<Categorie> {
  constructor(http: HttpClient) {
    super(http, 'categorie');
  }

  public get(id: number): Observable<Categorie> {
    return this.internalGet('', id);
  }

  public delete(id: number): Observable<void> {
    return this.internalDelete('', id);
  }

  public create(categorie: Categorie): Observable<Categorie> {
    return this.internalCreate('', categorie);
  }

  public modify(categorie: Categorie): Observable<Categorie> {
    return this.internalModify('', categorie);
  }

  public search(searchRequest: AutomaticSearchQuery): Observable<SearchResult<Categorie>> {
    return this.internalSearch('search', searchRequest);
  }

  public autocomplete(value: string): Observable<Categorie[]> {
    const fieldNom = new AutomaticSearchField(Categorie.NOM, FilterType.STRING_LIKE);
    fieldNom.value = value;
    fieldNom.order = Direction.ASC

    const searchQuery = new AutomaticSearchQuery([fieldNom]);
    searchQuery.page = 0;
    searchQuery.pageSize = 25;

    return this
      .search(searchQuery)
      .pipe(map((result: SearchResult<Categorie>) => result.elements));
  }

  protected override mapToClassMethod(): (object: Categorie) => Categorie {
    return (categorie: Categorie): Categorie => new Categorie(categorie);
  }
}
