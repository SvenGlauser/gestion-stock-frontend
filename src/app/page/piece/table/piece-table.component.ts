import {Component} from '@angular/core';
import {Column} from '../../../common/table/column/column';
import {Order} from '../../../common/search/filter';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {MODEL_ID} from '../../../common/model';
import {PieceService} from '../piece.service';
import {SearchRequest} from '../../../common/search/searchRequest';
import {Observable} from 'rxjs';
import {SearchResult} from '../../../common/search/searchResult';
import {TableComponent} from '../../../common/table/table.component';
import {PieceDialogComponent} from '../dialog/piece-dialog.component';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {MethodColumn} from '../../../common/table/column/method-column';
import {
  Piece,
  PIECE_CATEGORIE,
  PIECE_CATEGORIE_LABEL,
  PIECE_DESCRIPTION,
  PIECE_DESCRIPTION_LABEL,
  PIECE_NOM,
  PIECE_NOM_LABEL,
  PIECE_NUMERO_INVENTAIRE,
  PIECE_NUMERO_INVENTAIRE_LABEL,
  PIECE_PRIX,
  PIECE_PRIX_LABEL,
  PIECE_QUANTITE,
  PIECE_QUANTITE_LABEL,
  PIECE_TOTAL,
  PIECE_TOTAL_LABEL
} from '../piece.model';
import {CategorieService} from '../../categorie/categorie.service';
import {Categorie, CATEGORIE_NOM} from '../../categorie/categorie.model';

@Component({
  selector: 'app-piece-table',
  imports: [
    TableComponent
  ],
  templateUrl: './piece-table.component.html',
  styleUrl: './piece-table.component.scss'
})
export class PieceTableComponent {
  // Définition des colonnes
  protected readonly columns: Column[] = [
    ClassicColumn
      .of(PIECE_NUMERO_INVENTAIRE_LABEL, PIECE_NUMERO_INVENTAIRE, "10%")
      .sort(Order.ASC)
      .inputFilterOnSameField(),
    ClassicColumn
      .of(PIECE_NOM_LABEL, PIECE_NOM, "15%")
      .sort()
      .inputFilterOnSameField(),
    ClassicColumn
      .of(PIECE_DESCRIPTION_LABEL, PIECE_DESCRIPTION, "20%"),
    ClassicColumn
      .of(PIECE_CATEGORIE_LABEL, PIECE_CATEGORIE.concat(".", CATEGORIE_NOM), "15%")
      .sort()
      .autocompleteFilter(
        PIECE_CATEGORIE.concat(".", MODEL_ID),
        this.autocompleteCategorie.bind(this),
        MODEL_ID,
        CATEGORIE_NOM,
      ),
    ClassicColumn
      .of(PIECE_PRIX_LABEL, PIECE_PRIX, "10%")
      .sort(),
    ClassicColumn
      .of(PIECE_QUANTITE_LABEL, PIECE_QUANTITE, "10%")
      .sort(),
    MethodColumn
      .of(PIECE_TOTAL_LABEL, PIECE_TOTAL, "10%", this.calculateTotal.bind(this), PIECE_QUANTITE, PIECE_PRIX),
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: PieceDialogComponent,
    idField: MODEL_ID,
    clicOnLine: true,
    created: true,
    delete: true,
    modify: true,
    read: true
  };

  constructor(private readonly pieceService: PieceService,
              private readonly categorieService: CategorieService) {}

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: SearchRequest): Observable<SearchResult<Piece>> {
    return this.pieceService.search(searchRequest);
  }

  /**
   * Colonne calculé du prix total
   * @param quantite Quantité
   * @param prix Prix
   */
  private calculateTotal(quantite: number, prix: number): string {
    return (quantite * prix).toFixed(2) + " CHF";
  }

  /**
   * Méthode d'autocomplétion des catégories
   * @param value Valeur de recherche
   */
  private autocompleteCategorie(value: string): Observable<Categorie[]> {
    return this.categorieService.autocomplete(value);
  }
}
