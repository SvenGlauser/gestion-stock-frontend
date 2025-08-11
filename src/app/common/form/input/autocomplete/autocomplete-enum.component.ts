import {Component, input, InputSignal} from '@angular/core';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatInput} from '@angular/material/input';
import {Observable, of} from 'rxjs';
import {AbstractAutocompleteComponent} from './abstract/abstract-autocomplete.component';

@Component({
  selector: 'app-autocomplete-enum',
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
export class AutocompleteEnumComponent<T> extends AbstractAutocompleteComponent<T> {
  // Infos de l'autocomplete
  public readonly mapOfElements: InputSignal<Map<any, string>> = input.required();

  protected override autocomplete(stringValue: string): Observable<T[]> {
    const results: T[] = [];

    for (let [key, value] of this.mapOfElements()) {
      if (value.toLowerCase().includes(stringValue?.toLowerCase() ?? "")) {
        results.push(key);
      }
    }

    // Exécute la recherche
    return of(results);
  }

  protected override stringify(value: T): string {
    if (value === null) {
      return "";
    }

    return this.mapOfElements().get(value) ?? "";
  }

  protected override track(value: T): any {
    return value;
  }

  protected override isValidSelection(value: string | T | null): boolean {
    return value === null || (typeof value === "string" && !this.mapOfElements().has(value));
  }
}
