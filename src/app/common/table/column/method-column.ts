import {Column} from './column';
import {getValueFromAttributeInCascade} from '../../utils/function.utils';

export class MethodColumn extends Column {
  public method: ((...value: any) => string);
  public methodFields: string[];

  protected constructor(label: string,
                        field: string,
                        width: string,
                        method: (...value: any) => string,
                        methodFields: string[]) {
    super(label, field, width);
    this.method = method;
    this.methodFields = methodFields;
  }

  /**
   * Ajoute une méthode pour un champ calculé sur la base d'un autre champ
   * @param label Label
   * @param field Nom du champ
   * @param width Largeur de la colonne
   * @param method Méthode pour le calcul
   * @param methodFields Champs passés en paramètres
   */
  public static of(label: string,
                   field: string,
                   width: string,
                   method: (...value: any) => string,
                   ...methodFields: string[]): MethodColumn {
    return new MethodColumn(label, field, width, method, methodFields);
  }

  public override getValue(object: any): any {
    if (this.methodFields.length === 0) {
      return this.method(getValueFromAttributeInCascade(this.field, object));
    } else {
      return this.method(...this.methodFields.map(field => getValueFromAttributeInCascade(field, object)));
    }
  }
}
