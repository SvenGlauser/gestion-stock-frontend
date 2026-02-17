import {Column} from './column';
import {getValueFromAttributeInCascade} from '../../utils/function.utils';
import {SearchQuery} from '../../search/custom/search-query';

export class DateColumn<R extends SearchQuery> extends Column<R> {
  private time: boolean = false;

  /**
   * Initialise une colonne
   * @param label Label
   * @param field Nom du champ
   * @param width Largeur de la colonne
   */
  public static of<R extends SearchQuery>(label: string, field: string, width: string): DateColumn<R> {
    return new DateColumn(label, field, width)
  }

  /**
   * Indique s'il faut aussi afficher l'heure
   * @return La colonne
   */
  public withTime(): this {
    this.time = true;
    return this;
  }

  /**
   * Récupère la valeur d'une colonne
   * @param object Objet concerné
   */
  public getValue(object: any): any {
    let date: Date | null = getValueFromAttributeInCascade(this.field, object);

    let dateString = "";

    if (date) {
      dateString = date.toLocaleDateString();

      if (this.time) {
        dateString += " ";
        dateString += date.toLocaleTimeString();
      }
    }

    return dateString;
  }
}
