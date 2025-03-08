import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../common/search/searchResult';
import {Pays} from './pays.model';
import {Observable} from 'rxjs';
import {SearchRequest} from '../common/search/searchRequest';

@Injectable({
  providedIn: 'root'
})
export class PaysService {

  constructor(private readonly http: HttpClient) {}

  public get(id: number): Observable<Pays> {
    return this.http.get<Pays>("http://localhost:8080/pays/" + id);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>("http://localhost:8080/pays/" + id);
  }

  public create(pays: Pays): Observable<Pays> {
    return this.http.post<Pays>("http://localhost:8080/pays", pays);
  }

  public modify(pays: Pays): Observable<Pays> {
    return this.http.put<Pays>("http://localhost:8080/pays", pays);
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<Pays>> {
    return this.http.post<SearchResult<Pays>>("http://localhost:8080/pays/search", searchRequest);
  }
}
