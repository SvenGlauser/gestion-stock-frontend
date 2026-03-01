import {ColumnFilter} from "./column-filter";
import {SearchQuery} from '../../../search/custom/search-query';
import {SearchField} from '../../../search/api/search-field';

/**
 * Filtre avec un simple input
 */
export class InputFilter<T, R extends SearchQuery> extends ColumnFilter<T, R> {

  constructor(fieldGetter: (searchQuery: R) => (SearchField<any> | null)) {
    super(fieldGetter);
  }

  /**
   * Instancie un filtre avec input
   * @param fieldGetter Getter pour récupérer le champ de recherche dans la SearchQuery
   */
  public static of<T, R extends SearchQuery>(fieldGetter: (searchQuery: R) => (SearchField<any> | null)): InputFilter<T, R> {
    return new InputFilter(fieldGetter);
  }

  /**
   * Vérifie si l'objet passé en paramètre est de la class InputFilter
   * @param columnFilter ColumnFilter
   */
  public static isInstanceOf(columnFilter: ColumnFilter<any, any>): boolean {
    return columnFilter instanceof InputFilter;
  }

  /**
   * Récupère une version casté de l'objet passé en paramètre si la class InputFilter
   * @param columnFilter ColumnFilter
   * @return L'objet dans la bonne instance de class
   */
  public static cast(columnFilter: ColumnFilter<any, any>): InputFilter<any, any> | null {
    if (columnFilter instanceof InputFilter) {
      return columnFilter;
    }

    return null;
  }

  public override getValue(): any {
    return this.value;
  }
}
