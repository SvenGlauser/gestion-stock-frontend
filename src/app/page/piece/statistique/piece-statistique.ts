/**
 * Class représentant une statistique des pièces
 */
export class PieceStatistique {

  public date: Date | null = null;
  public quantite: number | null = null;
  public montantTotal: number | null = null;

  constructor(pieceStatistique?: PieceStatistique) {
    if (pieceStatistique) {
      if (pieceStatistique.date) {
        this.date = new Date(pieceStatistique.date);
      }
      this.quantite = pieceStatistique.quantite;
      this.montantTotal = pieceStatistique.montantTotal;
    }
  }
}
