import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {PersonnePhysique} from './personne-physique.model';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';

@Injectable({
  providedIn: 'root'
})
export class PersonnePhysiqueService extends GestionStockApiService<PersonnePhysique> {
  constructor(http: HttpClient) {
    super(http, PersonnePhysiqueService.separateWithSlash('identite', 'physique'));
  }

  public get(id: number): Observable<PersonnePhysique> {
    return this.internalGet('', id);
  }

  public delete(id: number): Observable<void> {
    return this.internalDelete('', id);
  }

  public create(personnePhysique: PersonnePhysique): Observable<PersonnePhysique> {
    return this.internalCreate('', personnePhysique);
  }

  public modify(personnePhysique: PersonnePhysique): Observable<PersonnePhysique> {
    return this.internalModify('', personnePhysique);
  }

  protected override mapToClassMethod(): (object: PersonnePhysique) => PersonnePhysique {
    return (personnePhysique: PersonnePhysique): PersonnePhysique => new PersonnePhysique(personnePhysique);
  }
}
