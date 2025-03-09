import {Order, Type} from '../search/filter';
import {AutocompleteMethod} from '../form/input/autocomplete/autocomplete';

/**
 * Colonne générée automatiquement dans le tableau
 */
export class Column {
  public label: string;
  public field: string;
  public filters: ColumnFilter[] = [];
  public sortable: boolean = false;
  public sortDefaultValue: Order | null = null;
  public width: string;

  private constructor(label: string, field: string, width: string) {
    this.label = label;
    this.field = field;
    this.width = width;
  }

  /**
   * Initialise une colonne
   * @param label Label
   * @param field Nom du champ
   * @param width Largeur de la colonne
   */
  public static of(label: string, field: string, width: string): Column {
    return new Column(label, field, width)
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
}

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

  public isInputFilter(): boolean {
    return this instanceof InputFilter;
  }

  public getInputFilter(): InputFilter | null {
    if (this instanceof InputFilter) {
      return <InputFilter>this;
    }

    return null;
  }

  public isAutocompleteFilter(): boolean {
    return this instanceof AutocompleteFilter;
  }

  public getAutocompleteFilter<T extends Record<string, any>>(): AutocompleteFilter<T> | null {
    if (this instanceof AutocompleteFilter) {
      return <AutocompleteFilter<T>>this;
    }

    return null;
  }
}

/**
 * Filtre avec autocompletion
 */
export class AutocompleteFilter<T extends Record<string, any>> extends ColumnFilter {
  public autocompleteMethod: AutocompleteMethod<T>;
  public autocompleteIdField: string;
  public autocompleteNameField: string;

  private constructor(filterField: any,
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
  public static of<T extends Record<string, any>>(filterField: any,
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
}

/**
 * Filtre avec un simple input
 */
export class InputFilter extends ColumnFilter {

  constructor(filterField: any, filterValue: any) {
    super(filterField, filterValue, Type.STRING_LIKE);
  }

  /**
   * Instancie un filtre avec input
   * @param filterField Champ de filtre
   * @param filterValue Valeur initiale [initial = null]
   */
  public static of(filterField: any, filterValue: any = null): InputFilter {
    return new InputFilter(filterField, filterValue);
  }
}
