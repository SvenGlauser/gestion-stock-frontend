import {Identite} from './identite.model';

/**
 * Class représentant une personne physique
 */
export class PersonneMorale extends Identite {

  // Field constantes
  public static readonly RAISON_SOCIALE = 'raisonSociale';

  // Label constantes
  public static readonly RAISON_SOCIALE_LABEL = 'Raison sociale';

  public raisonSociale: string | null = null;

  constructor(personneMorale?: PersonneMorale) {
    super(personneMorale);

    if (personneMorale) {
      this.raisonSociale = personneMorale.raisonSociale;
    }
  }

  public getDesignation(): string {
    return this.raisonSociale || '';
  }
}
