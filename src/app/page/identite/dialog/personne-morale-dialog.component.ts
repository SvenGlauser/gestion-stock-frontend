import {Component} from '@angular/core';
import {AbstractFormDialogComponent} from '../../../common/form/dialog/abstract-form-dialog.component';
import {Model} from '../../../common/model';
import {FormField} from '../../../common/form/field/form-field';
import {Observable} from 'rxjs';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {FormComponent} from '../../../common/form/form.component';
import {LocaliteService} from '../../localite/localite.service';
import {Localite} from '../../localite/localite.model';
import {Adresse} from '../../adresse/adresse';
import {InputFormField} from '../../../common/form/field/input-form-field';
import {AutocompleteFormField} from '../../../common/form/field/autocomplete-form-field';
import {PersonneMorale} from '../personne-morale.model';
import {PersonneMoraleService} from '../personne-morale.service';
import {IdentiteType} from '../identite.model';
import {Roles} from '../../../security/roles';

@Component({
  selector: 'app-personne-morale-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    FormsModule,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    ReactiveFormsModule,
    FormComponent
  ],
  templateUrl: '../../../common/form/dialog/abstract-form-dialog.component.html',
  styleUrl: '../../../common/form/dialog/abstract-form-dialog.component.scss'
})
export class PersonneMoraleDialogComponent extends AbstractFormDialogComponent<PersonneMoraleDialogComponent, PersonneMorale> {
  // Définition des champs de formulaire
  protected readonly formsMap: Map<string, FormField[]> = new Map([
    [
      PersonneMorale.PANEL_DONNEES_GENERALES,
      [
        InputFormField
          .ofValue(PersonneMorale.RAISON_SOCIALE_LABEL, PersonneMorale.RAISON_SOCIALE)
          .setColspan(2),
      ],
    ], [
      PersonneMorale.PANEL_INFORMATIONS_IDENTITE,
      [
        InputFormField.ofValue(PersonneMorale.EMAIL_LABEL, PersonneMorale.EMAIL),
        InputFormField.ofValue(PersonneMorale.TELEPHONE_LABEL, PersonneMorale.TELEPHONE),
      ],
    ], [
      Adresse.PANEL_ADRESSE,
      [
        InputFormField.ofValue(Adresse.RUE_LABEL, PersonneMorale.ADRESSE_RUE),
        InputFormField.ofValue(Adresse.NUMERO_LABEL, PersonneMorale.ADRESSE_NUMERO),
        AutocompleteFormField
          .ofValue(
            Adresse.LOCALILTE_LABEL,
            PersonneMorale.ADRESSE_LOCALITE,
            this.autocompleteLocalite.bind(this),
            Model.ID,
            Localite.NOM,
          )
          .setColspan(2),
      ],
    ], [
      PersonneMorale.PANEL_INFORMATIONS_SUPPLEMENTAIRES,
      [
        InputFormField
          .ofValue(PersonneMorale.REMARQUES_LABEL, PersonneMorale.REMARQUES)
          .setColspan(2),
      ]
    ]
  ]);

  constructor(private readonly personneMoraleService: PersonneMoraleService,
              private readonly localiteService: LocaliteService) {
    super();
  }

  protected getDataMethod(id: number): Observable<PersonneMorale> {
    return this.personneMoraleService.get(id);
  }

  protected deleteDataMethod(id: number): Observable<void> {
    return this.personneMoraleService.delete(id);
  }

  protected createDataMethod(personneMorale: PersonneMorale): Observable<PersonneMorale> {
    personneMorale.identiteType = IdentiteType.PERSONNE_MORALE;
    return this.personneMoraleService.create(personneMorale);
  }

  protected modifyDataMethod(personneMorale: PersonneMorale): Observable<PersonneMorale> {
    return this.personneMoraleService.modify(personneMorale);
  }

  /**
   * Méthode d'autocomplétion des localités
   * @param value Valeur de recherche
   */
  protected autocompleteLocalite(value: string): Observable<Localite[]> {
    return this.localiteService.autocomplete(value);
  }

  protected override readAccess(): Roles {
    return Roles.R_IDENTITE_LECTEUR;
  }

  protected override editAccess(): Roles {
    return Roles.R_IDENTITE_EDITEUR;
  }
}
