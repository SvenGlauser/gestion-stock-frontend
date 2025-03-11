export enum Titre {
  MONSIEUR = "MONSIEUR",
  MADAME = "MADAME",
}

export const TitreEnumValuesForAutocomplete: Map<Titre, string> = new Map([
  [Titre.MONSIEUR, "Monsieur"],
  [Titre.MADAME, "Madame"],
]);
