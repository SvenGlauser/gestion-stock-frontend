import {FormControl} from "@angular/forms";
import {FormField} from "./form-field";

/**
 * Classe pour les champs de saisie de date
 */
export class DateFormField extends FormField {
  /**
   * Récupère un champ de saisie de date à partir d'une valeur par déafut
   * @param label Label
   * @param field Champ
   * @param value Valeur initiale
   */
  public static ofValue(label: string,
                        field: string,
                        value: any = null): DateFormField {
    return this.ofFormControl(label, field, new FormControl(value));
  }

  /**
   * Récupère un champ de saisie de date à partir d'un FormControl
   * @param label Label
   * @param field Champ
   * @param formControl FormControl
   */
  public static ofFormControl(label: string,
                              field: string,
                              formControl: FormControl): DateFormField {
    return new DateFormField(label, field, formControl);
  }

  /**
   * Vérifie si le type est DateFormField
   */
  public static isInstanceOf(formField: FormField): boolean {
    return formField instanceof DateFormField;
  }

  /**
   * Récupère le type DateFormField
   */
  public static cast(formField: FormField): DateFormField | null {
    if (formField instanceof DateFormField) {
      return formField;
    }

    return null;
  }

  public override getValue(): any {
    return this.formControl.value;
  }
}
