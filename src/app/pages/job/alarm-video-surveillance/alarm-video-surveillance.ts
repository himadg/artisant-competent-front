import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { JobPageContentComponent } from '../_shared/job-page-content/job-page-content';
import { alarmVideoSurveillanceContent } from './alarm-video-surveillance.content';

@Component({
  standalone: true,
  imports: [JobPageContentComponent],
  templateUrl: './alarm-video-surveillance.html',
  styleUrl: './alarm-video-surveillance.scss',
})
export class AlarmVideoSurveillancePage {
  readonly content = alarmVideoSurveillanceContent;

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    title.setTitle(this.content.metaTitle);
    meta.updateTag({ name: 'description', content: this.content.metaDescription });
  }
}
