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
  styleUrls: ['./toast.scss'],
  templateUrl: './toast.html',
})
export class Toast implements OnDestroy {
  readonly flash = inject(FlashMessageService);
  readonly typeClasses = TYPE_CLASSES;

  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      if (this.flash.message()) {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => this.dismiss(), 10000); // 10 seconds
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
