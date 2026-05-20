import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { JobPageContentComponent } from '../_shared/job-page-content/job-page-content';
import { plumberSanitaryContent } from './plumber-sanitary.content';

@Component({
  standalone: true,
  imports: [JobPageContentComponent],
  templateUrl: './plumber-sanitary.html',
  styleUrl: './plumber-sanitary.scss',
})
export class PlumberSanitaryPage {
  readonly content = plumberSanitaryContent;

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    title.setTitle(this.content.metaTitle);
    meta.updateTag({ name: 'description', content: this.content.metaDescription });
  }
}
