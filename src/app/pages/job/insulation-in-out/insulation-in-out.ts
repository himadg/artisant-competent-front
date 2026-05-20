import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { JobPageContentComponent } from '../_shared/job-page-content/job-page-content';
import { insulationInOutContent } from './insulation-in-out.content';

@Component({
  standalone: true,
  imports: [JobPageContentComponent],
  templateUrl: './insulation-in-out.html',
  styleUrl: './insulation-in-out.scss',
})
export class InsulationInOutPage {
  readonly content = insulationInOutContent;

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    title.setTitle(this.content.metaTitle);
    meta.updateTag({ name: 'description', content: this.content.metaDescription });
  }
}
