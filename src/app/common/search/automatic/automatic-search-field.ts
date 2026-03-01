import {SearchField} from '../api/search-field';

/**
 * Champ de recherche non automatique
 */
export class AutomaticSearchField<T> extends SearchField<T> {
  public field: string;
  public type: FilterType;

  constructor(field: string, type: FilterType) {
    super();
    this.field = field;
    this.type = type;
  }

  public static of<T>(field: string, type: FilterType): AutomaticSearchField<T> {
    return new AutomaticSearchField<T>(field, type);
  }
}

export enum FilterType {
  EQUAL = "EQUAL",
  STRING_LIKE = "STRING_LIKE",
}
