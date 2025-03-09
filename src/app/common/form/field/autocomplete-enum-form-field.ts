import {FormControl} from "@angular/forms";
import {FormField} from "./form-field";

/**
 * Classe pour les champs de saisie avec autocomplétion complexe
 */
export class AutocompleteEnumFormField extends FormField {
  public mapOfElements: Map<any, string>;

  constructor(label: string,
              field: string,
              formControl: FormControl) {

    super(label, field, formControl);

    this.mapOfElements = new Map<any, string>();
  }

  /**
   * Récupère un champ de saisie avec autocomplétion
   * @param label Label
   * @param field Champ
   * @param value Valeur initiale
   */
  public static ofValue(label: string,
                        field: string,
                        value: any = null): AutocompleteEnumFormField {
    return this.ofFormControl(
      label,
      field,
      new FormControl(value),
    );
  }

  /**
   * Récupère un champ de saisie avec autocomplétion
   * @param label Label
   * @param field Champ
   * @param formControl FormControl
   */
  public static ofFormControl(label: string,
                              field: string,
                              formControl: FormControl): AutocompleteEnumFormField {
    return new AutocompleteEnumFormField(
      label,
      field,
      formControl,
    );
  }

  /**
   * Vérifie si le type est AutocompleteEnumFormField
   */
  public static isInstanceOf(formField: FormField): boolean {
    return formField instanceof AutocompleteEnumFormField;
  }

  /**
   * Récupère le type AutocompleteEnumFormField
   */
  public static cast(formField: FormField): AutocompleteEnumFormField | null {
    if (formField instanceof AutocompleteEnumFormField) {
      return formField;
    }

    return null;
  }

  /**
   * Ajoute une valeur
   * @param value Valeur
   * @param label Label
   */
  public addValue(value: any, label: string): this {
    this.mapOfElements.set(value, label);
    return this;
  }

  public override getValue(): any {
    return this.formControl.value;
  }
}
