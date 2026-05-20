import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { JobPageContentComponent } from '../_shared/job-page-content/job-page-content';
import { heatingTechContent } from './heating-tech.content';

@Component({
  standalone: true,
  imports: [JobPageContentComponent],
  templateUrl: './heating-tech.html',
  styleUrl: './heating-tech.scss',
})
export class HeatingTechPage {
  readonly content = heatingTechContent;

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    title.setTitle(this.content.metaTitle);
    meta.updateTag({ name: 'description', content: this.content.metaDescription });
  }
}
