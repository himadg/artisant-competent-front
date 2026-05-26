import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

const CANONICAL_URL = 'https://artisan-competent.com/seo-batiment';
const BREADCRUMB_LD_ID = 'seo-batiment-breadcrumb-jsonld';
const PERSON_LD_ID = 'seo-batiment-person-jsonld';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, RouterModule],
  templateUrl: './seo-batiment.html',
  styleUrl: './seo-batiment.scss',
})
export class SeoBatimentPageComponent implements OnInit {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly transloco = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  ngOnInit(): void {
    this.transloco
      .selectTranslate<string[]>([
        'seoBatiment.meta.title',
        'seoBatiment.meta.description',
        'seoBatiment.breadcrumb.home',
        'seoBatiment.breadcrumb.page',
        'seoBatiment.profile.name',
        'seoBatiment.profile.jobTitle',
        'seoBatiment.profile.organization',
      ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((values) => {
        const [title, description, breadcrumbHome, breadcrumbPage, personName, personJobTitle, organizationName] =
          values;
        this.titleService.setTitle(title);
        this.metaService.updateTag({ name: 'description', content: description });
        this.metaService.updateTag({ property: 'og:title', content: title });
        this.metaService.updateTag({ property: 'og:description', content: description });
        this.metaService.updateTag({ property: 'og:type', content: 'website' });
        this.metaService.updateTag({ property: 'og:url', content: CANONICAL_URL });
        this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.metaService.updateTag({ name: 'twitter:title', content: title });
        this.metaService.updateTag({ name: 'twitter:description', content: description });
        this.setCanonical(CANONICAL_URL);
        this.setBreadcrumbSchema(breadcrumbHome, breadcrumbPage);
        this.setPersonSchema(personName, personJobTitle, organizationName);
      });
  }

  private setCanonical(url: string): void {
    if (!this.isBrowser) return;
    const head = this.document.head;
    if (!head) return;
    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setBreadcrumbSchema(homeLabel: string, pageLabel: string): void {
    if (!this.isBrowser) return;
    const head = this.document.head;
    if (!head) return;
    const existing = this.document.getElementById(BREADCRUMB_LD_ID);
    if (existing) existing.remove();
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = BREADCRUMB_LD_ID;
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: homeLabel, item: 'https://artisan-competent.com/' },
        { '@type': 'ListItem', position: 2, name: pageLabel, item: CANONICAL_URL },
      ],
    });
    head.appendChild(script);
  }

  private setPersonSchema(name: string, jobTitle: string, organizationName: string): void {
    if (!this.isBrowser) return;
    const head = this.document.head;
    if (!head) return;
    const existing = this.document.getElementById(PERSON_LD_ID);
    if (existing) existing.remove();
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = PERSON_LD_ID;
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name,
      jobTitle,
      worksFor: {
        '@type': 'Organization',
        name: organizationName,
      },
    });
    head.appendChild(script);
  }
}
