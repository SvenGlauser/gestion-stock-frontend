import {Localite} from '../localite/localite.model';

export class Adresse {

  public static readonly RUE = "rue";
  public static readonly NUMERO = "numero";
  public static readonly LOCALILTE = "localite";

  public static readonly RUE_LABEL = "Rue";
  public static readonly NUMERO_LABEL = "Numéro de rue";
  public static readonly LOCALILTE_LABEL = "Localité";

  public static readonly PANEL_ADRESSE = "Données de l'adresse";

  public rue: string | null = null;
  public numero: string | null = null;
  public localite: Localite | null = null;

  constructor(adresse?: Adresse) {
    if (adresse) {
      this.rue = adresse.rue;
      this.numero = adresse.numero;
      if (adresse.localite) {
        this.localite = new Localite(adresse.localite);
      }
    }
  }

  public static adresseToString(adresse: Adresse | null): string {
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

      if (adresse.localite.npa) {
        adresseString = adresseString.concat(adresse.localite.npa, " ");
      }

      if (adresse.localite.nom) {
        adresseString = adresseString.concat(adresse.localite.nom);
      }
    }

    return adresseString;
  }
}
