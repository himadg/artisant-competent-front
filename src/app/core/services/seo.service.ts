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
/** Une étape d'un fil d'Ariane Schema.org BreadcrumbList. */
export interface BreadcrumbEntry {
  /** Libellé affichable de l'étape (ex. « Accueil », « Nos métiers »). */
  name: string;
  /** URL absolue de l'étape. Omis pour la dernière étape (page courante). */
  url?: string;
}

/** Données nécessaires à un JSON-LD Schema.org `Service`. */
export interface ServiceJsonLdInput {
  /** Nom du service (ex. « Électricien vérifié : Artisan Compétent »). */
  name: string;
  /** Type de service (ex. « Électricité », « Plomberie »). */
  serviceType: string;
  /** Description courte du service. */
  description?: string;
  /** URL canonique de la page Service. */
  url?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly rendererFactory = inject(RendererFactory2);

  /** Identifiant du <script> JSON-LD FAQPage, utilisé pour rester idempotent. */
  private static readonly FAQ_SCRIPT_ID = 'ld-json-faqpage';
  /** Identifiant du <script> JSON-LD Service. */
  private static readonly SERVICE_SCRIPT_ID = 'ld-json-service';
  /** Identifiant du <script> JSON-LD BreadcrumbList. */
  private static readonly BREADCRUMB_SCRIPT_ID = 'ld-json-breadcrumb';

  /** Provider Artisan Compétent partagé par tous les Service JSON-LD. */
  private static readonly PROVIDER = {
    '@type': 'Organization',
    name: 'Artisan Compétent',
    url: 'https://artisan-competent.com/',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '66 avenue des Champs-Élysées',
      postalCode: '75008',
      addressLocality: 'Paris',
      addressCountry: 'FR',
    },
  } as const;

  /** Zone desservie commune : France, DOM-TOM et Corse. */
  private static readonly AREA_SERVED = [
    { '@type': 'Country', name: 'France' },
    { '@type': 'AdministrativeArea', name: 'Corse' },
    { '@type': 'AdministrativeArea', name: 'DOM-TOM' },
  ] as const;

  /** Disponibilité 24h/24, 7j/7. */
  private static readonly HOURS_AVAILABLE = {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  } as const;

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
   * Injecte (ou remplace) le JSON-LD Schema.org `Service` dans le <head}.
   * Provider, zone desservie et horaires 24/7 sont mutualisés.
   */
  setServiceJsonLd(input: ServiceJsonLdInput): void {
    const service: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: input.name,
      serviceType: input.serviceType,
      provider: SeoService.PROVIDER,
      areaServed: SeoService.AREA_SERVED,
      hoursAvailable: SeoService.HOURS_AVAILABLE,
    };
    if (input.description) {
      service['description'] = input.description;
    }
    if (input.url) {
      service['url'] = input.url;
    }
    this.injectJsonLd(SeoService.SERVICE_SCRIPT_ID, service);
  }

  /**
   * Injecte (ou remplace) le JSON-LD Schema.org `BreadcrumbList` dans le <head>.
   * La dernière étape (page courante) peut omettre `url`.
   */
  setBreadcrumbJsonLd(entries: BreadcrumbEntry[]): void {
    if (!entries.length) {
      return;
    }
    const breadcrumbList = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: entries.map((entry, index) => {
        const item: Record<string, unknown> = {
          '@type': 'ListItem',
          position: index + 1,
          name: entry.name,
        };
        if (entry.url) {
          item['item'] = entry.url;
        }
        return item;
      }),
    };
    this.injectJsonLd(SeoService.BREADCRUMB_SCRIPT_ID, breadcrumbList);
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
