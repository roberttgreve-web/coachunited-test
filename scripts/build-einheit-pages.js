const fs   = require('fs');
const path = require('path');

const einheitenPath = path.join(__dirname, '..', 'public', 'einheiten.json');
const exercisesPath = path.join(__dirname, '..', 'public', 'exercises.json');
const templatePath  = path.join(__dirname, '..', 'public', 'einheit-detail.html');
const outputDir     = path.join(__dirname, '..', 'public', 'einheit');

if (!fs.existsSync(einheitenPath)) {
  console.log('einheiten.json nicht gefunden – Build übersprungen.');
  process.exit(0);
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const PHASE_ORDER = ['Aufwärmen', 'Hauptteil', 'Spielformat'];

// Slug-Normalisierung für Backwards-Compat (alte Slugs ohne Skill-Prefix,
// wie sie in einheiten.json[].uebungen[].slug stehen) – Pendant zu toSlug() in uebung-detail.html
function toSlug(text) {
  if (!text) return '';
  return String(text).toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9\s\-]/g, '').replace(/[\s\-]+/g, '-').replace(/^-+|-+$/g, '');
}

function renderCard(u, grafikMap, slugMap) {
  const resolvedSlug = slugMap[u.slug] || null;
  const grafik = resolvedSlug ? (grafikMap[resolvedSlug] || '') : '';
  const inner = `
          <div class="card-position">${u.position}</div>
          <div class="card-body">
            <p class="card-title">${esc(u.titel)}</p>
          </div>
          ${grafik ? `<div class="card-image"><img src="${esc(grafik)}" alt="" loading="lazy"></div>` : ''}
          <div class="card-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>`;

  if (!resolvedSlug) {
    // Übung existiert nicht mehr im aktuellen Bestand – als nicht-klickbare Karte anzeigen statt auf 404 zu verlinken.
    return `\n        <div class="uebung-card" style="cursor:default;">${inner}</div>`;
  }
  // Kein ?from=-Parameter: der erzeugte pro Uebung eine zusaetzliche crawlbare
  // URL mit identischem Inhalt. Die Herkunft merkt sich der delegierte
  // Click-Handler in einheit-detail.html ueber data-back-target.
  return `\n        <a href="/uebung/${esc(resolvedSlug)}" class="uebung-card" data-back-target="/uebung/${esc(resolvedSlug)}">${inner}</a>`;
}

function main() {
  const einheiten = JSON.parse(fs.readFileSync(einheitenPath, 'utf-8'));
  const exercises = fs.existsSync(exercisesPath) ? JSON.parse(fs.readFileSync(exercisesPath, 'utf-8')) : [];
  const template  = fs.readFileSync(templatePath, 'utf-8');

  const grafikMap = {};
  exercises.forEach(e => { if (e.url_slug && e.grafik_url) grafikMap[e.url_slug] = e.grafik_url; });

  // Alter Slug (aus einheiten.json) → aktueller url_slug (aus exercises.json)
  const slugMap = {};
  exercises.forEach(e => {
    if (!e.url_slug) return;
    [toSlug(e.titel), toSlug(e.alt_titel)].forEach(key => {
      if (key) slugMap[key] = e.url_slug;
    });
  });

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  let count = 0;

  for (const einheit of einheiten) {
    const slug = einheit.url_slug;
    if (!slug) continue;

    const displayTitle = einheit.titel || 'Trainingseinheit';
    const title        = `${displayTitle} | COACH UNITED`;
    const description  = displayTitle + ' – komplette Fußball-Trainingseinheit für den Kinderfußball bei COACH UNITED.';
    const canonical    = `https://coachunited.de/einheit/${slug}`;

    const uebungen = Array.isArray(einheit.uebungen) ? einheit.uebungen : [];
    const grouped = {};
    PHASE_ORDER.forEach(p => { grouped[p] = []; });
    uebungen.forEach(u => {
      const phase = u.phase || 'Hauptteil';
      if (!grouped[phase]) grouped[phase] = [];
      grouped[phase].push(u);
    });

    const uebungenListHtml = PHASE_ORDER
      .filter(p => grouped[p] && grouped[p].length)
      .map(phase => `
            <div class="phase-section">
              <div class="phase-section-header" data-phase="${phase}">
                <div class="phase-header-bar"></div>
                <span class="phase-header-label">${phase}</span>
              </div>
              ${grouped[phase].map(u => renderCard(u, grafikMap, slugMap)).join('')}
            </div>`).join('');

    const count_ = uebungen.length;
    const countText = `${count_} Übung${count_ !== 1 ? 'en' : ''}`;

    const ldGraph = [
      {
        '@type': 'Article',
        name: displayTitle,
        headline: displayTitle,
        description,
        url: canonical,
        publisher: { '@id': 'https://coachunited.de/#organization' }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Einheiten', item: 'https://coachunited.de/einheiten' },
          { '@type': 'ListItem', position: 2, name: displayTitle, item: canonical }
        ]
      }
    ];
    const ldScript = `\n  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': ldGraph })}</script>`;

    const html = template
      .replace('<meta name="description" content="">', `<meta name="description" content="${esc(description)}">`)
      .replace('<meta property="og:title" content="Trainingseinheit | COACH UNITED">', `<meta property="og:title" content="${esc(title)}">`)
      .replace('<meta property="og:description" content="">', `<meta property="og:description" content="${esc(description)}">`)
      .replace('<meta property="og:url" content="">', `<meta property="og:url" content="${canonical}">`)
      .replace('<link rel="canonical" href="">', `<link rel="canonical" href="${canonical}">${ldScript}`)
      .replace('<title>Trainingseinheit | COACH UNITED</title>', `<title>${esc(title)}</title>`)
      .replace('<h1 id="titel"></h1>', `<h1 id="titel">${esc(displayTitle)}</h1>`)
      .replace('<p class="section-label" id="einheit-count"></p>', `<p class="section-label" id="einheit-count">${esc(countText)}</p>`)
      .replace('<div id="uebungen-list"></div>', `<div id="uebungen-list">${uebungenListHtml}</div>`);

    fs.writeFileSync(path.join(outputDir, `${slug}.html`), html, 'utf-8');
    count++;
  }

  console.log(`✓ ${count} Einheitenseiten generiert.`);
}

main();
