import {Model} from '../../common/model';

/**
 * Class représentant un pays
 */
export class Pays extends Model {

  // Field constantes
  public static readonly NOM = 'nom';
  public static readonly ABREVIATION = 'abreviation';

  // Label constantes
  public static readonly NOM_LABEL = 'Nom';
  public static readonly ABREVIATION_LABEL = 'Abréviation';

  public nom: string | null = null;
  public abreviation: string | null = null;

  constructor(pays?: Pays) {
    super(pays);

    if (pays) {
      this.abreviation = pays.abreviation;
      this.nom = pays.nom;
    }
  }
}
