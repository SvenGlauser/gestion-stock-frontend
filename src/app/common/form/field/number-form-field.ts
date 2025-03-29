import {FormControl} from "@angular/forms";
import {FormField} from "./form-field";

/**
 * Classe pour les champs de saisie simple
 */
export class NumberFormField extends FormField {
  private decimal: boolean = false;

  /**
   * Récupère un champ de saisie à partir d'une valeur par déafut
   * @param label Label
   * @param field Champ
   * @param value Valeur initiale
   */
  public static ofValue(label: string,
                        field: string,
                        value: number | null = null): NumberFormField {

    let formField = this.ofFormControl(label, field, new FormControl(value));

    formField.formControl.valueChanges
      .subscribe((initialValue: any) => {
        let value: any;
        if (typeof initialValue === 'string') {
          value = initialValue.replace(/[^0-9.]/g, '');
          while (value.match(/\./g)?.length > formField.decimal ? 1 : 0) {
            let index = value.lastIndexOf(".");
            value = value.slice(0, index) + value.slice(index + 1);
          }
        } else if (typeof initialValue === 'number') {
          value = initialValue;
        } else {
          value = null;
        }

        if (value !== initialValue) {
          formField.formControl.setValue(value, { emitEvent: false });
        }
      });

    return formField;
  }

  /**
   * Récupère un champ de saisie à partir d'un FormControl
   * @param label Label
   * @param field Champ
   * @param formControl FormControl
   */
  public static ofFormControl(label: string,
                              field: string,
                              formControl: FormControl): NumberFormField {
    return new NumberFormField(label, field, formControl);
  }

  /**
   * Vérifie si le type est InputFormField
   */
  public static isInstanceOf(formField: FormField): boolean {
    return formField instanceof NumberFormField;
  }

  /**
   * Récupère le type InputFormField
   */
  public static cast(formField: FormField): NumberFormField | null {
    if (formField instanceof NumberFormField) {
      return formField;
    }

    return null;
  }

  public withDecimal(): this {
    this.decimal = true;
    return this;
  }

  public override getValue(): any {
    if (this.decimal) {
      return Number.parseFloat(this.formControl.value);
    }

    return Number.parseInt(this.formControl.value);
  }
}
