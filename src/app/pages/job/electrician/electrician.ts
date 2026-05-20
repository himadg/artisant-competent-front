import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { JobPageContentComponent } from '../_shared/job-page-content/job-page-content';
import { electricianContent } from './electrician.content';

@Component({
  standalone: true,
  imports: [JobPageContentComponent],
  templateUrl: './electrician.html',
  styleUrl: './electrician.scss',
})
export class ElectricianPage {
  readonly content = electricianContent;

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    title.setTitle(this.content.metaTitle);
    meta.updateTag({ name: 'description', content: this.content.metaDescription });
  }
}
