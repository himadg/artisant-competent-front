import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'ac-pdf-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="view-container">
      <div class="header">
        <h2>Visualisation du PDF</h2>
        <button (click)="goBack()">Retour à l'upload</button>
      </div>

      <div *ngIf="pdfUrl; else loading" class="pdf-viewer">
        <iframe [src]="pdfUrl" width="100%" height="100%" frameborder="0"></iframe>
      </div>

      <ng-template #loading>
        <p class="loading">Chargement du document...</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .view-container {
      display: flex;
      flex-direction: column;
      height: 90vh;
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .pdf-viewer { flex: 1; border: 1px solid #ddd; border-radius: 4px; }
    .loading { text-align: center; margin-top: 50px; font-size: 1.2rem; }
  `]
})
export class PdfViewComponent implements OnInit {
  pdfUrl: SafeResourceUrl | null = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pdfService = inject(PdfService);
  private sanitizer = inject(DomSanitizer);

  ngOnInit() {
    const key = this.route.snapshot.paramMap.get('key');
    if (key) {
      this.pdfService.getPdfUrl(key).subscribe(response => {
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(response.url);
      });
    }
  }

  goBack() {
    this.router.navigate(['/pdf-upload']);
  }
}