/**
 * Données transmises dans le dialog
 */
export interface DialogData {
  id: number | null;
  type: DialogType;
  specificData: any;
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
