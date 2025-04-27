import {Component} from '@angular/core';
import {Column} from '../../../common/table/column/column';
import {Order} from '../../../common/search/filter';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {PieceService} from '../piece.service';
import {SearchRequest} from '../../../common/search/searchRequest';
import {Observable, of} from 'rxjs';
import {SearchResult} from '../../../common/search/searchResult';
import {TableComponent} from '../../../common/table/table.component';
import {PieceDialogComponent} from '../dialog/piece-dialog.component';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {MethodColumn} from '../../../common/table/column/method-column';
import {CategorieService} from '../../categorie/categorie.service';
import {Categorie} from '../../categorie/categorie.model';
import {Piece} from '../piece.model';
import {Model} from '../../../common/model';
import {PieceHistorique} from '../../piece-historique/piece-historique.model';
import {Router} from '@angular/router';

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
      .of(Piece.NUMERO_INVENTAIRE_LABEL, Piece.NUMERO_INVENTAIRE, "15%")
      .sort(Order.ASC)
      .inputFilterOnSameField(),
    ClassicColumn
      .of(Piece.NOM_LABEL, Piece.NOM, "15%")
      .sort()
      .inputFilterOnSameField(),
    ClassicColumn
      .of(Piece.DESCRIPTION_LABEL, Piece.DESCRIPTION, "15%"),
    ClassicColumn
      .of(Piece.CATEGORIE_LABEL, Piece.CATEGORIE_NOM, "15%")
      .sort()
      .autocompleteFilter(
        Piece.CATEGORIE.concat(".", Model.ID),
        this.autocompleteCategorie.bind(this),
        Model.ID,
        Categorie.NOM,
      ),
    ClassicColumn
      .of(Piece.PRIX_LABEL, Piece.PRIX, "10%")
      .sort(),
    ClassicColumn
      .of(Piece.QUANTITE_LABEL, Piece.QUANTITE, "10%")
      .sort(),
    MethodColumn
      .of(Piece.TOTAL_LABEL, Piece.TOTAL, "10%", this.calculateTotal.bind(this), Piece.QUANTITE, Piece.PRIX),
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: PieceDialogComponent,
    idField: Model.ID,
    clicOnLine: true,
    created: true,
    delete: true,
    modify: true,
    read: true,
    actions: [
      {
        name: "Voir l'historique",
        action: (element: PieceHistorique) => {
          this.router.navigate(['pieces', 'historique', element.id]).then();
          return of(false);
        }
      }
    ]
  };

  constructor(private readonly pieceService: PieceService,
              private readonly categorieService: CategorieService,
              private readonly router: Router) {}

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
