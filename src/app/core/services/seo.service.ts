import { DOCUMENT } from '@angular/common';
import { Injectable, RendererFactory2, inject } from '@angular/core';

/** Une entrée de FAQ : intitulé de la question et pavé de réponse (HTML autorisé). */
export interface FaqEntry {
  /** Intitulé de la question, en texte brut. */
  question: string;
  /** Réponse complète. Peut contenir du HTML (p, ul, li) — autorisé par Google pour FAQPage. */
  answerHtml: string;
}

/**
 * Service SEO : injection de données structurées Schema.org (JSON-LD) dans le <head>.
 *
 * L'injection s'appuie sur Renderer2 + DOCUMENT afin de rester compatible avec le
 * rendu côté serveur (Angular SSR). Appelé depuis un `ngOnInit` exécuté sur le
 * serveur, le <script> généré est présent dans le HTML statique renvoyé au
 * navigateur (vérifiable via « Afficher le code source de la page »), donc
 * détectable par Google et les crawlers LLM sans exécution de JavaScript.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly rendererFactory = inject(RendererFactory2);

  /** Identifiant du <script> JSON-LD FAQPage, utilisé pour rester idempotent. */
  private static readonly FAQ_SCRIPT_ID = 'ld-json-faqpage';

  /**
   * Injecte (ou remplace) le JSON-LD Schema.org `FAQPage` dans le <head>.
   *
   * @param entries Les questions/réponses de la FAQ, dans l'ordre d'affichage.
   */
  setFaqJsonLd(entries: FaqEntry[]): void {
    if (!entries.length) {
      return;
    }

    const faqPage = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: entries.map((entry) => ({
        '@type': 'Question',
        name: entry.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: entry.answerHtml,
        },
      })),
    };

    this.injectJsonLd(SeoService.FAQ_SCRIPT_ID, faqPage);
  }

  /**
   * Crée un <script type="application/ld+json"> dans le <head> via Renderer2
   * (compatible SSR). Tout script de même identifiant est retiré au préalable
   * afin de rester idempotent (ré-appel, navigation SPA, hydratation client).
   */
  private injectJsonLd(id: string, data: unknown): void {
    const renderer = this.rendererFactory.createRenderer(null, null);

    const existing = this.document.getElementById(id);
    if (existing?.parentNode) {
      renderer.removeChild(existing.parentNode, existing);
    }

    const script = renderer.createElement('script') as HTMLScriptElement;
    renderer.setAttribute(script, 'type', 'application/ld+json');
    renderer.setAttribute(script, 'id', id);
    // JSON.stringify échappe nativement les guillemets ; les accents et apostrophes
    // restent en UTF-8 dans la sortie du document.
    script.text = JSON.stringify(data);
    renderer.appendChild(this.document.head, script);
  }
}
