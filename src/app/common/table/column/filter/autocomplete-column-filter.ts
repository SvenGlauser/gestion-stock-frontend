import {AutocompleteMethod} from '../../../form/input/autocomplete/autocomplete';
import {Type} from '../../../search/filter';
import {ColumnFilter} from './column-filter';

/**
 * Filtre avec autocompletion
 */
export class AutocompleteFilter<T extends Record<string, any>> extends ColumnFilter {
  public autocompleteMethod: AutocompleteMethod<T>;
  public autocompleteIdField: string;
  public autocompleteNameField: string;

  private constructor(filterField: string,
                      filterValue: any,
                      autocompleteMethod: AutocompleteMethod<T>,
                      autocompleteIdField: string,
                      autocompleteNameField: string) {

    super(filterField, filterValue, Type.EQUAL);

    this.autocompleteMethod = autocompleteMethod;
    this.autocompleteIdField = autocompleteIdField;
    this.autocompleteNameField = autocompleteNameField;
  }

  /**
   * Instancie un filtre avec l'autocomplétion
   * @param filterField Champ
   * @param autocompleteMethod Méthode d'autocomplétion
   * @param autocompleteIdField Champ contenant l'id
   * @param autocompleteNameField Champ du text à afficher
   * @param filterValue Valeur initiale [initial = null]
   */
  public static of<T extends Record<string, any>>(filterField: string,
                                                  autocompleteMethod: AutocompleteMethod<T>,
                                                  autocompleteIdField: string,
                                                  autocompleteNameField: string,
                                                  filterValue: any = null): AutocompleteFilter<T> {
    return new AutocompleteFilter<T>(
      filterField,
      filterValue,
      autocompleteMethod,
      autocompleteIdField,
      autocompleteNameField,
    );
  }

  /**
   * Vérifie si l'objet passé en paramètre est de la class AutocompleteFilter
   * @param columnFilter ColumnFilter
   */
  public static isInstanceOf(columnFilter: ColumnFilter): boolean {
    return columnFilter instanceof AutocompleteFilter;
  }

  /**
   * Récupère une version casté de l'objet passé en paramètre si la class AutocompleteFilter
   * @param columnFilter ColumnFilter
   * @return L'objet dans la bonne instance de class
   */
  public static cast<T extends Record<string, any>>(columnFilter: ColumnFilter): AutocompleteFilter<T> | null {
    if (columnFilter instanceof AutocompleteFilter) {
      return <AutocompleteFilter<T>>columnFilter;
    }

    return null;
  }
}
