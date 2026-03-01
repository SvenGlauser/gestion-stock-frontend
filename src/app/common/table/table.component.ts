import {
  afterNextRender,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  InputSignal,
  linkedSignal,
  model,
  ModelSignal,
  signal,
  Signal,
  untracked,
  viewChild,
  WritableSignal
} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {SearchResult} from '../search/search-result';
import {Column} from './column/column';
import {debounceTime, mergeMap, Observable, of, Subject, tap} from 'rxjs';
import {MatSort, MatSortHeader, Sort, SortDirection} from '@angular/material/sort';
import {MatFormField, MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {AutocompleteComponent} from '../form/input/autocomplete/autocomplete.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgClass} from '@angular/common';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {DialogData, DialogType} from '../form/dialog/dialog-data';
import {MatDialog} from '@angular/material/dialog';
import {ActionColumnInfo} from './action-column.info';
import {InputFilter} from './column/filter/input-column-filter';
import {AutocompleteFilter} from './column/filter/autocomplete-column-filter';
import {LinkColumn} from './column/link-column';
import {RouterLink} from '@angular/router';
import {CustomColumn} from './column/custom-column';
import {AutocompleteEnumFilter} from './column/filter/autocomplete-enunm-column-filter';
import {AutocompleteEnumComponent} from '../form/input/autocomplete/autocomplete-enum.component';
import {ComponentType} from '@angular/cdk/portal';
import {AbstractFormDialogComponent} from '../form/dialog/abstract-form-dialog.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Roles} from '../../security/roles';
import {AuthentificationService} from '../../security/authentification.service';
import {SearchQuery} from '../search/custom/search-query';
import {Direction, SearchField} from '../search/api/search-field';
import {ColumnChooserComponent} from './column-chooser/column-chooser.component';

@Component({
  selector: 'app-table',
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    MatSort,
    MatSortHeader,
    MatInput,
    MatFormField,
    FormsModule,
    AutocompleteComponent,
    MatProgressSpinner,
    MatIcon,
    MatIconButton,
    NgClass,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatButton,
    RouterLink,
    AutocompleteEnumComponent,
    ColumnChooserComponent
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent<T extends Record<string, any>, R extends SearchQuery> {
  // Constantes
  protected readonly DialogType = DialogType;
  protected readonly InputFilter = InputFilter;
  protected readonly AutocompleteFilter = AutocompleteFilter;
  protected readonly AutocompleteEnumFilter = AutocompleteEnumFilter;
  protected readonly LinkColumn = LinkColumn;

  // Configuration
  private readonly alwaysDisplayedColumns: string[] = ["actions"];

  // Input
  public readonly title: InputSignal<string> = input("");
  public readonly columns: ModelSignal<Column<R>[]> = model.required();
  public readonly initSearchQueryMethod: InputSignal<() => R> = input.required();
  public readonly updateMethod: InputSignal<(searchQuery: R) => Observable<SearchResult<T>>> = input.required();
  public readonly actionColumnInfo: InputSignal<ActionColumnInfo> = input.required();

  // Access
  public readonly readAccessRole: InputSignal<Roles> = input.required();
  public readonly editAccessRole: InputSignal<Roles> = input.required();

  public readonly haveReadAccessRole: Signal<boolean> = computed(() => this.authentificationService.hasRole(this.readAccessRole()));
  public readonly haveEditAccessRole: Signal<boolean> = computed(() => this.authentificationService.hasRole(this.editAccessRole()));

  // Enfants
  private readonly paginator: Signal<MatPaginator | undefined> = viewChild(MatPaginator);
  private readonly table: Signal<MatTable<T> | undefined> = viewChild(MatTable);

  // Contenu
  private readonly columnDefs: Signal<readonly MatColumnDef[]> = contentChildren(MatColumnDef);
  private readonly rowDefs: Signal<readonly MatRowDef<T>[]> = contentChildren(MatRowDef);

  // Données
  private readonly data: WritableSignal<SearchResult<T> | undefined> = signal(undefined);
  protected readonly tableLength: Signal<number> = computed((): number => this.data()?.elements.length ?? 0);
  protected readonly tableElements: Signal<T[]> = computed((): T[] => this.data()?.elements ?? []);

  // Configuration table
  protected readonly allColumnsToDisplayAsString: Signal<string[]> = computed((): string[] => this.getAllColumnsToDisplay());
  protected readonly columnsToDisplay: Signal<Column<R>[]> = computed((): Column<R>[] => this.getColumnsToDisplay());
  protected readonly columnsToGenerateAutomatically: Signal<Column<R>[]> = computed((): Column<R>[] => this.getColumnsToGenerateList());
  protected readonly columnsWidth: Signal<number> = computed((): number => this.getColumnsWidth());
  protected readonly actionsColumnWidth: Signal<number> = signal(10);

  // Configuration tri par défaut
  private readonly firstSortableColumn: WritableSignal<Column<R> | null> = signal(null);
  protected readonly defaultSortDirection: Signal<SortDirection> = computed((): SortDirection => this.getDefaultSortDirection());
  protected readonly defaultSortColumn: Signal<string> = computed((): string => this.getDefaultSortColumn());

  // Configuration de l'affichage
  protected readonly isLoading: WritableSignal<boolean> = signal(false);
  protected readonly existFilter: Signal<boolean> = computed((): boolean => this.getExistFilter());
  protected readonly viewFilter: WritableSignal<boolean> = linkedSignal((): boolean => this.existFilter());

  // Événement de recherche
  private readonly searchEvent: Subject<void> = new Subject();

  // Champ dans lequel sont stockés les filtres pour la prochaine requête
  private readonly searchQuery: WritableSignal<R | null> = signal(null);

  constructor(private readonly matDialog: MatDialog,
              private readonly authentificationService: AuthentificationService) {
    // Initialise l'événement qui doit s'exécuter lors d'une recherche
    this.searchEvent
      .pipe(
        tap((): void => this.isLoading.set(true)),
        debounceTime(500),
        mergeMap(() => {
          const searchQuery: R | null = this.searchQuery();
          if (searchQuery !== null && this.haveReadAccessRole()) {
            return this.updateMethod()(searchQuery);
          } else {
            return of(<SearchResult<T>>{
              currentPage: 0,
              elements: [],
              pageSize: 0,
              totalPages: 0,
              totalElements: 0,
            });
          }
        }),
        takeUntilDestroyed())
      .subscribe((result) => {
        this.isLoading.set(false);
        this.updateTable(result);
      });

    effect((): void => {
      const table: MatTable<T> | undefined = this.table();
      const manuallyAddedRows: readonly MatRowDef<T>[] = this.rowDefs();
      const manuallyAddedColumns: readonly MatColumnDef[] = this.columnDefs();

      if (table !== undefined) {
        untracked(() => this.updateManualRowsAndColumns(table, manuallyAddedRows, manuallyAddedColumns));
      }
    }, {debugName: "Manual columns/rows update"});

    effect((): void => {
      const columns: Column<R>[] = this.columns();

      untracked(() => this.updateSearchRequestFilter(columns));
    }, {debugName: "SearchRequest filters initialize"})

    afterNextRender((): void => {
      untracked((): void => {
        const columns: Column<R>[] = this.columns();
        const searchQuery: R = this.initSearchQueryMethod()();

        for (const column of columns) {
          column.initSortFromSearchQuery(searchQuery);
          for (const filter of column.filters) {
            filter.initValueFromSearchQuery(searchQuery);
          }
        }

        this.searchQuery.set(searchQuery);
        this.firstSortableColumn.set(this.getFirstSortableColum());

        this.update();
      })
    });
  }

  /**
   * Actualise les colonnes de la table
   */
  public renderRows(): void {
    this.table()?.renderRows();
  }

  /**
   * Met à jour la table
   */
  public update(): void {
    this.searchEvent.next();
  }

  /**
   * Recherche en fonction de la nouvelle page
   * @param page Nouvelle page
   */
  protected changePage(page: PageEvent): void {
    const searchQuery: R | null = this.searchQuery();
    if (!searchQuery) {
      return;
    }

    searchQuery.page = page.pageIndex;
    searchQuery.pageSize = page.pageSize;

    this.update();
  }

  /**
   * Tri la table
   * @param sort Nouveau trie
   */
  protected sort(sort: Sort): void {
    const searchQuery: R | null = this.searchQuery();
    if (!searchQuery) {
      return;
    }

    searchQuery.page = 0;

    for (const column of this.columns()) {
      if (column.field == sort.active) {
        switch (sort.direction) {
          case "asc":
            column.sortOrder = Direction.ASC;
            break;
          case "desc":
            column.sortOrder = Direction.DESC;
            break;
          case "":
            column.sortOrder = null;
            break;
        }
      } else {
        column.sortOrder = null;
      }

      column.pushSortToSearchQuery(searchQuery);
    }

    this.update();
  }

  /**
   * Filtre la table
   */
  protected filter(): void {
    const searchQuery: R | null = this.searchQuery();
    if (!searchQuery) {
      return;
    }

    searchQuery.page = 0;

    for (const filter of this.columns().flatMap(column => column.filters)) {
      filter.pushValueToSearchQuery(searchQuery);
    }

    this.update();
  }

  /**
   * Met à jour les données affichées dans la table
   * @param searchResult Résultat de la recherche
   */
  private updateTable(searchResult: SearchResult<T>): void {
    this.data.set(searchResult);

    const paginator: MatPaginator | undefined = this.paginator();
    if (paginator !== undefined) {
      paginator.pageIndex = searchResult.currentPage;
      paginator.pageSize = searchResult.pageSize;
      paginator.length = searchResult.totalElements;
    }
  }

  /**
   * Ouvre un dialog
   * @param element Élément à afficher dans le dialog
   * @param type Type de dialog
   */
  public openDialog(element: T | null, type: DialogType): void {
    let dialogComponent: ComponentType<AbstractFormDialogComponent<any, any>> | null = null;

    const dialogComponentFromActions = this.actionColumnInfo().dialogComponent
    const dialogComponentMethodFromActions = this.actionColumnInfo().dialogComponentMethod
    if (dialogComponentFromActions) {
      dialogComponent = dialogComponentFromActions;
    } else if (dialogComponentMethodFromActions) {
      dialogComponent = dialogComponentMethodFromActions(element);
    }

    if (!dialogComponent) {
      return;
    }

    const dialogRef = this.matDialog.open(dialogComponent, {
      maxWidth: 1000,
      data: <DialogData>{
        type: type,
        id: element ? element[this.actionColumnInfo().idField] : null,
        specificData: this.actionColumnInfo().dialogSpecificData,
      },
    });

    dialogRef.afterClosed().subscribe(modification => {
      if (modification) {
        this.update();
      }
    });
  }

  /**
   * Efface les filtres
   */
  protected clearAllFilters(): void {
    const searchQuery: R | null = this.searchQuery();
    if (!searchQuery) {
      return;
    }

    for (const filter of this.columns().flatMap(column => column.filters)) {
      filter.clear(searchQuery);
    }

    this.filter();
  }

  /**
   * Retourne la liste des colonnes à créer
   */
  private getColumnsToGenerateList(): Column<R>[] {
    return this.columns().filter(column => !(CustomColumn.isInstanceOf(column)));
  }

  /**
   * Retourne la largeur totale des colonnes affichées
   */
  private getColumnsWidth(): number {
    let sum: number = 0;

    for (const column of this.columnsToDisplay()) {
      sum += column.width;
    }

    sum += this.actionsColumnWidth();
    return sum;
  }

  /**
   * Lance une méthode et rafraichit si nécessaire
   *
   * @param action Méthode à exécuter
   * @param element Elément
   */
  protected run(action: (value: any) => Observable<boolean>, element: T): void {
    action(element).subscribe((needToRefresh: boolean) => {
      if (needToRefresh) {
        this.update();
      }
    })
  }

  /**
   * Vérifier si au moins une action est affiché
   * @param element
   */
  protected canViewOneAction(element: T): boolean {
    for (const action of this.actionColumnInfo().actions ?? []) {
      if (!action.condition || action.condition(element)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Récupère le premier tri
   */
  private getDefaultSortColumn(): string {
    let column: Column<R> | null = this.firstSortableColumn();

    if (column) {
      return column.field;
    }

    return "";
  }

  /**
   * Récupère le premier ordre de tri
   */
  private getDefaultSortDirection(): SortDirection {
    let column: Column<R> | null = this.firstSortableColumn();

    if (column) {
      switch (column.sortOrder) {
        case Direction.ASC:
          return "asc";
        case Direction.DESC:
          return "desc";
        default:
          return "";
      }
    }

    return "";
  }

  /**
   * Récupère la première colonne à ordrer
   */
  private getFirstSortableColum(): Column<R> | null {
    let columns: Column<R>[] = this.columns()
      .filter(column => column.isSortable() && column.sortOrder);

    if (columns.length == 0) {
      columns = this.columns().filter(column => column.isSortable());
    }

    if (columns.length > 0) {
      return columns[0];
    }

    return null;
  }

  /**
   * Mets à jour les colonnes manuelles dans la MatTable
   * @param table Table
   * @param manuallyAddedRows Lignes manuelles
   * @param manuallyAddedColumns Colonnes manuelles
   */
  private updateManualRowsAndColumns(table: MatTable<T>,
                                     manuallyAddedRows: readonly MatRowDef<T>[],
                                     manuallyAddedColumns: readonly MatColumnDef[]): void {
    for (const manuallyAddedRow of manuallyAddedRows) {
      table.addRowDef(manuallyAddedRow);
    }

    for (const manuallyAddedColumn of manuallyAddedColumns) {
      table.addColumnDef(manuallyAddedColumn);
    }
  }

  /**
   * Mets à jour la liste des filtres de la SearchRequest
   * @param columns Nouvelles colonnes
   */
  private updateSearchRequestFilter(columns: Column<R>[]): void {
    const searchQuery: R | null = this.searchQuery();
    if (!searchQuery) {
      return;
    }

    for (let column of columns) {
      for (const filter of column.filters) {
        filter.pushValueToSearchQuery(searchQuery);
      }

      if (column.isSortable()) {
        let field: SearchField<any> | null;
        if (column.sortableFieldGetter) {
          field = column.sortableFieldGetter(searchQuery);
        } else {
          field = null;
        }

        if (field !== null) {
          field.order = column.sortOrder;
        }
      }
    }
  }

  /**
   * Récupère la liste des colonnes à afficher
   */
  private getColumnsToDisplay(): Column<R>[] {
    return this.columns().filter(column => column.view);
  }

  /**
   * Récupère la liste des colonnes à afficher en string
   */
  private getAllColumnsToDisplay(): string[] {
    return this.columnsToDisplay()
      .map(column => column.field)
      .concat(this.alwaysDisplayedColumns);
  }

  /**
   * Vérifie s'il existe des filtres dans les nouvelles colonnes de l'input
   */
  private getExistFilter(): boolean {
    return this.columns().some(column => column.filters.length !== 0);
  }
}
