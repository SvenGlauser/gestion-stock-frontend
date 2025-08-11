import {Component} from '@angular/core';
import {AbstractFormDialogComponent} from '../../../common/form/dialog/abstract-form-dialog.component';
import {FormField} from '../../../common/form/field/form-field';
import {Observable, of} from 'rxjs';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {FormComponent} from '../../../common/form/form.component';
import {PieceHistoriqueService} from '../piece-historique.service';
import {InputFormField} from '../../../common/form/field/input-form-field';
import {AutocompleteEnumFormField} from '../../../common/form/field/autocomplete-enum-form-field';
import {PieceHistorique} from '../piece-historique.model';
import {PieceHistoriqueTypeEnumValuesForAutocomplete} from '../piece-historique-type.enum';
import {PieceHistoriqueSourceEnumValuesForAutocomplete} from '../piece-historique-source.enum';

@Component({
  selector: 'app-piece-historique-dialog',
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
export class PieceHistoriqueDialogComponent extends AbstractFormDialogComponent<PieceHistoriqueDialogComponent, PieceHistorique> {
  // Définition des champs de formulaire
  protected readonly formsMap: Map<string, FormField[]> = new Map([
    [
      PieceHistorique.PANEL_DONNEES_GENERALES,
      [
        AutocompleteEnumFormField
          .ofValue(PieceHistorique.TYPE_LABEL, PieceHistorique.TYPE)
          .addValues(PieceHistoriqueTypeEnumValuesForAutocomplete),
        AutocompleteEnumFormField
          .ofValue(PieceHistorique.SOURCE_LABEL, PieceHistorique.SOURCE)
          .addValues(PieceHistoriqueSourceEnumValuesForAutocomplete),
        InputFormField.ofValue(PieceHistorique.HEURE_LABEL, PieceHistorique.HEURE),
        InputFormField.ofValue(PieceHistorique.DIFFERENCE_LABEL, PieceHistorique.DIFFERENCE),
      ]
    ]
  ]);

  constructor(private readonly pieceHistoriqueService: PieceHistoriqueService) {
    super();
  }

  protected getDataMethod(id: number): Observable<PieceHistorique> {
    return this.pieceHistoriqueService.get(id);
  }

  protected deleteDataMethod(id: number): Observable<void> {
    return this.pieceHistoriqueService.delete(id);
  }

  protected createDataMethod(_pieceHistorique: PieceHistorique): Observable<PieceHistorique> {
    return of();
  }

  protected modifyDataMethod(_pieceHistorique: PieceHistorique): Observable<PieceHistorique> {
    return of();
  }
}
