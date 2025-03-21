import {Model} from '../../common/model';
import {Contact} from '../contact/contact.model';
import {Piece} from '../piece/piece.model';

/**
 * Interface représentant une machine
 */
export interface Machine extends Model {
  nom: string;
  description: string | null;
  contact: Contact | null;
  pieces: Piece[];
}

// Field constantes
export const MACHINE_NOM = 'nom';
export const MACHINE_DESCRIPTION = 'description';
export const MACHINE_CONTACT = 'contact';
export const MACHINE_PIECES = 'pieces';

// Label constantes
export const MACHINE_NOM_LABEL = 'Nom';
export const MACHINE_DESCRIPTION_LABEL = 'Description';
export const MACHINE_CONTACT_LABEL = 'Contact';
export const MACHINE_PIECES_LABEL = 'Pièces';

export const MACHINE_ROW_EXTENDER = 'rowExtender';
