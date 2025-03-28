import {Model} from '../../common/model';

/**
 * Interface représentant un pays
 */
export interface ThrownException extends Model {
  stacktrace: string;
  className: string;
  message: string;
  timestamp: Date;
  actif: boolean;
}

// Field constantes
export const THROWN_EXCEPTION_STACKTRACE = 'stacktrace';
export const THROWN_EXCEPTION_CLASS_NAME = 'className';
export const THROWN_EXCEPTION_MESSAGE = 'message';
export const THROWN_EXCEPTION_TIMESTAMP = 'timestamp';
export const THROWN_EXCEPTION_ACTIF = 'actif';

// Label constantes
export const THROWN_EXCEPTION_STACKTRACE_LABEL = 'Stacktrace';
export const THROWN_EXCEPTION_CLASS_NAME_LABEL = 'Exception';
export const THROWN_EXCEPTION_MESSAGE_LABEL = 'Message';
export const THROWN_EXCEPTION_TIMESTAMP_LABEL = 'Date et heure';
export const THROWN_EXCEPTION_ACTIF_LABEL = 'Actif';

// DataTable constantes
export const THROWN_EXCEPTION_ROW_EXTENDER = 'rowExtender';
