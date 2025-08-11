import {Component} from '@angular/core';
import {AbstractFormDialogComponent} from '../../../common/form/dialog/abstract-form-dialog.component';
import {FormField} from '../../../common/form/field/form-field';
import {Observable} from 'rxjs';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {FormComponent} from '../../../common/form/form.component';
import {PieceService} from '../piece.service';
import {InputFormField} from '../../../common/form/field/input-form-field';
import {Fournisseur} from '../../fournisseur/fournisseur.model';
import {AutocompleteFormField} from '../../../common/form/field/autocomplete-form-field';
import {Categorie} from '../../categorie/categorie.model';
import {CategorieService} from '../../categorie/categorie.service';
import {FournisseurService} from '../../fournisseur/fournisseur.service';
import {Piece} from '../piece.model';
import {Model} from '../../../common/model';
import {NumberFormField} from '../../../common/form/field/number-form-field';

@Component({
  selector: 'app-piece-dialog',
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
export class PieceDialogComponent extends AbstractFormDialogComponent<PieceDialogComponent, Piece> {
  // Définition des champs de formulaire
  protected formsMap: Map<string, FormField[]> = new Map([
    [
      Piece.PANEL_DONNEES_GENERALES,
      [
        InputFormField
          .ofValue(Piece.NOM_LABEL, Piece.NOM),
        AutocompleteFormField
          .ofValue(
            Piece.CATEGORIE_LABEL,
            Piece.CATEGORIE,
            this.autocompleteCategorie.bind(this),
            Model.ID,
            Categorie.NOM,
          ),
        InputFormField
          .ofValue(Piece.DESCRIPTION_LABEL, Piece.DESCRIPTION)
          .setColspan(2),
      ],
    ], [
      Piece.PANEL_INFORMATIONS_FOURNISSEUR,
      [
        InputFormField
          .ofValue(Piece.NUMERO_INVENTAIRE_LABEL, Piece.NUMERO_INVENTAIRE),
        AutocompleteFormField
          .ofValue(
            Piece.FOURNISSEUR_LABEL,
            Piece.FOURNISSEUR,
            this.autocompleteFournisseur.bind(this),
            Model.ID,
            Fournisseur.NOM,
          ),
      ],
    ], [
      Piece.PANEL_INFORMATIONS_VENTE,
      [
        NumberFormField
          .ofValue(Piece.QUANTITE_LABEL, Piece.QUANTITE),
        NumberFormField
          .ofValue(Piece.PRIX_LABEL, Piece.PRIX)
          .withDecimal(),
      ]
    ]
  ]);

  constructor(private readonly pieceService: PieceService,
              private readonly categorieService: CategorieService,
              private readonly fournisseurService: FournisseurService) {
    super();
  }

  protected getDataMethod(id: number): Observable<Piece> {
    return this.pieceService.get(id);
  }

  protected deleteDataMethod(id: number): Observable<void> {
    return this.pieceService.delete(id);
  }

  protected createDataMethod(piece: Piece): Observable<Piece> {
    return this.pieceService.create(piece);
  }

  protected modifyDataMethod(piece: Piece): Observable<Piece> {
    return this.pieceService.modify(piece);
  }

  /**
   * Méthode d'autocomplétion des catégories
   * @param value Valeur de recherche
   */
  private autocompleteCategorie(value: string): Observable<Categorie[]> {
    return this.categorieService.autocomplete(value);
  }

  /**
   * Méthode d'autocomplétion des fournisseurs
   * @param value Valeur de recherche
   */
  private autocompleteFournisseur(value: string): Observable<Fournisseur[]> {
    return this.fournisseurService.autocomplete(value);
  }
}
