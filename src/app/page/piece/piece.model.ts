import {Model} from '../../common/model';
import {Fournisseur} from '../fournisseur/fournisseur.model';
import {Categorie} from '../categorie/categorie.model';

/**
 * Interface représentant une pièce
 */
export interface Piece extends Model {
  numeroInventaire: string;
  nom: string;
  description: string | null;

  numeroFournisseur: string | null;
  fournisseur: Fournisseur | null;

  categorie: Categorie | null;

  quantite: number;
  prix: number;
}

// Field constantes
export const PIECE_NUMERO_INVENTAIRE = 'numeroInventaire';
export const PIECE_NOM = 'nom';
export const PIECE_DESCRIPTION = 'description';
export const PIECE_NUMERO_FOURNISSEUR = 'numeroFournisseur';
export const PIECE_FOURNISSEUR = 'fournisseur';
export const PIECE_CATEGORIE = 'categorie';
export const PIECE_QUANTITE = 'quantite';
export const PIECE_PRIX = 'prix';

// Label constantes
export const PIECE_NUMERO_INVENTAIRE_LABEL = "N° d'inventaire";
export const PIECE_NOM_LABEL = 'Nom';
export const PIECE_DESCRIPTION_LABEL = 'Description';
export const PIECE_NUMERO_FOURNISSEUR_LABEL = 'N° du fournisseur';
export const PIECE_FOURNISSEUR_LABEL = 'Fournisseur';
export const PIECE_CATEGORIE_LABEL = 'Catégorie';
export const PIECE_QUANTITE_LABEL = 'Quantité';
export const PIECE_PRIX_LABEL = 'Prix';

// Champs calculées
export const PIECE_TOTAL = 'total';
export const PIECE_TOTAL_LABEL = 'Valeur total';

// Constantes pour les panels
export const PANEL_INFORMATIONS_FOURNISSEUR = 'Informations du fournisseur';
export const PANEL_INFORMATIONS_VENTE = 'Informations de vente';
