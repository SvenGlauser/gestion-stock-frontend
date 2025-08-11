import {
  afterNextRender,
  DestroyRef,
  Directive,
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
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {debounceTime, map, mergeMap, Observable, startWith} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatOptionSelectionChange} from '@angular/material/core';

@Directive()
export abstract class AbstractAutocompleteComponent<T> {

  // Label
  public readonly label: InputSignal<string | null> = input<string | null>(null);

  // Saisie de valeur
  public readonly value: ModelSignal<T | null> = model<T | null>(null);
  public readonly autocompleteFormControl: InputSignal<FormControl<string | T | null>> = input(new FormControl<string | T | null>(null));

  // ViewChild
  private readonly trigger: Signal<MatAutocompleteTrigger> = viewChild.required(MatAutocompleteTrigger);

  // Options de l'autocomplete
  protected readonly results: WritableSignal<T[]> = signal([]);

  public constructor() {
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
          map((value: string | T | null): string => {
            if (value === null) {
              return "";
            }

            if (typeof value === 'string') {
              return value.trim();
            }

            return this.stringify(value);
          }),
          mergeMap(this.autocomplete.bind(this)),
          takeUntilDestroyed(destroyRef))
        .subscribe((results: T[]): void => this.results.set(results));

      this.trigger().panelClosingActions.subscribe((event: MatOptionSelectionChange<any> | null): void => {
        // Si le panel n'est pas fermé suite à clic du bouton
        if (!event?.source) {
          const value: string | T | null = this.autocompleteFormControl().value;

          // Et que le type n'est pas un objet
          if (!this.isValidSelection(value)) {
            // Réinitialiser la valeur
            this.autocompleteFormControl().setValue(null);
            this.emitValue(null);
          }
        }
      });
    })
  }

  /**
   * Méthode de recherche de la valeur
   * @param value Valeur à rechercher
   */
  protected abstract autocomplete(value: string): Observable<T[]>;

  /**
   * Transforme l'objet en une chaîne de caractères
   * @param value Objet
   */
  protected abstract stringify(value: T | null): string;

  /**
   * Retourne un élément permettant de tracker un objet
   * @param value Objet
   */
  protected abstract track(value: T): any;

  /**
   * Est appelé pour mettre à jour la valeur sélectionné dans l'autocomplete
   * @param event Événement du <mat-autocomplete/>
   */
  protected selectValue(event: MatAutocompleteSelectedEvent): void {
    this.emitValue(event.option.value);
  }

  private setValue(value: T | null): void {
    if (this.autocompleteFormControl().value !== value) {
      this.autocompleteFormControl().setValue(value);
    }
  }

  private emitValue(value: T | null): void {
    untracked((): void => {
      if (value === this.value()) {
        return;
      }

      this.value.set(value);
    });
  }

  /**
   * Vérifie si la sélection est valide
   * @param value Valeur sélectionnée
   */
  protected isValidSelection(value: string | T | null): boolean {
    return value === null || typeof value === "string";
  }
}
