import {SearchQuery} from '../../../search/custom/search-query';
import {SearchField} from '../../../search/api/search-field';

/**
 * Classe abstraite pour les filtres
 */
export abstract class ColumnFilter<T, R extends SearchQuery> {
  public value: T | null = null;
  public fieldGetter: (searchQuery: R) => (SearchField<any> | null);

  protected constructor(fieldGetter: (searchQuery: R) => (SearchField<any> | null)) {
    this.fieldGetter = fieldGetter;
  }

  /**
   * Initialise le filtre avec la valeur de la SearchQuery
   * @param searchQuery SearchQuery
   */
  public initValueFromSearchQuery(searchQuery: R): void {
    const searchField: SearchField<any> | null = this.fieldGetter(searchQuery);
    if (searchField) {
      this.value = searchField.value;
    } else {
      this.value = null;
    }
  }

  /**
   * Mets à jour les fields dans la search query
   * @param searchQuery
   */
  public pushValueToSearchQuery(searchQuery: R): void {
    const searchField: SearchField<any> | null = this.fieldGetter(searchQuery);
    if (searchField) {
      searchField.value = this.getValue();
    }
  }

  /**
   * Supprimer les filtres dans la search query
   * @param searchQuery
   */
  public clear(searchQuery: R): void {
    const searchField: SearchField<any> | null = this.fieldGetter(searchQuery);
    if (searchField) {
      this.value = null;
    }
  }

  /**
   * Récupère la valeur de filtre
   * @return La valeur à envoyer à l'API
   */
  public abstract getValue(): any;
}
