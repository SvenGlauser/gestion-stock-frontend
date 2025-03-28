import {Model} from '../../common/model';
import {Fournisseur} from '../fournisseur/fournisseur.model';
import {Categorie} from '../categorie/categorie.model';

/**
 * Class représentant une pièce
 */
export class Piece extends Model {

  // Field constantes
  public static readonly NUMERO_INVENTAIRE = 'numeroInventaire';
  public static readonly NOM = 'nom';
  public static readonly DESCRIPTION = 'description';
  public static readonly NUMERO_FOURNISSEUR = 'numeroFournisseur';
  public static readonly FOURNISSEUR = 'fournisseur';
  public static readonly CATEGORIE = 'categorie';
  public static readonly CATEGORIE_NOM = this.CATEGORIE.concat(".", Categorie.NOM);
  public static readonly QUANTITE = 'quantite';
  public static readonly PRIX = 'prix';

  // Label constantes
  public static readonly NUMERO_INVENTAIRE_LABEL = "N° d'inventaire";
  public static readonly NOM_LABEL = 'Nom';
  public static readonly DESCRIPTION_LABEL = 'Description';
  public static readonly NUMERO_FOURNISSEUR_LABEL = 'N° du fournisseur';
  public static readonly FOURNISSEUR_LABEL = 'Fournisseur';
  public static readonly CATEGORIE_LABEL = 'Catégorie';
  public static readonly QUANTITE_LABEL = 'Quantité';
  public static readonly PRIX_LABEL = 'Prix';

  // Champs calculées
  public static readonly TOTAL = 'total';
  public static readonly TOTAL_LABEL = 'Valeur total';

  // Constantes pour les panels
  public static readonly PANEL_INFORMATIONS_FOURNISSEUR = 'Informations du fournisseur';
  public static readonly PANEL_INFORMATIONS_VENTE = 'Informations de vente';

  public numeroInventaire: string | null = null;
  public nom: string | null = null;
  public description: string | null = null;

  public numeroFournisseur: string | null = null;
  public fournisseur: Fournisseur | null = null;

  public categorie: Categorie | null = null;

  public quantite: number | null = null;
  public prix: number | null = null;

  constructor(piece?: Piece) {
    super(piece);

    if (piece) {
      this.numeroInventaire = piece.numeroInventaire;
      this.nom = piece.nom;
      this.description = piece.description;
      this.numeroFournisseur = piece.numeroFournisseur;
      if (piece.fournisseur) {
        this.fournisseur = new Fournisseur(piece.fournisseur);
      }
      if (piece.categorie) {
        this.categorie = new Categorie(piece.categorie);
      }
      this.quantite = piece.quantite;
      this.prix = piece.prix;
    }
  }
}
