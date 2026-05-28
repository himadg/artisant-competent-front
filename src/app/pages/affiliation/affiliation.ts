import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, PlatformLocation } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { setAffiliateCode } from '../../core/utils/common-utils';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, RouterModule],
  templateUrl: './affiliation.html',
  styleUrl: './affiliation.scss',
})
export class AffiliationPage implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly platformLocation = inject(PlatformLocation);

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private transloco: TranslocoService,
    private destroyRef: DestroyRef,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const ref = this.route.snapshot.queryParamMap.get('ref');
    if (ref && isPlatformBrowser(this.platformId)) {
      setAffiliateCode(ref);
    }

    const { protocol, hostname, port } = this.platformLocation;
    const origin = `${protocol}//${hostname}${port ? ':' + port : ''}`;
    const url = `${origin}/affiliation`;

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
