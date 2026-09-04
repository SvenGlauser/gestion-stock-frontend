import {Model} from '../../common/model';
import {Machine} from '../machine/machine.model';
import {ChangementPiece} from '../changement-piece/changement-piece.model';

/**
 * Class représentant un service
 */
export class Service extends Model {

  // Field constantes
  public static readonly MACHINE = 'machine';
  public static readonly MACHINE_ID = Service.MACHINE.concat('.', Machine.ID);
  public static readonly DATE = 'date';
  public static readonly DUREE = 'duree';
  public static readonly DESCRIPTION_TRAVAUX = 'descriptionTravaux';
  public static readonly DIVERS = 'divers';
  public static readonly CHANGEMENT_PIECE = 'changementPieces';

  // Label constantes
  public static readonly MACHINE_LABEL = 'Machine';
  public static readonly DATE_LABEL = 'Date';
  public static readonly DUREE_LABEL = 'Durée';
  public static readonly DESCRIPTION_TRAVAUX_LABEL = 'Description des travaux';
  public static readonly DIVERS_LABEL = 'Divers';
  public static readonly CHANGEMENT_PIECE_LABEL = 'Changement de pièces';

  public machine: Machine | null = null;

  public date: Date | null = null;
  public duree: number | null = null;

  public descriptionTravaux: string | null = null;
  public divers: string | null = null;

  public changementPieces: ChangementPiece[] = [];

  constructor(service?: Service) {
    super(service);

    if (service) {
      if (service.machine) {
        this.machine = new Machine(service.machine);
      }

      this.date = service.date;
      this.duree = service.duree;
      this.descriptionTravaux = service.descriptionTravaux;
      this.divers = service.divers;
      this.changementPieces = service.changementPieces.map(changementPiece => new ChangementPiece(changementPiece));
    }
  }
}
