/* One-off parser for Contenu_Pages_Metiers_V2.md → per-job .content.ts files.
 * Not used by the build. Safe to delete after generation. */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MD_PATH = path.join(ROOT, 'Contenu_Pages_Metiers_V2.md');
const PAGES_DIR = path.join(ROOT, 'src/app/pages/job');

const IMAGE_MAP = {
  'plumber-sanitary': { path: 'assets/img/plombier.jpg', alt: 'Plombier sanitaire vérifié' },
  'electrician': { path: 'assets/img/electricien.jpg', alt: 'Électricien vérifié' },
  'locksmith-metaller': { path: 'assets/img/serrurier-metallier.jpg', alt: 'Serrurier vérifié' },
  'heating-tech': { path: 'assets/img/chauffagiste.jpg', alt: 'Chauffagiste vérifié' },
  'drain-unblocker': { path: 'assets/img/deboucheur-canalisation.jpg', alt: 'Déboucheur de canalisation vérifié' },
  'hvac-installer': { path: 'assets/img/installateur-clim.jpg', alt: 'Technicien climatisation vérifié' },
  'carpenter-glazier': { path: 'assets/img/vitrier.jpg', alt: 'Vitrier vérifié' },
  'insulation-in-out': { path: 'assets/img/isolation.jpg', alt: 'Plaquiste vérifié' },
  'painter-interior-facade': { path: 'assets/img/peintre.jpg', alt: 'Peintre d’intérieur et façadier vérifié' },
  'floor-coverings': { path: 'assets/img/revetement-sol.webp', alt: 'Poseur de revêtements de sols vérifié' },
  'pest-control': { path: 'assets/img/anti-nuisible.jpg', alt: 'Spécialiste anti-nuisibles vérifié' },
  'alarm-video-surveillance': { path: 'assets/img/alarme-video-surveillance.webp', alt: 'Installateur alarme et vidéosurveillance vérifié' },
};

const SLUG_TO_VAR = {
  'plumber-sanitary': 'plumberSanitary',
  'electrician': 'electrician',
  'locksmith-metaller': 'locksmithMetaller',
  'heating-tech': 'heatingTech',
  'drain-unblocker': 'drainUnblocker',
  'hvac-installer': 'hvacInstaller',
  'carpenter-glazier': 'carpenterGlazier',
  'insulation-in-out': 'insulationInOut',
  'painter-interior-facade': 'painterInteriorFacade',
  'floor-coverings': 'floorCoverings',
  'pest-control': 'pestControl',
  'alarm-video-surveillance': 'alarmVideoSurveillance',
};

const md = fs.readFileSync(MD_PATH, 'utf8');
const lines = md.split('\n');

// Find page section boundaries
const pageHeaderRe = /^PAGE\s+(\d+)\/12\s+\|\s+SLUG:\s+([\w-]+)\s+\|/;
const sections = [];
let current = null;
lines.forEach((line, i) => {
  const m = line.match(pageHeaderRe);
  if (m) {
    if (current) {
      current.end = i;
      sections.push(current);
    }
    current = { slug: m[2], start: i, end: lines.length };
  }
});
if (current) sections.push(current);

function parsePage(slug, startLine, endLine) {
  const pageLines = lines.slice(startLine, endLine);

  // Find INTRO and CORPS boundaries
  let introStart = -1, corpsStart = -1;
  pageLines.forEach((l, i) => {
    if (l.startsWith('---- INTRO')) introStart = i + 1;
    if (l.startsWith('---- CORPS')) corpsStart = i + 1;
  });

  // Parse INTRO: H1, slogan, intro paragraphs
  const introLines = pageLines.slice(introStart, corpsStart - 1);
  let h1 = '', slogan = '', intro = '';
  let i = 0;
  // skip empty
  while (i < introLines.length && introLines[i].trim() === '') i++;
  if (introLines[i] && introLines[i].startsWith('# ')) {
    h1 = introLines[i].slice(2).trim();
    i++;
  }
  while (i < introLines.length && introLines[i].trim() === '') i++;
  if (introLines[i] && introLines[i].startsWith('_') && introLines[i].endsWith('_')) {
    slogan = introLines[i].slice(1, -1).trim();
    i++;
  }
  while (i < introLines.length && introLines[i].trim() === '') i++;
  // Remaining lines = intro paragraph(s)
  const introParas = [];
  let curPara = [];
  for (; i < introLines.length; i++) {
    const ln = introLines[i];
    if (ln.trim() === '') {
      if (curPara.length) {
        introParas.push(curPara.join(' ').trim());
        curPara = [];
      }
    } else {
      curPara.push(ln.trim());
    }
  }
  if (curPara.length) introParas.push(curPara.join(' ').trim());
  intro = introParas.join('\n\n');
  // INTRO blocks in source only contain H1 + slogan — no separate intro paragraph.
  if (!intro) intro = undefined;

  // Parse CORPS
  const corpsLines = pageLines.slice(corpsStart);
  const body = [];
  let inFAQ = false;
  let citiesH2Seen = false;
  let pendingFAQ = null; // { question, answers: [] }
  let metaTitle = h1 + ' | Artisan Compétent';
  let metaDescription = '';

  function flushFAQItem(faqBlock) {
    if (pendingFAQ) {
      faqBlock.items.push(pendingFAQ);
      pendingFAQ = null;
    }
  }

  function endFAQ() {
    if (inFAQ) {
      // Close any pending FAQ item in last faq block
      const last = body[body.length - 1];
      if (last && last.kind === 'faq') flushFAQItem(last);
      inFAQ = false;
      pendingFAQ = null;
    }
  }

  // Walk lines with a cursor
  let c = 0;
  while (c < corpsLines.length) {
    const raw = corpsLines[c];
    const line = raw.trim();
    if (line === '') { c++; continue; }

    // Stop at next-page separator: a line like **Job name** (single bold, no callout)
    // or `| Fin de la page ... |` table — skip rest of section.
    if (/^\| Fin de la page/.test(line)) break;
    if (/^\| --- \|$/.test(line)) { c++; continue; }
    if (/^\*\*[A-ZÉÈÊÀÂÔÎÛÇ][^*]+\*\*$/.test(line) && !line.includes(':')) {
      // Section terminator like "**Électricien**"
      // Only treat as terminator if it's a single short line (next-page marker).
      // Heuristic: short bolded line that's not a paragraph accroche.
      const stripped = line.slice(2, -2).trim();
      if (stripped.length < 80 && !stripped.includes(',') && !stripped.includes('.')) break;
    }

    // Callout: > **Title** : body
    const calloutMatch = line.match(/^>\s+\*\*([^*]+)\*\*\s*:\s*(.+)$/);
    if (calloutMatch) {
      endFAQ();
      // Multi-line callouts? Combine continuation lines that start with ">"
      let body0 = calloutMatch[2].trim();
      let c2 = c + 1;
      while (c2 < corpsLines.length && corpsLines[c2].startsWith('>')) {
        body0 += ' ' + corpsLines[c2].replace(/^>\s*/, '').trim();
        c2++;
      }
      const co = { kind: 'callout', title: calloutMatch[1].trim(), body: body0 };
      body.push(co);
      // Use "En une phrase" body as meta description if not yet set
      if (!metaDescription && /^En une phrase$/i.test(co.title)) {
        metaDescription = co.body;
      }
      c = c2;
      continue;
    }

    // H2 — section heading
    if (line.startsWith('## ')) {
      endFAQ();
      const text = line.slice(3).trim();
      body.push({ kind: 'h2', text });
      // Check section type
      inFAQ = /^Questions fréquentes/i.test(text);
      if (inFAQ) {
        body.push({ kind: 'faq', items: [] });
      }
      citiesH2Seen = /^Trouver un /i.test(text);
      c++;
      continue;
    }

    // H3 — sub-heading (FAQ question if in FAQ section, else regular h3)
    if (line.startsWith('### ')) {
      const text = line.slice(4).trim();
      if (inFAQ) {
        // Push previous FAQ item if any
        const faqBlock = body[body.length - 1].kind === 'faq'
          ? body[body.length - 1]
          : (() => {
              for (let k = body.length - 1; k >= 0; k--) if (body[k].kind === 'faq') return body[k];
              const b = { kind: 'faq', items: [] };
              body.push(b);
              return b;
            })();
        flushFAQItem(faqBlock);
        pendingFAQ = { question: text, answers: [] };
      } else {
        body.push({ kind: 'h3', text });
      }
      c++;
      continue;
    }

    // List of bullets: consecutive lines starting with `- `
    if (line.startsWith('- ')) {
      const items = [];
      while (c < corpsLines.length) {
        const ln = corpsLines[c].trim();
        if (ln.startsWith('- ')) {
          // Continuation lines under a bullet are not common in this MD; assume single line
          items.push(ln.slice(2).trim());
          c++;
        } else if (ln === '') {
          // peek: if next non-empty is also a "- " we keep going
          let k = c + 1;
          while (k < corpsLines.length && corpsLines[k].trim() === '') k++;
          if (k < corpsLines.length && corpsLines[k].trim().startsWith('- ')) {
            c = k;
          } else {
            break;
          }
        } else {
          break;
        }
      }
      // Decide: cities list or regular list
      if (citiesH2Seen) {
        body.push({ kind: 'cities', items });
        citiesH2Seen = false; // cities only once per section
      } else {
        body.push({ kind: 'list', items });
      }
      continue;
    }

    // Table row: `| ... | ... |`
    if (line.startsWith('|') && line.endsWith('|')) {
      // Collect contiguous table lines
      const tableLines = [];
      while (c < corpsLines.length) {
        const ln = corpsLines[c].trim();
        if (ln.startsWith('|') && ln.endsWith('|')) {
          tableLines.push(ln);
          c++;
        } else if (ln === '') {
          // peek for more table rows
          let k = c + 1;
          while (k < corpsLines.length && corpsLines[k].trim() === '') k++;
          if (k < corpsLines.length && corpsLines[k].trim().startsWith('|') && corpsLines[k].trim().endsWith('|')) {
            c = k;
          } else {
            break;
          }
        } else {
          break;
        }
      }
      if (tableLines.length >= 2) {
        const cellsOf = (l) => l.split('|').slice(1, -1).map(s => s.trim());
        const headers = cellsOf(tableLines[0]);
        const rest = tableLines.slice(1).filter(l => !/^\|\s*-+\s*(\|\s*-+\s*)*\|$/.test(l));
        const rows = rest.map(cellsOf);
        body.push({ kind: 'table', headers, rows });
      }
      continue;
    }

    // Paragraph: collect contiguous non-empty, non-special lines until blank
    const paraLines = [];
    while (c < corpsLines.length) {
      const ln = corpsLines[c];
      const t = ln.trim();
      if (t === '') break;
      if (t.startsWith('## ') || t.startsWith('### ') || t.startsWith('- ') ||
          t.startsWith('> ') || (t.startsWith('|') && t.endsWith('|'))) break;
      paraLines.push(t);
      c++;
    }
    if (paraLines.length === 0) { c++; continue; }
    let para = paraLines.join(' ').trim();
    let emphasis = false;
    if (para.startsWith('**') && para.endsWith('**') && para.slice(2, -2).indexOf('**') === -1) {
      emphasis = true;
      para = para.slice(2, -2).trim();
    }
    if (inFAQ) {
      if (pendingFAQ) {
        pendingFAQ.answers.push(para);
      } else {
        // Intro paragraph for FAQ section (before first H3) — keep as plain p before the faq block
        // Insert before the empty faq block
        const idx = body.findIndex(b => b.kind === 'faq' && b.items.length === 0);
        if (idx !== -1) {
          body.splice(idx, 0, { kind: 'p', text: para });
        } else {
          body.push({ kind: 'p', text: para });
        }
      }
    } else {
      body.push({ kind: 'p', text: para, ...(emphasis ? { emphasis: true } : {}) });
    }
  }
  endFAQ();

  // Remove trailing empty FAQ blocks
  for (let k = body.length - 1; k >= 0; k--) {
    if (body[k].kind === 'faq' && body[k].items.length === 0) body.splice(k, 1);
  }

  if (!metaDescription) metaDescription = slogan;
  // Truncate meta description around 155 chars at clean boundary
  if (metaDescription.length > 160) {
    const cut = metaDescription.slice(0, 157);
    const lastSpace = cut.lastIndexOf(' ');
    metaDescription = cut.slice(0, lastSpace > 100 ? lastSpace : 157).replace(/[\s,;:.]+$/, '') + '…';
  }

  const img = IMAGE_MAP[slug];
  const obj = {
    imagePath: img.path,
    imageAlt: img.alt,
    h1,
    slogan,
    metaTitle,
    metaDescription,
    body,
  };
  if (intro) obj.intro = intro;
  return obj;
}

function tsStringify(value, indent = 0) {
  const pad = '  '.repeat(indent);
  const padNext = '  '.repeat(indent + 1);
  if (typeof value === 'string') {
    // Use single quotes; escape backslashes and single quotes
    return "'" + value.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  }
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map(v => padNext + tsStringify(v, indent + 1));
    return '[\n' + items.join(',\n') + ',\n' + pad + ']';
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return '{}';
    const props = keys.map(k => padNext + k + ': ' + tsStringify(value[k], indent + 1));
    return '{\n' + props.join(',\n') + ',\n' + pad + '}';
  }
  return 'undefined';
}

function emit(slug, content) {
  const varName = SLUG_TO_VAR[slug] + 'Content';
  const literal = tsStringify(content, 1);
  return `import type { JobPageContent } from '../_shared/job-content.types';\n\nexport const ${varName}: JobPageContent = ${literal};\n`;
}

const writeMode = process.argv.includes('--write');
const onlySlug = process.argv.find(a => a.startsWith('--slug='));
const filterSlug = onlySlug ? onlySlug.split('=')[1] : null;

for (const sec of sections) {
  if (filterSlug && sec.slug !== filterSlug) continue;
  const content = parsePage(sec.slug, sec.start, sec.end);
  const outFile = path.join(PAGES_DIR, sec.slug, `${sec.slug}.content.ts`);
  const ts = emit(sec.slug, content);
  if (writeMode) {
    fs.writeFileSync(outFile, ts);
    console.log('wrote', outFile, '(', content.body.length, 'blocks)');
  } else {
    console.log('would write', outFile, '(', content.body.length, 'blocks)');
  }
}
