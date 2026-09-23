import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, computed, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { QuoteLineItem, QuotePreviewData } from '../../interfaces/quote';

@Component({
  selector: 'quote-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, DecimalPipe],
  templateUrl: './quote-preview.html',
  styleUrl: './quote-preview.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class QuotePreview {
  readonly data = input.required<QuotePreviewData>();
  readonly closed = output<void>();

  private readonly allLines = computed(() => [
    ...this.data().materialLines,
    ...this.data().laborLines,
    ...this.data().logisticsLines,
  ]);

  readonly totalHT = computed(() => this.allLines().reduce((sum, l) => sum + (l.amountHT ?? 0), 0));
  readonly totalVAT = computed(() =>
    this.allLines().reduce((sum, l) => sum + ((l.amountHT ?? 0) * l.vatRate) / 100, 0),
  );
  readonly totalTTC = computed(() => this.totalHT() + this.totalVAT());

  readonly documents = computed(() => this.data().documents.filter((d) => d.name.trim()));

  lineTTC(line: QuoteLineItem): number {
    const ht = line.amountHT ?? 0;
    return ht + (ht * line.vatRate) / 100;
  }

  close(): void {
    this.closed.emit();
  }
}
