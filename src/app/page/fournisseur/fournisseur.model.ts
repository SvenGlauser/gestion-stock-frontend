import {Model} from '../../common/model';
import {Adresse} from '../adresse/adresse';

/**
 * Interface représentant un pays
 */
export interface Fournisseur extends Model {
  nom: string;
  description: string;
  url: boolean;
  adresse: Adresse;
}

// Field constantes
export const FOURNISSEUR_NOM = 'nom';
export const FOURNISSEUR_DESCRIPTION = 'description';
export const FOURNISSEUR_URL = 'url';
export const FOURNISSEUR_ADRESSE = 'adresse';

// Label constantes
export const FOURNISSEUR_NOM_LABEL = 'Nom';
export const FOURNISSEUR_DESCRIPTION_LABEL = 'Description';
export const FOURNISSEUR_URL_LABEL = 'Site internet';
export const FOURNISSEUR_ADRESSE_LABEL = 'Adresse';
