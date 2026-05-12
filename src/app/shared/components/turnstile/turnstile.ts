import { Component, AfterViewInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef, input } from '@angular/core';

declare const turnstile: {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

@Component({
  selector: 'app-turnstile',
  standalone: true,
  template: '<div class="mt-4" #widgetEl></div>',
})
export class TurnstileComponent implements AfterViewInit, OnDestroy {
  readonly siteKey = input.required<string>();

  @Output() readonly resolved = new EventEmitter<string>();
  @Output() readonly errored = new EventEmitter<void>();
  @Output() readonly expired = new EventEmitter<void>();

  @ViewChild('widgetEl') private readonly widgetEl!: ElementRef<HTMLDivElement>;
  private widgetId: string | null = null;
  private pollTimeout = 0;

  ngAfterViewInit() {
    this.renderWhenReady();
  }

  private renderWhenReady(attempts = 0) {
    if (typeof turnstile !== 'undefined') {
      this.widgetId = turnstile.render(this.widgetEl.nativeElement, {
        sitekey: this.siteKey(),
        callback: (token: string) => this.resolved.emit(token),
        'error-callback': () => this.errored.emit(),
        'expired-callback': () => this.expired.emit(),
      });
      return;
    }
    if (attempts < 50) {
      this.pollTimeout = window.setTimeout(() => this.renderWhenReady(attempts + 1), 100);
    }
  }

  reset() {
    if (this.widgetId !== null) turnstile.reset(this.widgetId);
  }

  ngOnDestroy() {
    clearTimeout(this.pollTimeout);
    if (this.widgetId !== null) turnstile.remove(this.widgetId);
  }
}
