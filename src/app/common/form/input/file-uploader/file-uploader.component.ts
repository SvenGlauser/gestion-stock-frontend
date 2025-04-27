import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
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
  @Input({required: true})
  public formats: string[] = [];

  @Input()
  public value: File | null = null;

  @Output()
  public valueChange: EventEmitter<File | null> = new EventEmitter<File | null>();

  @ViewChild('inputFile')
  public inputFile: ElementRef<HTMLInputElement> | null = null;

  /**
   * Récupère le fichier
   * @param event Événement
   */
  protected onFileChange(event: Event): void {
    let files: FileList | null = (event.target as HTMLInputElement).files;
    if (files === null || files.length == 0) {
      return;
    }

    this.value = files[0];
    this.valueChange.emit(this.value);
  }

  /**
   * Ajoute un fichier
   */
  protected addFile(): void {
    this.inputFile?.nativeElement.click();
  }

  /**
   * Supprime un fichier
   */
  protected removeFile(): void {
    this.inputFile!.nativeElement.value = "";
    this.value = null;
    this.valueChange.emit(this.value);
  }
}
