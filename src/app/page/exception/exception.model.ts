import {Model} from '../../common/model';

/**
 * Class représentant un pays
 */
export class ThrownException extends Model {

  // Field constantes
  public static readonly STACKTRACE = 'stacktrace';
  public static readonly CLASS_NAME = 'className';
  public static readonly MESSAGE = 'message';
  public static readonly TIMESTAMP = 'timestamp';
  public static readonly ACTIF = 'actif';

  // Label constantes
  public static readonly STACKTRACE_LABEL = 'Stacktrace';
  public static readonly CLASS_NAME_LABEL = 'Exception';
  public static readonly MESSAGE_LABEL = 'Message';
  public static readonly TIMESTAMP_LABEL = 'Date et heure';
  public static readonly ACTIF_LABEL = 'Actif';

  // DataTable constantes
  public static readonly ROW_EXTENDER = 'rowExtender';

  public stacktrace: string | null = null;
  public className: string | null = null;
  public message: string | null = null;
  public timestamp: Date | null = null;
  public actif: boolean | null = null;

  constructor(exception?: ThrownException) {
    super(exception);

    if (exception) {
      this.stacktrace = exception.stacktrace;
      this.className = exception.className;
      this.message = exception.message;
      if (exception.timestamp) {
        this.timestamp = new Date(exception.timestamp);
      }
      this.actif = exception.actif;
    }
  }
}
