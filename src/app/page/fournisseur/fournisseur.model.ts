import {Model} from '../../common/model';
import {Adresse} from '../adresse/adresse';

/**
 * Class représentant un pays
 */
export class Fournisseur extends Model {

  // Field constantes
  public static readonly NOM = 'nom';
  public static readonly DESCRIPTION = 'description';
  public static readonly URL = 'url';
  public static readonly ADRESSE = 'adresse';
  public static readonly ADRESSE_RUE = this.ADRESSE.concat(".", Adresse.RUE);
  public static readonly ADRESSE_NUMERO = this.ADRESSE.concat(".", Adresse.NUMERO);
  public static readonly ADRESSE_LOCALITE = this.ADRESSE.concat(".", Adresse.LOCALILTE);

  // Label constantes
  public static readonly NOM_LABEL = 'Nom';
  public static readonly DESCRIPTION_LABEL = 'Description';
  public static readonly URL_LABEL = 'Site internet';
  public static readonly ADRESSE_LABEL = 'Adresse';

  public nom: string | null = null;
  public description: string | null = null;
  public url: string | null = null;
  public adresse: Adresse | null = null;

  constructor(fournisseur?: Fournisseur) {
    super(fournisseur);

    if (fournisseur) {
      this.nom = fournisseur.nom;
      this.description = fournisseur.description;
      this.url = fournisseur.url;
      if (fournisseur.adresse) {
        this.adresse = new Adresse(fournisseur.adresse);
      }
    }
  }
}
