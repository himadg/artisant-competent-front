import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { JobPageContentComponent } from '../_shared/job-page-content/job-page-content';
import { floorCoveringsContent } from './floor-coverings.content';

@Component({
  standalone: true,
  imports: [JobPageContentComponent],
  templateUrl: './floor-coverings.html',
  styleUrl: './floor-coverings.scss',
})
export class FloorCoveringsPage {
  readonly content = floorCoveringsContent;

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    title.setTitle(this.content.metaTitle);
    meta.updateTag({ name: 'description', content: this.content.metaDescription });
  }
}
