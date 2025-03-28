import {Model} from '../../common/model';
import {Pays} from '../pays/pays.model';

/**
 * Class représentant une localité
 */
export class Localite extends Model {

  public static readonly NOM: string = "nom";
  public static readonly NPA: string = "npa";
  public static readonly PAYS: string = "pays";
  public static readonly PAYS_ID: string = this.PAYS.concat(".", Model.ID);
  public static readonly PAYS_NOM: string = this.PAYS.concat(".", Pays.NOM);

  public static readonly NOM_LABEL: string = "Nom";
  public static readonly NPA_LABEL: string = "Code postal";
  public static readonly PAYS_LABEL: string = "Pays";

  public nom: string | null = null;
  public npa: string | null = null;
  public pays: Pays | null = null;

  constructor(localite?: Localite) {
    super(localite);

    if (localite) {
      this.nom = localite.nom;
      this.npa = localite.npa;
      if (localite.pays) {
        this.pays = new Pays(localite.pays);
      }
    }
  }
}
