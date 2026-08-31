const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

// Calcule les empreintes SHA-256 des scripts inline générés par Angular (ex: le bootstrap
// withEventReplay) dans le build réel, pour les comparer/écrire dans src/csp-hashes.json,
// consommé par server.ts pour la directive script-src du CSP.
//
// Utilisation :
//   node scripts/csp-hashes.js          → vérifie (échoue si différent du fichier existant)
//   node scripts/csp-hashes.js --update → recalcule et écrit dans src/csp-hashes.json

const MODE = process.argv.includes('--update') ? 'update' : 'check';
const indexPath = path.join(__dirname, '../dist/artisan-competent/browser/index.html');
const hashesPath = path.join(__dirname, '../src/csp-hashes.json');

if (!fs.existsSync(indexPath)) {
  console.error('[csp-hashes] dist/artisan-competent/browser/index.html introuvable — lance `ng build` avant ce script.');
  process.exit(1);
}

const html = fs.readFileSync(indexPath, 'utf8');
// Scripts inline uniquement (pas de src=), en excluant les payloads de données (ex: TransferState
// en type="application/json", dont le contenu varie et n'a pas vocation à être hashé).
const scriptRegex = /<script(?![^>]*\bsrc=)(?![^>]*type="application\/json")[^>]*>([\s\S]*?)<\/script>/g;

const hashes = [];
let match;
while ((match = scriptRegex.exec(html)) !== null) {
  const content = match[1];
  if (!content.trim()) continue;
  hashes.push('sha256-' + crypto.createHash('sha256').update(content, 'utf8').digest('base64'));
}

if (hashes.length === 0) {
  console.warn('[csp-hashes] Aucun script inline trouvé — vérifie que withEventReplay() est toujours actif.');
}

if (MODE === 'update') {
  fs.writeFileSync(hashesPath, JSON.stringify({ hashes }, null, 2) + '\n');
  console.log(`[csp-hashes] ${hashes.length} empreinte(s) écrite(s) dans src/csp-hashes.json :`);
  hashes.forEach((h) => console.log('  ' + h));
  process.exit(0);
}

const expected = fs.existsSync(hashesPath) ? JSON.parse(fs.readFileSync(hashesPath, 'utf8')).hashes : [];
const same = expected.length === hashes.length && expected.every((h) => hashes.includes(h));

if (!same) {
  console.error('[csp-hashes] Les empreintes des scripts inline ne correspondent plus à src/csp-hashes.json.');
  console.error('Nouvelles empreintes trouvées :');
  hashes.forEach((h) => console.error('  ' + h));
  console.error(
    "Si ce changement est légitime (ex: mise à jour d'Angular), vérifie le contenu du script inline concerné dans " +
    "dist/artisan-competent/browser/index.html, puis lance `npm run update-csp` et commite le résultat.",
  );
  process.exit(1);
}

console.log('[csp-hashes] OK — les empreintes correspondent à src/csp-hashes.json.');
