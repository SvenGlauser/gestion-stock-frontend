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
import {AutocompleteEnumFormField} from '../../../common/form/field/autocomplete-enum-form-field';
import {TitreEnumValuesForAutocomplete} from '../titre.enum';
import {PersonnePhysique} from '../personne-physique.model';
import {PersonnePhysiqueService} from '../personne-physique.service';

@Component({
  selector: 'app-personne-physique-dialog',
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
export class PersonnePhysiqueDialogComponent extends AbstractFormDialogComponent<PersonnePhysiqueDialogComponent, PersonnePhysique> {
  // Constantes
  protected readonly ID_FIELD: string = Model.ID;

  // Définition des champs de formulaire
  protected formsMap: Map<string, FormField[]> = new Map([
    [
      PersonnePhysique.PANEL_DONNEES_GENERALES,
      [
        AutocompleteEnumFormField
          .ofValue(PersonnePhysique.TITRE_LABEL, PersonnePhysique.TITRE)
          .addValues(TitreEnumValuesForAutocomplete)
          .setColspan(2),
        InputFormField.ofValue(PersonnePhysique.NOM_LABEL, PersonnePhysique.NOM),
        InputFormField.ofValue(PersonnePhysique.PRENOM_LABEL, PersonnePhysique.PRENOM),
      ],
    ], [
      PersonnePhysique.PANEL_INFORMATIONS_IDENTITE,
      [
        InputFormField.ofValue(PersonnePhysique.EMAIL_LABEL, PersonnePhysique.EMAIL),
        InputFormField.ofValue(PersonnePhysique.TELEPHONE_LABEL, PersonnePhysique.TELEPHONE),
      ],
    ], [
      Adresse.PANEL_ADRESSE,
      [
        InputFormField.ofValue(Adresse.RUE_LABEL, PersonnePhysique.ADRESSE_RUE),
        InputFormField.ofValue(Adresse.NUMERO_LABEL, PersonnePhysique.ADRESSE_NUMERO),
        AutocompleteFormField
          .ofValue(
            Adresse.LOCALILTE_LABEL,
            PersonnePhysique.ADRESSE_LOCALITE,
            this.autocompleteLocalite.bind(this),
            Model.ID,
            Localite.NOM,
          )
          .setColspan(2),
      ],
    ], [
      PersonnePhysique.PANEL_INFORMATIONS_SUPPLEMENTAIRES,
      [
        InputFormField
          .ofValue(PersonnePhysique.REMARQUES_LABEL, PersonnePhysique.REMARQUES)
          .setColspan(2),
      ]
    ]
  ]);

  constructor(private readonly personnePhysiqueService: PersonnePhysiqueService,
              private readonly localiteService: LocaliteService) {
    super();
  }

  protected getDataMethod(id: number): Observable<PersonnePhysique> {
    return this.personnePhysiqueService.get(id);
  }

  protected deleteDataMethod(id: number): Observable<void> {
    return this.personnePhysiqueService.delete(id);
  }

  protected createDataMethod(personnePhysique: PersonnePhysique): Observable<PersonnePhysique> {
    personnePhysique.identiteType = "PERSONNE_PHYSIQUE";
    return this.personnePhysiqueService.create(personnePhysique);
  }

  protected modifyDataMethod(personnePhysique: PersonnePhysique): Observable<PersonnePhysique> {
    return this.personnePhysiqueService.modify(personnePhysique);
  }

  /**
   * Méthode d'autocomplétion des localités
   * @param value Valeur de recherche
   */
  protected autocompleteLocalite(value: string): Observable<Localite[]> {
    return this.localiteService.autocomplete(value);
  }
}
