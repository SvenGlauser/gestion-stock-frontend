import {Component} from '@angular/core';
import {Column} from '../../../common/table/column/column';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {PieceService} from '../piece.service';
import {Observable, of} from 'rxjs';
import {SearchResult} from '../../../common/search/search-result';
import {TableComponent} from '../../../common/table/table.component';
import {PieceDialogComponent} from '../dialog/piece-dialog.component';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {MethodColumn} from '../../../common/table/column/method-column';
import {CategorieService} from '../../categorie/categorie.service';
import {Categorie} from '../../categorie/categorie.model';
import {Model} from '../../../common/model';
import {PieceHistorique} from '../../piece-historique/piece-historique.model';
import {Router} from '@angular/router';
import {Roles} from '../../../security/roles';
import {PieceWithHistoriqueSearchQuery} from '../piece-with-historique.searchquery';
import {Direction} from '../../../common/search/api/search-field';
import {PieceWithHistorique} from '../piece-with-historique.model';

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
  protected columns: Column<PieceWithHistoriqueSearchQuery>[] = [
    ClassicColumn
      .of<PieceWithHistoriqueSearchQuery>(PieceWithHistorique.NUMERO_INVENTAIRE_LABEL, PieceWithHistorique.NUMERO_INVENTAIRE, 15)
      .sort(searchQuery => searchQuery.numeroInventaire)
      .inputFilter(searchQuery => searchQuery.numeroInventaire),
    ClassicColumn
      .of<PieceWithHistoriqueSearchQuery>(PieceWithHistorique.NOM_LABEL, PieceWithHistorique.NOM, 15)
      .sort(searchQuery => searchQuery.nom)
      .inputFilter(searchQuery => searchQuery.nom),
    ClassicColumn
      .of(PieceWithHistorique.DESCRIPTION_LABEL, PieceWithHistorique.DESCRIPTION, 15),
    ClassicColumn
      .of<PieceWithHistoriqueSearchQuery>(PieceWithHistorique.CATEGORIE_LABEL, PieceWithHistorique.CATEGORIE_NOM, 15)
      .sort(searchQuery => searchQuery.categorieNom)
      .autocompleteFilter(
        searchQuery => searchQuery.categorieId,
        this.autocompleteCategorie.bind(this),
        Model.ID,
        Categorie.NOM
      ),
    MethodColumn
      .of<PieceWithHistoriqueSearchQuery>(PieceWithHistorique.PRIX_LABEL, PieceWithHistorique.PRIX, 10, (piece) => piece + " CHF", PieceWithHistorique.PRIX)
      .sort(searchQuery => searchQuery.prix)
      .addStyle("text-align: right;"),
    ClassicColumn
      .of<PieceWithHistoriqueSearchQuery>(PieceWithHistorique.QUANTITE_LABEL, PieceWithHistorique.QUANTITE, 10)
      .sort(searchQuery => searchQuery.quantite),
    ClassicColumn
      .of<PieceWithHistoriqueSearchQuery>(PieceWithHistorique.QUANTITE_ENTREE_LABEL, PieceWithHistorique.QUANTITE_ENTREE, 10)
      .sort(searchQuery => searchQuery.quantiteEntree)
      .hide(),
    ClassicColumn
      .of<PieceWithHistoriqueSearchQuery>(PieceWithHistorique.QUANTITE_SORTIE_LABEL, PieceWithHistorique.QUANTITE_SORTIE, 10)
      .sort(searchQuery => searchQuery.quantiteSortie)
      .hide(),
    MethodColumn
      .of<PieceWithHistoriqueSearchQuery>(PieceWithHistorique.TOTAL_LABEL, PieceWithHistorique.TOTAL, 10, this.calculateTotal.bind(this), PieceWithHistorique.QUANTITE, PieceWithHistorique.PRIX)
      .addStyle("text-align: right;"),
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: PieceDialogComponent,
    idField: PieceWithHistorique.ID,
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
   * Récupère une nouvelle PieceWithHistoriqueSearchQuery
   */
  protected getSearchQueryMethod(): PieceWithHistoriqueSearchQuery {
    const pieceWithHistoriqueSearchQuery = new PieceWithHistoriqueSearchQuery();
    pieceWithHistoriqueSearchQuery.nom.order = Direction.ASC;
    return pieceWithHistoriqueSearchQuery;
  }

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchQuery SearchRequest
   */
  protected getUpdateMethod(searchQuery: PieceWithHistoriqueSearchQuery): Observable<SearchResult<PieceWithHistorique>> {
    return this.pieceService.searchWithHistorique(searchQuery);
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
