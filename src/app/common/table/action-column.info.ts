import {AbstractDialogComponent} from '../dialog/abstract-dialog.component';
import {ComponentType} from '@angular/cdk/portal';

/**
 * Configuraiton des informations pour les dialogues ouverts depuis la data table
 */
export interface ActionColumnInfo {
  dialogComponent: ComponentType<AbstractDialogComponent<any, any>> | null;
  idField: string;
  read: boolean;
  created: boolean;
  modify: boolean;
  delete: boolean;
  clicOnLine: boolean;
}
