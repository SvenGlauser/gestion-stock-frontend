export enum PieceHistoriqueSource {
  CREATION = "CREATION",
  MODIFICATION = "MODIFICATION",
  IMPORTATION = "IMPORTATION",
}

export const PieceHistoriqueSourceEnumValuesForAutocomplete: Map<PieceHistoriqueSource, string> = new Map([
  [PieceHistoriqueSource.CREATION, "Création"],
  [PieceHistoriqueSource.MODIFICATION, "Modification"],
  [PieceHistoriqueSource.IMPORTATION, "Importation"],
]);
