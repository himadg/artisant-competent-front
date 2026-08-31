const fs = require('node:fs');
const path = require('node:path');

// Mêmes noms de variables que .env / server.ts / AppConfigService (branche serveur) : API_URL /
// TURNSTILE_SITE_KEY — pour que ce script (build:staging/build:prod, CI) et le reste du code
// lisent la même convention et ne divergent pas silencieusement.
const config = {
  apiUrl: process.env.API_URL,
  turnstileSiteKey: process.env.TURNSTILE_SITE_KEY,
};

const outPath = path.join(__dirname, '../src/assets/config/config.json');
fs.writeFileSync(outPath, JSON.stringify(config, null, 2));
