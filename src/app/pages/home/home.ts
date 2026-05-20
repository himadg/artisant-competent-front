import { Component, DestroyRef, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { DOCUMENT, isPlatformServer } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { SearchPro } from '../../shared/components/search-pro/search-pro';
import { Accordion } from '../../shared/components/accordion';
import { SeoService } from '../../core/services/seo.service';

@Component({
  standalone: true,
  imports: [TranslocoModule, RouterModule, SearchPro, Accordion],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage implements OnInit {
  /**
   * Section "Preuve sociale" masquée tant qu'il n'y a pas au moins 3 avis réels.
   * Passer à true une fois les avis réels disponibles (section 7 du brief V5).
   */
  readonly reviewsEnabled = false;

  /** Nombre de questions de la FAQ (clés i18n home.faq.q1 → home.faq.q13). */
  private static readonly FAQ_COUNT = 13;

  private readonly meta = inject(Meta);
  private readonly transloco = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    const url = 'https://artisan-competent.com/';

    this.transloco
      .selectTranslate<string[]>(['home.meta.title', 'home.meta.ogDescription', 'home.meta.description'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([title, ogDescription, description]) => {
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:description', content: ogDescription });
        this.meta.updateTag({ property: 'og:type', content: 'website' });
        this.meta.updateTag({ property: 'og:url', content: url });
        // TODO: og:image 1200x630 à fournir
      });

    this.setCanonicalUrl(url);

    // JSON-LD FAQPage : injecté uniquement côté serveur afin d'être présent dans
    // le HTML SSR (détectable par Google et les crawlers LLM sans exécuter le JS).
    // Le script étant déjà dans le HTML rendu, on évite ainsi une double injection
    // lors de l'hydratation client.
    if (isPlatformServer(this.platformId)) {
      this.injectFaqJsonLd();
    }
  }

  /**
   * Fait défiler la page en douceur jusqu'au formulaire de recherche du hero.
   * Déclenché par le bouton primaire du CTA intermédiaire.
   */
  scrollToSearch(): void {
    this.document
      .getElementById('hero-search-form')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /**
   * Construit le JSON-LD Schema.org FAQPage à partir des 13 questions/réponses
   * de la FAQ (clés Transloco) et l'injecte dans le <head> via le SeoService.
   *
   * On passe par `selectTranslate` (et non `translate`) car les fichiers de
   * traduction sont chargés en HTTP : la requête maintient l'application SSR
   * « instable » jusqu'à résolution, garantissant que le <script> est injecté
   * avant la sérialisation du HTML renvoyé par le serveur.
   */
  private injectFaqJsonLd(): void {
    const questionIds = Array.from({ length: HomePage.FAQ_COUNT }, (_, i) => `q${i + 1}`);
    // Pour chaque question : son intitulé puis le pavé de réponse complet (HTML).
    const keys = questionIds.flatMap((id) => [`home.faq.${id}.question`, `home.faq.${id}.body`]);

    this.transloco
      .selectTranslate<string[]>(keys)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((values) => {
        const entries = questionIds.map((_, i) => ({
          question: values[i * 2],
          answerHtml: values[i * 2 + 1],
        }));
        this.seo.setFaqJsonLd(entries);
      });
  }

  private setCanonicalUrl(url: string): void {
    let link = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
