import {FormControl} from '@angular/forms';
import {AutocompleteMethod} from './input/autocomplete/autocomplete';

/**
 * Classe abstraite pour les champs de formulaire
 */
export abstract class FormField {
  public label: string;
  public field: string;
  public formControl: FormControl;

  protected constructor(label: string, field: string, formControl: FormControl) {
    this.label = label;
    this.field = field;
    this.formControl = formControl;
  }

  /**
   * Vérifie si le type est InputFormField
   */
  public isInputFormField(): boolean {
    return this instanceof InputFormField;
  }

  /**
   * Récupère le type InputFormField
   */
  public getInputFormField(): InputFormField | null {
    if (this instanceof InputFormField) {
      return <InputFormField>this;
    }

    return null;
  }

  /**
   * Vérifie si le type est AutocompleteFormField
   */
  public isAutocompleteFormField(): boolean {
    return this instanceof AutocompleteFormField;
  }

  /**
   * Récupère le type AutocompleteFormField
   */
  public getAutocompleteFormField<T extends Record<string, any>>(): AutocompleteFormField<T> | null {
    if (this instanceof AutocompleteFormField) {
      return <AutocompleteFormField<T>>this;
    }

    return null;
  }

  /**
   * Récupère la valeur pour l'envoyer auu backend
   */
  public abstract getValue(): any;
}

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

  public override getValue(): any {
    return this.formControl.value;
  }
}

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
                        value: any = null): InputFormField {
    return new AutocompleteFormField(
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
                           formControl: FormControl): InputFormField {
    return new AutocompleteFormField(
      label,
      field,
      autocompleteMethod,
      autocompleteIdField,
      autocompleteNameField,
      formControl,
    );
  }

  public override getValue(): any {
    return this.formControl.value;
  }
}
