import {SearchField} from '../api/search-field';

/**
 * Champ de recherche non automatique
 */
export class CustomSearchField<T> extends SearchField<T> {

  constructor() {
    super();
  }

  public static of<T>(): CustomSearchField<T> {
    return new CustomSearchField<T>();
  }
}
