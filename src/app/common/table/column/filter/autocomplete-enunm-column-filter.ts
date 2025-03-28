import {Type} from '../../../search/filter';
import {ColumnFilter} from './column-filter';

/**
 * Filtre avec autocompletion
 */
export class AutocompleteEnumFilter extends ColumnFilter {
  public mapOfElements: Map<any, string>;

  private constructor(filterField: string,
                      filterValue: any) {

    super(filterField, filterValue, Type.EQUAL);

    this.mapOfElements = new Map<any, string>();
  }

  /**
   * Instancie un filtre avec l'autocomplétion pour une énumération
   * @param filterField Champ
   * @param filterValue Valeur initiale [initial = null]
   */
  public static of(filterField: string,
                   filterValue: any = null): AutocompleteEnumFilter {
    return new AutocompleteEnumFilter(
      filterField,
      filterValue,
    );
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
  public static isInstanceOf(columnFilter: ColumnFilter): boolean {
    return columnFilter instanceof AutocompleteEnumFilter;
  }

  /**
   * Récupère une version casté de l'objet passé en paramètre si la class AutocompleteFilter
   * @param columnFilter ColumnFilter
   * @return L'objet dans la bonne instance de class
   */
  public static cast(columnFilter: ColumnFilter): AutocompleteEnumFilter | null {
    if (columnFilter instanceof AutocompleteEnumFilter) {
      return columnFilter;
    }

    return null;
  }

  public override getValue(): any {
    return this.filterValue;
  }
}
