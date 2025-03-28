import {Order} from '../../search/filter';
import {AutocompleteMethod} from '../../form/input/autocomplete/autocomplete';
import {ColumnFilter} from './filter/column-filter';
import {InputFilter} from './filter/input-column-filter';
import {AutocompleteFilter} from './filter/autocomplete-column-filter';
import {AutocompleteEnumFilter} from './filter/autocomplete-enunm-column-filter';

/**
 * Colonne générée automatiquement dans le tableau
 */
export abstract class Column {
  public label: string;
  public field: string;
  public filters: ColumnFilter[] = [];
  public sortable: boolean = false;
  public sortDefaultValue: Order | null = null;
  public width: string;
  public style: string | null = null;

  protected constructor(label: string, field: string, width: string) {
    this.label = label;
    this.field = field;
    this.width = width;
  }

  /**
   * Set le style
   * @param style Style
   */
  public setStyle(style: string): this {
    this.style = style;
    return this;
  }

  /**
   * Permet de tri sur la colonne
   * @param order ASC ou DESC ou null
   */
  public sort(order: Order | null = null): this {
    this.sortable = true;
    this.sortDefaultValue = order;
    return this;
  }

  /**
   * Ajoute un filtre avec input pour le champ de la colonne
   * @param filterValue Valeur initiale
   */
  public inputFilterOnSameField(filterValue: any = null): this {
    this.inputFilter(this.field, filterValue);
    return this;
  }

  /**
   * Ajoute un filtre avec input
   * @param filterField Champ
   * @param filterValue Valeur initiale
   */
  public inputFilter(filterField: any, filterValue: any = null): this {
    this.filters.push(InputFilter.of(filterField, filterValue));
    return this;
  }

  /**
   * Ajoute un filtre avec autocomplétion
   * @param filterField Champ
   * @param autocompleteMethod Méthode
   * @param autocompleteIdField Champ contenant l'id
   * @param autocompleteNameField Champ du text à afficher
   * @param filterValue Valeur initiale
   */
  public autocompleteFilter<T extends Record<string, any>>(filterField: any,
                                                           autocompleteMethod: AutocompleteMethod<T>,
                                                           autocompleteIdField: string,
                                                           autocompleteNameField: string,
                                                           filterValue: any = null): this {
    this.filters.push(AutocompleteFilter.of<T>(
      filterField,
      autocompleteMethod,
      autocompleteIdField,
      autocompleteNameField,
      filterValue
    ));
    return this;
  }

  /**
   * Ajoute un filtre avec autocomplétion pour une énumération
   * @param filterField Champ
   * @param values Valeurs de l'autocomplete
   * @param filterValue Valeur initiale
   */
  public autocompleteEnumFilter(filterField: any,
                                values: Map<any, string>,
                                filterValue: any = null): this {
    this.filters.push(AutocompleteEnumFilter.of(
      filterField,
      filterValue
    ).addValues(values));
    return this;
  }

  public abstract getValue(object: any): any;
}

