import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, RouterModule],
  templateUrl: './affiliation.html',
  styleUrl: './affiliation.scss',
})
export class AffiliationPage implements OnInit {
  constructor(
    private titleService: Title,
    private metaService: Meta,
    private transloco: TranslocoService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/affiliation` : '/affiliation';

    this.transloco
      .selectTranslate<string[]>(['affiliation.meta.title', 'affiliation.meta.description'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([title, description]) => {
        this.titleService.setTitle(title);
        this.metaService.updateTag({ name: 'description', content: description });
        this.metaService.updateTag({ property: 'og:title', content: title });
        this.metaService.updateTag({ property: 'og:description', content: description });
        this.metaService.updateTag({ property: 'og:type', content: 'website' });
        this.metaService.updateTag({ property: 'og:url', content: url });
        this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.metaService.updateTag({ name: 'twitter:title', content: title });
        this.metaService.updateTag({ name: 'twitter:description', content: description });
      });
  }
}
