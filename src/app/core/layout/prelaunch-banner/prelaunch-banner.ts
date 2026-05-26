import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'ac-prelaunch-banner',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './prelaunch-banner.html',
  styleUrl: './prelaunch-banner.scss',
})
export class PrelaunchBanner {}
