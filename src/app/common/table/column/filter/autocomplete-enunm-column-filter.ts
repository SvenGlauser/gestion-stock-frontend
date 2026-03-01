import {ColumnFilter} from './column-filter';
import {SearchQuery} from '../../../search/custom/search-query';
import {SearchField} from '../../../search/api/search-field';

/**
 * Filtre avec autocompletion
 */
export class AutocompleteEnumFilter<T, R extends SearchQuery> extends ColumnFilter<T, R> {
  public mapOfElements: Map<any, string>;

  constructor(fieldGetter: (searchQuery: R) => (SearchField<any> | null)) {
    super(fieldGetter);

    this.mapOfElements = new Map<any, string>();
  }

  /**
   * Instancie un filtre avec l'autocomplétion pour une énumération
   * @param fieldGetter Getter pour récupérer le champ de recherche
   */
  public static of<T, R extends SearchQuery>(fieldGetter: (searchQuery: R) => (SearchField<any> | null)): AutocompleteEnumFilter<T, R> {
    return new AutocompleteEnumFilter(fieldGetter);
  }

  /**
   * Ajoute des valeurs
   * @param values Valeurs
   */
  public addValues(values: Map<any, string>): this {
    for (const [key, value] of values) {
      this.mapOfElements.set(key, value);
    }
    return this;
  }

  /**
   * Vérifie si l'objet passé en paramètre est de la class AutocompleteFilter
   * @param columnFilter ColumnFilter
   */
  public static isInstanceOf(columnFilter: ColumnFilter<any, any>): boolean {
    return columnFilter instanceof AutocompleteEnumFilter;
  }

  /**
   * Récupère une version casté de l'objet passé en paramètre si la class AutocompleteFilter
   * @param columnFilter ColumnFilter
   * @return L'objet dans la bonne instance de class
   */
  public static cast(columnFilter: ColumnFilter<any, any>): AutocompleteEnumFilter<any, any> | null {
    if (columnFilter instanceof AutocompleteEnumFilter) {
      return columnFilter;
    }

    return null;
  }

  public override getValue(): any {
    return this.value;
  }
}
