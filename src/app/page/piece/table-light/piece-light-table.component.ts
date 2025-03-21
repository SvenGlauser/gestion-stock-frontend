import {Component, Input, ViewChild} from '@angular/core';
import {Column} from '../../../common/table/column/column';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {MODEL_ID} from '../../../common/model';
import {SearchRequest} from '../../../common/search/searchRequest';
import {map, mergeMap, Observable, of, tap} from 'rxjs';
import {SearchResult} from '../../../common/search/searchResult';
import {TableComponent} from '../../../common/table/table.component';
import {PieceDialogComponent} from '../dialog/piece-dialog.component';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {
  Piece,
  PIECE_CATEGORIE,
  PIECE_CATEGORIE_LABEL,
  PIECE_DESCRIPTION,
  PIECE_DESCRIPTION_LABEL,
  PIECE_NOM,
  PIECE_NOM_LABEL,
  PIECE_NUMERO_INVENTAIRE,
  PIECE_NUMERO_INVENTAIRE_LABEL
} from '../piece.model';
import {CATEGORIE_NOM} from '../../categorie/categorie.model';
import {copyNewMachineDataInOldInstance, Machine} from '../../machine/machine.model';
import {MachineService} from '../../machine/machine.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../../../common/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-piece-light-table',
  imports: [
    TableComponent
  ],
  templateUrl: './piece-light-table.component.html',
  styleUrl: './piece-light-table.component.scss'
})
export class PieceLightTableComponent {
  // Définition des colonnes
  protected readonly columns: Column[] = [
    ClassicColumn
      .of(PIECE_NUMERO_INVENTAIRE_LABEL, PIECE_NUMERO_INVENTAIRE, "10%"),
    ClassicColumn
      .of(PIECE_NOM_LABEL, PIECE_NOM, "25%"),
    ClassicColumn
      .of(PIECE_DESCRIPTION_LABEL, PIECE_DESCRIPTION, "30%"),
    ClassicColumn
      .of(PIECE_CATEGORIE_LABEL, PIECE_CATEGORIE.concat(".", CATEGORIE_NOM), "25%"),
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: PieceDialogComponent,
    idField: MODEL_ID,
    clicOnLine: true,
    read: true,
    created: false,
    modify: true,
    delete: false,
    actions: [
      { name: "Retirer la pièce de la machine", action: this.unlinkPiece.bind(this) }
    ]
  };

  @Input({required: true})
  public machine: Machine | null = null;

  @ViewChild(TableComponent)
  public table: TableComponent<Piece> | null = null;

  constructor(private readonly machineService: MachineService,
              private readonly matDialog: MatDialog) {}

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: SearchRequest): Observable<SearchResult<Piece>> {
    const page: number = searchRequest.page ?? 0;
    const pageSize: number = searchRequest.pageSize ?? 10;
    const orignalPiecesList: Piece[] = this.machine?.pieces ?? [];

    let pieces: Piece[] = [...(this.machine?.pieces ?? [])].sort((a, b) => a.numeroInventaire.localeCompare(b.numeroInventaire));

    let numberElementToRemove: number = page * pageSize;

    pieces.splice(0, numberElementToRemove);

    let searchResult: SearchResult<Piece> = {
      currentPage: page,
      pageSize: pageSize,
      totalElements: orignalPiecesList.length,
      totalPages: orignalPiecesList.length / pageSize,
      elements: pieces.slice(0, pageSize),
    }

    return of(searchResult);
  }

  /**
   * Retire la piece de la machine
   * @param piece Pièce à retirer
   */
  private unlinkPiece(piece: Piece): Observable<boolean> {
    if (this.machine) {
      return this.matDialog
        .open(ConfirmationDialogComponent, {
          data: "Voulez-vous vraiment retirer la pièce ?"
        })
        .afterClosed()
        .pipe(mergeMap((confirmation: boolean): Observable<boolean> => {
          if (!this.machine || !confirmation) {
            return of(false);
          }

          let machine = structuredClone(this.machine);
          machine.pieces = machine.pieces.filter(pieceFromFilter => pieceFromFilter.id !== piece.id);

          return this.machineService
            .modify(machine)
            .pipe(
              tap(machine => {
                if (this.machine) {
                  copyNewMachineDataInOldInstance(machine, this.machine);
                }
              }),
              map(() => true));
        }));
    }

    return of(false);
  }
}
