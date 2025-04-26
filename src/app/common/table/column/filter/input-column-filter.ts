import {ColumnFilter} from "./column-filter";
import {FilterType} from "../../../search/filter";

/**
 * Filtre avec un simple input
 */
export class InputFilter extends ColumnFilter {

  constructor(filterField: any, filterValue: any) {
    super(filterField, filterValue, FilterType.STRING_LIKE);
  }

  /**
   * Instancie un filtre avec input
   * @param filterField Champ de filtre
   * @param filterValue Valeur initiale [initial = null]
   */
  public static of(filterField: any, filterValue: any = null): InputFilter {
    return new InputFilter(filterField, filterValue);
  }

  /**
   * Vérifie si l'objet passé en paramètre est de la class InputFilter
   * @param columnFilter ColumnFilter
   */
  public static isInstanceOf(columnFilter: ColumnFilter): boolean {
    return columnFilter instanceof InputFilter;
  }

  /**
   * Récupère une version casté de l'objet passé en paramètre si la class InputFilter
   * @param columnFilter ColumnFilter
   * @return L'objet dans la bonne instance de class
   */
  public static cast(columnFilter: ColumnFilter): InputFilter | null {
    if (columnFilter instanceof InputFilter) {
      return columnFilter;
    }

    return null;
  }

  public override getValue(): any {
    return this.filterValue;
  }
}
