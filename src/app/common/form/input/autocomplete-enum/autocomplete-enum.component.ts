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
import {debounceTime, map, startWith} from 'rxjs';
import {KeyValuePipe} from '@angular/common';

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
export class AutocompleteEnumComponent implements OnInit, AfterViewInit, OnChanges {
  @Input({required: true})
  public mapOfElements: Map<any, string> | null = null;

  @Input()
  public label: string | null = null;

  @Input()
  public value: any = null;
  @Output()
  public valueChange: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  public autocompleteFormControl = new FormControl<any>(null);

  @ViewChild(MatAutocompleteTrigger)
  public trigger: MatAutocompleteTrigger | null = null;

  protected results: Map<any, string> = new Map<any, string>();

  /**
   * Initialise les events listeners
   */
  public ngOnInit(): void {
    // Sélectionne la valeur par défaut
    if (this.value !== null) {
      this.autocompleteFormControl.setValue(this.value);
    }

    this.autocompleteFormControl.valueChanges.pipe(
      startWith(""), // Valeur initiale
      debounceTime(500), // Ne fait une nouvelle requête que toutes les 500 ms
      map(value => {
        // Si le composant n'est pas correctement initialisé
        if (!this.mapOfElements) {
          return new Map<any, string>();
        }

        let stringValue: string | null;

        // Si la valeur n'est pas null et pas de type string
        if (value === null) {
          stringValue = null;
        } else if (typeof value === 'string') {
          stringValue = value;
        } else {
          // Récupère la valeur affichée pour faire la recherche
          stringValue = this.mapOfElements.get(value) ?? null;
        }

        let result: Map<any, string> = new Map<any, string>();

        for (let [key, value] of this.mapOfElements) {
          if (value.toLowerCase().includes(stringValue?.toLowerCase() ?? "")) {
            result.set(key, value);
          }
        }

        // Exécute la recherche
        return result;
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
        if (this.autocompleteFormControl.value === null || typeof this.autocompleteFormControl.value === "string") {
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
  private emitValue(value: any): void {
    if (value === this.value) {
      return;
    }

    this.valueChange.emit(value);
  }

  /**
   * Récupère le nom pour l'affichage dans l'autocomplete
   * @param value Valeur
   */
  protected displayName(value: any): string {
    if (!this.mapOfElements) {
      return "";
    }

    if (value === null) {
      return "";
    }

    return this.mapOfElements.get(value) ?? "";
  }
}
