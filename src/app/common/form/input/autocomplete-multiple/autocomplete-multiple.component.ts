import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
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
import {debounceTime, mergeMap, of, startWith} from 'rxjs';
import {AutocompleteMethod} from '../autocomplete/autocomplete';

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
export class AutocompleteMultipleComponent<T extends Record<string, any>> implements OnInit, AfterViewInit, OnChanges {
  @Input({required: true})
  public autocompleteMethod: AutocompleteMethod<T> | null = null;
  @Input({required: true})
  public autocompleteIdField: string | null = null;
  @Input({required: true})
  public autocompleteNameFields: string[] = [];
  @Input({required: true})
  public separator: string = " / ";

  @Input()
  public label: string | null = null;

  @Input()
  public value: T | null = null;
  @Output()
  public valueChange: EventEmitter<T | null> = new EventEmitter<T | null>();

  @Input()
  public autocompleteFormControl = new FormControl<string | T | null>(null);

  @ViewChild(MatAutocompleteTrigger)
  public trigger: MatAutocompleteTrigger | null = null;

  protected results: T[] = [];

  /**
   * Initialise les events listeners
   */
  public ngOnInit(): void {
    // Sélectionne la valeur par défaut
    if (this.value) {
      this.autocompleteFormControl.setValue(this.value);
    }

    this.autocompleteFormControl.valueChanges.pipe(
      startWith(""), // Valeur initiale
      debounceTime(500), // Ne fait une nouvelle requête que toutes les 500 ms
      mergeMap(value => {
        // Si le composant n'est pas correctement initialisé
        if (!this.autocompleteMethod || !this.autocompleteIdField || this.autocompleteNameFields.length == 0) {
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
          stringValue = this.autocompleteNameFields.map(field => value[field]).join(this.separator);
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
        if (!this.autocompleteFormControl.value || typeof this.autocompleteFormControl.value === "string") {
          // Réinitialiser la valeur
          this.autocompleteFormControl.setValue(null);
          this.emitValue(null);
        }
      }
    });
  }

  /**
   * Catch les changements de valeur et update le formcontrol
   * @param changes Changement de valeur
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      if (this.autocompleteFormControl.value !== this.value) {
        this.autocompleteFormControl.setValue(this.value);
      }
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
    if (value === this.value) {
      return;
    }

    this.valueChange.emit(value);
  }

  /**
   * Récupère le nom pour l'affichage dans l'autocomplete
   * @param value Valeur
   */
  protected displayName(value: T): string {
    if (this.autocompleteNameFields.length == 0) {
      return "";
    }

    if (!value) {
      return "";
    }

    return this.autocompleteNameFields.map(field => value[field]).join(this.separator) ?? "";
  }
}
