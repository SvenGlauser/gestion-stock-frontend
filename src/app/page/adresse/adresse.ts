import {Localite} from '../localite/localite.model';

export interface Adresse {
  rue: string;
  numero: string;
  localite: Localite;
}

export const ADRESSE_RUE = "rue";
export const ADRESSE_NUMERO = "numero";
export const ADRESSE_LOCALILTE = "localite";

export const ADRESSE_RUE_LABEL = "Rue";
export const ADRESSE_NUMERO_LABEL = "Numéro de rue";
export const ADRESSE_LOCALILTE_LABEL = "Localité";

export const PANEL_ADRESSE = "Données de l'adresse";

export const adresseToString: (adresse?: Adresse) => string = (adresse?: Adresse): string => {
  if (!adresse) {
    return "";
  }

  let adresseString = "";

  if (adresse.rue) {
    adresseString = adresseString.concat(adresse.rue, " ");
  }

  if (adresse.numero) {
    adresseString = adresseString.concat(adresse.numero);
  }

  if (adresse.localite) {
    if (adresseString) {
      adresseString = adresseString.concat("\n")
    }

    if (adresse.rue) {
      adresseString = adresseString.concat(adresse.localite.npa, " ");
    }

    if (adresse.numero) {
      adresseString = adresseString.concat(adresse.localite.nom);
    }
  }

  return adresseString;
}
