import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Column} from '../../../common/table/column/column';
import {Filter, FilterType, Order} from '../../../common/search/filter';
import {ActionColumnInfo} from '../../../common/table/action-column.info';
import {MachineService} from '../machine.service';
import {SearchRequest} from '../../../common/search/searchRequest';
import {map, Observable, of, tap} from 'rxjs';
import {SearchResult} from '../../../common/search/searchResult';
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
import {Identite} from '../../contact/identite.model';
import {Model} from '../../../common/model';
import {FilterCombinatorType} from '../../../common/search/filter-combinator';
import {PersonnePhysiqueService} from '../../contact/personne-physique.service';
import {PersonneMoraleService} from '../../contact/personne-morale.service';

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
export class MachineTableComponent implements OnInit {
  // Définition des colonnes
  protected readonly columns: Column[] = [
    CustomColumn.of("", Machine.ROW_EXTENDER, "10%"),
    ClassicColumn
      .of(Machine.NOM_LABEL, Machine.NOM, "20%")
      .sort(Order.ASC)
      .inputFilterOnSameField(),
    ClassicColumn.of(Machine.DESCRIPTION_LABEL, Machine.DESCRIPTION, "40%"),
    MethodColumn.of(Machine.PROPRIETAIRE_LABEL, Machine.PROPRIETAIRE, "20%", (identite: Identite) => identite.getDesignation()),
  ]

  // Utilisé pour udpate la dataTable
  @ViewChild(TableComponent)
  public matTable: TableComponent<Machine> | null = null;

  // Utilisé pour udpate la dataTable
  @ViewChildren(PieceLightTableComponent)
  public piecesLightsTables:  QueryList<PieceLightTableComponent> | null = null;

  // Définition des actions possibles
  protected readonly actionColumnInfo: ActionColumnInfo = {
    dialogComponent: MachineDialogComponent,
    dialogSpecificData: { proprietaire: null },
    idField: Model.ID,
    clicOnLine: true,
    created: true,
    delete: true,
    modify: true,
    read: true,
    actions: [
      { name: "Ajouter une pièce à la machine", action: this.linkPiece.bind(this) }
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
              private readonly matDialog: MatDialog) {}

  /**
   * Récupère le proprietaire
   */
  public ngOnInit(): void {
    // For subscribing to the observable paramMap...
    this.route.paramMap.subscribe((params: ParamMap) => {
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
   * Récupère la liste à afficher dans le tableau
   * @param searchRequest SearchRequest
   */
  protected getUpdateMethod(searchRequest: SearchRequest): Observable<SearchResult<Machine>> {
    if (!this.proprietaire) {
      return of(<SearchResult<Machine>>{
        currentPage: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        elements: <Machine[]>[]
      });
    }

    let searchRequestModified: SearchRequest = structuredClone(searchRequest);
    searchRequestModified.combinators.push({
      filters: [
        <Filter>{
        field: Machine.PROPRIETAIRE_ID,
        value: this.proprietaire.id,
        type: FilterType.EQUAL,
        order: undefined,
      }],
      type: FilterCombinatorType.AND})
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
    this.matTable?.table?.renderRows();
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
            if (this.piecesLightsTables) {
              this.piecesLightsTables.forEach(table => {
                if (table.machine?.id === machine.id) {
                  table.table!.update();
                }
              })
            }
          }
        }),
        map(() => false));
  }
}
