import {afterNextRender, Component, input, InputSignal} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormField} from './field/form-field';
import {AutocompleteComponent} from './input/autocomplete/autocomplete.component';
import {AutocompleteEnumComponent} from './input/autocomplete/autocomplete-enum.component';
import {AutocompleteFormField} from './field/autocomplete-form-field';
import {AutocompleteEnumFormField} from './field/autocomplete-enum-form-field';
import {InputFormField} from './field/input-form-field';
import {KeyValuePipe, NgClass} from '@angular/common';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {NumberFormField} from './field/number-form-field';
import {AutocompleteMultipleFormField} from './field/autocomplete-multiple-form-field';
import {AutocompleteMultipleComponent} from './input/autocomplete/autocomplete-multiple.component';

@Component({
  selector: 'app-form',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatError,
    AutocompleteComponent,
    AutocompleteEnumComponent,
    KeyValuePipe,
    MatAccordion,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    NgClass,
    AutocompleteMultipleComponent
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  // Constantes
  protected readonly AutocompleteFormField: typeof AutocompleteFormField = AutocompleteFormField;
  protected readonly AutocompleteMultipleFormField: typeof AutocompleteMultipleFormField  = AutocompleteMultipleFormField;
  protected readonly AutocompleteEnumFormField: typeof AutocompleteEnumFormField = AutocompleteEnumFormField;
  protected readonly InputFormField: typeof InputFormField = InputFormField;
  protected readonly NumberFormField: typeof NumberFormField = NumberFormField;

  public formsMap: InputSignal<Map<string, FormField[]>> = input.required();

  // Public, car doit être accédé s'il faut ajouter une erreur globale
  public formGroup: FormGroup = new FormGroup({});

  constructor() {
    afterNextRender((): void => this.initFormGroup());
  }

  /**
   * Ajoute les FormControl au FormGroup
   */
  private initFormGroup(): void {
    for (const forms of this.formsMap().values()) {
      forms.forEach((form: FormField): void => {
        this.formGroup.addControl(
          form.field.replace(".", "-"),
          form.formControl
        );
      });
    }
  }

  /**
   * Garde le tri par défaut de la Map
   * @param _a Objet A
   * @param _b Objet B
   */
  protected unsortedMap(_a: any, _b: any): number {
    return 0;
  }
}
