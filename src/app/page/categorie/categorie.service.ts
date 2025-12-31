import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {Categorie} from './categorie.model';
import {map, Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {FilterType, Order} from '../../common/search/filter';
import {FilterCombinatorType} from '../../common/search/filter-combinator';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';

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

  public search(searchRequest: SearchRequest): Observable<SearchResult<Categorie>> {
    return this.internalSearch('search', searchRequest);
  }

  public autocomplete(value: string): Observable<Categorie[]> {
    return this.search({
      page: 0,
      pageSize: 25,
      combinators: [{
        type: FilterCombinatorType.AND,
        filters: [{
          field: Categorie.NOM,
          value: value,
          type: FilterType.STRING_LIKE,
          order: Order.ASC
        }]
      }]
    }).pipe(map((result: SearchResult<Categorie>) => result.elements.map(categorie => new Categorie(categorie))));
  }

  protected override mapToClassMethod(): (object: Categorie) => Categorie {
    return (categorie: Categorie): Categorie => new Categorie(categorie);
  }
}
