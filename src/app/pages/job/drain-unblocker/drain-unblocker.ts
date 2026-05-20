import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { JobPageContentComponent } from '../_shared/job-page-content/job-page-content';
import { drainUnblockerContent } from './drain-unblocker.content';

@Component({
  standalone: true,
  imports: [JobPageContentComponent],
  templateUrl: './drain-unblocker.html',
  styleUrl: './drain-unblocker.scss',
})
export class DrainUnblockerPage {
  readonly content = drainUnblockerContent;

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    title.setTitle(this.content.metaTitle);
    meta.updateTag({ name: 'description', content: this.content.metaDescription });
  }
}
