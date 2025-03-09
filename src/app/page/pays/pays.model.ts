import {Model} from '../../common/model';

/**
 * Interface représentant un pays
 */
export interface Pays extends Model {
  nom: string;
  abreviation: string;
}

// Field constantes
export const PAYS_NOM = 'nom';
export const PAYS_ABREVIATION = 'abreviation';

// Label constantes
export const PAYS_NOM_LABEL = 'Nom';
export const PAYS_ABREVIATION_LABEL = 'Abréviation';
