import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormField} from './field/form-field';
import {AutocompleteComponent} from './input/autocomplete/autocomplete.component';
import {AutocompleteEnumComponent} from './input/autocomplete-enum/autocomplete-enum.component';
import {AutocompleteFormField} from './field/autocomplete-form-field';
import {AutocompleteEnumFormField} from './field/autocomplete-enum-form-field';
import {InputFormField} from './field/input-form-field';

@Component({
  selector: 'app-form',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatError,
    AutocompleteComponent,
    AutocompleteEnumComponent
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
  // Constantes
  protected readonly AutocompleteFormField = AutocompleteFormField;
  protected readonly AutocompleteEnumFormField = AutocompleteEnumFormField;
  protected readonly InputFormField = InputFormField;

  @Input({required: true})
  public forms: FormField[] = [];

  // Public, car doit être accédé s'il faut ajouter une erreur globale
  public formGroup: FormGroup | null = null;

  /**
   * Ajoute les FormControl au FormGroup
   */
  public ngOnInit(): void {
    let controls: Record<string, FormControl> = {};

    this.forms.forEach(form => {
      controls[form.field.replace(".", "-")] = form.formControl;
    })

    this.formGroup = new FormGroup(controls);
  }
}
