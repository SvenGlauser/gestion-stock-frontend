import {Model} from '../../common/model';

/**
 * Interface représentant un pays
 */
export interface Categorie extends Model {
  nom: string;
  description: string;
  actif: boolean;
}

// Field constantes
export const CATEGORIE_NOM = 'nom';
export const CATEGORIE_DESCRIPTION = 'description';
export const CATEGORIE_ACTIF = 'actif';

// Label constantes
export const CATEGORIE_NOM_LABEL = 'Nom';
export const CATEGORIE_DESCRIPTION_LABEL = 'Description';
export const CATEGORIE_ACTIF_LABEL = 'Active';
