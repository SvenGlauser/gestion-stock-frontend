import {Model} from '../../common/model';

/**
 * Class représentant un pays
 */
export class Categorie extends Model {

  // Field constantes
  public static readonly NOM = 'nom';
  public static readonly DESCRIPTION = 'description';
  public static readonly ACTIF = 'actif';

  // Label constantes
  public static readonly NOM_LABEL = 'Nom';
  public static readonly DESCRIPTION_LABEL = 'Description';
  public static readonly ACTIF_LABEL = 'Active';

  public nom: string | null = null;
  public description: string | null = null;
  public actif: boolean | null = null;

  constructor(categorie?: Categorie) {
    super(categorie);

    if (categorie) {
      this.nom = categorie.nom;
      this.description = categorie.description;
      this.actif = categorie.actif;
    }
  }
}
