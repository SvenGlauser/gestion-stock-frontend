import {Model} from '../common/model';
import {Pays} from '../pays/pays.model';

export interface Localite extends Model {
  nom: string;
  npa: string;
  pays: Pays;
}

export const LOCALITE_NOM: string = "nom";
export const LOCALITE_NPA: string = "npa";
export const LOCALITE_PAYS: string = "pays";

export const LOCALITE_NOM_LABEL: string = "Nom";
export const LOCALITE_NPA_LABEL: string = "Code postal";
export const LOCALITE_PAYS_LABEL: string = "Pays";
