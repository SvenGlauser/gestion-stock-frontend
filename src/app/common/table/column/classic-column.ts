import {Column} from './column';
import {getValueFromAttributeInCascade} from '../../utils/function.utils';
import {SearchQuery} from '../../search/custom/search-query';

export class ClassicColumn<R extends SearchQuery> extends Column<R> {
  /**
   * Initialise une colonne
   * @param label Label
   * @param field Nom du champ
   * @param width Largeur de la colonne
   */
  public static of<R extends SearchQuery>(label: string, field: string, width: string): Column<R> {
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
