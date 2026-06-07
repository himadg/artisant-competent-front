import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { QuoteService } from '../../services/quote.service';
import { firstValueFrom } from 'rxjs';
import { QuoteCalculationService } from '../../services/quote-calculation.service';

@Component({
  selector: 'ac-quote-preview',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './quote-preview.component.html',
  styleUrls: ['./quote-preview.component.scss']
})
export class QuotePreviewComponent {
  @Input() quoteData: any;
  @Input() quoteId?: string;
  @Input() showAccept = false;
  @Output() close = new EventEmitter<void>();
  @Output() accepted = new EventEmitter<void>();

  private quoteService = inject(QuoteService);
  public calcService = inject(QuoteCalculationService);
  isGenerating = false;
  isGeneratingSignature = false;
  isInitiatingYousign = false;
  isAccepting = false;

  get totalHT(): number {
    return this.calcService.getTotalHT(this.quoteData);
  }

  get grandTotalTTC(): number {
    return this.calcService.getGrandTotalTTC(this.quoteData);
  }

  closePreview(): void {
    this.close.emit();
  }

  async acceptQuote(): Promise<void> {
    if (!this.quoteId) return;
    this.isAccepting = true;
    try {
      await firstValueFrom(this.quoteService.acceptQuote(this.quoteId));
      // Le devis est accepté : on bascule en mode signature électronique
      await this.startYousignProcedure();
      this.accepted.emit();
    } catch (err) {
      console.error('Erreur lors de l\'acceptation du devis', err);
      alert('Une erreur est survenue lors de l\'acceptation du devis.');
    } finally {
      this.isAccepting = false;
    }
  }

  async generatePdf(): Promise<void> {
    this.isGenerating = true;
    try {
      const pdfBlob = await firstValueFrom(this.quoteService.generatePdf(this.quoteData));

      if (pdfBlob) {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        const clientName = `${this.quoteData.coordinates?.client?.firstName || ''}_${this.quoteData.coordinates?.client?.lastName || 'client'}`;
        a.download = `devis_${clientName.replace(/ /g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Erreur lors de la génération du PDF', err);
      alert('Une erreur est survenue lors de la génération du PDF.');
    } finally {
      this.isGenerating = false;
    }
  }

  async generateSignaturePdf(): Promise<void> {
    this.isGeneratingSignature = true;
    try {
      const result = await firstValueFrom(this.quoteService.generateSignaturePage(this.quoteData));

      if (result && result.pdfBase64) {
        console.log('Coordonnées des zones de signature :', result.signatures);

        const byteCharacters = atob(result.pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const pdfBlob = new Blob([byteArray], {type: 'application/pdf'});

        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        const clientName = `${this.quoteData.coordinates?.client?.firstName || ''}_${this.quoteData.coordinates?.client?.lastName || 'client'}`;
        a.download = `signature_devis_${clientName.replace(/ /g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Erreur lors de la génération de la page de signature', err);
      alert('Une erreur est survenue lors de la génération de la page de signature.');
    } finally {
      this.isGeneratingSignature = false;
    }
  }

  async startYousignProcedure(): Promise<void> {
    this.isInitiatingYousign = true;
    try {
      const result = await firstValueFrom(this.quoteService.initiateSignature(this.quoteData, this.quoteId));
      if (result) {
        // Redirige l'utilisateur vers la page de signature Yousign
        // TODO client
        console.log("client signature url: " + result.clientSignatureUrl)
        console.log("pro signature url: " + result.prestataireSignatureUrl)
      } else {
        alert('Impossible de récupérer l\'URL de signature.');
      }
    } catch (err) {
      console.error('Erreur lors de l\'initiation de la procédure Yousign', err);
      alert('Une erreur est survenue lors de l\'initiation de la procédure de signature.');
    } finally {
      this.isInitiatingYousign = false;
    }
  }
}
