import {Component, computed, Signal, signal, WritableSignal} from '@angular/core';
import {FileUploaderComponent} from '../../common/form/input/file-uploader/file-uploader.component';
import {TechniqueService} from './technique.service';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {ValidationException} from '../../common/utils/validation-exception';
import {AbstractProtectedComponent} from '../../common/abstract/abstract-protected-component.directive';
import {Roles} from '../../security/roles';

@Component({
  selector: 'app-technique-page',
  imports: [
    FileUploaderComponent
  ],
  templateUrl: './technique-page.component.html',
  styleUrl: './technique-page.component.scss'
})
export class TechniquePageComponent extends AbstractProtectedComponent {

  protected readonly file: WritableSignal<File | null> = signal(null);
  protected readonly infoImportationPiece: WritableSignal<string | null> = signal(null);
  protected readonly errorImportationPiece: WritableSignal<string | null> = signal(null);

  protected readonly hasInfoImportationPiece: Signal<boolean> = computed((): boolean => this.infoImportationPiece() !== null);
  protected readonly hasErrorImportationPiece: Signal<boolean> = computed((): boolean => this.errorImportationPiece() !== null);

  constructor(private readonly techniqueService: TechniqueService) {
    super();
  }

  protected importPiece(): void {
    this.infoImportationPiece.set(null);
    this.errorImportationPiece.set(null);

    const file: File | null = this.file();
    if (file == null) {
      return;
    }

    this.techniqueService.importPieces(file).subscribe({
      complete: (): void => {
        this.file.set(null);
        this.infoImportationPiece.set("Importé avec succès");
        this.errorImportationPiece.set(null);
      },
      error: (error: HttpErrorResponse) => {
        this.file.set(null);
        this.errorImportationPiece.set(null);
        if (error.status === HttpStatusCode.NotAcceptable) {
          this.traiterErreur(error.error);
        } else {
          this.errorImportationPiece.set("Importation en erreur");
        }
      },
    });
  }

  /**
   * Affiche les erreurs de validation
   * @param errors Erreurs
   */
  private traiterErreur(errors: ValidationException[]): void {
    this.errorImportationPiece.set(errors
      .map(error => error.message)
      .join('\n'));
  }

  protected override readAccess(): Roles {
    return Roles.R_TECHNIQUE_LECTEUR;
  }

  protected override editAccess(): Roles {
    return Roles.R_TECHNIQUE_EDITEUR;
  }
}
