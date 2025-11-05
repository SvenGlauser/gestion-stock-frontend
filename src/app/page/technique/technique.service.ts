import {Injectable} from '@angular/core';
import {BASE_URL} from '../../common/utils/http-client.configuration';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TechniqueService {
  private readonly URL: string = BASE_URL + 'technique';
  private readonly URL_WITH_SLASH: string = this.URL + '/';

  constructor(private readonly http: HttpClient) {
  }

  public importPieces(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<void>(this.URL_WITH_SLASH + "import/piece", formData);
  }
}
