import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/search-result';
import {PieceHistorique} from './piece-historique.model';
import {map, Observable} from 'rxjs';
import {AutomaticSearchQuery} from '../../common/search/automatic/automatic-search-query';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';

@Injectable({
  providedIn: 'root'
})
export class PieceHistoriqueService extends GestionStockApiService<PieceHistorique> {
  constructor(http: HttpClient) {
    super(http, PieceHistoriqueService.separateWithSlash('piece', 'historique'));
  }

  public get(id: number): Observable<PieceHistorique> {
    return this.internalGet('', id);
  }

  public search(searchRequest: AutomaticSearchQuery): Observable<SearchResult<PieceHistorique>> {
    return this.internalSearch('search', searchRequest);
  }

  public delete(id: number): Observable<void> {
    return this.internalDelete('', id);
  }

  protected override mapToClassMethod(): (object: PieceHistorique) => PieceHistorique {
    return (pieceHistorique: PieceHistorique): PieceHistorique => new PieceHistorique(pieceHistorique);
  }
}
