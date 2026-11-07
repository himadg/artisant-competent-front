import { RenderMode, ServerRoute } from '@angular/ssr';
import { CITIES } from './data/cities';
import { TRADES } from './data/trades';

export const serverRoutes: ServerRoute[] = [
  // Routes protégées → CSR
  { path: 'dashboard', renderMode: RenderMode.Client },
  { path: 'dashboard/**', renderMode: RenderMode.Client },
  { path: 'admin/professionals/**', renderMode: RenderMode.Client },
  { path: 'auth/**', renderMode: RenderMode.Client },

  // Résultats dépendant des query params (+ sessionStorage) → CSR
  { path: 'search-pro', renderMode: RenderMode.Client },

  // Pages statiques → prérendu au build
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'about-us', renderMode: RenderMode.Prerender },
  { path: 'pro-why-join-us', renderMode: RenderMode.Prerender },
  { path: 'jobs', renderMode: RenderMode.Prerender },
  { path: 'affiliation', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'seo-batiment', renderMode: RenderMode.Prerender },
  { path: 'cmod/formule', renderMode: RenderMode.Prerender },
  { path: 'coming-soon', renderMode: RenderMode.Prerender },
  { path: 'cities', renderMode: RenderMode.Prerender },
  { path: 'blog', renderMode: RenderMode.Prerender },
  { path: 'faq', renderMode: RenderMode.Prerender },
  { path: 'urgences', renderMode: RenderMode.Prerender },
  { path: 'guidance', renderMode: RenderMode.Prerender },
  { path: 'steps', renderMode: RenderMode.Prerender },
  { path: 'cgu', renderMode: RenderMode.Prerender },
  { path: 'cgv', renderMode: RenderMode.Prerender },
  { path: 'politique-confidentialite', renderMode: RenderMode.Prerender },
  { path: 'mentions-legales', renderMode: RenderMode.Prerender },
  { path: 'politique-cookies', renderMode: RenderMode.Prerender },

  // Pages métier → prérendu statique par métier
  { path: 'job/electrician', renderMode: RenderMode.Prerender },
  { path: 'job/locksmith', renderMode: RenderMode.Prerender },
  { path: 'job/plumber-sanitary', renderMode: RenderMode.Prerender },
  { path: 'job/drain-unblocker', renderMode: RenderMode.Prerender },
  { path: 'job/heating', renderMode: RenderMode.Prerender },
  { path: 'job/hvac', renderMode: RenderMode.Prerender },
  { path: 'job/glazier', renderMode: RenderMode.Prerender },
  { path: 'job/pest-control', renderMode: RenderMode.Prerender },

  // Pages ville → prérendu pour chaque ville
  {
    path: 'city/:city',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return CITIES.map((city) => ({ city: city.slug }));
    },
  },

  // Pages métier/ville → prérendu avec getPrerenderParams
  {
    path: 'job/:trade/:city',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return TRADES.flatMap((trade) => CITIES.map((city) => ({ trade: trade.slug, city: city.slug })));
    },
  },

  // Toutes les autres pages publiques → SSR à la demande
  { path: '**', renderMode: RenderMode.Server },
];
