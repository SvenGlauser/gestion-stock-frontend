import {ColumnFilter} from './filter/column-filter';
import {SearchQuery} from '../../search/custom/search-query';
import {Direction, SearchField} from '../../search/api/search-field';
import {InputFilter} from './filter/input-column-filter';
import {AutocompleteFilter} from './filter/autocomplete-column-filter';
import {AutocompleteMethod} from '../../form/input/autocomplete/autocomplete';
import {AutocompleteEnumFilter} from './filter/autocomplete-enunm-column-filter';

/**
 * Colonne générée automatiquement dans le tableau
 */
export abstract class Column<R extends SearchQuery> {
  public label: string;
  public field: string;
  public filters: ColumnFilter<any, R>[] = [];
  public sortableFieldGetter: ((searchQuery: R) => SearchField<any> | null) | null = null;
  public sortOrder: Direction | null = null;
  public view: boolean = true;
  public width: number;
  public style: string;

  protected constructor(label: string, field: string, width: number) {
    this.label = label;
    this.field = field;
    this.width = width;
    this.style = "text-wrap: nowrap; text-overflow: ellipsis; overflow: hidden;"
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
   * Ajoute le style à l'existant
   * @param style Style
   */
  public addStyle(style: string): this {
    this.style += style;
    return this;
  }

  /**
   * Set le style pre-wrap
   */
  public setStylePreWrap(): this {
    return this.setStyle("white-space: pre-wrap");
  }

  /**
   * Permet de tri sur la colonne
   * @param sortableFieldGetter Getter pour récupérer le field associé
   */
  public sort(sortableFieldGetter: ((searchQuery: R) => SearchField<any> | null) | null): this {
    this.sortableFieldGetter = sortableFieldGetter;
    return this;
  }

  /**
   * Ajoute un filtre
   * @param filter Filtre
   */
  public addFilter<T>(filter: ColumnFilter<T, R>): this {
    this.filters.push(filter);
    return this;
  }

  /**
   * Ajouter un filtre de type InputFilter sur un champ
   * @param fieldGetter Getter du filtre
   */
  public inputFilter(fieldGetter: (searchQuery: R) => (SearchField<any> | null)): this {
    this.addFilter(InputFilter.of(fieldGetter))
    return this;
  }

  public hide(): this {
    this.view = false;
    return this;
  }

  /**
   * Ajouter un filtre de type Autocomplete sur un champ
   * @param fieldGetter Getter du filtre
   * @param autocompleteMethod
   * @param autocompleteIdField
   * @param autocompleteNameField
   */
  public autocompleteFilter<T extends Record<string, any>>(fieldGetter: (searchQuery: R) => (SearchField<any> | null),
                                                           autocompleteMethod: AutocompleteMethod<T>,
                                                           autocompleteIdField: string,
                                                           autocompleteNameField: string): this {
    this.addFilter(AutocompleteFilter.of(
      fieldGetter,
      autocompleteMethod,
      autocompleteIdField,
      autocompleteNameField))
    return this;
  }

  /**
   * Ajoute un filtre avec l'autocomplétion pour une énumération
   * @param fieldGetter Modification a apporté à la SearchQuery lié
   * @param mapElements Map des éléments de l'auto-complete
   */
  public autocompleteEnumFilter<T>(fieldGetter: (searchQuery: R) => (SearchField<any> | null),
                                   mapElements: Map<any, string>): this {
    this.addFilter(AutocompleteEnumFilter
      .of(fieldGetter)
      .addValues(mapElements))
    return this;
  }

  /**
   * Initialise le filtre avec la valeur de la SearchQuery
   * @param searchQuery SearchQuery
   */
  public initSortFromSearchQuery(searchQuery: R): void {
    if (!this.sortableFieldGetter) {
      return;
    }
    const searchField: SearchField<any> | null = this.sortableFieldGetter(searchQuery);
    if (searchField) {
      this.sortOrder = searchField.order;
    } else {
      this.sortOrder = null;
    }
  }

  /**
   * Mets à jour les fields dans la search query
   * @param searchQuery SearchQuery
   */
  public pushSortToSearchQuery(searchQuery: R): void {
    if (!this.sortableFieldGetter) {
      return;
    }
    const searchField: SearchField<any> | null = this.sortableFieldGetter(searchQuery);
    if (searchField) {
      searchField.order = this.sortOrder;
    }
  }

  /**
   * Vérifie si la colonne peut être triée
   */
  public isSortable(): boolean {
    return this.sortableFieldGetter !== null;
  }

  public abstract getValue(object: any): any;
}

