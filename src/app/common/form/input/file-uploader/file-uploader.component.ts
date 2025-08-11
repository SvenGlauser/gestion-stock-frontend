import {
  Component,
  computed,
  ElementRef,
  input,
  InputSignal,
  model,
  ModelSignal,
  Signal,
  viewChild
} from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-file-uploader',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatButton
  ],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss'
})
export class FileUploaderComponent {

  public readonly formats: InputSignal<string[]> = input.required();
  public readonly value: ModelSignal<File | null> = model<File | null>(null);

  protected readonly isFileSelected: Signal<boolean> = computed((): boolean => this.value() !== null);
  private readonly inputFile: Signal<ElementRef<HTMLInputElement>> = viewChild.required('inputFile');

  /**
   * Récupère le fichier
   * @param event Événement
   */
  protected onFileChange(event: Event): void {
    let files: FileList | null = (event.target as HTMLInputElement).files;
    if (files === null || files.length == 0) {
      return;
    }

    this.value.set(files[0]);
  }

  /**
   * Ajoute un fichier
   */
  protected addFile(): void {
    this.inputFile().nativeElement.click();
  }

  /**
   * Supprime un fichier
   */
  protected removeFile(): void {
    this.inputFile().nativeElement.value = "";
    this.value.set(null);
  }
}
