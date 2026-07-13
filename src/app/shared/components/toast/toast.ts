import { Component, ChangeDetectionStrategy, inject, effect, OnDestroy } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import type { FlashMessageType } from '../../interfaces/flash-message';

const TYPE_CLASSES: Record<FlashMessageType, string> = {
  error: 'bg-red-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-500 text-white',
  info: 'bg-blue-600 text-white',
};

@Component({
  selector: 'ac-toast',
  standalone: true,
  imports: [TranslocoModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .toast { animation: toast-in 0.25s ease-out; }
    @keyframes toast-in {
      from { opacity: 0; transform: translateY(0.5rem); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `],
  template: `
    @if (flash.message(); as msg) {
      <div class="toast fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium max-w-sm"
           [class]="typeClasses[msg.type]">
        <span>{{ msg.key | transloco }}</span>
        <button (click)="dismiss()" class="ml-2 shrink-0 opacity-70 hover:opacity-100 leading-none">✕</button>
      </div>
    }
  `,
})
export class Toast implements OnDestroy {
  readonly flash = inject(FlashMessageService);
  readonly typeClasses = TYPE_CLASSES;

  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      if (this.flash.message()) {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => this.dismiss(), 5000);
      }
    });
  }

  dismiss(): void {
    this.flash.consume();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
  }
}
