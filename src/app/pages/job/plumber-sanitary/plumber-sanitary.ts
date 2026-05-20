import { Component, computed, effect, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { LangService } from '../../../core/services/lang.service';
import { JobPageContentComponent } from '../_shared/job-page-content/job-page-content';
import { plumberSanitaryContent } from './plumber-sanitary.content';

@Component({
  standalone: true,
  imports: [JobPageContentComponent],
  templateUrl: './plumber-sanitary.html',
  styleUrl: './plumber-sanitary.scss',
})
export class PlumberSanitaryPage {
  private readonly lang = inject(LangService).lang;
  readonly content = computed(() => plumberSanitaryContent[this.lang()]);

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    effect(() => {
      const c = this.content();
      title.setTitle(c.metaTitle);
      meta.updateTag({ name: 'description', content: c.metaDescription });
    });
  }
}
