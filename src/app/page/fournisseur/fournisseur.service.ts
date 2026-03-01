import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/search-result';
import {Fournisseur} from './fournisseur.model';
import {map, Observable} from 'rxjs';
import {AutomaticSearchQuery} from '../../common/search/automatic/automatic-search-query';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';
import {AutomaticSearchField, FilterType} from '../../common/search/automatic/automatic-search-field';
import {Direction} from '../../common/search/api/search-field';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService extends GestionStockApiService<Fournisseur>{
  constructor(http: HttpClient) {
    super(http, 'fournisseur');
  }

  public get(id: number): Observable<Fournisseur> {
    return this.internalGet('', id);
  }

  public delete(id: number): Observable<void> {
    return this.internalDelete('', id);
  }

  public create(fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.internalCreate('', fournisseur);
  }

  public modify(fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.internalModify('', fournisseur);
  }

  public search(searchRequest: AutomaticSearchQuery): Observable<SearchResult<Fournisseur>> {
    return this.internalSearch('search', searchRequest);
  }

  public autocomplete(value: string): Observable<Fournisseur[]> {
    const fieldNom = new AutomaticSearchField(Fournisseur.IDENTITE_DESIGNATION, FilterType.STRING_LIKE);
    fieldNom.value = value;
    fieldNom.order = Direction.ASC

    const searchQuery = new AutomaticSearchQuery([fieldNom]);
    searchQuery.page = 0;
    searchQuery.pageSize = 25;

    return this
      .search(searchQuery)
      .pipe(map((result: SearchResult<Fournisseur>) => result.elements));
  }

  protected override mapToClassMethod(): (object: Fournisseur) => Fournisseur {
    return (fournisseur: Fournisseur): Fournisseur => new Fournisseur(fournisseur);
  }
}
