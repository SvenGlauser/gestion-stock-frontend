import {HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpStatusCode} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {inject} from '@angular/core';
import {SnackBarService} from './snack-bar.service';
import {AuthentificationService} from '../security/authentification.service';

export const catchHttpExceptionInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): any => {
  const snackBarService: SnackBarService = inject(SnackBarService);
  const authentificationService: AuthentificationService = inject(AuthentificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse): Observable<never> => {
      if (error.status == HttpStatusCode.NotAcceptable) {
        return throwError(() => error);
      }

      let message = error.status + " - ";
      if (error.status == HttpStatusCode.Unauthorized) {
        message += "Authentification requise";
        authentificationService.logout();
        authentificationService.login();
      } else if (error.status == HttpStatusCode.Forbidden) {
        message += "Vous n'avez pas les droits d'accéder à cette ressource";
      } else {
        message += "Erreur inconnue";
      }

      snackBarService.view(message);

      return throwError(() => error);
    })
  );
};
