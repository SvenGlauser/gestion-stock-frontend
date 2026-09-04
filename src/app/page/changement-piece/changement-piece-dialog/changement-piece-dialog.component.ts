import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {Model} from '../../../common/model';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {AutocompleteMultipleComponent} from '../../../common/form/input/autocomplete/autocomplete-multiple.component';
import {ServiceService} from '../../service/service.service';
import {Service} from '../../service/service.model';
import {ChangementPiece} from '../changement-piece.model';
import {PieceService} from '../../piece/piece.service';
import {Piece} from '../../piece/piece.model';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {TextAreaFormField} from '../../../common/form/field/textarea-form-field';
import {NumberFormField} from '../../../common/form/field/number-form-field';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';

@Component({
  selector: 'app-changement-piece-dialog',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatDialogClose,
    AutocompleteMultipleComponent,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
  ],
  templateUrl: './changement-piece-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './changement-piece-dialog.component.scss'
})
export class ChangementPieceDialogComponent {
  protected readonly FIELD_ID = Model.ID;
  protected readonly FIELDS_NAME = [Piece.NUMERO_INVENTAIRE, Piece.NOM];
  protected readonly FIELDS_SEPARATOR = " / ";

  private readonly serviceId: number = inject(MAT_DIALOG_DATA);

  protected readonly pieceFormControl: FormControl = new FormControl();
  protected readonly quantiteFormControl: FormControl = new FormControl();
  protected readonly descriptionFormControl: FormControl = new FormControl();

  private service: Service | null = null;

  constructor(private readonly pieceService: PieceService,
              private readonly serviceService: ServiceService,
              private readonly dialogRef: MatDialogRef<ChangementPieceDialogComponent>) {
    this.serviceService
      .get(this.serviceId)
      .subscribe((service: Service): Service => this.service = service);

    NumberFormField.addLogicToFormControl(this.quantiteFormControl, false);
  }

  /**
   * Méthode d'autocomplétion pour la sélection de pièces
   * @param value Valeur
   */
  protected autocompletePiece(value: string): Observable<Piece[]> {
    return this.pieceService.autocomplete(value);
  }

  /**
   * Sauvegarde la machine avec la nouvelle pièce
   */
  protected save(): void {
    if (this.service) {
      let service: Service = structuredClone(this.service);
      let changementPiece: ChangementPiece = new ChangementPiece();
      changementPiece.piece = this.pieceFormControl.value;
      changementPiece.quantite = this.quantiteFormControl.value;
      changementPiece.description = this.descriptionFormControl.value;
      service.changementPieces.push(changementPiece);
      this.serviceService.modify(service).subscribe({
        error: (error: HttpErrorResponse): void => {
          if (error.status === HttpStatusCode.NotAcceptable) {
            for (let validationException of error.error) {
              if (validationException.field == 'description') {
                this.descriptionFormControl.setErrors({
                  "validation": validationException.message,
                }, {emitEvent: true});
                this.descriptionFormControl.markAsTouched();
              } else if (validationException.field == 'quantite') {
                this.quantiteFormControl.setErrors({
                  "validation": validationException.message,
                }, {emitEvent: true});
                this.quantiteFormControl.markAsTouched();
              } else {
                this.pieceFormControl.setErrors({
                  "validation": validationException.message,
                }, {emitEvent: true});
                this.pieceFormControl.markAsTouched();
              }
            }
          }
        },
        next: (service: Service): void => {
          this.dialogRef.close(service);
        }
      })
    }
  }

  protected readonly TextAreaFormField = TextAreaFormField;
}
