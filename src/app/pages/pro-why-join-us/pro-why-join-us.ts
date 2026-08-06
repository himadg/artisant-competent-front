import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

const CANONICAL_URL = 'https://artisan-competent.com/pro-why-join-us';
const BREADCRUMB_LD_ID = 'pro-breadcrumb-jsonld';
const FAQ_LD_ID = 'pro-faq-jsonld';
const FAQ_ENTRIES: ReadonlyArray<{ q: string; a: string }> = [
  { q: 'pro.faq.q1.question', a: 'pro.faq.q1.answerLd' },
  { q: 'pro.faq.q2.question', a: 'pro.faq.q2.answerLd' },
  { q: 'pro.faq.q3.question', a: 'pro.faq.q3.body' },
  { q: 'pro.faq.q4.question', a: 'pro.faq.q4.answerLd' },
  { q: 'pro.faq.q5.question', a: 'pro.faq.q5.answerLd' },
];

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, RouterModule],
  templateUrl: './pro-why-join-us.html',
  styleUrl: './pro-why-join-us.scss',
})
export class ProWhyJoinUsPageComponent implements OnInit {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly transloco = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  ngOnInit(): void {
    const faqKeys = FAQ_ENTRIES.flatMap((entry) => [entry.q, entry.a]);

    this.transloco
      .selectTranslate<string[]>([
        'pro.meta.title',
        'pro.meta.description',
        'pro.breadcrumb.home',
        'pro.breadcrumb.pro',
        ...faqKeys,
      ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((values) => {
        const [title, description, breadcrumbHome, breadcrumbPro, ...faqValues] = values;
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
        this.setBreadcrumbSchema(breadcrumbHome, breadcrumbPro);
        const faqPairs = FAQ_ENTRIES.map((_, i) => ({
          question: faqValues[i * 2],
          answer: faqValues[i * 2 + 1],
        }));
        this.setFaqSchema(faqPairs);
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

  private setBreadcrumbSchema(homeLabel: string, proLabel: string): void {
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
        { '@type': 'ListItem', position: 2, name: proLabel, item: CANONICAL_URL },
      ],
    });
    head.appendChild(script);
  }

  private setFaqSchema(pairs: ReadonlyArray<{ question: string; answer: string }>): void {
    if (!this.isBrowser) return;
    const head = this.document.head;
    if (!head) return;
    const existing = this.document.getElementById(FAQ_LD_ID);
    if (existing) existing.remove();
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = FAQ_LD_ID;
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: pairs.map((p) => ({
        '@type': 'Question',
        name: p.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: p.answer,
        },
      })),
    });
    head.appendChild(script);
  }
}
