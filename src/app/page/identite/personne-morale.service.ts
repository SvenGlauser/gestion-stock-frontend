import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {BASE_URL} from '../../common/utils/http-client.configuration';
import {PersonneMorale} from './personne-morale.model';

@Injectable({
  providedIn: 'root'
})
export class PersonneMoraleService {
  private readonly URL: string = BASE_URL + 'identite/morale';
  private readonly URL_WITH_SLASH: string = this.URL + '/';

  constructor(private readonly http: HttpClient) {
  }

  public get(id: number): Observable<PersonneMorale> {
    return this.http
      .get<PersonneMorale>(this.URL_WITH_SLASH + id)
      .pipe(map(personneMorale => new PersonneMorale(personneMorale)));
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(this.URL_WITH_SLASH + id);
  }

  public create(personneMorale: PersonneMorale): Observable<PersonneMorale> {
    return this.http
      .post<PersonneMorale>(this.URL, personneMorale)
      .pipe(map(personneMorale => new PersonneMorale(personneMorale)));
  }

  public modify(personneMorale: PersonneMorale): Observable<PersonneMorale> {
    return this.http
      .put<PersonneMorale>(this.URL, personneMorale)
      .pipe(map(personneMorale => new PersonneMorale(personneMorale)));
  }
}
