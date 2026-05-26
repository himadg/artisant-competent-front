import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { JobPageContentComponent } from '../_shared/job-page-content/job-page-content';
import { SeoService } from '../../../core/services/seo.service';
import { electricianContent } from './electrician.content';

@Component({
  standalone: true,
  imports: [JobPageContentComponent],
  templateUrl: './electrician.html',
  styleUrl: './electrician.scss',
})
export class ElectricianPage implements OnInit {
  readonly content = electricianContent;

  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.title.setTitle(this.content.metaTitle);
    this.meta.updateTag({ name: 'description', content: this.content.metaDescription });

    // JSON-LD : injecté uniquement côté serveur pour être présent dans le HTML
    // SSR (détectable par Google et crawlers LLM sans exécuter le JS), et éviter
    // une double injection lors de l'hydratation client.
    if (isPlatformServer(this.platformId)) {
      this.injectJsonLd();
    }
  }

  private injectJsonLd(): void {
    const pageUrl = 'https://artisan-competent.com/jobs/electrician';

    this.seo.setServiceJsonLd({
      name: 'Électricien vérifié : Artisan Compétent',
      serviceType: 'Électricité',
      description: this.content.metaDescription,
      url: pageUrl,
    });

    const faqBlock = this.content.body.find((b) => b.kind === 'faq');
    if (faqBlock && faqBlock.kind === 'faq') {
      this.seo.setFaqJsonLd(
        faqBlock.items.map((item) => ({
          question: item.question,
          answerHtml: item.answers.join(' '),
        })),
      );
    }

    this.seo.setBreadcrumbJsonLd([
      { name: 'Accueil', url: 'https://artisan-competent.com/' },
      { name: 'Nos métiers', url: 'https://artisan-competent.com/jobs' },
      { name: 'Électricien' },
    ]);
  }
}
