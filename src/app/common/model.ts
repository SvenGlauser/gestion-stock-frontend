export class Model {

  public static readonly ID = 'id';

  public static readonly PANEL_DONNEES_GENERALES = 'Données générales';

  public id: number | null = null;

  constructor(model?: Model) {
    if (model) {
      this.id = model.id;
    }
  }
}
