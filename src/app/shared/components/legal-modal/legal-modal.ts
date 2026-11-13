import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { LegalSections } from '../legal-sections/legal-sections';
import { CGU_SECTION_KEYS, CGV_SECTION_KEYS, MENTIONS_LEGALES_SECTION_KEYS } from './legal-modal.content';
import { ANNULATION_SECTION_KEYS, CONFIDENTIALITE_SECTION_KEYS, COOKIES_SECTION_KEYS } from '../policy-modal/policy-modal.content';

export type LegalTab = 'cgu' | 'cgv' | 'mentionsLegales' | 'confidentialite' | 'cookies' | 'annulation';

@Component({
  selector: 'legal-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, NgTemplateOutlet, LegalSections],
  templateUrl: './legal-modal.html',
  styleUrl: './legal-modal.scss',
})
export class LegalModal {
  readonly modal = input<boolean>(false);
  readonly inline = input<boolean>(false);
  readonly closed = output<void>();

  readonly activeTab = signal<LegalTab>('cgu');
  readonly cguKeys = CGU_SECTION_KEYS;
  readonly cgvKeys = CGV_SECTION_KEYS;
  readonly mentionsLegalesKeys = MENTIONS_LEGALES_SECTION_KEYS;
  readonly confidentialiteKeys = CONFIDENTIALITE_SECTION_KEYS;
  readonly cookiesKeys = COOKIES_SECTION_KEYS;
  readonly annulationKeys = ANNULATION_SECTION_KEYS;

  setTab(tab: LegalTab) {
    this.activeTab.set(tab);
  }

  close() {
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('legal-overlay')) {
      this.close();
    }
  }
}
