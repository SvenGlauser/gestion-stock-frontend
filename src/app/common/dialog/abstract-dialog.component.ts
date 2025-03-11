import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData, DialogType} from './dialog-data';
import {Observable} from 'rxjs';
import {FormField} from '../form/field/form-field';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {FormComponent} from '../form/form.component';
import {getValueFromAttributeInCascade, setValueOfAttributeInCascade} from '../utils/function.utils';

@Component({template: ''}) // Obligatoire, car implémente OnInit
export abstract class AbstractDialogComponent<T extends AbstractDialogComponent<T, E>, E extends Record<string, any>> implements OnInit {
  // Données du dialog
  private readonly dialogRef: MatDialogRef<T> = inject(MatDialogRef<T>);
  protected readonly data: DialogData = inject<DialogData>(MAT_DIALOG_DATA);

  // Constantes que le parent doit déclarer
  protected readonly abstract ID_FIELD: string;

  // Constantes pour HTML
  protected readonly DialogType: typeof DialogType = DialogType;

  // Utilisé pour modifier les erreurs sur le formGroup
  @ViewChild(FormComponent)
  protected formComponent: FormComponent | null = null;

  // Force le parent à déclarer des champs de formulaire
  protected abstract formsMap: Map<string, FormField[]>;

  // Ancien objet récupéré (sauf lors de la création)
  protected oldObject: E | null = null;

  /**
   * Initialise le dialog
   */
  public ngOnInit(): void {
    // Désactive les champs nécessaires
    this.disableFormIfNeeded();

    // Charge les anciennes données
    this.loadOldData();
  }

  /**
   * Récupère le titre du dialog
   */
  protected getTitle(): string {
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
    if (this.data.type === DialogType.READ ||
      this.data.type === DialogType.DELETE) {

      for (const forms of this.formsMap.values()) {
        forms.forEach(form => {
          form.formControl.disable();
        })
      }
    }
  }

  /**
   * Charge l'ancien objet et rempli le formulaire avec les données récupérées
   */
  private loadOldData(): void {
    // Ne s'exécute pas à la création
    if (this.data.type === DialogType.READ ||
      this.data.type === DialogType.MODIFY ||
      this.data.type === DialogType.DELETE) {

      // Récupère l'objet
      this.getDataMethod(this.data.id!).subscribe(data => {
        this.oldObject = data;

        if (!this.oldObject) {
          return;
        }

        // Rempli le formulaire avec les nouvelles données
        for (const forms of this.formsMap.values()) {
          forms.forEach((form: FormField) => {
            let oldValue: any = getValueFromAttributeInCascade(form.field, this.oldObject);

            if (oldValue !== null) {
              form.formControl.setValue(oldValue);
            }
          });
        }
      });
    }
  }

  /**
   * Crée un nouvel élément et ferme le dialog
   */
  protected create(): void {
    let element: Record<string, any> = this.getNewData();

    this.executeAndTraiterErreurAndClose(this.createDataMethod(<E>element));
  }

  /**
   * Modifie l'élément courant et ferme le dialog
   */
  protected modify(): void {
    let element: Record<string, any> = this.getNewData();

    // Réassignement manuel de l'id, car pas présent dans le formulaire
    element[this.ID_FIELD] = this.data.id;

    this.executeAndTraiterErreurAndClose(this.modifyDataMethod(<E>element));
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
  private getNewData(): Record<string, any> {
    let element: Record<string, any> = {};

    for (const forms of this.formsMap.values()) {
      forms.forEach((form: FormField) => {
        setValueOfAttributeInCascade(form.field, element, form.getValue());
      });
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
  private traiterErreur(errors: { clazz: string, field: string, message: string }[]): void {
    // Traiter les erreurs liées à un champ connu
    for (const forms of this.formsMap.values()) {
      forms.forEach((form: FormField) => {
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
      });
    }

    // Gestion des erreurs inconnues
    if (this.formComponent) {
      if (errors.length > 0) {
        // Création du message
        let errorsMessages: string = this.createErrorMessage(errors);

        // Assignement du message
        this.formComponent.formGroup?.setErrors({"validation": errorsMessages});
        this.formComponent.formGroup?.markAsTouched();
      }
    }
  }

  /**
   * Créer un message d'erreur
   * @param errors Erreurs
   */
  private createErrorMessage(errors: { clazz: string; field: string; message: string }[]): string {
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
}
