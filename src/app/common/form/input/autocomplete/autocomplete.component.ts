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
import {AutocompleteMethod} from './autocomplete';
import {MatInput} from '@angular/material/input';
import {debounceTime, mergeMap, Observable, startWith} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatOptionSelectionChange} from '@angular/material/core';

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
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss'
})
export class AutocompleteComponent<T extends AutocompleteValueType> {

  // Infos de l'autocomplete
  public readonly autocompleteMethod: InputSignal<AutocompleteMethod<T>> = input.required();
  public readonly autocompleteIdField: InputSignal<string> = input.required();
  public readonly autocompleteNameField: InputSignal<string> = input.required();

  // Label
  public readonly label: InputSignal<string | null> = input<string | null>(null);

  // Saisie de valeur
  public readonly value: ModelSignal<T | null> = model<T | null>(null);
  public readonly autocompleteFormControl: InputSignal<FormControl<FormControlValueType>> = input(new FormControl<FormControlValueType>(null));

  // ViewChild
  private readonly trigger: Signal<MatAutocompleteTrigger> = viewChild.required(MatAutocompleteTrigger);

  // Options de l'autocomplete
  protected readonly results: WritableSignal<T[]> = signal([]);

  constructor() {
    // Modification de la valeur dans le formControl
    effect((): void => {
      const value: T | null = this.value();
      untracked((): void => this.setValue(value));
    });

    const destroyRef: DestroyRef = inject(DestroyRef);

    afterNextRender((): void => {
      this.autocompleteFormControl().valueChanges
        .pipe(
          startWith(this.autocompleteFormControl().value), // Valeur initiale
          debounceTime(500), // Ne fait une nouvelle requête que toutes les 500 ms
          mergeMap((value: FormControlValueType): Observable<T[]> => {
            let stringValue: string | null;

            // Si la valeur n'est pas null et pas de type string
            if (!value) {
              stringValue = "";
            } else if (typeof value === 'string') {
              stringValue = value;
            } else {
              // Récupère la valeur affichée pour faire la recherche
              stringValue = value[this.autocompleteNameField()];
            }

            // Exécute la recherche
            return this.autocompleteMethod()(stringValue ?? "");
          }),
          takeUntilDestroyed(destroyRef))
        .subscribe((results: T[]): void => this.results.set(results));

      this.trigger().panelClosingActions.subscribe((event: MatOptionSelectionChange<any> | null): void => {
        // Si le panel n'est pas fermé suite à clic du bouton
        if (!event?.source) {
          const value: FormControlValueType = this.autocompleteFormControl().value;

          // Et que le type n'est pas un objet
          if (value === null || typeof value === "string") {
            // Réinitialiser la valeur
            this.autocompleteFormControl().setValue(null);
            this.emitValue(null);
          }
        }
      });
    })
  }

  private setValue(value: T | null): void {
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
  private emitValue(value: T | null): void {
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
  protected displayName(value: T | null): string {
    if (value === null) {
      return "";
    }

    return value[this.autocompleteNameField()] ?? "";
  }
}

type AutocompleteValueType = Record<string, any>;
type FormControlValueType = string | AutocompleteValueType | null;
