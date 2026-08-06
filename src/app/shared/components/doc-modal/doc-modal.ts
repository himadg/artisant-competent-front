import { Component, input, output, inject, computed, effect, signal, ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { PreviewDocument } from '../../interfaces/preview-document';

const MIN_SCALE = 1;
const MAX_SCALE = 15;

@Component({
  selector: 'doc-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './doc-modal.html',
  styleUrl: './doc-modal.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DocModal {
  document = input.required<PreviewDocument | null>();
  closeModal = output<void>();

  private readonly sanitizer = inject(DomSanitizer);

  isWebp = computed(() => {
    const url = this.document()?.url?.toLowerCase();
    return !!url && !!new RegExp(/\.webp(\?.*)?$/).exec(url);
  });

  isPdf = computed(() => {
    const url = this.document()?.url?.toLowerCase();
    return !!url && !!new RegExp(/\.pdf(\?.*)?$/).exec(url);
  });

  safePdfUrl = computed<SafeResourceUrl | null>(() => {
    const docUrl = this.document()?.url;
    if (!docUrl || !this.isPdf()) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(docUrl);
  });

  // ── Pinch-to-zoom / pan de l'image (tactile + souris/trackpad) ───────────
  private readonly scale = signal(1);
  private readonly translateX = signal(0);
  private readonly translateY = signal(0);
  readonly imageTransform = computed(
    () => `translate(${this.translateX()}px, ${this.translateY()}px) scale(${this.scale()})`,
  );
  readonly isZoomed = computed(() => this.scale() > MIN_SCALE);

  private pinchStartDistance = 0;
  private pinchStartScale = 1;
  private panStart: { x: number; y: number } | null = null;
  private panOrigin = { x: 0, y: 0 };
  private isPanningWithMouse = false;

  constructor() {
    // Réinitialise le zoom à chaque nouvelle image affichée.
    effect(() => {
      this.document();
      this.resetZoom();
    });
  }

  onImageTouchStart(event: TouchEvent): void {
    if (event.touches.length === 2) {
      this.pinchStartDistance = this.touchDistance(event.touches);
      this.pinchStartScale = this.scale();
    } else if (event.touches.length === 1 && this.scale() > MIN_SCALE) {
      const touch = event.touches[0];
      this.panStart = { x: touch.clientX, y: touch.clientY };
      this.panOrigin = { x: this.translateX(), y: this.translateY() };
    }
  }

  onImageTouchMove(event: TouchEvent): void {
    if (event.touches.length === 2 && this.pinchStartDistance) {
      event.preventDefault();
      const distance = this.touchDistance(event.touches);
      const nextScale = (this.pinchStartScale * distance) / this.pinchStartDistance;
      this.scale.set(Math.min(Math.max(nextScale, MIN_SCALE), MAX_SCALE));
    } else if (event.touches.length === 1 && this.panStart) {
      event.preventDefault();
      const touch = event.touches[0];
      this.translateX.set(this.panOrigin.x + (touch.clientX - this.panStart.x));
      this.translateY.set(this.panOrigin.y + (touch.clientY - this.panStart.y));
    }
  }

  onImageTouchEnd(event: TouchEvent): void {
    if (event.touches.length < 2) this.pinchStartDistance = 0;
    if (event.touches.length === 0) {
      this.panStart = null;
      if (this.scale() <= MIN_SCALE) this.resetZoom();
    }
  }

  /** Ctrl+molette ou pincement sur trackpad (le navigateur les remonte tous deux comme un `wheel` avec `ctrlKey`). */
  onImageWheel(event: WheelEvent): void {
    if (!event.ctrlKey) return;
    event.preventDefault();
    const nextScale = this.scale() - event.deltaY * 0.01;
    this.scale.set(Math.min(Math.max(nextScale, MIN_SCALE), MAX_SCALE));
    if (this.scale() <= MIN_SCALE) this.resetZoom();
  }

  onImageMouseDown(event: MouseEvent): void {
    if (!this.isZoomed()) return;
    event.preventDefault();
    this.isPanningWithMouse = true;
    this.panStart = { x: event.clientX, y: event.clientY };
    this.panOrigin = { x: this.translateX(), y: this.translateY() };
    window.addEventListener('mousemove', this.onWindowMouseMove);
    window.addEventListener('mouseup', this.onWindowMouseUp);
  }

  private readonly onWindowMouseMove = (event: MouseEvent): void => {
    if (!this.isPanningWithMouse || !this.panStart) return;
    this.translateX.set(this.panOrigin.x + (event.clientX - this.panStart.x));
    this.translateY.set(this.panOrigin.y + (event.clientY - this.panStart.y));
  };

  private readonly onWindowMouseUp = (): void => {
    this.isPanningWithMouse = false;
    this.panStart = null;
    window.removeEventListener('mousemove', this.onWindowMouseMove);
    window.removeEventListener('mouseup', this.onWindowMouseUp);
  };

  private resetZoom(): void {
    this.scale.set(1);
    this.translateX.set(0);
    this.translateY.set(0);
  }

  private touchDistance(touches: TouchList): number {
    const a = touches[0];
    const b = touches[1];
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }
}
