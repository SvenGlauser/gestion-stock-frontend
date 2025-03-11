import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SearchResult} from '../../common/search/searchResult';
import {Contact} from './contact.model';
import {Observable} from 'rxjs';
import {SearchRequest} from '../../common/search/searchRequest';
import {BASE_URL} from '../../common/utils/http-client.configuration';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly URL: string = BASE_URL + 'contact';
  private readonly URL_WITH_SLASH: string = this.URL + '/';

  constructor(private readonly http: HttpClient) {}

  public get(id: number): Observable<Contact> {
    return this.http.get<Contact>(this.URL_WITH_SLASH + id);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(this.URL_WITH_SLASH + id);
  }

  public create(Categorie: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.URL, Categorie);
  }

  public modify(Categorie: Contact): Observable<Contact> {
    return this.http.put<Contact>(this.URL, Categorie);
  }

  public search(searchRequest: SearchRequest): Observable<SearchResult<Contact>> {
    return this.http.post<SearchResult<Contact>>(this.URL_WITH_SLASH + "search", searchRequest);
  }
}
