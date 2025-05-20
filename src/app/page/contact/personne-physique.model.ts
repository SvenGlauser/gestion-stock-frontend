import {Identite} from './identite.model';
import {Titre} from './titre.enum';

/**
 * Class représentant une personne physique
 */
export class PersonnePhysique extends Identite {

  // Field constantes
  public static readonly TITRE = 'titre';
  public static readonly NOM = 'nom';
  public static readonly PRENOM = 'prenom';

  // Label constantes
  public static readonly TITRE_LABEL = 'Titre';
  public static readonly NOM_LABEL = 'Nom';
  public static readonly PRENOM_LABEL = 'Prénom';

  public titre: Titre | null = null;
  public nom: string | null = null;
  public prenom: string | null = null;

  constructor(personnePhysique?: PersonnePhysique) {
    super(personnePhysique);

    if (personnePhysique) {
      this.titre = personnePhysique.titre;
      this.nom = personnePhysique.nom;
      this.prenom = personnePhysique.prenom;
    }
  }

  public getDesignation(): string {
    return this.prenom + " " +  this.nom;
  }
}
