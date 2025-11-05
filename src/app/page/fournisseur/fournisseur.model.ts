import {Model} from '../../common/model';
import {Identite, IdentiteType} from '../identite/identite.model';
import {PersonneMorale} from '../identite/personne-morale.model';
import {PersonnePhysique} from '../identite/personne-physique.model';

/**
 * Class représentant un pays
 */
export class Fournisseur extends Model {

  // Field constantes
  public static readonly IDENTITE = 'identite';
  public static readonly IDENTITE_DESIGNATION = this.IDENTITE.concat(".", Identite.DESIGNATION);
  public static readonly IDENTITE_ADRESSE = this.IDENTITE.concat(".", Identite.ADRESSE);
  public static readonly DESCRIPTION = 'description';
  public static readonly URL = 'url';

  // Label constantes
  public static readonly IDENTITE_LABEL = 'Identité';
  public static readonly DESCRIPTION_LABEL = 'Description';
  public static readonly URL_LABEL = 'Site internet';
  public static readonly ADRESSE_LABEL = 'Adresse';

  public identite: Identite | null = null;
  public description: string | null = null;
  public url: string | null = null;

  constructor(fournisseur?: Fournisseur) {
    super(fournisseur);

    if (fournisseur) {
      if (fournisseur.identite) {
        if (fournisseur.identite.identiteType == IdentiteType.PERSONNE_MORALE) {
          this.identite = new PersonneMorale(fournisseur.identite as PersonneMorale);
        } else if (fournisseur.identite.identiteType == IdentiteType.PERSONNE_PHYSIQUE) {
          this.identite = new PersonnePhysique(fournisseur.identite as PersonnePhysique);
        } else {
          throw new Error("Type d'identité inconnu")
        }
      }
      this.description = fournisseur.description;
      this.url = fournisseur.url;
    }
  }
}
