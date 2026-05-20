import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { JobPageContentComponent } from '../_shared/job-page-content/job-page-content';
import { carpenterGlazierContent } from './carpenter-glazier.content';

@Component({
  standalone: true,
  imports: [JobPageContentComponent],
  templateUrl: './carpenter-glazier.html',
  styleUrl: './carpenter-glazier.scss',
})
export class CarpenterGlazierPage {
  readonly content = carpenterGlazierContent;

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    title.setTitle(this.content.metaTitle);
    meta.updateTag({ name: 'description', content: this.content.metaDescription });
  }
}
