import {Column} from './column';
import {getValueFromAttributeInCascade} from '../../utils/function.utils';

export class ClassicColumn extends Column {
  /**
   * Initialise une colonne
   * @param label Label
   * @param field Nom du champ
   * @param width Largeur de la colonne
   */
  public static of(label: string, field: string, width: string): Column {
    return new ClassicColumn(label, field, width)
  }

  /**
   * Récupère la valeur d'une colonne
   * @param object Objet concerné
   */
  public getValue(object: any): any {
    return getValueFromAttributeInCascade(this.field, object);
  }
}
