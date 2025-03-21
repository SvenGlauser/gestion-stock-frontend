/**
 * Représente une erreur de validation du backend
 */
export interface ValidationException {
  message: string;
  clazz: string;
  field: string;
}
