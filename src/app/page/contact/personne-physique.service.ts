import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {BASE_URL} from '../../common/utils/http-client.configuration';
import {PersonnePhysique} from './personne-physique.model';

@Injectable({
  providedIn: 'root'
})
export class PersonnePhysiqueService {
  private readonly URL: string = BASE_URL + 'identite/physique';
  private readonly URL_WITH_SLASH: string = this.URL + '/';

  constructor(private readonly http: HttpClient) {}

  public get(id: number): Observable<PersonnePhysique> {
    return this.http
      .get<PersonnePhysique>(this.URL_WITH_SLASH + id)
      .pipe(map(personnePhysique => new PersonnePhysique(personnePhysique)));
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(this.URL_WITH_SLASH + id);
  }

  public create(personnePhysique: PersonnePhysique): Observable<PersonnePhysique> {
    return this.http
      .post<PersonnePhysique>(this.URL, personnePhysique)
      .pipe(map(personnePhysique => new PersonnePhysique(personnePhysique)));
  }

  public modify(personnePhysique: PersonnePhysique): Observable<PersonnePhysique> {
    return this.http
      .put<PersonnePhysique>(this.URL, personnePhysique)
      .pipe(map(personnePhysique => new PersonnePhysique(personnePhysique)));
  }
}
