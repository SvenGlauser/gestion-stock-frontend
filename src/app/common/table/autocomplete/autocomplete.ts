import {Observable} from 'rxjs';

export type AutocompleteMethod<T> = (value: string) => Observable<T[]>
