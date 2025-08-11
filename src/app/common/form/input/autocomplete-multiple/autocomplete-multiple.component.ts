import {
  afterNextRender,
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  InputSignal,
  model,
  ModelSignal,
  OnChanges,
  OnInit,
  Signal,
  signal,
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
import {debounceTime, mergeMap, Observable, startWith} from 'rxjs';
import {AutocompleteMethod} from '../autocomplete/autocomplete';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatOptionSelectionChange} from '@angular/material/core';

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
  templateUrl: './autocomplete-multiple.component.html',
  styleUrl: './autocomplete-multiple.component.scss'
})
export class AutocompleteMultipleComponent<T extends AutocompleteValueType> implements OnInit, AfterViewInit, OnChanges {
  // Infos autocomplete
  public autocompleteMethod: InputSignal<AutocompleteMethod<T>> = input.required();
  public autocompleteIdField: InputSignal<string> = input.required();
  public autocompleteNameFields: InputSignal<string[]> = input.required();
  public separator: InputSignal<string> = input(" / ");

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
              stringValue = this.getStringValueFromObject(value);
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
  protected displayName(value: T): string {
    if (this.autocompleteNameFields().length == 0) {
      return "";
    }

    if (!value) {
      return "";
    }

    return this.getStringValueFromObject(value);
  }

  private getStringValueFromObject(value: AutocompleteValueType): string {
    return this.autocompleteNameFields().map((field: string): void => value[field]).join(this.separator());
  }
}

type AutocompleteValueType = Record<string, any>;
type FormControlValueType = string | AutocompleteValueType | null;
