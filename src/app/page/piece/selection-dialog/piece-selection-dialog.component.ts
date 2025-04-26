import {Component, Inject, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {PieceService} from '../piece.service';
import {Observable} from 'rxjs';
import {Model} from '../../../common/model';
import {MachineService} from '../../machine/machine.service';
import {Machine} from '../../machine/machine.model';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {FormControl} from '@angular/forms';
import {ValidationException} from '../../../common/utils/validation-exception';
import {Piece} from '../piece.model';
import {
  AutocompleteMultipleComponent
} from '../../../common/form/input/autocomplete-multiple/autocomplete-multiple.component';

@Component({
  selector: 'app-piece-selection-dialog',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatDialogClose,
    AutocompleteMultipleComponent
  ],
  templateUrl: './piece-selection-dialog.component.html',
  styleUrl: './piece-selection-dialog.component.scss'
})
export class PieceSelectionDialogComponent implements OnInit {
  protected readonly FIELD_ID = Model.ID;
  protected readonly FIELDS_NAME = [Piece.NUMERO_INVENTAIRE, Piece.NOM];
  protected readonly FIELDS_SEPARATOR = " / ";

  protected pieceFormControl: FormControl = new FormControl();
  protected machine: Machine | null = null;

  constructor(private readonly pieceService: PieceService,
              private readonly machineService: MachineService,
              private readonly dialogRef: MatDialogRef<PieceSelectionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public machineId: number) {}

  /**
   * Récupère la machine en cours de traitement
   */
  public ngOnInit(): void {
    this.machineService
      .get(this.machineId)
      .subscribe((machine: Machine) => this.machine = machine);
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
    if (this.pieceFormControl.valid && this.pieceFormControl.value && this.machine) {
      let machine: Machine = structuredClone(this.machine);
      machine.pieces.push(this.pieceFormControl.value);
      this.machineService.modify(machine).subscribe({
        error: (error: HttpErrorResponse): void => {
          if (error.status === HttpStatusCode.NotAcceptable) {
            this.pieceFormControl.setErrors({
              "validation": error.error.map((ValidationException: ValidationException): string => ValidationException.message).join("<br>")
            })
          }
        },
        next: (machine: Machine): void => {
          this.dialogRef.close(machine);
        }
      })
    }
  }
}
