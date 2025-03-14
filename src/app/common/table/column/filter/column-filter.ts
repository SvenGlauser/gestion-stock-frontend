import {Type} from "../../../search/filter";

/**
 * Classe abstraite pour les filtres
 */
export abstract class ColumnFilter {
  public filterField: any;
  public filterValue: any;
  public filterType: Type;

  protected constructor(filterField: any,
                        filterValue: any,
                        filterType: Type) {
    this.filterField = filterField;
    this.filterValue = filterValue;
    this.filterType = filterType;
  }

  /**
   * Récupère la valeur de filtre
   * @return La valeur à envoyer à l'API
   */
  public abstract getValue(): any;
}


