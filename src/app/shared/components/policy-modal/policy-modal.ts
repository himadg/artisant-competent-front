import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

export type PolicyTab = 'annulation' | 'confidentialite' | 'cookies';

@Component({
  selector: 'policy-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, NgTemplateOutlet],
  templateUrl: './policy-modal.html',
  styleUrl: './policy-modal.scss',
})
export class PolicyModal {
  readonly modal = input<boolean>(false);
  readonly tab = input.required<PolicyTab>();
  readonly closed = output<void>();

  close() {
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('legal-overlay')) {
      this.close();
    }
  }
}
