import 'iconify-icon';
import { addCollection } from '@iconify/iconify';
import lucide from '@iconify-json/lucide/icons.json';
import circleFlags from '@iconify-json/circle-flags/icons.json';
import { bootstrapApplication } from '@angular/platform-browser';
import DOMPurify from 'dompurify';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// FilePond utilise deux sinks Trusted Types :
//   1. `element.innerHTML = string` pour les libellés de la zone de dépôt
//      (createHTML) ;
//   2. `new Worker(url)` dans le plugin image-preview, qui construit le worker
//      à partir d'une URL `blob:` générée en interne (createScriptURL).
// Sous une CSP `require-trusted-types-for 'script'`, le navigateur refuse les
// assignations de strings brutes. On enregistre une policy `default` couvrant
// les deux sinks : elle s'applique automatiquement aux écritures internes de
// FilePond. À exécuter AVANT le bootstrap (donc avant l'init FilePond).
// Garde-fous : `typeof window` pour le rendu SSR, et la détection de l'API
// Trusted Types (non supportée par tous les navigateurs).
if (
  typeof window !== 'undefined' &&
  (window as any).trustedTypes &&
  typeof (window as any).trustedTypes.createPolicy === 'function'
) {
  try {
    (window as any).trustedTypes.createPolicy('default', {
      createHTML: (input: string) => DOMPurify.sanitize(input, { RETURN_TRUSTED_TYPE: false }),
      // Le worker image-preview est instancié depuis une URL `blob:` (ou
      // same-origin). On n'autorise que ces schémas et on rejette tout le reste
      // afin de ne pas ouvrir un sink script-URL arbitraire.
      createScriptURL: (input: string) => {
        const url = new URL(input, window.location.origin);
        if (url.protocol === 'blob:' || url.origin === window.location.origin) {
          return input;
        }
        throw new Error(`[trusted-types] URL de script refusée : ${input}`);
      },
    });
  } catch (e) {
    // Une policy `default` déjà enregistrée (HMR / double bootstrap) lève une
    // erreur bénigne. En revanche, un blocage CSP (nom `default` absent de la
    // directive `trusted-types`) doit rester visible : on le journalise.
    console.warn('[trusted-types] createPolicy("default") a échoué :', e);
  }
}

addCollection(lucide);
addCollection(circleFlags);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
