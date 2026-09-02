import {Component, input, InputSignal, Signal, viewChild} from '@angular/core';
import {Column} from '../../../common/table/column/column';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {AutomaticSearchQuery} from '../../../common/search/automatic/automatic-search-query';
import {map, mergeMap, Observable, of, tap} from 'rxjs';
import {SearchResult} from '../../../common/search/search-result';
import {TableComponent} from '../../../common/table/table.component';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../../../common/confirmation-dialog/confirmation-dialog.component';
import {Model} from '../../../common/model';
import {Roles} from '../../../security/roles';
import {ChangementPiece} from '../changement-piece.model';
import {Service} from '../../service/service.model';
import {ServiceService} from '../../service/service.service';

@Component({
  selector: 'app-changement-piece-table',
  imports: [
    TableComponent
  ],
  templateUrl: './changement-piece-table.component.html',
  styleUrl: './changement-piece-table.component.scss'
})
export class ChangementPieceTableComponent {
  // Définition des colonnes
  protected columns: Column<AutomaticSearchQuery>[] = [
    ClassicColumn
      .of(ChangementPiece.PIECE_LABEL, ChangementPiece.PIECE_NOM, 30),
    ClassicColumn
      .of(ChangementPiece.QUANTITE_LABEL, ChangementPiece.QUANTITE, 30),
    ClassicColumn
      .of(ChangementPiece.DESCRIPTION_LABEL, ChangementPiece.DESCRIPTION, 30),
  ]

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: null,
    idField: Model.ID,
    clicOnLine: 'none',
    read: false,
    created: false, // Ne pas activer comme ça simplement, car la recherche ne recherche pas les nouvelles valeurs en DB
    modify: false, // Ne pas activer comme ça simplement, car la recherche ne recherche pas les nouvelles valeurs en DB
    delete: false, // Ne pas activer comme ça simplement, car la recherche ne recherche pas les nouvelles valeurs en DB
    actions: [
      {name: "Retirer la pièce du service", action: this.unlinkPiece.bind(this)}
    ]
  };

  public readonly service: InputSignal<Service> = input.required();
  public readonly table: Signal<TableComponent<ChangementPiece, AutomaticSearchQuery>> = viewChild.required<TableComponent<ChangementPiece, AutomaticSearchQuery>>(TableComponent);

  constructor(private readonly serviceService: ServiceService,
              private readonly matDialog: MatDialog) {
  }

  /**
   * Récupère une nouvelle PieceSearchQuery
   */
  protected getSearchQueryMethod(): AutomaticSearchQuery {
    return new AutomaticSearchQuery();
  }

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchQuery AutomaticSearchQuery
   */
  protected getUpdateMethod(searchQuery: AutomaticSearchQuery): Observable<SearchResult<ChangementPiece>> {
    const page: number = searchQuery.page ?? 0;
    const pageSize: number = searchQuery.pageSize ?? 10;
    const orignalPiecesList: ChangementPiece[] = this.service().changementPieces ?? [];

    let pieces: ChangementPiece[] = [...(this.service().changementPieces ?? [])].sort((a, b) => a.piece!.numeroInventaire!.localeCompare(b.piece!.numeroInventaire!));

    let numberElementToRemove: number = page * pageSize;

    pieces.splice(0, numberElementToRemove);

    let searchResult: SearchResult<ChangementPiece> = {
      currentPage: page,
      pageSize: pageSize,
      totalElements: orignalPiecesList.length,
      totalPages: orignalPiecesList.length / pageSize,
      elements: pieces.slice(0, pageSize),
    }

    return of(searchResult);
  }

  /**
   * Retire la piece du service
   * @param changementPiece Pièce à retirer
   */
  private unlinkPiece(changementPiece: ChangementPiece): Observable<boolean> {
    return this.matDialog
      .open(ConfirmationDialogComponent, {
        data: "Voulez-vous vraiment retirer la pièce ?"
      })
      .afterClosed()
      .pipe(mergeMap((confirmation: boolean): Observable<boolean> => {
        if (!this.service() || !confirmation) {
          return of(false);
        }

        let service = new Service(this.service());
        service.changementPieces = service.changementPieces.filter(pieceFromFilter => pieceFromFilter.id !== changementPiece.id);

        return this.serviceService
          .modify(service)
          .pipe(
            tap(service => {
              this.service().machine = service.machine;
              this.service().date = service.date;
              this.service().duree = service.duree;
              this.service().divers = service.divers;
              this.service().descriptionTravaux = service.descriptionTravaux;
              this.service().changementPieces = service.changementPieces;
            }),
            map(() => true));
      }));
  }

  protected readonly Roles = Roles;
}
