import {AbstractFormDialogComponent} from '../form/dialog/abstract-form-dialog.component';
import {ComponentType} from '@angular/cdk/portal';
import {Observable} from 'rxjs';

/**
 * Configuraiton des informations pour les dialogues ouverts depuis la data table
 */
export interface ActionColumnInfo {
  dialogComponent?: ComponentType<AbstractFormDialogComponent<any, any>> | null;
  dialogComponentMethod?: ((element: any) => ComponentType<AbstractFormDialogComponent<any, any>> | null) | null;
  dialogSpecificData?: any;
  idField: string;
  read: boolean;
  created: boolean;
  modify: boolean;
  actions?: Action[];
  delete: boolean;
  clicOnLine: boolean;
}

export interface Action {
  name: string;
  action: (value: any) => Observable<boolean>;
  condition?: (value: any) => boolean;
}
