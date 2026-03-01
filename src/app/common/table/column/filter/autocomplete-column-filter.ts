import {AutocompleteMethod} from '../../../form/input/autocomplete/autocomplete';
import {ColumnFilter} from './column-filter';
import {SearchQuery} from '../../../search/custom/search-query';
import {SearchField} from '../../../search/api/search-field';

/**
 * Filtre avec autocompletion
 */
export class AutocompleteFilter<T extends Record<string, any>, R extends SearchQuery> extends ColumnFilter<T, R> {
  public autocompleteMethod: AutocompleteMethod<T>;
  public autocompleteIdField: string;
  public autocompleteNameField: string;

  private constructor(fieldGetter: (searchQuery: R) => (SearchField<any> | null),
                      autocompleteMethod: AutocompleteMethod<T>,
                      autocompleteIdField: string,
                      autocompleteNameField: string) {

    super(fieldGetter);

    this.autocompleteMethod = autocompleteMethod;
    this.autocompleteIdField = autocompleteIdField;
    this.autocompleteNameField = autocompleteNameField;
  }

  /**
   * Instancie un filtre avec l'autocomplétion
   * @param fieldGetter Getter pour récupérer le champ de recherche
   * @param autocompleteMethod Méthode d'autocomplétion
   * @param autocompleteIdField Champ contenant l'id
   * @param autocompleteNameField Champ du text à afficher
   */
  public static of<T extends Record<string, any>, R extends SearchQuery>(fieldGetter: (searchQuery: R) => (SearchField<any> | null),
                                                                         autocompleteMethod: AutocompleteMethod<T>,
                                                                         autocompleteIdField: string,
                                                                         autocompleteNameField: string): AutocompleteFilter<T, R> {
    return new AutocompleteFilter<T, R>(
      fieldGetter,
      autocompleteMethod,
      autocompleteIdField,
      autocompleteNameField,
    );
  }

  /**
   * Vérifie si l'objet passé en paramètre est de la class AutocompleteFilter
   * @param columnFilter ColumnFilter
   */
  public static isInstanceOf(columnFilter: ColumnFilter<any, any>): boolean {
    return columnFilter instanceof AutocompleteFilter;
  }

  /**
   * Récupère une version casté de l'objet passé en paramètre si la class AutocompleteFilter
   * @param columnFilter ColumnFilter
   * @return L'objet dans la bonne instance de class
   */
  public static cast(columnFilter: ColumnFilter<any, any>): AutocompleteFilter<any, any> | null {
    if (columnFilter instanceof AutocompleteFilter) {
      return columnFilter;
    }

    return null;
  }

  public override getValue(): any {
    if (this.value) {
      return this.value[this.autocompleteIdField];
    } else {
      return null;
    }
  }
}
