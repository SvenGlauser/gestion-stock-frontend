import {FormControl} from "@angular/forms";
import {FormField} from "./form-field";

/**
 * Classe pour les champs de saisie sur plusieurs lignes
 */
export class TextAreaFormField extends FormField {
  public numberOfLines: number = 3;

  /**
   * Récupère un champ de saisie à partir d'une valeur par défaut
   * @param label Label
   * @param field Champ
   * @param value Valeur initiale
   */
  public static ofValue(label: string,
                        field: string,
                        value: any = null): TextAreaFormField {
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
                              formControl: FormControl): TextAreaFormField {
    return new TextAreaFormField(label, field, formControl);
  }

  /**
   * Modifie le nombre de lignes affichées par défaut
   * @param numberOfLines number of lines
   */
  public setNumberOfLines(numberOfLines: number): this {
    this.numberOfLines = numberOfLines;
    return this;
  }

  /**
   * Vérifie si le type est TextAreaFormField
   */
  public static isInstanceOf(formField: FormField): boolean {
    return formField instanceof TextAreaFormField;
  }

  /**
   * Récupère le type TextAreaFormField
   */
  public static cast(formField: FormField): TextAreaFormField | null {
    if (formField instanceof TextAreaFormField) {
      return formField;
    }

    return null;
  }

  public override getValue(): any {
    return this.formControl.value;
  }
}
