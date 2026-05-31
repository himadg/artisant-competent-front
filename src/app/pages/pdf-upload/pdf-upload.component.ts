import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'ac-pdf-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="upload-container">
      <h2>Uploader un fichier PDF</h2>
      
      <div class="file-input-wrapper">
        <input 
          type="file" 
          accept="application/pdf" 
          (change)="onFileSelected($event)" 
          [disabled]="isUploading"
        />
      </div>

      <div *ngIf="selectedFile" class="file-details">
        Fichier sélectionné : {{ selectedFile.name }} ({{ (selectedFile.size / 1024 / 1024).toFixed(2) }} Mo)
      </div>

      <button 
        (click)="upload()" 
        [disabled]="!selectedFile || isUploading"
        class="upload-btn"
      >
        {{ isUploading ? 'Upload en cours...' : 'Envoyer vers Backblaze' }}
      </button>

      <div *ngIf="errorMessage" class="error-msg">{{ errorMessage }}</div>
    </div>
  `,
  styles: [`
    .upload-container {
      max-width: 500px;
      margin: 50px auto;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
    }
    .file-input-wrapper, .file-details, .upload-btn { margin-top: 20px; }
    .upload-btn {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .upload-btn:disabled { background-color: #ccc; cursor: not-allowed; }
    .error-msg { color: red; margin-top: 15px; }
  `]
})
export class PdfUploadComponent {
  selectedFile: File | null = null;
  isUploading = false;
  errorMessage = '';

  private pdfService = inject(PdfService);
  private router = inject(Router);

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.errorMessage = '';
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
      this.errorMessage = 'Veuillez sélectionner un fichier PDF valide.';
    }
  }

  upload() {
    if (!this.selectedFile) return;
    this.isUploading = true;
    this.pdfService.uploadPdf(this.selectedFile).subscribe({
      next: (response) => {
        this.isUploading = false;
        this.router.navigate(['/pdf-view', response.key]);
      },
      error: (err) => {
        this.isUploading = false;
        this.errorMessage = "Erreur lors de l'upload.";
        console.error(err);
      }
    });
  }
}