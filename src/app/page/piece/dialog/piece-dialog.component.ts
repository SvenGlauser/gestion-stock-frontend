import {Component} from '@angular/core';
import {AbstractFormDialogComponent} from '../../../common/form/dialog/abstract-form-dialog.component';
import {MODEL_ID, PANEL_DONNEES_GENERALES} from '../../../common/model';
import {FormField} from '../../../common/form/field/form-field';
import {Observable} from 'rxjs';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {FormComponent} from '../../../common/form/form.component';
import {PieceService} from '../piece.service';
import {
  PANEL_INFORMATIONS_FOURNISSEUR,
  PANEL_INFORMATIONS_VENTE,
  Piece,
  PIECE_CATEGORIE,
  PIECE_CATEGORIE_LABEL,
  PIECE_DESCRIPTION,
  PIECE_DESCRIPTION_LABEL,
  PIECE_FOURNISSEUR,
  PIECE_FOURNISSEUR_LABEL,
  PIECE_NOM,
  PIECE_NOM_LABEL,
  PIECE_NUMERO_FOURNISSEUR,
  PIECE_NUMERO_FOURNISSEUR_LABEL,
  PIECE_NUMERO_INVENTAIRE,
  PIECE_NUMERO_INVENTAIRE_LABEL,
  PIECE_PRIX,
  PIECE_PRIX_LABEL,
  PIECE_QUANTITE,
  PIECE_QUANTITE_LABEL
} from '../piece.model';
import {InputFormField} from '../../../common/form/field/input-form-field';
import {Fournisseur, FOURNISSEUR_NOM} from '../../fournisseur/fournisseur.model';
import {AutocompleteFormField} from '../../../common/form/field/autocomplete-form-field';
import {Categorie, CATEGORIE_NOM} from '../../categorie/categorie.model';
import {CategorieService} from '../../categorie/categorie.service';
import {FournisseurService} from '../../fournisseur/fournisseur.service';

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
  // Constantes
  protected readonly ID_FIELD: string = MODEL_ID;

  // Définition des champs de formulaire
  protected formsMap: Map<string, FormField[]> = new Map([
    [
      PANEL_DONNEES_GENERALES,
      [
        InputFormField
          .ofValue(PIECE_NUMERO_INVENTAIRE_LABEL, PIECE_NUMERO_INVENTAIRE),
        AutocompleteFormField
          .ofValue(
            PIECE_CATEGORIE_LABEL,
            PIECE_CATEGORIE,
            this.autocompleteCategorie.bind(this),
            MODEL_ID,
            CATEGORIE_NOM,
          ),
        InputFormField
          .ofValue(PIECE_NOM_LABEL, PIECE_NOM)
          .setColspan(2),
        InputFormField
          .ofValue(PIECE_DESCRIPTION_LABEL, PIECE_DESCRIPTION)
          .setColspan(2),
      ],
    ], [
      PANEL_INFORMATIONS_FOURNISSEUR,
      [
        InputFormField
          .ofValue(PIECE_NUMERO_FOURNISSEUR_LABEL, PIECE_NUMERO_FOURNISSEUR),
        AutocompleteFormField
          .ofValue(
            PIECE_FOURNISSEUR_LABEL,
            PIECE_FOURNISSEUR,
            this.autocompleteFournisseur.bind(this),
            MODEL_ID,
            FOURNISSEUR_NOM,
          ),
      ],
    ], [
      PANEL_INFORMATIONS_VENTE,
      [
        InputFormField
          .ofValue(PIECE_QUANTITE_LABEL, PIECE_QUANTITE),
        InputFormField
          .ofValue(PIECE_PRIX_LABEL, PIECE_PRIX),
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
