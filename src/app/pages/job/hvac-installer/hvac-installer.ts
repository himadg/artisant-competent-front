import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { JobPageContentComponent } from '../_shared/job-page-content/job-page-content';
import { hvacInstallerContent } from './hvac-installer.content';

@Component({
  standalone: true,
  imports: [JobPageContentComponent],
  templateUrl: './hvac-installer.html',
  styleUrl: './hvac-installer.scss',
})
export class HvacInstallerPage {
  readonly content = hvacInstallerContent;

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    title.setTitle(this.content.metaTitle);
    meta.updateTag({ name: 'description', content: this.content.metaDescription });
  }
}
