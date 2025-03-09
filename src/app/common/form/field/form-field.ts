import {FormControl} from '@angular/forms';

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
   * Récupère la valeur pour l'envoyer auu backend
   */
  public abstract getValue(): any;
}

