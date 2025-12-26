import { Component, output, signal, Signal } from '@angular/core';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-image-upload',
  imports: [FormsModule],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css'
})
export class ImageUpload {
  protected imageSrc = signal<string | ArrayBuffer | null | undefined>(null);
  protected isDragging = false;
  private fileToUpload: File | null = null;
  uploadFile = output<File>();
  loading = output<boolean>();

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    debugger;
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.previewFile(file);
      this.fileToUpload = file;
    }
  }
  
  onCancel(){
    this.fileToUpload = null;
    this.imageSrc.set(null);
  }
  onUpload(){
    if(this.fileToUpload){
      this.loading.emit(true);
      this.uploadFile.emit(this.fileToUpload);
    }
  }
  
  private previewFile(file: File) {
    debugger;
    const reader = new FileReader();
    reader.onload = (e) => this.imageSrc.set(e.target?.result);
    reader.readAsDataURL(file);
  }
}
