export class Model {

  public static readonly ID = 'id';

  public static readonly PANEL_DONNEES_GENERALES = 'Données générales';

  public id: number | null = null;
  public creationUser: string | null = null;
  public creationDate: Date | null = null;
  public modificationUser: number | null = null;
  public modificationDate: Date | null = null;

  constructor(model?: Model) {
    if (model) {
      this.id = model.id;
      this.creationUser = model.creationUser;
      this.creationDate = model.creationDate;
      this.modificationUser = model.modificationUser;
      this.modificationDate = model.modificationDate;
    }
  }
}
