import {Component} from '@angular/core';
import {Column} from '../../../common/table/column/column';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {PieceService} from '../piece.service';
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
import {Roles} from '../../../security/roles';
import {PieceSearchQuery} from '../piece.searchquery';
import {Direction} from '../../../common/search/api/search-field';

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
  protected readonly columns: Column<PieceSearchQuery>[] = [
    ClassicColumn
      .of<PieceSearchQuery>(Piece.NUMERO_INVENTAIRE_LABEL, Piece.NUMERO_INVENTAIRE, "15%")
      .sort(searchQuery => searchQuery.numeroInventaire)
      .inputFilter(searchQuery => searchQuery.numeroInventaire),
    ClassicColumn
      .of<PieceSearchQuery>(Piece.NOM_LABEL, Piece.NOM, "15%")
      .sort(searchQuery => searchQuery.nom)
      .inputFilter(searchQuery => searchQuery.nom),
    ClassicColumn
      .of(Piece.DESCRIPTION_LABEL, Piece.DESCRIPTION, "15%"),
    ClassicColumn
      .of<PieceSearchQuery>(Piece.CATEGORIE_LABEL, Piece.CATEGORIE_NOM, "15%")
      .sort(searchQuery => searchQuery.categorieNom)
      .autocompleteFilter(
        searchQuery => searchQuery.categorieId,
        this.autocompleteCategorie.bind(this),
        Model.ID,
        Categorie.NOM
      ),
    MethodColumn
      .of<PieceSearchQuery>(Piece.PRIX_LABEL, Piece.PRIX, "10%", (piece) => piece + " CHF", Piece.PRIX)
      .sort(searchQuery => searchQuery.prix)
      .addStyle("text-align: right;"),
    ClassicColumn
      .of<PieceSearchQuery>(Piece.QUANTITE_LABEL, Piece.QUANTITE, "10%")
      .sort(searchQuery => searchQuery.quantite),
    MethodColumn
      .of<PieceSearchQuery>(Piece.TOTAL_LABEL, Piece.TOTAL, "10%", this.calculateTotal.bind(this), Piece.QUANTITE, Piece.PRIX)
      .addStyle("text-align: right;"),
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
              private readonly router: Router) {
  }

  /**
   * Récupère une nouvelle PieceSearchQuery
   */
  protected getSearchQueryMethod(): PieceSearchQuery {
    const pieceSearchQuery = new PieceSearchQuery();
    pieceSearchQuery.nom.order = Direction.ASC;
    return pieceSearchQuery;
  }

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchQuery SearchRequest
   */
  protected getUpdateMethod(searchQuery: PieceSearchQuery): Observable<SearchResult<Piece>> {
    return this.pieceService.search(searchQuery);
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

  protected readonly Roles = Roles;
}
