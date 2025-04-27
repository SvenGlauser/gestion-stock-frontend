import {Model} from '../../common/model';
import {Piece} from '../piece/piece.model';
import {PieceHistoriqueSource} from './piece-historique-source.enum';
import {PieceHistoriqueType} from './piece-historique-type.enum';

/**
 * Class représentant un mouvement de pièce
 */
export class PieceHistorique extends Model {

  // Field constantes
  public static readonly PIECE = 'piece';
  public static readonly PIECE_ID = this.PIECE.concat(".", Model.ID);
  public static readonly DIFFERENCE = 'difference';
  public static readonly DATE = 'date';
  public static readonly TYPE = 'type';
  public static readonly SOURCE = 'source';

  // Label constantes
  public static readonly PIECE_LABEL = 'Pièce';
  public static readonly DIFFERENCE_LABEL = 'Différence';
  public static readonly DATE_LABEL = 'Date';
  public static readonly TYPE_LABEL = 'Type';
  public static readonly SOURCE_LABEL = 'Source';

  public piece: Piece | null = null;
  public difference: string | null = null;
  public date: Date | null = null;
  public type: PieceHistoriqueType | null = null;
  public source: PieceHistoriqueSource | null = null;

  constructor(pieceHistorique?: PieceHistorique) {
    super(pieceHistorique);

    if (pieceHistorique) {
      if (pieceHistorique.piece) {
        this.piece = new Piece(pieceHistorique.piece);
      }
      this.difference = pieceHistorique.difference;
      if (pieceHistorique.date) {
        this.date = new Date(pieceHistorique.date);
      }
      this.type = pieceHistorique.type;
      this.source = pieceHistorique.source;
    }
  }
}
