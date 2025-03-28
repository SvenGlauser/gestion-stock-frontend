import {Model} from '../../common/model';
import {Adresse} from '../adresse/adresse';
import {Titre, TitreEnumValuesForAutocomplete} from './titre.enum';

/**
 * Class représentant un contact
 */
export class Contact extends Model {

  // Field constantes
  public static readonly TITRE = 'titre';
  public static readonly NOM = 'nom';
  public static readonly PRENOM = 'prenom';
  public static readonly EMAIL = 'email';
  public static readonly TELEPHONE = 'telephone';
  public static readonly ADRESSE = 'adresse';
  public static readonly ADRESSE_RUE = this.ADRESSE.concat(".", Adresse.RUE);
  public static readonly ADRESSE_NUMERO = this.ADRESSE.concat(".", Adresse.NUMERO);
  public static readonly ADRESSE_LOCALITE = this.ADRESSE.concat(".", Adresse.LOCALILTE);
  public static readonly REMARQUES = 'remarques';

  // Label constantes
  public static readonly TITRE_LABEL = 'Titre';
  public static readonly NOM_LABEL = 'Nom';
  public static readonly PRENOM_LABEL = 'Prénom';
  public static readonly EMAIL_LABEL = 'Email';
  public static readonly TELEPHONE_LABEL = 'Téléphone';
  public static readonly ADRESSE_LABEL = 'Adresse';
  public static readonly REMARQUES_LABEL = 'Remarques';

  // Autres pour la page des contacts et pas en DB
  public static readonly MACHINES = 'machines';
  public static readonly MACHINES_LABEL = 'Machines';

  // Constantes pour les panels
  public static readonly PANEL_INFORMATIONS_CONTACT = 'Informations de contact';
  public static readonly PANEL_INFORMATIONS_SUPPLEMENTAIRES = 'Informations supplémentaires';

  public titre: Titre | null = null;
  public nom: string | null = null;
  public prenom: string | null = null;
  public email: string | null = null;
  public telephone: string | null = null;
  public adresse: Adresse | null = null;
  public remarques: string | null = null;

  constructor(contact?: Contact) {
    super(contact);

    if (contact) {
      this.titre = contact.titre;
      this.nom = contact.nom;
      this.prenom = contact.prenom;
      this.email = contact.email;
      this.telephone = contact.telephone;
      if (contact.adresse) {
        this.adresse = new Adresse(contact.adresse);
      }
      this.remarques = contact.remarques;
    }
  }

  public static contactNomPrenomToString(contact: Contact | null): string {
    if (!contact) {
      return "";
    }

    let nomPrenom = "";

    if (contact.prenom) {
      nomPrenom = nomPrenom.concat(contact.prenom, " ");
    }

    if (contact.nom) {
      nomPrenom = nomPrenom.concat(contact.nom);
    }

    return nomPrenom;
  }

  public static contactToString(contact: Contact | null): string {
    if (!contact) {
      return "";
    }

    let contactString = "";

    if (contact.titre) {
      contactString = contactString.concat(TitreEnumValuesForAutocomplete.get(contact.titre) ?? "", "\n");
    }

    contactString = contactString.concat(this.contactNomPrenomToString(contact), " ");

    let adresseString = Adresse.adresseToString(contact.adresse);

    if (adresseString) {
      contactString = contactString.concat("\n", adresseString);
    }

    return contactString;
  }

}
