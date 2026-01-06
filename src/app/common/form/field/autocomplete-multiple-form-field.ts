import {AutocompleteMethod} from "../input/autocomplete/autocomplete";
import {FormControl} from "@angular/forms";
import {FormField} from "./form-field";

/**
 * Classe pour les champs de saisie avec autocomplétion complexe avec concaténation de champs
 */
export class AutocompleteMultipleFormField<T extends Record<string, any>> extends FormField {
  public autocompleteMethod: AutocompleteMethod<T>;
  public autocompleteIdField: string;
  public autocompleteNameFields: string[];
  public separator: string;

  constructor(label: string,
              field: string,
              autocompleteMethod: AutocompleteMethod<T>,
              autocompleteIdField: string,
              autocompleteNameFields: string[],
              separator: string,
              formControl: FormControl) {

    super(label, field, formControl);

    this.autocompleteMethod = autocompleteMethod;
    this.autocompleteIdField = autocompleteIdField;
    this.autocompleteNameFields = autocompleteNameFields;
    this.separator = separator;
  }

  /**
   * Récupère un champ de saisie avec autocomplétion
   * @param label Label
   * @param field Champ
   * @param autocompleteMethod Méthode d'autocomplétion
   * @param autocompleteIdField Id à utiliser pour l'autocomplétion
   * @param autocompleteNameFields Noms à utiliser pour l'affichage
   * @param separator Séparateur
   * @param value Valeur initiale
   */
  public static ofValue<T extends Record<string, any>>(label: string,
                                                       field: string,
                                                       autocompleteMethod: AutocompleteMethod<T>,
                                                       autocompleteIdField: string,
                                                       autocompleteNameFields: string[],
                                                       separator: string,
                                                       value: any = null): AutocompleteMultipleFormField<T> {
    return this.ofFormControl(
      label,
      field,
      autocompleteMethod,
      autocompleteIdField,
      autocompleteNameFields,
      separator,
      new FormControl(value),
    );
  }

  /**
   * Récupère un champ de saisie avec autocomplétion
   * @param label Label
   * @param field Champ
   * @param autocompleteMethod Méthode d'autocomplétion
   * @param autocompleteIdField Id à utiliser pour l'autocomplétion
   * @param autocompleteNameFields Noms à utiliser pour l'affichage
   * @param separator Séparateur
   * @param formControl FormControl
   */
  public static ofFormControl<T extends Record<string, any>>(label: string,
                                                             field: string,
                                                             autocompleteMethod: AutocompleteMethod<T>,
                                                             autocompleteIdField: string,
                                                             autocompleteNameFields: string[],
                                                             separator: string,
                                                             formControl: FormControl): AutocompleteMultipleFormField<T> {
    return new AutocompleteMultipleFormField(
      label,
      field,
      autocompleteMethod,
      autocompleteIdField,
      autocompleteNameFields,
      separator,
      formControl,
    );
  }

  /**
   * Vérifie si le type est AutocompleteMultipleFormField
   */
  public static isInstanceOf(formField: FormField): boolean {
    return formField instanceof AutocompleteMultipleFormField;
  }

  /**
   * Récupère le type AutocompleteMultipleFormField
   */
  public static cast<T extends Record<string, any>>(formField: FormField): AutocompleteMultipleFormField<T> | null {
    if (formField instanceof AutocompleteMultipleFormField) {
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
