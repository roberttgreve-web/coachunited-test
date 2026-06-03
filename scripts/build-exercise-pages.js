const fs    = require('fs');
const path  = require('path');
const https = require('https');

const exercisesPath = path.join(__dirname, '..', 'public', 'exercises.json');
const templatePath  = path.join(__dirname, '..', 'public', 'uebung-detail.html');
const outputDir     = path.join(__dirname, '..', 'public', 'uebung');
const DEFAULT_OG    = 'https://coachunited.de/og-image.png';

if (!fs.existsSync(exercisesPath)) {
  console.log('exercises.json nicht gefunden – Build übersprungen.');
  process.exit(0);
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── WordPress helpers ────────────────────────────────────────────────────────

const WP_HOST = 'archiv.coachunited.de';
const WP_USER = process.env.WP_USER;
const WP_PASS = process.env.WP_APP_PASSWORD;
const wpEnabled = WP_USER && WP_PASS;

function wpRequest(options, body) {
  const auth = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname: WP_HOST, ...options, headers: { Authorization: `Basic ${auth}`, ...options.headers } },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
          catch { resolve({ status: res.statusCode, body: raw }); }
        });
      }
    );
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function findExistingMedia(filename) {
  const slug = filename.replace(/\.[^.]+$/, ''); // remove extension
  const res = await wpRequest({ path: `/wp-json/wp/v2/media?slug=${encodeURIComponent(slug)}&per_page=1`, method: 'GET' });
  if (res.status === 200 && Array.isArray(res.body) && res.body.length > 0) {
    return res.body[0].source_url;
  }
  return null;
}

async function uploadMedia(buffer, mimeType, filename) {
  const res = await wpRequest(
    {
      path: '/wp-json/wp/v2/media',
      method: 'POST',
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length,
      },
    },
    buffer
  );
  if (res.status === 201) return res.body.source_url;
  throw new Error(`Upload fehlgeschlagen (${res.status}): ${typeof res.body === 'object' ? res.body.message : res.body}`);
}

async function resolveGrafikUrl(ex) {
  const raw = ex.grafik_url;

  // Echte URL → direkt verwenden
  if (!raw || !raw.startsWith('data:')) {
    return raw || DEFAULT_OG;
  }

  // base64 → WordPress-Upload nötig
  if (!wpEnabled) {
    console.warn(`  ⚠ ID ${ex.id} (${ex.url_slug}): base64-Grafik, aber keine WP-Credentials → Fallback auf Logo.`);
    return DEFAULT_OG;
  }

  const match = raw.match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) return DEFAULT_OG;

  const mimeType = match[1];
  const ext      = mimeType.split('/')[1] || 'png';
  const filename = `uebung-${String(ex.id).padStart(3, '0')}-${ex.url_slug || 'grafik'}.${ext}`;

  // Bereits hochgeladen?
  const existing = await findExistingMedia(filename);
  if (existing) {
    console.log(`  ↩ ID ${ex.id}: bereits auf WP vorhanden → ${existing}`);
    return existing;
  }

  // Hochladen
  const buffer = Buffer.from(match[2], 'base64');
  process.stdout.write(`  ↑ ID ${ex.id}: lade hoch ... `);
  const url = await uploadMedia(buffer, mimeType, filename);
  console.log(`✓ ${url}`);
  return url;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf-8'));
  const template  = fs.readFileSync(templatePath, 'utf-8');

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const published = exercises.filter(e => e.status === 'veroeffentlicht' && e.url_slug);

  const base64Count = published.filter(e => e.grafik_url && e.grafik_url.startsWith('data:')).length;
  if (base64Count > 0) {
    console.log(`${base64Count} Übung(en) mit base64-Grafik – WordPress-Upload läuft...`);
  }

  let count = 0;

  for (const ex of published) {
    const slug         = ex.url_slug;
    const displayTitle = ex.alt_titel || ex.titel || 'Fußballübung';
    const title        = `${displayTitle} | COACH UNITED`;
    const description  = ex.seo_meta_description || ex.kurzbeschreibung || '';
    const canonical    = `https://coachunited.de/uebung/${slug}`;
    const ogImage      = await resolveGrafikUrl(ex);

    let faqSchema = '';
    if (Array.isArray(ex.faq) && ex.faq.length > 0) {
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: ex.faq.map(f => ({
          '@type': 'Question',
          name: f.frage,
          acceptedAnswer: { '@type': 'Answer', text: f.antwort }
        }))
      };
      faqSchema = `\n  <script type="application/ld+json">${JSON.stringify(ld)}</script>`;
    }

    const html = template
      .replace('<meta name="description" content="">', `<meta name="description" content="${esc(description)}">`)
      .replace('content="Fußballübung | COACH UNITED"', `content="${esc(title)}"`)
      .replace('<meta property="og:description" content="">', `<meta property="og:description" content="${esc(description)}">`)
      .replace('<meta property="og:image" content="https://coachunited.de/og-image.png">', `<meta property="og:image" content="${esc(ogImage)}">`)
      .replace('<meta property="og:url" content="">', `<meta property="og:url" content="${canonical}">`)
      .replace('<link rel="canonical" href="">', `<link rel="canonical" href="${canonical}">${faqSchema}`)
      .replace('<title>Fußballübung | COACH UNITED</title>', `<title>${esc(title)}</title>`);

    fs.writeFileSync(path.join(outputDir, `${slug}.html`), html, 'utf-8');
    count++;
  }

  console.log(`✓ ${count} Übungsseiten generiert.`);
}

main().catch(err => {
  console.error('Build-Fehler:', err.message);
  process.exit(1);
});
