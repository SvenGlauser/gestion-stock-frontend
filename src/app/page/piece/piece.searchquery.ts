import {SearchQuery} from '../../common/search/custom/search-query';
import {SearchField} from '../../common/search/api/search-field';
import {CustomSearchField} from '../../common/search/custom/custom-search-field';

/**
 * Class représentant une recherche de pièce
 */
export class PieceSearchQuery extends SearchQuery {
  public numeroInventaire: SearchField<string>;
  public nom: SearchField<string>;
  public categorieId: SearchField<number>;
  public categorieNom: SearchField<string>;
  public prix: SearchField<number>;
  public quantite: SearchField<number>;

  constructor() {
    super();
    this.numeroInventaire = CustomSearchField.of();
    this.nom = CustomSearchField.of();
    this.categorieId = CustomSearchField.of();
    this.categorieNom = CustomSearchField.of();
    this.prix = CustomSearchField.of();
    this.quantite = CustomSearchField.of();
  }
}
