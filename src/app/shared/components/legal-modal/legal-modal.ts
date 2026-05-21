import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

export type LegalTab = 'cgu' | 'cgv';

@Component({
  selector: 'legal-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, NgTemplateOutlet],
  templateUrl: './legal-modal.html',
  styleUrl: './legal-modal.scss',
})
export class LegalModal {
  readonly modal = input<boolean>(false);
  readonly inline = input<boolean>(false);
  readonly closed = output<void>();

  readonly activeTab = signal<LegalTab>('cgu');

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