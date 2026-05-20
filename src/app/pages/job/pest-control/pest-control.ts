import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { JobPageContentComponent } from '../_shared/job-page-content/job-page-content';
import { pestControlContent } from './pest-control.content';

@Component({
  standalone: true,
  imports: [JobPageContentComponent],
  templateUrl: './pest-control.html',
  styleUrl: './pest-control.scss',
})
export class PestControlPage {
  readonly content = pestControlContent;

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    title.setTitle(this.content.metaTitle);
    meta.updateTag({ name: 'description', content: this.content.metaDescription });
  }
}
