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

  public adresseToString(): string {
    let adresseString = "";

    if (this.rue) {
      adresseString = adresseString.concat(this.rue, " ");
    }

    if (this.numero) {
      adresseString = adresseString.concat(this.numero);
    }

    if (this.localite) {
      if (adresseString) {
        adresseString = adresseString.concat("\n")
      }

      if (this.localite.npa) {
        adresseString = adresseString.concat(this.localite.npa, " ");
      }

      if (this.localite.nom) {
        adresseString = adresseString.concat(this.localite.nom);
      }
    }

    return adresseString;
  }
}
