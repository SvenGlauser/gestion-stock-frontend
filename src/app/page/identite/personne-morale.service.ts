import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {PersonneMorale} from './personne-morale.model';
import {GestionStockApiService} from '../../config/gestion-stock-api.service';
import {PersonnePhysique} from './personne-physique.model';

@Injectable({
  providedIn: 'root'
})
export class PersonneMoraleService extends GestionStockApiService<PersonneMorale> {
  constructor(http: HttpClient) {
    super(http, PersonneMoraleService.separateWithSlash('identite', 'morale'));
  }

  public get(id: number): Observable<PersonneMorale> {
    return this.internalGet('', id);
  }

  public delete(id: number): Observable<void> {
    return this.internalDelete('', id);
  }

  public create(personneMorale: PersonneMorale): Observable<PersonneMorale> {
    return this.internalCreate('', personneMorale);
  }

  public modify(personneMorale: PersonneMorale): Observable<PersonneMorale> {
    return this.internalModify('', personneMorale);
  }

  protected override mapToClassMethod(): (object: PersonneMorale) => PersonneMorale {
    return (personneMorale: PersonneMorale): PersonneMorale => new PersonneMorale(personneMorale);
  }
}
