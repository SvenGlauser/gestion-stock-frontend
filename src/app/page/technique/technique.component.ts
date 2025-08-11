import {Component, computed, Signal, signal, WritableSignal} from '@angular/core';
import {FileUploaderComponent} from '../../common/form/input/file-uploader/file-uploader.component';
import {TechniqueService} from './technique.service';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {ValidationException} from '../../common/utils/validation-exception';

@Component({
  selector: 'app-technique',
  imports: [
    FileUploaderComponent
  ],
  templateUrl: './technique.component.html',
  styleUrl: './technique.component.scss'
})
export class TechniqueComponent {

  protected readonly file: WritableSignal<File | null> = signal(null);
  protected readonly infoImportationPiece: WritableSignal<string | null> = signal(null);
  protected readonly errorImportationPiece: WritableSignal<string | null> = signal(null);

  protected readonly hasInfoImportationPiece: Signal<boolean> = computed((): boolean => this.infoImportationPiece() !== null);
  protected readonly hasErrorImportationPiece: Signal<boolean> = computed((): boolean => this.errorImportationPiece() !== null);

  constructor(private readonly techniqueService: TechniqueService) {
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
}
