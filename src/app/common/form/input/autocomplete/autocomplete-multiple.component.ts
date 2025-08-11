import {Component, input, InputSignal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {AutocompleteMethod} from './autocomplete';
import {AbstractAutocompleteComponent} from './abstract/abstract-autocomplete.component';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';

@Component({
  selector: 'app-autocomplete-multiple',
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
export class AutocompleteMultipleComponent<T extends Record<string, any>> extends AbstractAutocompleteComponent<T> {
  // Infos autocomplete
  public autocompleteMethod: InputSignal<AutocompleteMethod<T>> = input.required();
  public autocompleteIdField: InputSignal<string> = input.required();
  public autocompleteNameFields: InputSignal<string[]> = input.required();
  public separator: InputSignal<string> = input(" / ");

  protected override autocomplete(value: string): Observable<T[]> {
    return this.autocompleteMethod()(value);
  }

  protected override stringify(value: T): string {
    if (value === null) {
      return "";
    }

    if (this.autocompleteNameFields().length == 0) {
      return "";
    }

    return this.autocompleteNameFields().map((field: string): void => value[field]).join(this.separator());
  }

  protected override track(value: T): any {
    return value[this.autocompleteIdField()];
  }
}
