import {FormControl} from "@angular/forms";
import {FormField} from "./form-field";

/**
 * Classe pour les champs de saisie simple
 */
export class InputFormField extends FormField {
  /**
   * Récupère un champ de saisie à partir d'une valeur par déafut
   * @param label Label
   * @param field Champ
   * @param value Valeur initiale
   */
  public static ofValue(label: string,
                        field: string,
                        value: any = null): InputFormField {
    return this.ofFormControl(label, field, new FormControl(value));
  }

  /**
   * Récupère un champ de saisie à partir d'un FormControl
   * @param label Label
   * @param field Champ
   * @param formControl FormControl
   */
  public static ofFormControl(label: string,
                              field: string,
                              formControl: FormControl): InputFormField {
    return new InputFormField(label, field, formControl);
  }

  /**
   * Vérifie si le type est InputFormField
   */
  public static isInstanceOf(formField: FormField): boolean {
    return formField instanceof InputFormField;
  }

  /**
   * Récupère le type InputFormField
   */
  public static cast(formField: FormField): InputFormField | null {
    if (formField instanceof InputFormField) {
      return formField;
    }

    return null;
  }

  public override getValue(): any {
    return this.formControl.value;
  }
}
