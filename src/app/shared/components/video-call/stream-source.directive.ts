import { Directive, ElementRef, input, effect } from '@angular/core';

@Directive({
  selector: 'video[streamSource]',
  standalone: true,
})
export class StreamSourceDirective {
  streamSource = input<MediaStream | null>(null);

  constructor(private readonly elementRef: ElementRef<HTMLVideoElement>) {
    effect(() => {
      this.elementRef.nativeElement.srcObject = this.streamSource();
    });
  }
}
