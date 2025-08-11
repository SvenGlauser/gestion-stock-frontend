import {
  afterNextRender,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  InputSignal,
  model,
  ModelSignal,
  signal,
  Signal,
  untracked,
  viewChild,
  WritableSignal
} from '@angular/core';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption
} from '@angular/material/autocomplete';
import {MatInput} from '@angular/material/input';
import {debounceTime, map, startWith} from 'rxjs';
import {KeyValuePipe} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatOptionSelectionChange} from '@angular/material/core';

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
    MatLabel,
    KeyValuePipe
  ],
  templateUrl: './autocomplete-enum.component.html',
  styleUrl: './autocomplete-enum.component.scss'
})
export class AutocompleteEnumComponent {
  // Infos de l'autocomplete
  public readonly mapOfElements: InputSignal<Map<any, string>> = input.required();

  // Label
  public readonly label: InputSignal<string | null> = input<string | null>(null);

  // Saisie de valeur
  public readonly value: ModelSignal<any> = model<any>(null);
  public readonly autocompleteFormControl: InputSignal<FormControl<any>> = input(new FormControl<any>(null));

  // ViewChild
  private readonly trigger: Signal<MatAutocompleteTrigger> = viewChild.required(MatAutocompleteTrigger);

  // Options de l'autocomplete
  protected readonly results: WritableSignal<Map<any, string>> = signal(new Map());

  constructor() {
    // Modification de la valeur dans le formControl
    effect((): void => {
      const value: any = this.value();
      untracked((): void => this.setValue(value));
    });

    const destroyRef: DestroyRef = inject(DestroyRef);

    afterNextRender((): void => {
      this.autocompleteFormControl().valueChanges
        .pipe(
          startWith(this.autocompleteFormControl().value), // Valeur initiale
          debounceTime(500), // Ne fait une nouvelle requête que toutes les 500 ms
          map((value: any): Map<any, string> => {
            let stringValue: string | null;

            // Si la valeur n'est pas null et pas de type string
            if (value === null) {
              stringValue = null;
            } else if (typeof value === 'string') {
              stringValue = value;
            } else {
              // Récupère la valeur affichée pour faire la recherche
              stringValue = this.mapOfElements().get(value) ?? null;
            }

            const result: Map<any, string> = new Map<any, string>();

            for (let [key, value] of this.mapOfElements()) {
              if (value.toLowerCase().includes(stringValue?.toLowerCase() ?? "")) {
                result.set(key, value);
              }
            }

            // Exécute la recherche
            return result;
          }),
          takeUntilDestroyed(destroyRef))
        .subscribe((results: Map<any, string>): void => this.results.set(results));

      this.trigger().panelClosingActions.subscribe((event: MatOptionSelectionChange<any> | null): void => {
        // Si le panel n'est pas fermé suite à clic du bouton
        if (!event?.source) {
          const value: any = this.autocompleteFormControl().value;

          // Et que le type n'est pas un objet
          if (value === null
              || (typeof value === "string" && !this.mapOfElements().has(value))) {

            // Réinitialiser la valeur
            this.autocompleteFormControl().setValue(null);
            this.emitValue(null);
          }
        }
      });
    })
  }

  private setValue(value: any): void {
    if (this.autocompleteFormControl().value !== value) {
      this.autocompleteFormControl().setValue(value);
    }
  }

  /**
   * Est appelé pour mettre à jour la valeur sélectionné dans l'autocomplete
   * @param event Événement du <mat-autocomplete/>
   */
  protected selectValue(event: MatAutocompleteSelectedEvent): void {
    this.emitValue(event.option.value);
  }

  /**
   * Émet la valeur
   * @param value Valeur à émettre
   */
  private emitValue(value: any): void {
    untracked((): void => {
      if (value === this.value()) {
        return;
      }

      this.value.set(value);
    });
  }

  /**
   * Récupère le nom pour l'affichage dans l'autocomplete
   * @param value Valeur
   */
  protected displayName(value: any): string {
    if (value === null) {
      return "";
    }

    return this.mapOfElements().get(value) ?? "";
  }
}
