import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';

@Injectable({
  providedIn: 'root'
})
export class TechniqueService extends GestionStockApiService<any> {
  constructor(http: HttpClient) {
    super(http, 'technique');
  }

  public importPieces(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<void>(TechniqueService.separateWithSlash(this.URL, 'import', 'piece'), formData);
  }

  protected override mapToClassMethod(): (object: any) => any {
    throw new Error("Service not linked to specific class");
  }
}
