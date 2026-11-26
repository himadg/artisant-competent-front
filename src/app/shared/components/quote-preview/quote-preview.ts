import { Component, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, computed, inject, input, output, signal } from '@angular/core';
import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '../../../core/services/auth.service';
import { QuoteLineItem, QuotePreviewData } from '../../interfaces/quote';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';

@Component({
  selector: 'quote-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, DecimalPipe, LocalizedDatePipe, NgTemplateOutlet],
  templateUrl: './quote-preview.html',
  styleUrl: './quote-preview.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class QuotePreview {
  readonly data = input.required<QuotePreviewData>();
  readonly closed = output<void>();

  readonly interactive = input(false);

  // Rendu "papier nu", sans overlay/backdrop/bouton fermer — utilisé uniquement par la route
  // d'impression (cf. quote-print-page) capturée en PDF par Playwright, jamais par un utilisateur.
  readonly printMode = input(false);

  readonly statusNotice = input<string | null>(null);

  private readonly authService = inject(AuthService);

  readonly viewerRole = computed<'pro' | 'client'>(() =>
    this.authService.currentUser()?.role.code === 'PROFESSIONAL' ? 'pro' : 'client',
  );

  readonly accept = output<void>();
  readonly decline = output<void>();

  private readonly allLines = computed(() => [
    ...this.data().materialLines,
    ...this.data().laborLines,
    ...this.data().logisticsLines,
  ]);

  readonly totalHT = computed(() => this.allLines().reduce((sum, l) => sum + (l.amountHT ?? 0), 0));
  readonly totalVAT = computed(() =>
    this.data().vatExempt
      ? 0
      : this.allLines().reduce((sum, l) => sum + ((l.amountHT ?? 0) * l.vatRate) / 100, 0),
  );
  readonly totalTTC = computed(() => this.totalHT() + this.totalVAT());

  readonly logisticsTotal = computed(() =>
    this.data().logisticsLines.reduce((sum: number, l: QuoteLineItem) => sum + (l.amountHT ?? 0), 0),
  );

  readonly documents = computed(() => this.data().documents.filter((d) => d.name.trim()));

  lineTTC(line: QuoteLineItem): number {
    const ht = line.amountHT ?? 0;
    if (this.data().vatExempt) return ht;
    return ht + (ht * line.vatRate) / 100;
  }

  close(): void {
    this.closed.emit();
  }

  civilityKey(gender: string): string {
    return gender === 'male' ? 'quote.preview.civilityMale' : 'quote.preview.civilityFemale';
  }

  private readonly withdrawalInfoParty = signal<'pro' | 'client' | null>(null);

  readonly withdrawalInfoImage = computed(() => {
    const party = this.withdrawalInfoParty();
    if (party === 'pro') return 'assets/img/right-of-withdrawal-pro.jpeg';
    if (party === 'client') return 'assets/img/right-of-withdrawal-client.jpeg';
    return null;
  });

  openWithdrawalInfo(party: 'pro' | 'client'): void {
    this.withdrawalInfoParty.set(party);
  }

  closeWithdrawalInfo(): void {
    this.withdrawalInfoParty.set(null);
  }
}
