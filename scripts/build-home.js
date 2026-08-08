const fs   = require('fs');
const path = require('path');

const homePath      = path.join(__dirname, '..', 'public', 'home.html');
const exercisesPath = path.join(__dirname, '..', 'public', 'exercises.json');
const articlesPath  = path.join(__dirname, '..', 'public', 'articles.json');
const thumbDir      = path.join(__dirname, '..', 'public', 'images', 'artikel', 'thumbs');

const ARTIKEL_ANZAHL = 3;

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function readJson(p) {
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf-8')) : [];
}

/**
 * Ersetzt den Inhalt zwischen zwei Markern, laesst die Marker stehen.
 * Dadurch ist das Script beliebig oft wiederholbar und home.html enthaelt
 * auch ohne Build-Lauf immer gueltiges Markup (wichtig fuer die lokale Vorschau).
 */
function ersetzeBlock(html, name, inhalt) {
  const start = `<!--cu:${name}-->`;
  const ende  = `<!--/cu:${name}-->`;
  const i = html.indexOf(start);
  const j = html.indexOf(ende);
  if (i === -1 || j === -1 || j < i) {
    throw new Error(`Marker cu:${name} fehlt oder ist vertauscht in home.html`);
  }
  return html.slice(0, i + start.length) + inhalt + html.slice(j);
}

function datumDeutsch(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  return m ? `${m[3]}.${m[2]}.${m[1]}` : '';
}

/** Lokales WebP-Thumbnail, sonst das Originalbild aus foto_url. */
function bildQuelle(fotoUrl) {
  const dateiname = String(fotoUrl || '').split('?')[0].split('/').pop();
  if (!dateiname) return '';
  const webp = dateiname.replace(/\.[^.]+$/, '') + '.webp';
  if (fs.existsSync(path.join(thumbDir, webp))) {
    return `/images/artikel/thumbs/${webp}`;
  }
  return fotoUrl || '';
}

function main() {
  if (!fs.existsSync(homePath)) {
    console.log('home.html nicht gefunden – Build übersprungen.');
    return;
  }

  let html = fs.readFileSync(homePath, 'utf-8');

  // ── Anzahl der veröffentlichten Übungen ──
  const uebungen = readJson(exercisesPath)
    .filter(e => e.status === 'veroeffentlicht' && e.url_slug);
  html = ersetzeBlock(html, 'count', String(uebungen.length));

  // ── Die drei neuesten Artikel ──
  const artikel = readJson(articlesPath)
    .filter(a => a.status === 'veroeffentlicht' && a.url_slug)
    .sort((a, b) => String(b.erstellt_am || '').localeCompare(String(a.erstellt_am || '')))
    .slice(0, ARTIKEL_ANZAHL);

  const kacheln = artikel.map(a => `
            <a class="hs-tile" href="/artikel/${esc(a.url_slug)}">
              <img src="${esc(bildQuelle(a.foto_url))}" alt="" width="480" height="320" loading="lazy" decoding="async">
              <div class="hs-tile-body">
                <span class="hs-tile-date">${esc(datumDeutsch(a.erstellt_am))}</span>
                <p class="hs-tile-title">${esc(a.titel)}</p>
              </div>
            </a>`).join('');

  html = ersetzeBlock(html, 'artikel', kacheln + '\n');

  fs.writeFileSync(homePath, html, 'utf-8');

  const ohneThumb = artikel.filter(a => !bildQuelle(a.foto_url).startsWith('/images/artikel/thumbs/'));
  console.log(`✓ home.html aktualisiert: ${uebungen.length} Übungen, ${artikel.length} Artikel.`);
  if (ohneThumb.length) {
    console.warn(`  ⚠ Ohne lokales Thumbnail (nutzt das Originalbild): ${ohneThumb.map(a => a.url_slug).join(', ')}`);
  }
}

main();
