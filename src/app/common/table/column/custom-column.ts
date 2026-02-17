import {Column} from './column';
import {SearchQuery} from '../../search/custom/search-query';

/**
 * Colonne custom pour gérer de A-Z l'affichage
 */
export class CustomColumn<R extends SearchQuery> extends Column<R> {
  /**
   * Initialise une colonne
   * @param label Label
   * @param field Nom du champ
   * @param width Largeur de la colonne
   */
  public static of<R extends SearchQuery>(label: string, field: string, width: string): Column<R> {
    return new CustomColumn(label, field, width)
  }

  /**
   * Indique si l'instance est une instance de CustomColumn
   * @param instance Instance à vérifier
   */
  public static isInstanceOf<R extends SearchQuery>(instance: Column<R>): boolean {
    return instance instanceof CustomColumn;
  }

  public override getValue(object: any): void {
    throw new Error("Impossible de récupérer la valeur pour l'objet : " + JSON.stringify(object) + " car la colonne est custom");
  }
}
