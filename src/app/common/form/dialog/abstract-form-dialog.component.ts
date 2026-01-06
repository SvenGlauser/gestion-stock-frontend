import {afterNextRender, Directive, inject, signal, Signal, viewChild, WritableSignal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData, DialogType} from './dialog-data';
import {Observable} from 'rxjs';
import {FormField} from '../field/form-field';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {FormComponent} from '../form.component';
import {getValueFromAttributeInCascade, setValueOfAttributeInCascade} from '../../utils/function.utils';
import {ValidationException} from '../../utils/validation-exception';
import {AbstractProtectedComponent} from '../../abstract/abstract-protected-component.directive';
import {Roles} from '../../../security/roles';
import {Model} from '../../model';

@Directive()
export abstract class AbstractFormDialogComponent<T extends AbstractFormDialogComponent<T, E>, E extends Model> extends AbstractProtectedComponent {
  // Données du dialog
  private readonly dialogRef: MatDialogRef<T> = inject(MatDialogRef<T>);
  protected readonly data: DialogData = inject<DialogData>(MAT_DIALOG_DATA);

  // Constantes pour HTML
  protected readonly DialogType: typeof DialogType = DialogType;

  // Utilisé pour modifier les erreurs sur le formGroup
  private readonly formComponent: Signal<FormComponent> = viewChild.required(FormComponent);

  // Force le parent à déclarer des champs de formulaire
  protected readonly abstract formsMap: Map<string, FormField[]>;

  // Ancien objet récupéré (sauf lors de la création)
  protected oldObject: WritableSignal<E | null> = signal(null);

  // Affichage
  protected readonly dialogTitle: string;

  protected constructor() {
    super();

    this.dialogTitle = this.getTitle();

    // Important, car accéder à un champ abstrait est impossible dans le constructeur
    afterNextRender((): void => {
      this.disableFormIfNeeded();
      this.loadOldData();
    })
  }

  /**
   * Récupère le titre du dialog
   */
  private getTitle(): string {
    switch (this.data.type) {
      case DialogType.READ:
        return "Lecture seule";
      case DialogType.CREATE:
        return "Création";
      case DialogType.MODIFY:
        return "Edition";
      case DialogType.DELETE:
        return "Suppression";
    }
  }

  /**
   * Si en mode suppression ou lecture, on désactive les formulaires
   */
  private disableFormIfNeeded(): void {
    if ([DialogType.READ, DialogType.DELETE].includes(this.data.type)) {

      for (const forms of this.formsMap.values()) {
        for (const form of forms) {
          form.formControl.disable();
        }
      }
    }
  }

  /**
   * Charge l'ancien objet et rempli le formulaire avec les données récupérées
   */
  private loadOldData(): void {
    // Ne s'exécute pas à la création
    if ([DialogType.READ, DialogType.MODIFY, DialogType.DELETE].includes(this.data.type)) {
      // Récupère l'objet
      this.getDataMethod(this.data.id!).subscribe((data: E): void => {
        this.oldObject.set(data);

        if (!data) {
          return;
        }

        // Rempli le formulaire avec les nouvelles données
        for (const forms of this.formsMap.values()) {
          for (const form of forms) {
            let oldValue: any = getValueFromAttributeInCascade(form.field, data);

            if (oldValue !== null) {
              form.formControl.setValue(oldValue);
            }
          }
        }
      });
    }
  }

  /**
   * Crée un nouvel élément et ferme le dialog
   */
  protected create(): void {
    this.executeAndTraiterErreurAndClose(this.createDataMethod(this.getNewData()));
  }

  /**
   * Modifie l'élément courant et ferme le dialog
   */
  protected modify(): void {
    this.executeAndTraiterErreurAndClose(this.modifyDataMethod(this.getNewData()));
  }

  /**
   * Supprime l'élément et ferme le dialog
   */
  protected delete(): void {
    this.executeAndTraiterErreurAndClose(this.deleteDataMethod(this.data.id!));
  }

  /**
   * Récupère un object avec les nouvelles données
   */
  private getNewData(): E {
    let element: E = structuredClone(this.oldObject()) ?? <E>{};

    for (const forms of this.formsMap.values()) {
      for (const form of forms) {
        setValueOfAttributeInCascade(form.field, element, form.getValue());
      }
    }

    return element;
  }

  /**
   * Exécute la requête, traite les potentielles erreurs et sinon ferme le dialog
   * @param observable Observable à exécuter
   */
  private executeAndTraiterErreurAndClose(observable: Observable<any>): void {
    observable.subscribe({
      error: (error: HttpErrorResponse): void => {
        if (error.status === HttpStatusCode.NotAcceptable) {
          this.traiterErreur(error.error);
        }
      },
      complete: (): void => {
        this.dialogRef.close(true);
      }
    });
  }

  /**
   * Traitement des erreurs
   * @param errors Erreurs à traiter
   */
  private traiterErreur(errors: ValidationException[]): void {
    // Traiter les erreurs liées à un champ connu
    for (const forms of this.formsMap.values()) {
      for (const form of forms) {
        // Récupération des erreurs
        let errorsAssignedToField = errors.filter(error => error.field == form.field)

        // Création du message d'erreur
        let errorsMessages: string = this.createErrorMessage(errorsAssignedToField);

        // En cas d'erreur
        if (errorsAssignedToField.length > 0) {
          // Assignement du message
          form.formControl.setErrors({"validation": errorsMessages});
          form.formControl.markAsTouched();

          // Suppression des erreurs dans la liste
          errors = errors.filter(error => !errorsAssignedToField.includes(error));
        }
      }
    }

    // Gestion des erreurs inconnues
    if (this.formComponent()) {
      if (errors.length > 0) {
        // Création du message
        let errorsMessages: string = this.createErrorMessage(errors);

        // Assignement du message
        this.formComponent().formGroup.setErrors({"validation": errorsMessages});
        this.formComponent().formGroup.markAsTouched();
      }
    }
  }

  /**
   * Créer un message d'erreur
   * @param errors Erreurs
   */
  private createErrorMessage(errors: ValidationException[]): string {
    return errors.map(error => error.message).join("<br>");
  }

  /**
   * Methode GET
   * @param id Id de l'élément
   */
  protected abstract getDataMethod(id: number): Observable<E>;

  /**
   * Methode POST
   * @param element Objet à créer
   */
  protected abstract createDataMethod(element: E): Observable<E>;

  /**
   * Methode PUT
   * @param element Objet à modifier
   */
  protected abstract modifyDataMethod(element: E): Observable<E>;

  /**
   * Methode DELETE
   * @param id Id de l'élément
   */
  protected abstract deleteDataMethod(id: number): Observable<void>;

  protected override hasAccess(roles: string[]): boolean {
    let role: Roles;

    switch (this.data.type) {
      case DialogType.READ:
        role = this.readAccess();
        break;
      case DialogType.CREATE:
      case DialogType.MODIFY:
      case DialogType.DELETE:
        role = this.editAccess();
        break;
    }

    return roles.includes(role.toString());
  }

  protected override noAcessAction(): void {
    this.dialogRef.close(true);
  }
}
