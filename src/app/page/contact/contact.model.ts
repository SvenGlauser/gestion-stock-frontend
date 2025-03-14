import {Model} from '../../common/model';
import {Adresse, adresseToString} from '../adresse/adresse';
import {Titre, TitreEnumValuesForAutocomplete} from './titre.enum';

/**
 * Interface représentant un contact
 */
export interface Contact extends Model {
  titre: Titre | null;
  nom: string;
  prenom: string;
  email: string | null;
  telephone: string | null;
  adresse: Adresse;
  remarques: string | null;
}

// Field constantes
export const CONTACT_TITRE = 'titre';
export const CONTACT_NOM = 'nom';
export const CONTACT_PRENOM = 'prenom';
export const CONTACT_EMAIL = 'email';
export const CONTACT_TELEPHONE = 'telephone';
export const CONTACT_ADRESSE = 'adresse';
export const CONTACT_REMARQUES = 'remarques';

// Label constantes
export const CONTACT_TITRE_LABEL = 'Titre';
export const CONTACT_NOM_LABEL = 'Nom';
export const CONTACT_PRENOM_LABEL = 'Prénom';
export const CONTACT_EMAIL_LABEL = 'Email';
export const CONTACT_TELEPHONE_LABEL = 'Téléphone';
export const CONTACT_ADRESSE_LABEL = 'Adresse';
export const CONTACT_REMARQUES_LABEL = 'Remarques';

// Autres pour la page des contacts et pas en DB
export const CONTACT_MACHINES = 'machines';
export const CONTACT_MACHINES_LABEL = 'Machines';

// Constantes pour les panels
export const PANEL_INFORMATIONS_CONTACT = 'Informations de contact';
export const PANEL_INFORMATIONS_SUPPLEMENTAIRES = 'Informations supplémentaires';

export const contactToString: (contact?: Contact) => string = (contact?: Contact): string => {
  if (!contact) {
    return "";
  }

  let contactString = "";

  if (contact.titre) {
    contactString = contactString.concat(TitreEnumValuesForAutocomplete.get(contact.titre) ?? "", "\n");
  }

  if (contact.prenom) {
    contactString = contactString.concat(contact.prenom, " ");
  }

  if (contact.nom) {
    contactString = contactString.concat(contact.nom, " ");
  }

  let adresseString = adresseToString(contact.adresse);

  if (adresseString) {
    contactString = contactString.concat("\n", adresseString);
  }

  return contactString;
}
