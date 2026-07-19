# Artisan Compétent — Front (Angular)

Front de la marketplace BTP « Artisan Compétent » : site public + dashboards (particulier, professionnel, admin). Backend NestJS dans `../artisant-competent-backend`.

## Stack

- Angular 21, **100 % standalone** (aucun NgModule), signals + `ChangeDetectionStrategy.OnPush`
- SSR via `@angular/ssr` (Express, `src/server.ts`) + hydratation ; **la route `dashboard` est `RenderMode.Client`** (CSR pur, voir `app.routes.server.ts`)
- Tailwind 3 + SCSS scopé par composant, dark mode via `:host-context(.dark)`, variables de thème dans `src/styles.css` (palette beige/marron/vert d'eau)
- Transloco (i18n fr/en, défaut fr) : `src/assets/i18n/fr.json` + `en.json` — **toujours mettre à jour les deux**
- Cloudflare Turnstile, `@ng-icons`/iconify

## Commandes

```bash
npm run dev          # ng serve --hmr
npm start            # ng cache clean && ng serve
npm run build        # ng build
npm run build:prod   # generate-config.js + ng build -c production
npm run ssr          # build + node dist/.../server.mjs
```

## Patterns clés

- **Services API** : wrappers `HttpClient` fins dans `src/app/core/services/*-api.service.ts`, URLs **relatives** (`this.http.get('/dashboard')`) — les interceptors `apiUrlInterceptor` (préfixe apiUrl) et `authInterceptor` (Bearer + refresh silencieux sur 401) font le reste. Modèle : `affiliation-api.service.ts`
- **Config runtime** : toute nouvelle clé publique passe par 4 fichiers — `src/assets/config/config.json`, `config.example.json`, `scripts/generate-config.js`, `app-config.service.ts` (branche SSR lit `process.env`). Lecture : `appConfigService.get('...')`. Modèle : `turnstileSiteKey`
- **Auth** : `auth.service.ts` (signaux `currentUser`, `isAuthenticated`), rôle via `currentUser()?.role?.code` ; routes protégées par `authGuard`/`adminGuard`
- **Dashboard pro** (`src/app/pages/dashboard/professional/professional-dashboard.ts/.html/.scss`) : la navigation interne est un **état signal** (`ProSection`), pas des routes enfants — sidebar + bottom-nav mobile + `@switch (activeSection())` ; chargement lazy des données à la 1ʳᵉ ouverture d'une section (modèle : `affiliation`). Bandeaux de statut en haut du template (l. 8-54, jaune/rouge Tailwind)
- **CSP** : `index.html` impose `require-trusted-types-for 'script'` avec allowlist trusted-types — tout script tiers doit être compatible (modèle : Turnstile, chargé par `<script>` statique)
- Routes top-level lazy (`loadComponent`) ; `title` des routes = clés Transloco

## Git

- Branche de prod : `master` (gérée par l'autre dev). Branches de feature, commits locaux par étape, PR quand l'incrément est testé
- Style de commit : court, anglais, minuscules, impératif (ex. `add seed.ts to fill db for new devs`, `fix siret control issue`)

## Stripe Connect (incrément 1 ✅ livré et testé E2E le 18/07/2026, branche `stripe`)

Onboarding et gestion du compte Stripe Connect de l'artisan via **composants embarqués** (`@stripe/connect-js`), sans jamais quitter la plateforme. Référence : `../docs/Plan Stripe v4.pdf`, `../docs/PLAN-MVP-STRIPE.md`, et `AGENTS.md` du backend (§Stripe).

- Section `payments` du dashboard pro : `professional/stripe-payments/stripe-payments-section` — au 1ᵉʳ affichage : `createAccount()` (lazy, idempotent) → `getStatus()` → montage des composants embarqués via effect/viewChild. Non onboardé : `account-onboarding` seul (`setOnExit` → `getStatus(refresh=true)` → émet `statusChanged` au parent). Onboardé : `notification-banner` + `balances` + `payouts` (lecture seule) + `account-management`
- Bandeaux en haut du dashboard pro (masqués dans la section payments) : jaune « Configurez vos paiements » si `!stripeDetailsSubmitted`, rouge « Action requise » si onboardé mais `transfersEnabled`/`payoutsEnabled` retombe à false — flags servis par `GET /dashboard` (spread du profil), mis à jour par l'output `statusChanged` ; CTA → `setSection('payments')`
- `stripe-api.service.ts` (create account / account-session / status) + `stripe-connect.service.ts` (singleton `loadConnectAndInitialize`, `fetchClientSecret` → `POST /stripe/connect/account-session`, appearance `colorPrimary #00637b`, locale suivant Transloco)
- `stripePublishableKey` dans la config runtime (4 fichiers, modèle turnstileSiteKey ; `config.json` local est gitignoré)
- CSP : script statique `connect-js.stripe.com/v1.0/connect.js` + `stripe-js` dans l'allowlist trusted-types de `index.html` — validé à l'exécution, aucune violation
- i18n : clés `dashboard.pro.nav.payments` + `dashboard.pro.payments.*` (fr + en)
