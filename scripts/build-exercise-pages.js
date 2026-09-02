const fs    = require('fs');
const path  = require('path');

const exercisesPath = path.join(__dirname, '..', 'public', 'exercises.json');
const templatePath  = path.join(__dirname, '..', 'public', 'uebung-detail.html');
const outputDir     = path.join(__dirname, '..', 'public', 'uebung');
const grafikDir     = path.join(__dirname, '..', 'public', 'images', 'uebungen');
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

// Pendant zu toSlug() in einheit-detail.html / build-einheit-pages.js
function toSlug(text) {
  if (!text) return '';
  return String(text).toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9\s\-]/g, '').replace(/[\s\-]+/g, '-').replace(/^-+|-+$/g, '');
}

// Pendants zu den frueher clientseitigen Funktionen in uebung-detail.html –
// dieselbe Logik, jetzt beim Build statt bei jedem Seitenaufruf ausgefuehrt.
function toBulletList(text) {
  if (!text) return '';
  const items = String(text).split(/[;•]/).map(s => s.trim()).filter(Boolean);
  return items.length ? '<ul>' + items.map(i => `<li>${esc(i)}</li>`).join('') + '</ul>' : '';
}

function faqToHtml(faqArr) {
  if (!Array.isArray(faqArr) || !faqArr.length) return '';
  const items = faqArr.filter(f => f.frage && String(f.frage).trim());
  return items.length
    ? '<ul>' + items.map(f => `<li><strong>${esc(f.frage)}</strong><br>${esc(f.antwort)}</li>`).join('') + '</ul>'
    : '';
}

const EMPTY_HINWEIS = '<p style="color:#9aa3b0;font-style:italic;margin:0;">Keine Hinweise zu dieser Übung.</p>';
const CHEVRON_SVG = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="sister-chevron"><path d="M5 2L10 7L5 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const PHASE_COLORS = { 'Aufwärmen': '#C2611F', 'Hauptteil': '#0E6A45', 'Spielformat': '#0F3FA8' };
const JUGEND_URL_MAP = {
  'G-Jugend': '/uebungen/alter/g-jugend', 'F-Jugend': '/uebungen/alter/f-jugend',
  'E-Jugend': '/uebungen/alter/e-jugend', 'D-Jugend': '/uebungen/alter/d-jugend'
};
const PHASE_URL_MAP = {
  'Aufwärmen': '/uebungen/phase/aufwaermen',
  'Hauptteil': '/uebungen/phase/hauptteil',
  'Spielformat': '/uebungen/phase/spielformat'
};

// ── Grafik-Auflösung ─────────────────────────────────────────────────────────

function resolveGrafikUrl(ex) {
  const raw = ex.grafik_url;

  // Echte URL → direkt verwenden
  if (!raw || !raw.startsWith('data:')) {
    return raw || DEFAULT_OG;
  }

  // base64 → lokal ablegen (normalerweise sollte upload-grafik-images.js das
  // vorher schon erledigt haben; das hier ist nur der Sicherheitsnetz-Fall)
  const match = raw.match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) return DEFAULT_OG;

  const mimeType = match[1];
  const ext      = mimeType.split('/')[1] || 'png';
  const filename = `uebung-${String(ex.id).padStart(3, '0')}-${ex.url_slug || 'grafik'}.${ext}`;
  const filePath = path.join(grafikDir, filename);
  const url      = `https://coachunited.de/images/uebungen/${filename}`;

  if (fs.existsSync(filePath)) {
    console.log(`  ↩ ID ${ex.id}: liegt schon lokal vor → ${url}`);
    return url;
  }

  if (!fs.existsSync(grafikDir)) fs.mkdirSync(grafikDir, { recursive: true });
  fs.writeFileSync(filePath, Buffer.from(match[2], 'base64'));
  console.log(`  ✓ ID ${ex.id}: lokal gespeichert → ${url}`);
  return url;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf-8'));
  const template  = fs.readFileSync(templatePath, 'utf-8');

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const published = exercises.filter(e => e.status === 'veroeffentlicht' && e.url_slug);

  // Fuer Schwesterübungen: Lookup ueber ALLE Uebungen (nicht nur
  // veroeffentlichte), genau wie es das fruehere Client-JS tat
  // (`exercises.filter(e => sisterIds.includes(e.id) && e.url_slug)`
  // filterte dort ebenfalls nicht nach status).
  const byId = new Map(exercises.map(e => [e.id, e]));

  const base64Count = published.filter(e => e.grafik_url && e.grafik_url.startsWith('data:')).length;
  if (base64Count > 0) {
    console.log(`${base64Count} Übung(en) mit base64-Grafik – wird lokal gespeichert...`);
  }

  let count = 0;

  for (const ex of published) {
    const slug         = ex.url_slug;
    const displayTitle = ex.titel || ex.alt_titel || 'Fußballübung';
    const title        = `${displayTitle} | COACH UNITED`;
    const description  = ex.seo_meta_description || ex.kurzbeschreibung || '';
    const kurzbeschreibung = ex.kurzbeschreibung || '';
    const aufbau       = ex.aufbau || '';
    const durchfuehrung = ex.durchfuehrung || '';
    const canonical    = `https://coachunited.de/uebung/${slug}`;
    const hasOwnGrafik = !!ex.grafik_url; // vor Aufloesung auf DEFAULT_OG pruefen
    const ogImage      = resolveGrafikUrl(ex);
    const grafikAlt    = ex.grafik_alt_text || displayTitle;
    const grafikTitle  = ex.grafik_title || displayTitle;
    const phaseUrl     = PHASE_URL_MAP[ex.trainingsphase];
    const erstelltAmHtml = ex.erstellt_am
      ? `Erstellt am ${new Date(ex.erstellt_am + 'T00:00:00').toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}`
      : '';

    // ── FAQ-Schema (bereits vorher serverseitig) ──
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

    // ── Article + Breadcrumb-Schema (bisher clientseitig aus exercises.json) ──
    const breadcrumbItems = [
      { '@type': 'ListItem', position: 1, name: 'Übungen', item: 'https://coachunited.de/uebungen' }
    ];
    if (phaseUrl) breadcrumbItems.push({ '@type': 'ListItem', position: 2, name: ex.trainingsphase, item: 'https://coachunited.de' + phaseUrl });
    breadcrumbItems.push({ '@type': 'ListItem', position: breadcrumbItems.length + 1, name: displayTitle, item: canonical });
    const articleLdGraph = [
      {
        '@type': 'Article', name: displayTitle, headline: displayTitle,
        description: ex.seo_meta_description || '',
        url: canonical,
        image: ogImage || DEFAULT_OG,
        publisher: { '@id': 'https://coachunited.de/#organization' }
      },
      { '@type': 'BreadcrumbList', itemListElement: breadcrumbItems }
    ];
    const articleLdScript = `\n  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': articleLdGraph })}</script>`;

    // ── Phase- und Jahrgangs-Badges ──
    let phaseRowHtml = '';
    if (ex.trainingsphase) {
      const phaseColor = PHASE_COLORS[ex.trainingsphase] || '#0E1430';
      phaseRowHtml += `<span class="phase-badge" style="background:${phaseColor};">${esc(ex.trainingsphase)}</span>`;
    }
    const jahrgangStr = (ex.jugend || []).map(j => j.replace('-Jugend', '')).join('·');
    if (jahrgangStr) phaseRowHtml += `<span class="jahrgang-badge">${esc(jahrgangStr)}</span>`;

    // ── Skill-Tags ──
    const skillTagsHtml = (ex.skills || []).map(s => `<span class="skill-tag">${esc(s)}</span>`).join('');

    // ── Kategorie-Links ("Weitere Übungen") ──
    const catLinks = [];
    (ex.jugend || []).forEach(j => {
      if (JUGEND_URL_MAP[j]) catLinks.push({ label: 'Weitere ' + j + '-Übungen', url: JUGEND_URL_MAP[j] });
    });
    if (phaseUrl) catLinks.push({ label: 'Alle ' + ex.trainingsphase + '-Übungen', url: phaseUrl });
    (ex.skills || []).slice(0, 2).forEach(s => {
      catLinks.push({ label: 'Alle ' + s + '-Übungen', url: '/uebungen/skill/' + toSlug(s) });
    });
    const categoryLinksHtml = catLinks
      .map(c => `<a href="${esc(c.url)}" class="related-link" style="margin-bottom:8px;"><span class="related-name">${esc(c.label)}</span>${CHEVRON_SVG}</a>`)
      .join('');

    // ── Schwesterübungen ──
    const sisterIds = (ex.schwester_ids && ex.schwester_ids.length) ? ex.schwester_ids
      : (ex.schwester_id ? [ex.schwester_id] : []);
    const sisters = sisterIds.map(id => byId.get(id)).filter(s => s && s.url_slug);
    const sistersHtml = sisters.map(s => `
              <a href="/uebung/${esc(s.url_slug)}" class="sister-link" data-back-target="/uebung/${esc(s.url_slug)}">
                <span class="sister-accent"></span>
                <span class="sister-name">${esc(s.titel)}</span>
                ${CHEVRON_SVG}
              </a>`).join('');

    // ── Inhalt der vier Sekundär-Kacheln ──
    const sheetData = {
      coaching_fokus: toBulletList(ex.coaching_fokus) || EMPTY_HINWEIS,
      leichter_machen: toBulletList(ex.leichter_machen) || EMPTY_HINWEIS,
      schwerer_machen: toBulletList(ex.schwerer_machen) || EMPTY_HINWEIS,
      faq: faqToHtml(ex.faq) || EMPTY_HINWEIS,
    };
    // Sicher fuer die Einbettung in ein <script>-Tag: kein "</script>" im JSON.
    const sheetDataScript = `const SHEET_DATA = ${JSON.stringify(sheetData).replace(/</g, '\\u003c')};`;

    // ── Print-Ansicht: Coaching/Leichter/Schwieriger inline, ohne FAQ ──
    const printCfg = [
      { key: 'coaching_fokus', label: 'Coaching-Fokus', color: '#E89844' },
      { key: 'leichter_machen', label: 'Übung leichter machen', color: '#16A571' },
      { key: 'schwerer_machen', label: 'Übung schwieriger machen', color: '#F23D3D' },
    ];
    const printTilesHtml = printCfg.map(t => `
              <div class="print-tile-item">
                <div class="print-tile-label" style="color:${t.color}">${t.label}</div>
                <div class="print-tile-body">${sheetData[t.key]}</div>
              </div>`).join('');

    const html = template
      .replace('<meta name="description" content="">', `<meta name="description" content="${esc(description)}">`)
      .replace('content="Fußballübung | COACH UNITED"', `content="${esc(title)}"`)
      .replace('<meta property="og:description" content="">', `<meta property="og:description" content="${esc(description)}">`)
      .replace('<meta property="og:image" content="https://coachunited.de/og-image.png">', `<meta property="og:image" content="${esc(ogImage)}">`)
      .replace('<meta property="og:image:alt" content="">', `<meta property="og:image:alt" content="${esc(grafikAlt)}">`)
      .replace('<meta property="og:url" content="">', `<meta property="og:url" content="${canonical}">`)
      .replace('<link rel="canonical" href="">', `<link rel="canonical" href="${canonical}">${faqSchema}${articleLdScript}`)
      .replace('<title>Fußballübung | COACH UNITED</title>', `<title>${esc(title)}</title>`)
      .replace('<div class="grafik-panel" id="grafik-panel">', hasOwnGrafik ? '<div class="grafik-panel" id="grafik-panel" style="display:block">' : '<div class="grafik-panel" id="grafik-panel">')
      .replace('<img id="grafik-img" src="" alt="" title="">', `<img id="grafik-img" src="${esc(ogImage)}" alt="${esc(grafikAlt)}" title="${esc(grafikTitle)}">`)
      .replace('<div class="phase-row" id="phase-row"></div>', `<div class="phase-row" id="phase-row">${phaseRowHtml}</div>`)
      .replace('<h1 class="ex-title" id="titel"></h1>', `<h1 class="ex-title" id="titel">${esc(displayTitle)}</h1>`)
      .replace('<p class="ex-desc" id="beschreibung"></p>', `<p class="ex-desc" id="beschreibung">${esc(kurzbeschreibung)}</p>`)
      .replace('<div class="skill-tags" id="skill-tags"></div>', `<div class="skill-tags" id="skill-tags">${skillTagsHtml}</div>`)
      .replace('<p id="aufbau"></p>', `<p id="aufbau">${esc(aufbau)}</p>`)
      .replace('<p id="durchfuehrung"></p>', `<p id="durchfuehrung">${esc(durchfuehrung)}</p>`)
      .replace('<div id="print-tiles"></div>', `<div id="print-tiles">${printTilesHtml}</div>`)
      .replace('<p class="ex-created" id="ex-created"></p>', `<p class="ex-created" id="ex-created">${esc(erstelltAmHtml)}</p>`)
      .replace('<div class="section-block" id="sisters-block" style="display:none;">', sistersHtml ? '<div class="section-block" id="sisters-block">' : '<div class="section-block" id="sisters-block" style="display:none;">')
      .replace('<div id="sisters-list"></div>', `<div id="sisters-list">${sistersHtml}</div>`)
      .replace('<div class="section-block" id="category-links-block" style="display:none;">', categoryLinksHtml ? '<div class="section-block" id="category-links-block">' : '<div class="section-block" id="category-links-block" style="display:none;">')
      .replace('<div id="category-links-list"></div>', `<div id="category-links-list">${categoryLinksHtml}</div>`)
      .replace('const SHEET_DATA = {};', sheetDataScript);

    fs.writeFileSync(path.join(outputDir, `${slug}.html`), html, 'utf-8');
    count++;
  }

  console.log(`✓ ${count} Übungsseiten generiert – jede vollständig vorgerendert, kein fetch('/exercises.json') mehr im Client.`);
}

main().catch(err => {
  console.error('Build-Fehler:', err.message);
  process.exit(1);
});
