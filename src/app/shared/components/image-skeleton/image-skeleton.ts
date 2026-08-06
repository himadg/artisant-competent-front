import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'image-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full h-full bg-gray-200 animate-pulse' },
  template: '',
})
export class ImageSkeleton {}
