// Doit rester le tout premier import : charge .env (non versionné) dans process.env avant que quoi que ce soit
// d'autre ne s'exécute — fiable quel que soit le mode de lancement (ng serve, HMR, npm run ssr...), contrairement
// à une lecture des artefacts de build (dist/), qui ne sont pas toujours matérialisés sur disque en dev.
import 'dotenv/config';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
// Import statique (résolu par le bundler, pas lu sur disque au runtime) : fiable en ng serve
// comme en prod, contrairement à une lecture de dist/ dont le chemin réel varie selon le mode.
// Régénéré via `npm run update-csp` (cf. scripts/csp-hashes.js) — empreintes des scripts inline
// générés par Angular (ex: bootstrap withEventReplay), fixes tant que la version d'Angular ne change pas.
import cspHashesData from './csp-hashes.json';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

// Origine de l'API dépendant du déploiement (prod/préprod/dev ont des domaines différents) — jamais
// en dur, lue depuis les variables d'environnement du serveur Node (même convention que API_URL déjà
// utilisé par AppConfigService). Le stockage (*.backblazeb2.com), lui, ne dépend pas de
// l'environnement — seul le nom du bucket change, ce que le wildcard absorbe déjà.
function buildContentSecurityPolicy(): string {
  const apiUrl = process.env['API_URL'];
  const apiWsUrl = apiUrl?.replace(/^http/, 'ws');

  const connectSrc = [
    "'self'",
    'https://api.iconify.design',
    // GA4 envoie ses mesures vers des sous-domaines régionaux (region1., region2., ...).
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
    // Turnstile appelle challenges.cloudflare.com en XHR/fetch pour valider le challenge.
    'https://challenges.cloudflare.com',
    apiUrl,
    apiWsUrl,
  ].filter(Boolean);

  if (!apiUrl) console.warn('[CSP] apiUrl non défini : connect-src ne couvrira pas les appels API.');

  const scriptHashes = cspHashesData.hashes.map((h) => `'${h}'`).join(' ');

  return [
    "default-src 'self'",
    `script-src 'self' ${scriptHashes} https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://*.backblazeb2.com",
    "font-src 'self' data:",
    `connect-src ${connectSrc.join(' ')}`,
    // Backblaze : aperçu PDF affiché en iframe (doc-modal) depuis une URL signée du bucket.
    "frame-src https://challenges.cloudflare.com https://www.googletagmanager.com https://*.backblazeb2.com",
    // Angular utilise des Web Workers via blob: en interne (dev + certains outils internes).
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'self'",
  ].join('; ');
}

// Recalculé à chaque requête (coût négligeable) plutôt que mis en cache une fois au démarrage :
// évite qu'une variable d'environnement changée sans redémarrage complet du process ne reste figée.
app.use((_req, res, next) => {
  res.setHeader('Content-Security-Policy', buildContentSecurityPolicy());
  next();
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
