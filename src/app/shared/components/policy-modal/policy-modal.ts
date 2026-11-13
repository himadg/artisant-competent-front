import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { LegalSections } from '../legal-sections/legal-sections';
import { ANNULATION_SECTION_KEYS, CONFIDENTIALITE_SECTION_KEYS, COOKIES_SECTION_KEYS } from './policy-modal.content';

export type PolicyTab = 'annulation' | 'confidentialite' | 'cookies';

@Component({
  selector: 'policy-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, NgTemplateOutlet, LegalSections],
  templateUrl: './policy-modal.html',
  styleUrl: './policy-modal.scss',
})
export class PolicyModal {
  readonly modal = input<boolean>(false);
  readonly tab = input.required<PolicyTab>();
  readonly closed = output<void>();

  readonly annulationKeys = ANNULATION_SECTION_KEYS;
  readonly confidentialiteKeys = CONFIDENTIALITE_SECTION_KEYS;
  readonly cookiesKeys = COOKIES_SECTION_KEYS;

  close() {
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('legal-overlay')) {
      this.close();
    }
  }
}
