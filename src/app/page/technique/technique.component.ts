import {Component} from '@angular/core';
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

  protected file: File | null = null;
  protected infoImportationPiece: string | null = null;
  protected errorImportationPiece: string | null = null;

  constructor(private readonly techniqueService: TechniqueService) {}

  protected importPiece(): void {
    this.infoImportationPiece = null;
    this.errorImportationPiece = null;

    if (this.file == null) {
      return;
    }

    this.techniqueService.importPieces(this.file).subscribe({
      complete: () => {
        this.file = null;
        this.infoImportationPiece = "Importé avec succès";
        this.errorImportationPiece = null;
      },
      error: (error: HttpErrorResponse) => {
        this.file = null;
        this.infoImportationPiece = null;
        if (error.status === HttpStatusCode.NotAcceptable) {
          this.traiterErreur(error.error);
        } else {
          this.errorImportationPiece = "Importation en erreur";
        }
      },
    });
  }

  /**
   * Affiche les erreurs de validation
   * @param errors Erreurs
   */
  private traiterErreur(errors: ValidationException[]): void {
    this.errorImportationPiece = errors
      .map(error => error.message)
      .join('\n');
  }
}
