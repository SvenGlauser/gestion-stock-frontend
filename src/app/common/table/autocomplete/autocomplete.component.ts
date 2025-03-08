import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatFormField} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption
} from '@angular/material/autocomplete';
import {AutocompleteMethod} from './autocomplete';
import {MatInput} from '@angular/material/input';
import {debounceTime, mergeMap, of, startWith} from 'rxjs';

@Component({
  selector: 'app-autocomplete',
  imports: [
    MatFormField,
    FormsModule,
    MatInput,
    ReactiveFormsModule,
    MatAutocomplete,
    MatOption,
    MatAutocompleteTrigger
  ],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss'
})
export class AutocompleteComponent<T extends Record<string, any>> implements OnInit, AfterViewInit {
  @Input({required: true})
  public autocompleteMethod: AutocompleteMethod<T> | null = null;
  @Input({required: true})
  public autocompleteIdField: string | null = null;
  @Input({required: true})
  public autocompleteNameField: string | null = null;

  @Input()
  public value: T | null = null; // FIXME à implémenter
  @Output()
  public valueChange: EventEmitter<T | null> = new EventEmitter<T | null>();

  @ViewChild(MatAutocompleteTrigger)
  public trigger: MatAutocompleteTrigger | null = null;

  protected autoCompleteFormControl = new FormControl<string | T | null>(null);

  protected results: T[] = [];

  /**
   * Initialise les events listeners
   */
  public ngOnInit(): void {
    this.autoCompleteFormControl.valueChanges.pipe(
      startWith(""), // Valeur initiale
      debounceTime(500), // Ne fait une nouvelle requête que toutes les 500 ms
      mergeMap(value => {
        // Si le composant n'est pas correctement initialisé
        if (!this.autocompleteMethod || !this.autocompleteIdField || !this.autocompleteNameField) {
          return of([]);
        }

        let stringValue: string | null;

        // Si la valeur n'est pas null et pas de type string
        if (!value) {
          stringValue = "";
        } else if (typeof value === 'string') {
          stringValue = value;
        } else {
          // Récupère la valeur affichée pour faire la recherche
          stringValue = value[this.autocompleteNameField];
        }

        // Exécute la recherche
        return this.autocompleteMethod(stringValue ?? "");
      }))
      .subscribe(result => this.results = result);
  }

  /**
   * Initialise les events listeners
   */
  public ngAfterViewInit(): void {
    this.trigger!.panelClosingActions.subscribe((event) => {
      // Si le panel n'est pas fermé suite à clic du bouton
      if (!event?.source) {

        // Et que le type n'est pas un objet
        if (!this.autoCompleteFormControl.value || typeof this.autoCompleteFormControl.value === "string") {
          // Réinitialiser la valeur
          this.autoCompleteFormControl.setValue(null);
          this.valueChange.emit(null);
        }
      }
    });
  }

  /**
   * Est appelé pour mettre à jour la valeur sélectionné dans l'autocomplete
   * @param event Événement du <mat-autocomplete/>
   */
  protected selectValue(event: MatAutocompleteSelectedEvent): void {
    this.valueChange.emit(event.option.value);
  }

  /**
   * Récupère le nom pour l'affichage dans l'autocomplete
   * @param value Valeur
   */
  protected displayName(value: T): string {
    if (!this.autocompleteNameField) {
      return "";
    }

    if (!value) {
      return "";
    }

    return value[this.autocompleteNameField] ?? "";
  }
}
