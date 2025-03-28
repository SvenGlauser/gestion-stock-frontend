import {Model} from '../../common/model';
import {Contact} from '../contact/contact.model';
import {Piece} from '../piece/piece.model';

/**
 * Class représentant une machine
 */
export class Machine extends Model {

  // Field constantes
  public static readonly NOM = 'nom';
  public static readonly DESCRIPTION = 'description';
  public static readonly CONTACT = 'contact';
  public static readonly CONTACT_ID = this.CONTACT.concat(".", Model.ID);
  public static readonly PIECES = 'pieces';

  // Label constantes
  public static readonly NOM_LABEL = 'Nom';
  public static readonly DESCRIPTION_LABEL = 'Description';
  public static readonly CONTACT_LABEL = 'Contact';
  public static readonly PIECES_LABEL = 'Pièces';

  // DataTable constantes
  public static readonly ROW_EXTENDER = 'rowExtender';

  public nom: string | null = null;
  public description: string | null = null;
  public contact: Contact | null = null;
  public pieces: Piece[] = [];

  constructor(machine?: Machine) {
    super(machine);

    if (machine) {
      this.nom = machine.nom;
      this.description = machine.description;
      this.contact = machine.contact;
      this.pieces = machine.pieces.map(piece => new Piece(piece));
    }
  }
}
