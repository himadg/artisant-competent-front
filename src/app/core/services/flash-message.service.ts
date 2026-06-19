import { Injectable, signal } from '@angular/core';
import { FlashMessage } from '../../shared/interfaces/flash-message';

@Injectable({ providedIn: 'root' })
export class FlashMessageService {
  private readonly _message = signal<FlashMessage | null>(null);

  readonly message = this._message.asReadonly();

  set(message: FlashMessage): void {
    this._message.set(message);
  }

  consume(): FlashMessage | null {
    const msg = this._message();
    this._message.set(null);
    return msg;
  }
}
