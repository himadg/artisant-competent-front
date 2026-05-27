import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  // Recalcul des totaux pour l'affichage
  get totalMaterialsHT(): number {
    if (!this.quoteData?.materials) return 0;
    return this.quoteData.materials.reduce((acc: number, curr: any) => acc + (curr.amountHT || 0), 0);
  }

  get totalServicesHT(): number {
    if (!this.quoteData?.services) return 0;
    return this.quoteData.services.reduce((acc: number, curr: any) => acc + (curr.amountHT || 0), 0);
  }

  get totalTravelCostHT(): number {
    return this.quoteData?.logistics?.travelCostHT || 0;
  }

  get totalHT(): number {
    return this.totalMaterialsHT + this.totalServicesHT + this.totalTravelCostHT;
  }

  calculateItemTTC(amountHT: number, tva: number): number {
    return amountHT * (1 + (tva / 100));
  }

  get totalMaterialsTTC(): number {
    if (!this.quoteData?.materials) return 0;
    return this.quoteData.materials.reduce((acc: number, curr: any) => acc + this.calculateItemTTC(curr.amountHT || 0, curr.tva || 0), 0);
  }

  get totalServicesTTC(): number {
    if (!this.quoteData?.services) return 0;
    return this.quoteData.services.reduce((acc: number, curr: any) => acc + this.calculateItemTTC(curr.amountHT || 0, curr.tva || 0), 0);
  }

  get platformFee(): number {
    const total = this.totalHT;
    return total < 1500 ? total * 0.15 : total * 0.10;
  }

  closePreview(): void {
    this.close.emit();
  }
}
