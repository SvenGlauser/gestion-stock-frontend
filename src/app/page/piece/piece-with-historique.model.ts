import {Fournisseur} from '../fournisseur/fournisseur.model';
import {Categorie} from '../categorie/categorie.model';

/**
 * Class représentant une pièce
 */
export class PieceWithHistorique {

  // Label champ
  public static readonly ID = "id";
  public static readonly NUMERO_INVENTAIRE = 'numeroInventaire';
  public static readonly NOM = 'nom';
  public static readonly DESCRIPTION = 'description';
  public static readonly CATEGORIE = 'categorie';
  public static readonly CATEGORIE_NOM = this.CATEGORIE.concat(".", Categorie.NOM);
  public static readonly QUANTITE = 'quantite';
  public static readonly PRIX = 'prix';
  public static readonly QUANTITE_ENTREE = 'quantiteEntree';
  public static readonly QUANTITE_SORTIE = 'quantiteSortie';

  // Label constantes
  public static readonly NUMERO_INVENTAIRE_LABEL = "N° d'inventaire";
  public static readonly NOM_LABEL = 'Nom';
  public static readonly DESCRIPTION_LABEL = 'Description';
  public static readonly CATEGORIE_LABEL = 'Catégorie';
  public static readonly QUANTITE_LABEL = 'Quantité';
  public static readonly PRIX_LABEL = 'Prix';
  public static readonly QUANTITE_ENTREE_LABEL = 'Quantité entrée';
  public static readonly QUANTITE_SORTIE_LABEL = 'Quantité sortie';

  // Champs calculées
  public static readonly TOTAL = 'Valeur total';
  public static readonly TOTAL_LABEL = 'Valeur total';

  public id: number | null = null;

  public numeroInventaire: string | null = null;
  public nom: string | null = null;
  public description: string | null = null;

  public fournisseur: Fournisseur | null = null;

  public categorie: Categorie | null = null;

  public quantite: number | null = null;
  public prix: number | null = null;

  public quantiteEntree: number | null = null;
  public quantiteSortie: number | null = null;

  constructor(pieceWithHistorique?: PieceWithHistorique) {
    if (pieceWithHistorique) {
      this.id = pieceWithHistorique.id;
      this.numeroInventaire = pieceWithHistorique.numeroInventaire;
      this.nom = pieceWithHistorique.nom;
      this.description = pieceWithHistorique.description;
      if (pieceWithHistorique.fournisseur) {
        this.fournisseur = new Fournisseur(pieceWithHistorique.fournisseur);
      }
      if (pieceWithHistorique.categorie) {
        this.categorie = new Categorie(pieceWithHistorique.categorie);
      }
      this.quantite = pieceWithHistorique.quantite;
      this.prix = pieceWithHistorique.prix;
      this.quantiteEntree = pieceWithHistorique.quantiteEntree;
      this.quantiteSortie = pieceWithHistorique.quantiteSortie;
    }
  }
}
