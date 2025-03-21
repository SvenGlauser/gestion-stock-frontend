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

/**
 * Met à jour tous les attributs de la machine
 * @param newMachine Nouvelle machine
 * @param oldMachine Ancienne machine
 */
export function copyNewMachineDataInOldInstance(newMachine: Machine, oldMachine: Machine): void {
  oldMachine.nom = newMachine.nom;
  oldMachine.description = newMachine.description;
  oldMachine.contact = newMachine.contact;
  oldMachine.pieces = newMachine.pieces;
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
