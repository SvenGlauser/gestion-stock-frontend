import {Column} from './column';

export class LinkColumn extends Column {
  public link: (object: any) => string;
  public icon: string;

  protected constructor(label: string,
                        field: string,
                        width: string,
                        link: (object: any) => string) {
    super(label, field, width);
    this.link = link;
    this.icon = "open_in_new";
  }

  /**
   * Ajoute une méthode pour un champ calculé sur la base d'un autre champ
   * @param label Label
   * @param field Nom du champ
   * @param width Largeur de la colonne
   * @param link Méthode de génération du lien
   */
  public static of(label: string,
                   field: string,
                   width: string,
                   link: (object: any) => string): LinkColumn {
    return new LinkColumn(label, field, width, link);
  }

  /**
   * Indique si l'instance est une instance de LinkColumn
   * @param instance Instance à vérifier
   */
  public static isInstanceOf(instance: Column): boolean {
    return instance instanceof LinkColumn;
  }

  /**
   * Cast l'instance en LinkColumn
   * @param instance Instance à vérifier
   */
  public static cast(instance: Column): LinkColumn | null {
    if (instance instanceof LinkColumn) {
      return instance;
    }

    return null;
  }

  public override getValue(object: any): string {
    return this.link(object);
  }

  /**
   * Change l'icône du lien
   * @param icon Nouvelle icône
   */
  public withIcon(icon: string): this {
    this.icon = icon;
    return this;
  }
}
