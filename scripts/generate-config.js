const fs = require('node:fs');
const path = require('node:path');

const config = {
  apiUrl: process.env.apiUrl,
  turnstileSiteKey: process.env.turnstileSiteKey,
};

const outPath = path.join(__dirname, '../src/assets/config/config.json');
fs.writeFileSync(outPath, JSON.stringify(config, null, 2));
