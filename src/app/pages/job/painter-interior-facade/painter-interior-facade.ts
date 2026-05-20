import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { JobPageContentComponent } from '../_shared/job-page-content/job-page-content';
import { painterInteriorFacadeContent } from './painter-interior-facade.content';

@Component({
  standalone: true,
  imports: [JobPageContentComponent],
  templateUrl: './painter-interior-facade.html',
  styleUrl: './painter-interior-facade.scss',
})
export class PainterInteriorFacadePage {
  readonly content = painterInteriorFacadeContent;

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    title.setTitle(this.content.metaTitle);
    meta.updateTag({ name: 'description', content: this.content.metaDescription });
  }
}
