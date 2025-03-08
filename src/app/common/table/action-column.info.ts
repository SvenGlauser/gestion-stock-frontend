import {AbstractDialogComponent} from '../dialog/abstract-dialog.component';

/**
 * Configuraiton des informations pour les dialogues ouverts depuis la data table
 */
export interface ActionColumnInfo {
  dialogComponent: AbstractDialogComponent<any, any>;
  read: boolean;
  created: boolean;
  modify: boolean;
  delete: boolean;
  clicOnLine: boolean;
}
