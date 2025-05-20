import {Model} from '../../common/model';
import {Identite} from '../identite/identite.model';
import {Piece} from '../piece/piece.model';
import {PersonnePhysique} from '../identite/personne-physique.model';
import {PersonneMorale} from '../identite/personne-morale.model';

/**
 * Class représentant une machine
 */
export class Machine extends Model {

  // Field constantes
  public static readonly NOM = 'nom';
  public static readonly DESCRIPTION = 'description';
  public static readonly PROPRIETAIRE = 'proprietaire';
  public static readonly PROPRIETAIRE_ID = this.PROPRIETAIRE.concat(".", Model.ID);
  public static readonly PIECES = 'pieces';

  // Label constantes
  public static readonly NOM_LABEL = 'Nom';
  public static readonly DESCRIPTION_LABEL = 'Description';
  public static readonly PROPRIETAIRE_LABEL = 'Propriétaire';
  public static readonly PIECES_LABEL = 'Pièces';

  // DataTable constantes
  public static readonly ROW_EXTENDER = 'rowExtender';

  public nom: string | null = null;
  public description: string | null = null;
  public proprietaire: Identite | null = null;
  public pieces: Piece[] = [];

  constructor(machine?: Machine) {
    super(machine);

    if (machine) {
      this.nom = machine.nom;
      this.description = machine.description;
      if (machine.proprietaire) {
        if (machine.proprietaire.identiteType == "PERSONNE_MORALE") {
          this.proprietaire = new PersonneMorale(machine.proprietaire as PersonneMorale);
        } else if (machine.proprietaire.identiteType == "PERSONNE_PHYSIQUE") {
          this.proprietaire = new PersonnePhysique(machine.proprietaire as PersonnePhysique);
        } else {
          throw new Error("Type d'identité inconnu")
        }
      }
      this.pieces = machine.pieces.map(piece => new Piece(piece));
    }
  }
}
