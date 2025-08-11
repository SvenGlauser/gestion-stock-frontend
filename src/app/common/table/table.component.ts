import {
  afterNextRender,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  InputSignal,
  linkedSignal,
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
import {SearchResult} from '../search/searchResult';
import {Column} from './column/column';
import {SearchRequest} from '../search/searchRequest';
import {Filter, Order} from '../search/filter';
import {debounceTime, mergeMap, Observable, Subject, tap} from 'rxjs';
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
import {ColumnFilter} from './column/filter/column-filter';
import {InputFilter} from './column/filter/input-column-filter';
import {AutocompleteFilter} from './column/filter/autocomplete-column-filter';
import {LinkColumn} from './column/link-column';
import {RouterLink} from '@angular/router';
import {CustomColumn} from './column/custom-column';
import {AutocompleteEnumFilter} from './column/filter/autocomplete-enunm-column-filter';
import {AutocompleteEnumComponent} from '../form/input/autocomplete/autocomplete-enum.component';
import {FilterCombinatorType} from '../search/filter-combinator';
import {ComponentType} from '@angular/cdk/portal';
import {AbstractFormDialogComponent} from '../form/dialog/abstract-form-dialog.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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
    AutocompleteEnumComponent
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent<T extends Record<string, any>> {
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
  public readonly columns: InputSignal<Column[]> = input.required();
  public readonly updateMethod: InputSignal<((searchRequest: SearchRequest) => Observable<SearchResult<T>>)> = input.required();
  public readonly actionColumnInfo: InputSignal<ActionColumnInfo> = input.required();

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
  protected readonly displayedColumns: Signal<string[]> = computed((): string[] => this.getColumnsToDisplay());
  protected readonly columnsToGenerateAutomatically: Signal<Column[]> = computed((): Column[] => this.getColumnsToGenerateList())

  // Configuration tri par défaut
  private readonly firstSortabeColumn: Signal<Column | null> = computed((): Column | null => this.getFirstSortableColum())
  protected readonly defaultSortDirection: Signal<SortDirection> = computed((): SortDirection => this.getDefaultSortDirection())
  protected readonly defaultSortColumn: Signal<string> = computed((): string => this.getDefaultSortColumn());

  // Configuration de l'affichage
  protected readonly isLoading: WritableSignal<boolean> = signal(false);
  protected readonly existFilter: Signal<boolean> = computed((): boolean => this.getExistFilter());
  protected readonly viewFilter: WritableSignal<boolean> = linkedSignal((): boolean => this.existFilter());

  // Événement de recherche
  private readonly searchEvent: Subject<void> = new Subject();

  // Champ dans lequel sont stockés les filtres pour la prochaine requête
  private readonly searchRequest: SearchRequest = {
    page: 0,
    pageSize: null,
    combinators: [{
      filters: [],
      type: FilterCombinatorType.AND,
    }]
  };

  constructor(private readonly matDialog: MatDialog) {
    // Initialise l'événement qui doit s'exécuter lors d'une recherche
    this.searchEvent
      .pipe(
        tap((): void => this.isLoading.set(true)),
        debounceTime(500),
        mergeMap(() => {
          return this.updateMethod()(this.searchRequest);
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
      const columns: Column[] = this.columns();

      untracked(() => this.updateSearchRequestFilter(columns));
    }, {debugName: "SearchRequest filters initialize"})

    afterNextRender((): void => this.update());
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
    this.searchRequest.page = page.pageIndex;
    this.searchRequest.pageSize = page.pageSize;

    this.update();
  }

  /**
   * Tri la table
   * @param sort Nouveau trie
   */
  protected sort(sort: Sort): void {
    this.searchRequest.page = 0;

    this.searchRequest.combinators[0].filters.forEach((filter: Filter): void => {
      if (filter.field === sort.active) {
        switch (sort.direction) {
          case "asc":
            filter.order = Order.ASC;
            break;
          case "desc":
            filter.order = Order.DESC;
            break;
          case "":
            filter.order = undefined;
            break;
        }
      } else {
        filter.order = undefined;
      }
    });

    this.update();
  }

  /**
   * Filtre la table
   */
  protected filter(): void {
    this.searchRequest.page = 0;

    this.searchRequest.combinators[0].filters.forEach((filter: Filter): void => {
      let columnFilter: ColumnFilter | undefined = this.columns().flatMap(column => column.filters).find(columnFilter => columnFilter.filterField === filter.field);

      if (columnFilter !== undefined) {
        let value = columnFilter.getValue();
        if (value === '') {
          value = null;
        }

        filter.value = value;
      }
    });

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
    this.columns()
      .flatMap(column => column.filters)
      .forEach((filter) => {
        filter.filterValue = null;
      });

    this.filter();
  }

  /**
   * Retourne la liste des colonnes à créer
   */
  private getColumnsToGenerateList(): Column[] {
    return this.columns().filter(column => !(column instanceof CustomColumn));
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
    let column: Column | null = this.firstSortabeColumn();

    if (column) {
      return column.field;
    }

    return "";
  }

  /**
   * Récupère le premier ordre de tri
   */
  private getDefaultSortDirection(): SortDirection {
    let column: Column | null = this.firstSortabeColumn();

    if (column) {
      switch (column.sortDefaultValue) {
        case Order.ASC:
          return "asc";
        case Order.DESC:
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
  private getFirstSortableColum(): Column | null {
    let columns: Column[] = this.columns().filter(column => column.sortable && column.sortDefaultValue);

    if (columns.length == 0) {
      columns = this.columns().filter(column => column.sortable);
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
  private updateSearchRequestFilter(columns: Column[]): void {
    if (this.searchRequest.combinators.length === 0) {
      return;
    }

    const filtersToGenerate: Filter[] = [];

    for (let column of columns) {
      const filtersToGenerateForThisColumn: Filter[] = [];

      for (const filter of column.filters) {
        filtersToGenerateForThisColumn.push({
          field: filter.filterField,
          value: filter.filterValue ?? null,
          type: filter.filterType
        });
      }

      if (column.sortable) {
        const order: Order | undefined = column.sortDefaultValue ?? undefined;

        let needToGenerateOne: boolean = true;

        for (const filter of filtersToGenerateForThisColumn) {
          if (filter.field == column.field) {
            filter.order = order;
            needToGenerateOne = false;
          }
        }

        if (needToGenerateOne) {
          filtersToGenerateForThisColumn.push({
            field: column.field,
            order: order,
          });
        }
      }

      filtersToGenerate.push(...filtersToGenerateForThisColumn);
    }

    const filtersToKeep: Filter[] = [];

    for (const filterToGenerate of filtersToGenerate) {
      const currentFilter: Filter | undefined = this.searchRequest.combinators[0].filters
        .find(filter => filter.field === filterToGenerate.field);

      if (currentFilter === undefined) {
        filtersToKeep.push(filterToGenerate);
      } else {
        filtersToKeep.push(currentFilter);
      }
    }

    this.searchRequest.combinators[0].filters = filtersToKeep;
  }

  /**
   * Récupère la liste des colonnes à afficher
   */
  private getColumnsToDisplay(): string[] {
    return this.columns()
      .map(column => column.field)
      .concat(this.alwaysDisplayedColumns);
  }

  /**
   * Vérifie s'il existe des filtres dans les nouvelles colonnes de l'input
   */
  private getExistFilter(): boolean {
    return this.columns().filter(column => column.filters.length !== 0).length !== 0
  }
}
