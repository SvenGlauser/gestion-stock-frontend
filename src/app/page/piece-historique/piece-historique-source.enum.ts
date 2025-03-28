export enum PieceHistoriqueSource {
  AUTOMATIQUE = "AUTOMATIQUE",
  IMPORTATION = "IMPORTATION",
}

export const PieceHistoriqueSourceEnumValuesForAutocomplete: Map<PieceHistoriqueSource, string> = new Map([
  [PieceHistoriqueSource.AUTOMATIQUE, "Automatique"],
  [PieceHistoriqueSource.IMPORTATION, "Importation"],
]);
