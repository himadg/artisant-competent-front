import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { JobPageContentComponent } from '../_shared/job-page-content/job-page-content';
import { locksmithMetallerContent } from './locksmith-metaller.content';

@Component({
  standalone: true,
  imports: [JobPageContentComponent],
  templateUrl: './locksmith-metaller.html',
  styleUrl: './locksmith-metaller.scss',
})
export class LocksmithMetallerPage {
  readonly content = locksmithMetallerContent;

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    title.setTitle(this.content.metaTitle);
    meta.updateTag({ name: 'description', content: this.content.metaDescription });
  }
}
