import {Column} from './column';
import {getValueFromAttributeInCascade} from '../../utils/function.utils';

export class DateColumn extends Column {
  private time: boolean = false;

  /**
   * Initialise une colonne
   * @param label Label
   * @param field Nom du champ
   * @param width Largeur de la colonne
   */
  public static of(label: string, field: string, width: string): DateColumn {
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

    if (date) {
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    }

    return "";
  }
}
