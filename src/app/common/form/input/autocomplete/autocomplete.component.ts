import {Component, input, InputSignal} from '@angular/core';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {AutocompleteMethod} from './autocomplete';
import {MatInput} from '@angular/material/input';
import {Observable} from 'rxjs';
import {AbstractAutocompleteComponent} from './abstract/abstract-autocomplete.component';
import {getValueFromAttributeInCascade} from '../../../utils/function.utils';

@Component({
  selector: 'app-autocomplete',
  imports: [
    MatFormField,
    FormsModule,
    MatInput,
    ReactiveFormsModule,
    MatAutocomplete,
    MatOption,
    MatAutocompleteTrigger,
    MatError,
    MatLabel
  ],
  templateUrl: './abstract/abstract-autocomplete.component.html',
  styleUrl: './abstract/abstract-autocomplete.component.scss'
})
export class AutocompleteComponent<T extends Record<string, any>> extends AbstractAutocompleteComponent<T> {

  // Infos de l'autocomplete
  public readonly autocompleteMethod: InputSignal<AutocompleteMethod<T>> = input.required();
  public readonly autocompleteIdField: InputSignal<string> = input.required();
  public readonly autocompleteNameField: InputSignal<string> = input.required();

  protected override autocomplete(value: string): Observable<T[]> {
    return this.autocompleteMethod()(value);
  }

  protected override stringify(value: T | null): string {
    if (value === null) {
      return "";
    }

    return getValueFromAttributeInCascade(this.autocompleteNameField(), value);
  }

  protected override track(value: T): any {
    return value[this.autocompleteIdField()];
  }
}
