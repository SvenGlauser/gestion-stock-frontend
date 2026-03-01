import {Component, model, ModelSignal, signal, WritableSignal} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {MatCheckbox} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import {Column} from '../column/column';
import {SearchQuery} from '../../search/custom/search-query';

@Component({
  selector: 'app-column-chooser',
  imports: [
    MatIcon,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatCheckbox,
    FormsModule
  ],
  templateUrl: './column-chooser.component.html',
  styleUrl: './column-chooser.component.scss',
})
export class ColumnChooserComponent<R extends SearchQuery> {
  public readonly columns: ModelSignal<Column<R>[]> = model.required();

  protected readonly isMenuOpen: WritableSignal<boolean> = signal(false);

  /**
   * Informe que le menu est ouvert
   */
  protected menuOpened(): void {
    this.isMenuOpen.set(true);
  }

  /**
   * Informe que le menu est fermé
   */
  protected menuClosed(): void {
    this.isMenuOpen.set(false);
  }

  /**
   * Mise à jour des colonnes
   */
  protected changed(): void {
    this.columns.set([...this.columns()]);
  }
}
