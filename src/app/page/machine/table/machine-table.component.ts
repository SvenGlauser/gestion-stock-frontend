import {Component, Signal, viewChild, viewChildren} from '@angular/core';
import {Column} from '../../../common/table/column/column';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {MachineService} from '../machine.service';
import {AutomaticSearchQuery} from '../../../common/search/automatic/automatic-search-query';
import {map, Observable, of, tap} from 'rxjs';
import {SearchResult} from '../../../common/search/search-result';
import {TableComponent} from '../../../common/table/table.component';
import {MachineDialogComponent} from '../dialog/machine-dialog.component';
import {ClassicColumn} from '../../../common/table/column/classic-column';
import {MethodColumn} from '../../../common/table/column/method-column';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatRow,
  MatRowDef
} from '@angular/material/table';
import {PieceLightTableComponent} from '../../piece/table-light/piece-light-table.component';
import {CustomColumn} from '../../../common/table/column/custom-column';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatBadge, MatBadgeModule} from '@angular/material/badge';
import {MatDialog} from '@angular/material/dialog';
import {PieceSelectionDialogComponent} from '../../piece/selection-dialog/piece-selection-dialog.component';
import {Machine} from '../machine.model';
import {Identite} from '../../identite/identite.model';
import {Model} from '../../../common/model';
import {FilterCombinatorType} from '../../../common/search/automatic/automatic-search-field-combinaison';
import {PersonnePhysiqueService} from '../../identite/personne-physique.service';
import {PersonneMoraleService} from '../../identite/personne-morale.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Roles} from '../../../security/roles';
import {Direction} from '../../../common/search/api/search-field';
import {AutomaticSearchField, FilterType} from '../../../common/search/automatic/automatic-search-field';

@Component({
  selector: 'app-machine-table',
  imports: [
    TableComponent,
    MatCell,
    MatCellDef,
    MatRow,
    MatRowDef,
    MatColumnDef,
    PieceLightTableComponent,
    MatHeaderCell,
    MatHeaderCellDef,
    MatIcon,
    MatIconButton,
    MatBadge,
    MatBadgeModule
  ],
  templateUrl: './machine-table.component.html',
  styleUrl: './machine-table.component.scss'
})
export class MachineTableComponent {
  // Définition des colonnes
  protected columns: Column<AutomaticSearchQuery>[] = [
    CustomColumn.of("", Machine.ROW_EXTENDER, 10),
    ClassicColumn
      .of<AutomaticSearchQuery>(Machine.NOM_LABEL, Machine.NOM, 20)
      .sort(searchQuery => searchQuery.getFilter(Machine.NOM))
      .inputFilter(searchQuery => searchQuery.getFilter(Machine.NOM)),
    ClassicColumn.of(Machine.DESCRIPTION_LABEL, Machine.DESCRIPTION, 45),
    MethodColumn.of(Machine.PROPRIETAIRE_LABEL, Machine.PROPRIETAIRE, 20, (identite: Identite) => identite.getDesignation()),
  ]

  private readonly matTable: Signal<TableComponent<Machine, AutomaticSearchQuery>> = viewChild.required<TableComponent<Machine, AutomaticSearchQuery>>(TableComponent);
  private readonly piecesLightsTables: Signal<readonly PieceLightTableComponent[]> = viewChildren<PieceLightTableComponent>(PieceLightTableComponent);

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: MachineDialogComponent,
    dialogSpecificData: {proprietaire: null},
    idField: Model.ID,
    clicOnLine: true,
    created: true,
    delete: true,
    modify: true,
    read: true,
    actions: [
      {name: "Ajouter une pièce à la machine", action: this.linkPiece.bind(this)}
    ]
  };

  private currentProprietaireType: string | null = null;
  private currentProprietaireId: number | null = null;
  protected proprietaire: Identite | null = null;
  protected extendedRowId: number | null = null;

  constructor(private readonly machineService: MachineService,
              private readonly personnePhysiqueService: PersonnePhysiqueService,
              private readonly personneMoraleService: PersonneMoraleService,
              private readonly route: ActivatedRoute,
              private readonly matDialog: MatDialog) {
    this.route
      .paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params: ParamMap) => {
        this.currentProprietaireType = params.get('typeIdentite') ?? "";
        this.currentProprietaireId = Number.parseInt(params.get('id') ?? "");

        if (this.currentProprietaireType && this.currentProprietaireId) {
          if (this.currentProprietaireType == 'morale') {
            this.personneMoraleService.get(this.currentProprietaireId).subscribe(proprietaire => {
              this.proprietaire = proprietaire;
              this.actionColumnInfo.dialogSpecificData.proprietaire = this.proprietaire;
            });
          } else if (this.currentProprietaireType == 'physique') {
            this.personnePhysiqueService.get(this.currentProprietaireId).subscribe(proprietaire => {
              this.proprietaire = proprietaire;
              this.actionColumnInfo.dialogSpecificData.proprietaire = this.proprietaire;
            });
          }
        }
      });
  }

  /**
   * Récupère une nouvelle AutomaticSearchQuery
   */
  protected getSearchQueryMethod(): AutomaticSearchQuery {
    const fieldNom = new AutomaticSearchField(Machine.NOM, FilterType.STRING_LIKE);
    fieldNom.order = Direction.ASC;

    return new AutomaticSearchQuery([
      fieldNom,
    ]);
  }

  /**
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: AutomaticSearchQuery): Observable<SearchResult<Machine>> {
    if (!this.proprietaire) {
      return of(<SearchResult<Machine>>{
        currentPage: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        elements: <Machine[]>[]
      });
    }

    let searchRequestModified: AutomaticSearchQuery = structuredClone(searchRequest);
    let proprietaireIdField: AutomaticSearchField<number | null> = new AutomaticSearchField(Machine.PROPRIETAIRE_ID, FilterType.EQUAL);
    proprietaireIdField.value = this.proprietaire.id;

    searchRequestModified.combinators.push({
      type: FilterCombinatorType.AND,
      fields: [proprietaireIdField]
    })
    return this.machineService.search(searchRequestModified);
  }

  /**
   * Récupère le nom du tableau
   */
  protected getTableTitle(): string {
    let title: string = 'Liste des machines';

    if (this.proprietaire) {
      title += " - ";
      title += this.proprietaire.getDesignation();
    }

    return title;
  }

  /**
   * Affiche / Cache le tableau des pieces pour cet élément
   * @param element Machine en question
   */
  protected togglePieces(element: Machine): void {
    if (this.extendedRowId === element.id) {
      this.extendedRowId = null;
    } else {
      this.extendedRowId = element.id;
    }
    this.matTable().renderRows();
  }

  /**
   * Indique si la ligne supplémentaire doit s'afficher ou non
   * @param _index Index de l'élément
   * @param rowData Machine
   */
  protected viewRow(_index: number, rowData: Machine): boolean {
    return this.extendedRowId === rowData.id;
  }

  /**
   * Ouvre un dialog de saisie de pièce et ajoute cette pièce à la machine
   * @param machine
   */
  private linkPiece(machine: Machine): Observable<boolean> {
    return this.matDialog
      .open(PieceSelectionDialogComponent, {
        data: machine.id,
      })
      .afterClosed()
      .pipe(
        tap((returnedMachine: Machine | null) => {
          if (returnedMachine) {
            machine.nom = returnedMachine.nom;
            machine.description = returnedMachine.description;
            machine.proprietaire = returnedMachine.proprietaire;
            machine.pieces = returnedMachine.pieces;

            for (const table of this.piecesLightsTables()) {
              if (table.machine().id === machine.id) {
                table.table().update();
              }
            }
          }
        }),
        map(() => false));
  }

  protected readonly Roles = Roles;
}
