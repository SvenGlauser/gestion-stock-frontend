import {Model} from '../../common/model';
import {Piece} from '../piece/piece.model';

/**
 * Class représentant un service
 */
export class ChangementPiece extends Model {

  // Field constantes
  public static readonly PIECE = 'piece';
  public static readonly PIECE_ID = ChangementPiece.PIECE.concat('.', Piece.ID);
  public static readonly PIECE_NOM = ChangementPiece.PIECE.concat('.', Piece.NOM);
  public static readonly QUANTITE = 'quantite';
  public static readonly DESCRIPTION = 'description';

  // Label constantes
  public static readonly PIECE_LABEL = 'Pièce';
  public static readonly QUANTITE_LABEL = 'Quantité';
  public static readonly DESCRIPTION_LABEL = 'Description';

  public piece: Piece | null = null;

  public quantite: number | null = null;
  public description: string | null = null;

  constructor(changementPiece?: ChangementPiece) {
    super(changementPiece);

    if (changementPiece) {
      if (changementPiece.piece) {
        this.piece = new Piece(changementPiece.piece);
      }

      this.quantite = changementPiece.quantite;
      this.description = changementPiece.description;
    }
  }
}
