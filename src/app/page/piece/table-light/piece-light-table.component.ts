import {Component, input, InputSignal, Signal, viewChild} from '@angular/core';
import {Column} from '../../../common/table/column/column';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {SearchRequest} from '../../../common/search/searchRequest';
import {map, mergeMap, Observable, of, tap} from 'rxjs';
import {SearchResult} from '../../../common/search/searchResult';
import {TableComponent} from '../../../common/table/table.component';
import {PieceDialogComponent} from '../dialog/piece-dialog.component';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {Machine} from '../../machine/machine.model';
import {MachineService} from '../../machine/machine.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../../../common/confirmation-dialog/confirmation-dialog.component';
import {Piece} from '../piece.model';
import {Model} from '../../../common/model';

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
      .of(Piece.NUMERO_INVENTAIRE_LABEL, Piece.NUMERO_INVENTAIRE, "10%"),
    ClassicColumn
      .of(Piece.NOM_LABEL, Piece.NOM, "25%"),
    ClassicColumn
      .of(Piece.DESCRIPTION_LABEL, Piece.DESCRIPTION, "30%"),
    ClassicColumn
      .of(Piece.CATEGORIE_LABEL, Piece.CATEGORIE_NOM, "25%"),
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: PieceDialogComponent,
    idField: Model.ID,
    clicOnLine: true,
    read: true,
    created: false, // Ne pas activer comme ça simplement, car la recherche ne recherche pas les nouvelles valeurs en DB
    modify: false, // Ne pas activer comme ça simplement, car la recherche ne recherche pas les nouvelles valeurs en DB
    delete: false, // Ne pas activer comme ça simplement, car la recherche ne recherche pas les nouvelles valeurs en DB
    actions: [
      {name: "Retirer la pièce de la machine", action: this.unlinkPiece.bind(this)}
    ]
  };

  public readonly machine: InputSignal<Machine> = input.required();
  public readonly table: Signal<TableComponent<Piece>> = viewChild.required<TableComponent<Piece>>(TableComponent);

  constructor(private readonly machineService: MachineService,
              private readonly matDialog: MatDialog) {
  }

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: SearchRequest): Observable<SearchResult<Piece>> {
    const page: number = searchRequest.page ?? 0;
    const pageSize: number = searchRequest.pageSize ?? 10;
    const orignalPiecesList: Piece[] = this.machine().pieces ?? [];

    let pieces: Piece[] = [...(this.machine().pieces ?? [])].sort((a, b) => a.numeroInventaire!.localeCompare(b.numeroInventaire!));

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
    return this.matDialog
      .open(ConfirmationDialogComponent, {
        data: "Voulez-vous vraiment retirer la pièce ?"
      })
      .afterClosed()
      .pipe(mergeMap((confirmation: boolean): Observable<boolean> => {
        if (!this.machine() || !confirmation) {
          return of(false);
        }

        let machine = structuredClone(this.machine());
        machine.pieces = machine.pieces.filter(pieceFromFilter => pieceFromFilter.id !== piece.id);

        return this.machineService
          .modify(machine)
          .pipe(
            tap(machine => {
              this.machine().nom = machine.nom;
              this.machine().description = machine.description;
              this.machine().proprietaire = machine.proprietaire;
              this.machine().pieces = machine.pieces;
            }),
            map(() => true));
      }));
  }
}
