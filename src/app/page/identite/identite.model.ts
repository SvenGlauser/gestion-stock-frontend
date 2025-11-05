import {Model} from '../../common/model';
import {Adresse} from '../adresse/adresse';

/**
 * Enumération des types d'dentités
 */
export enum IdentiteType {
  PERSONNE_PHYSIQUE = 'PERSONNE_PHYSIQUE',
  PERSONNE_MORALE = 'PERSONNE_MORALE',
}

/**
 * Class représentant une identité
 */
export abstract class Identite extends Model {

  // Fake field in database
  public static readonly DESIGNATION = 'designation';
  public static readonly DESIGNATION_LABEL = 'Prénom et nom / Raison sociale';

  // Field constantes
  public static readonly EMAIL = 'email';
  public static readonly TELEPHONE = 'telephone';
  public static readonly ADRESSE = 'adresse';
  public static readonly ADRESSE_RUE = this.ADRESSE.concat(".", Adresse.RUE);
  public static readonly ADRESSE_NUMERO = this.ADRESSE.concat(".", Adresse.NUMERO);
  public static readonly ADRESSE_LOCALITE = this.ADRESSE.concat(".", Adresse.LOCALILTE);
  public static readonly REMARQUES = 'remarques';

  // Label constantes
  public static readonly EMAIL_LABEL = 'Email';
  public static readonly TELEPHONE_LABEL = 'Téléphone';
  public static readonly ADRESSE_LABEL = 'Adresse';
  public static readonly REMARQUES_LABEL = 'Remarques';

  // Autres pour la page des identités et pas en DB
  public static readonly MACHINES = 'machines';
  public static readonly MACHINES_LABEL = 'Machines';

  // Constantes pour les panels
  public static readonly PANEL_INFORMATIONS_IDENTITE = "Informations de l'identité";
  public static readonly PANEL_INFORMATIONS_SUPPLEMENTAIRES = 'Informations supplémentaires';

  // FAKE FIELD for getting designatin with API
  public designation: string | null = null;

  public identiteType: IdentiteType | null = null;
  public email: string | null = null;
  public telephone: string | null = null;
  public adresse: Adresse | null = null;
  public remarques: string | null = null;

  protected constructor(identite?: Identite) {
    super(identite);

    if (identite) {
      this.email = identite.email;
      this.telephone = identite.telephone;
      if (identite.adresse) {
        this.adresse = new Adresse(identite.adresse);
      }
      this.remarques = identite.remarques;
      this.identiteType = identite.identiteType;
    }
  }

  public abstract getDesignation(): string;
}

export class IdentiteLight extends Identite {
  public static override readonly DESIGNATION = 'designation';
  public static override readonly DESIGNATION_LABEL = 'Prénom et nom / Raison sociale';

  // Real field for the light API
  public override designation: string | null = null;

  constructor(identite?: IdentiteLight) {
    super(identite);

    if (identite) {
      this.designation = identite.designation;
    }
  }

  public static identiteToString(identite: IdentiteLight | null): string {
    if (!identite) {
      return "";
    }

    let identiteString = "";

    if (identite.designation) {
      identiteString = identiteString.concat(identite.designation, " ");
    }

    let adresseString = Adresse.adresseToString(identite.adresse);

    if (adresseString) {
      identiteString = identiteString.concat("\n", adresseString);
    }

    return identiteString;
  }

  public getDesignation(): string {
    return this.designation ?? '';
  }
}
