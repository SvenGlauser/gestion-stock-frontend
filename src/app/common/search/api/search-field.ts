/**
 * Champ de recherche
 */
export abstract class SearchField<T> {
  value: T | null = null;
  order: Direction | null = null;
}

/**
 * Direction de recherche
 */
export enum Direction {
  ASC = "ASC",
  DESC = "DESC",
}
