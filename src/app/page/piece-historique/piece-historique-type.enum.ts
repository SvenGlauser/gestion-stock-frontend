export enum PieceHistoriqueType {
  ENTREE = "ENTREE",
  SORTIE = "SORTIE",
}

export const PieceHistoriqueTypeEnumValuesForAutocomplete: Map<PieceHistoriqueType, string> = new Map([
  [PieceHistoriqueType.ENTREE, "Entrée"],
  [PieceHistoriqueType.SORTIE, "Sortie"],
]);
