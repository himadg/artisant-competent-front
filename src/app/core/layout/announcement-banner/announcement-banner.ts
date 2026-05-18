import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'ac-announcement-banner',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './announcement-banner.html',
  styleUrl: './announcement-banner.scss',
})
export class AnnouncementBanner {}
