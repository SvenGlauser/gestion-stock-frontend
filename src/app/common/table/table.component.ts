import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
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
import {debounceTime, mergeMap, Observable, tap} from 'rxjs';
import {MatSort, MatSortHeader, Sort} from '@angular/material/sort';
import {MatFormField, MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {AutocompleteComponent} from '../form/input/autocomplete/autocomplete.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgClass} from '@angular/common';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {DialogData, DialogType} from '../dialog/dialog-data';
import {MatDialog} from '@angular/material/dialog';
import {ActionColumnInfo} from './action-column.info';
import {ColumnFilter} from './column/filter/column-filter';
import {InputFilter} from './column/filter/input-column-filter';
import {AutocompleteFilter} from './column/filter/autocomplete-column-filter';
import {LinkColumn} from './column/link-column';

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
    MatButton
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent<T extends Record<string, any>> implements OnInit, AfterViewInit {
  // Constantes
  protected readonly DialogType = DialogType;
  protected readonly InputFilter = InputFilter;
  protected readonly AutocompleteFilter = AutocompleteFilter;

  @Input()
  public title: string = "";

  // Configuration des colonnes
  @Input({required: true})
  public columns: Column[] = [];

  // Méthode de mise à jour
  @Input({required: true})
  public updateMethod: ((searchRequest: SearchRequest) => Observable<SearchResult<T>>) | null = null;

  // Composant à afficher dans le dialog
  @Input({required: true})
  public actionColumnInfo: ActionColumnInfo = {
    dialogComponent: null,
    idField: '',
    clicOnLine: false,
    created: false,
    delete: false,
    modify: false,
    read: false
  };

  // Composant de pagination
  @ViewChild(MatPaginator)
  protected paginator: MatPaginator | undefined;

  // Données pour la MatTable
  protected data: SearchResult<T> | undefined;
  protected displayedColumns: string[] = ["actions"];

  // Configuration de l'affichage
  protected isLoadingData: boolean = false;
  protected viewFilter: boolean = true;

  // Événement de recherche
  private readonly searchEvent: EventEmitter<void> = new EventEmitter();

  // Champ dans lequel sont stockés les filtres pour la prochaine requête
  private readonly searchRequest: SearchRequest = {
    page: 0,
    pageSize: null,
    filters: []
  };

  constructor(private readonly cd: ChangeDetectorRef,
              private readonly matDialog: MatDialog) {}

  /**
   * Initialise la data table
   */
  public ngOnInit(): void {
    // Initialise l'événement qui doit s'exécuter lors d'une recherche
    this.searchEvent
      .pipe(
        tap(() => {
          this.isLoadingData = true;
          this.cd.detectChanges();
        }),
        debounceTime(500),
        mergeMap(() => {
          return this.updateMethod!(this.searchRequest);
        }))
      .subscribe((result) => {
        this.isLoadingData = false;
        this.updateTable(result);
      });

    // Crée tous les filtres
    this.searchRequest.filters = this.columns
      .filter(column => column.filters.length != 0)
      .flatMap(column => column.filters)
      .map(columnFilter => {
        return <Filter>{
          field: columnFilter.filterField,
          value: this.getFilterValueFromFilter(columnFilter),
          type: columnFilter.filterType,
          order: undefined,
        }
      });

    // Ajoute le tri
    this.columns.filter(column => column.sortable).forEach(column => {
      let founded = false;

      this.searchRequest.filters.forEach((filter) => {
        if (filter.field === column.field) {
          founded = true;
          filter.order = column.sortDefaultValue ?? undefined;
        }
      });

      // Crée un nouveau filtre si aucun de trouvé
      if (!founded) {
        this.searchRequest.filters.push({
          field: column.field,
          order: column.sortDefaultValue ?? undefined,
        });
      }
    })

    // Génère la liste des colonnes à afficher
    this.displayedColumns = this.columns.map(column => column.field).concat(this.displayedColumns);
  }

  /**
   * Recherche initiale après que tout a été initialisé
   */
  public ngAfterViewInit(): void {
    this.searchEvent.emit();
  }

  /**
   * Recherche en fonction de la nouvelle page
   * @param page Nouvelle page
   */
  protected changePage(page: PageEvent): void {
    this.searchRequest.page = page.pageIndex;
    this.searchRequest.pageSize = page.pageSize;
    this.searchEvent.emit();
  }

  /**
   * Récupère le premier tri
   */
  protected getDefaultSort(): string {
    let column: Column | null = this.getFirstSortableColum();

    if (column) {
      return column.field;
    }

    return "";
  }

  /**
   * Récupère le premier ordre de tri
   */
  protected getDefaultOrder(): "asc" | "desc" | "" {
    let column: Column | null = this.getFirstSortableColum();

    if (column) {
      switch (column.sortDefaultValue) {
        case Order.ASC: return "asc";
        case Order.DESC: return "desc";
        default: return "";
      }
    }

    return "";
  }

  /**
   * Récupère la première colonne à ordrer
   */
  private getFirstSortableColum(): Column | null {
    if (!this.columns) {
      return null;
    }

    let columns: Column[] = this.columns.filter(column => column.sortable);
    if (columns.length > 0) {
      return columns[0];
    }

    return null;
  }

  /**
   * Tri la table
   * @param sort Nouveau trie
   */
  protected sort(sort: Sort): void {
    this.searchRequest.page = 0;

    this.searchRequest.filters = this.searchRequest.filters.map(filter => {
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

      return filter;
    });
    this.searchEvent.emit();
  }

  /**
   * Filtre la table
   */
  protected filter(): void {
    this.searchRequest.page = 0;

    this.searchRequest.filters = this.searchRequest.filters.map(filter => {
      let columnFilter: ColumnFilter | undefined = this.columns.flatMap(column => column.filters).find(columnFilter => columnFilter.filterField === filter.field);

      if (!columnFilter) {
        return filter;
      }

      filter.value = this.getFilterValueFromFilter(columnFilter);

      return filter;
    });
    this.searchEvent.emit();
  }

  /**
   * Récupère la valeur de filtre
   * @param columnFilter Filtre de colonne
   * @return La valeur à envoyer à l'API
   */
  private getFilterValueFromFilter(columnFilter: ColumnFilter): any {
    if (columnFilter instanceof AutocompleteFilter) {
      if (columnFilter.filterValue) {
        return columnFilter.filterValue[columnFilter.autocompleteIdField];
      } else {
        return null;
      }
    } else if (columnFilter instanceof InputFilter) {
      return columnFilter.filterValue;
    }

    return null;
  }

  /**
   * Met à jour les données affichées dans la table
   * @param searchResult Résultat de la recherche
   */
  private updateTable(searchResult: SearchResult<T>): void {
    this.data = searchResult;
    this.paginator!.pageIndex = searchResult.currentPage;
    this.paginator!.pageSize = searchResult.pageSize;
    this.paginator!.length = searchResult.totalElements;
  }

  /**
   * Ouvre un dialog
   * @param element Élément à afficher dans le dialog
   * @param type Type de dialog
   */
  public openDialog(element: T | null, type: DialogType): void {
    if (!this.actionColumnInfo.dialogComponent) {
      return;
    }

    const dialogRef = this.matDialog.open(this.actionColumnInfo.dialogComponent, {
      maxWidth: 1000,
      data: <DialogData>{
        type : type,
        id: element ? element[this.actionColumnInfo.idField] : null,
      },
    });

    dialogRef.afterClosed().subscribe(modification => {
      if (modification) {
        this.searchEvent.emit();
      }
    });
  }

  /**
   * Efface les filtres
   */
  protected clearAllFilters(): void {
    this.columns
      .flatMap(column => column.filters)
      .forEach((filter) => {
        filter.filterValue = null;
      });

    this.filter();
  }

  protected readonly LinkColumn = LinkColumn;
}
