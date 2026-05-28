import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteService } from '../../services/quote.service';
import { firstValueFrom } from 'rxjs';
import { QuoteCalculationService } from '../../services/quote-calculation.service';

@Component({
  selector: 'app-quote-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quote-preview.component.html',
  styleUrls: ['./quote-preview.component.scss']
})
export class QuotePreviewComponent {
  @Input() quoteData: any;
  @Output() close = new EventEmitter<void>();

  private quoteService = inject(QuoteService);
  public calcService = inject(QuoteCalculationService);
  isGenerating = false;

  get totalHT(): number {
    return this.calcService.getTotalHT(this.quoteData);
  }

  get grandTotalTTC(): number {
    return this.calcService.getGrandTotalTTC(this.quoteData);
  }

  closePreview(): void {
    this.close.emit();
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
}
