const fs = require('fs');
const path = require('path');

const config = {
  apiUrl: process.env.apiUrl,
  turnstileSiteKey: process.env.turnstileSiteKey,
};

const outPath = path.join(__dirname, '../src/assets/config/config.json');
fs.writeFileSync(outPath, JSON.stringify(config, null, 2));
console.log('config.json generated:', config);
