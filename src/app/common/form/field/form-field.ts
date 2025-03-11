import {FormControl} from '@angular/forms';

/**
 * Classe abstraite pour les champs de formulaire
 */
export abstract class FormField {
  public label: string;
  public field: string;
  public colspan: 1 | 2;
  public formControl: FormControl;

  protected constructor(label: string, field: string, formControl: FormControl) {
    this.label = label;
    this.field = field;
    this.formControl = formControl;
    this.colspan = 1;
  }

  /**
   * Change la largeur du champ de saisie
   * @param colspan Colspan
   */
  public setColspan(colspan: 1 | 2): this {
    this.colspan = colspan;

    return this;
  }

  /**
   * Récupère la valeur pour l'envoyer auu backend
   */
  public abstract getValue(): any;
}

