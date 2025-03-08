/**
 * Données transmises dans le dialog
 */
export interface DialogData {
  id: number;
  type: DialogType;
}

/**
 * Type de dialog
 */
export enum DialogType {
  READ = 'READ',
  CREATE = 'CREATE',
  MODIFY = 'MODIFY',
  DELETE = 'DELETE',
}
