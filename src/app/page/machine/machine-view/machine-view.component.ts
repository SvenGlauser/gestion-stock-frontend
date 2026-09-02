import {Component, DestroyRef, effect, ElementRef, Signal, signal, viewChild, WritableSignal, ChangeDetectionStrategy} from '@angular/core';
import {AbstractProtectedComponent} from '../../../common/abstract/abstract-protected-component.directive';
import {Roles} from '../../../security/roles';
import {LayoutService} from '../../../layout/service/layout.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Identite} from '../../identite/identite.model';
import {Machine} from '../machine.model';
import {MachineService} from '../machine.service';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput} from '@angular/material/input';
import {DialogData, DialogType} from '../../../common/form/dialog/dialog-data';
import {MatDialog} from '@angular/material/dialog';
import {MachineDialogComponent} from '../dialog/machine-dialog.component';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MachineViewPieceComponent} from './machine-view-piece/machine-view-piece.component';
import {MachineViewServiceComponent} from './machine-view-service/machine-view-service.component';

@Component({
  selector: 'app-machine-view',
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatTabGroup,
    MatTab,
    MachineViewPieceComponent,
    MachineViewServiceComponent,
  ],
  templateUrl: './machine-view.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './machine-view.component.scss',
})
export class MachineViewComponent extends AbstractProtectedComponent {

  private readonly currentMachineId: WritableSignal<number | null> = signal<number | null>(null);

  protected readonly proprietaire: WritableSignal<Identite | null> = signal<Identite | null>(null);
  protected machine: WritableSignal<Machine | null> = signal<Machine | null>(null);

  protected readonly resetFocus: Signal<ElementRef | undefined> = viewChild('resetFocus', {read: ElementRef})

  constructor(private readonly machineService: MachineService,
              private readonly layoutService: LayoutService,
              private readonly destroyRef: DestroyRef,
              private readonly route: ActivatedRoute,
              private readonly matDialog: MatDialog) {
    super();

    layoutService.isView.set(true);
    destroyRef.onDestroy(() => layoutService.isView.set(false));

    this.route
      .paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params: ParamMap) => {
        this.currentMachineId.set(Number.parseInt(params.get('id') ?? ""));
      });

    effect(() => {
      this.updateMachine();
    })
  }

  private updateMachine(): void {
    const currentMachineId: number | null = this.currentMachineId();

    if (currentMachineId) {
      this.machineService.get(currentMachineId).subscribe(machine => {
        this.machine.set(machine);
        this.proprietaire.set(machine.proprietaire);
      })
    } else {
      this.machine.set(null);
      this.proprietaire.set(null);
    }
  }

  protected override readAccess(): Roles {
    return Roles.R_MACHINE_LECTEUR;
  }

  protected override editAccess(): Roles {
    return Roles.R_MACHINE_EDITEUR;
  }

  protected editMachine(): void {
    const dialogRef = this.matDialog.open(MachineDialogComponent, {
      maxWidth: 1000,
      data: <DialogData>{
        type: DialogType.MODIFY,
        id: this.currentMachineId(),
      },
    });

    dialogRef.afterClosed().subscribe(modification => {
      if (modification) {
        this.updateMachine();
      }

      console.log(this.resetFocus())
      this.resetFocus()?.nativeElement.focus();
    });
  }
}
