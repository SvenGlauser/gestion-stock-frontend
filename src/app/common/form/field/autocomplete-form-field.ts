import {AutocompleteMethod} from "../input/autocomplete/autocomplete";
import {FormControl} from "@angular/forms";
import {FormField} from "./form-field";

/**
 * Classe pour les champs de saisie avec autocomplétion complexe
 */
export class AutocompleteFormField<T extends Record<string, any>> extends FormField {
  public autocompleteMethod: AutocompleteMethod<T>;
  public autocompleteIdField: string;
  public autocompleteNameField: string;

  constructor(label: string,
              field: string,
              autocompleteMethod: AutocompleteMethod<T>,
              autocompleteIdField: string,
              autocompleteNameField: string,
              formControl: FormControl) {

    super(label, field, formControl);

    this.autocompleteMethod = autocompleteMethod;
    this.autocompleteIdField = autocompleteIdField;
    this.autocompleteNameField = autocompleteNameField;
  }

  /**
   * Récupère un champ de saisie avec autocomplétion
   * @param label Label
   * @param field Champ
   * @param autocompleteMethod Méthode d'autocomplétion
   * @param autocompleteIdField Id à utiliser pour l'autocomplétion
   * @param autocompleteNameField Nom à utiliser pour l'affichage
   * @param value Valeur initiale
   */
  public static ofValue<T extends Record<string, any>>(label: string,
                                                       field: string,
                                                       autocompleteMethod: AutocompleteMethod<T>,
                                                       autocompleteIdField: string,
                                                       autocompleteNameField: string,
                                                       value: any = null): AutocompleteFormField<T> {
    return this.ofFormControl(
      label,
      field,
      autocompleteMethod,
      autocompleteIdField,
      autocompleteNameField,
      new FormControl(value),
    );
  }

  /**
   * Récupère un champ de saisie avec autocomplétion
   * @param label Label
   * @param field Champ
   * @param autocompleteMethod Méthode d'autocomplétion
   * @param autocompleteIdField Id à utiliser pour l'autocomplétion
   * @param autocompleteNameField Nom à utiliser pour l'affichage
   * @param formControl FormControl
   */
  public static ofFormControl<T extends Record<string, any>>(label: string,
                                                             field: string,
                                                             autocompleteMethod: AutocompleteMethod<T>,
                                                             autocompleteIdField: string,
                                                             autocompleteNameField: string,
                                                             formControl: FormControl): AutocompleteFormField<T> {
    return new AutocompleteFormField(
      label,
      field,
      autocompleteMethod,
      autocompleteIdField,
      autocompleteNameField,
      formControl,
    );
  }

  /**
   * Vérifie si le type est AutocompleteFormField
   */
  public static isInstanceOf(formField: FormField): boolean {
    return formField instanceof AutocompleteFormField;
  }

  /**
   * Récupère le type AutocompleteFormField
   */
  public static cast<T extends Record<string, any>>(formField: FormField): AutocompleteFormField<T> | null {
    if (formField instanceof AutocompleteFormField) {
      return formField;
    }

    return null;
  }

  public override getValue(): any {
    let value: any = this.formControl.value;

    if (value === null || typeof value === "string") {
      return null;
    }

    return value;
  }
}
