const fs   = require('fs');
const path = require('path');

const homePath      = path.join(__dirname, '..', 'public', 'home.html');
const ueberUnsPath  = path.join(__dirname, '..', 'public', 'ueber-uns.html');
const wissenPath    = path.join(__dirname, '..', 'public', 'wissen.html');
const exercisesPath = path.join(__dirname, '..', 'public', 'exercises.json');
const articlesPath  = path.join(__dirname, '..', 'public', 'articles.json');
const thumbDir      = path.join(__dirname, '..', 'public', 'images', 'artikel', 'thumbs');
const skillIndexPath = path.join(__dirname, '..', 'public', 'skills-index.json');
const uebungsIndexPath = path.join(__dirname, '..', 'public', 'uebungen-index.json');

// Alle veroeffentlichten Artikel als Kacheln; auf Desktop laufen sie in einem
// waagerecht scrollbaren Band, die nicht sichtbaren laden per loading="lazy".
const ARTIKEL_ANZAHL = 99;

// Neueste-Uebungen-Band auf der Startseite: wie viele der zuletzt
// veroeffentlichten Uebungen als Kachel gezeigt werden (Rest per Pfeil/Wischen).
const NEUESTE_UEBUNGEN_ANZAHL = 12;

const JUGENDEN = ['G-Jugend', 'F-Jugend', 'E-Jugend', 'D-Jugend'];
const PHASEN   = ['Aufwärmen', 'Hauptteil', 'Spielformat'];

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
function ersetzeBlock(html, name, inhalt, datei = 'home.html') {
  const start = `<!--cu:${name}-->`;
  const ende  = `<!--/cu:${name}-->`;
  const i = html.indexOf(start);
  const j = html.indexOf(ende);
  if (i === -1 || j === -1 || j < i) {
    throw new Error(`Marker cu:${name} fehlt oder ist vertauscht in ${datei}`);
  }
  return html.slice(0, i + start.length) + inhalt + html.slice(j);
}

/**
 * Bild-URL einer Übung fürs Kachel-Grid. grafik_url sollte seit dem
 * CoachPublisher-Fix (01.09.2026, resolve_and_upload_grafik) nie mehr
 * Base64 sein – dieser Fallback ist nur ein Sicherheitsnetz, falls doch,
 * damit kein riesiger Base64-String im img-src landet.
 */
function resolveUebungGrafik(ex) {
  const raw = ex.grafik_url;
  if (raw && !raw.startsWith('data:')) return raw;
  return '/og-image.png';
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

/**
 * Skills, die je Altersstufe in ALLEN drei Trainingsphasen vorkommen –
 * nur solche kann der Generator zu einer vollständigen Einheit verbauen.
 *
 * Diese Rechnung lief bisher im Browser jedes Besuchers und zwang die
 * Startseite dazu, exercises.json (1,6 MB) zu laden – nur um daraus vier mal
 * gut zehn Wörter zu gewinnen. Jetzt läuft sie einmal pro Deploy, das
 * Ergebnis ist unter 1 KB gross.
 */
function baueSkillIndex(exercises) {
  function clustern(liste) {
    const gesehen = new Set();
    const cluster = [];
    for (const ex of liste) {
      if (gesehen.has(ex.id)) continue;
      gesehen.add(ex.id);
      const schwestern = liste.filter(o =>
        !gesehen.has(o.id) && (ex.schwester_ids || []).includes(o.id)
      );
      schwestern.forEach(s => gesehen.add(s.id));
      cluster.push([ex, ...schwestern]);
    }
    return cluster;
  }

  const index = {};
  for (const jugend of JUGENDEN) {
    const passend = exercises.filter(e => (e.jugend || []).includes(jugend));
    const proPhase = PHASEN.map(p => clustern(passend.filter(e => e.trainingsphase === p)));
    const alle = [...new Set(passend.flatMap(e => e.skills || []))].sort();
    index[jugend] = alle.filter(skill =>
      proPhase.every(cluster =>
        cluster.some(c => c.some(e => (e.skills || []).includes(skill)))
      )
    );
  }
  return index;
}

/**
 * Schlanker Index fuer die Uebungsuebersicht.
 *
 * Die Kartenansicht auf /uebungen zeigt genau sechs Felder und kein Bild.
 * Trotzdem lud die Seite exercises.json mit 2,6 MB – darin stecken Aufbau,
 * Durchfuehrung, Varianten, FAQ und die Grafiken, von denen dort nichts
 * sichtbar wird. Dieser Index enthaelt nur, was die Karten wirklich
 * brauchen.
 *
 * ⚠️ Aendert sich die Kartenansicht in uebungen.html und braucht ein
 * weiteres Feld, muss es hier ergaenzt werden – sonst ist es einfach leer.
 */
// `id` zeigt die Karte nicht an, die Seite sortiert aber danach (neueste
// zuerst). Ohne das Feld waere die Reihenfolge stillschweigend die der
// Datei – ein Fehler, den man nicht sieht.
const KARTEN_FELDER = ['id', 'titel', 'url_slug', 'kurzbeschreibung', 'jugend', 'skills', 'trainingsphase'];

function baueUebungsIndex(exercises) {
  return exercises.map(e => {
    const schlank = {};
    for (const feld of KARTEN_FELDER) {
      if (e[feld] !== undefined && e[feld] !== null && e[feld] !== '') schlank[feld] = e[feld];
    }
    return schlank;
  });
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

  // ── Artikel-Kacheln ──
  // Sortierung: hervorgehobene zuerst, danach nach Datum absteigend.
  // `hervorheben: true` in articles.json zieht einen Artikel nach vorn – auf
  // Mobil ist nur die erste Kachel sichtbar, dort entscheidet das Feld also,
  // welcher Artikel beworben wird. Ohne das Feld bleibt es beim Datum.
  const artikel = readJson(articlesPath)
    .filter(a => a.status === 'veroeffentlicht' && a.url_slug)
    .sort((a, b) => {
      const prio = (b.hervorheben ? 1 : 0) - (a.hervorheben ? 1 : 0);
      if (prio !== 0) return prio;
      return String(b.erstellt_am || '').localeCompare(String(a.erstellt_am || ''));
    })
    .slice(0, ARTIKEL_ANZAHL);

  // ── Neueste-Übungen-Kacheln ──
  // Sortierung: erstellt_am absteigend (neueste zuerst). Übungen ohne
  // erstellt_am (sollte nach der Rückwirkend-Rekonstruktion nicht mehr
  // vorkommen) fallen ans Ende, statt den Bau abzubrechen.
  const neuesteUebungen = [...uebungen]
    .sort((a, b) => String(b.erstellt_am || '').localeCompare(String(a.erstellt_am || '')))
    .slice(0, NEUESTE_UEBUNGEN_ANZAHL);

  const uebungenKacheln = neuesteUebungen.map(e => {
    const jugendTags = (e.jugend || []).map(j => `<span class="hs-tag hs-tag--jugend">${esc(j)}</span>`).join('');
    const skillTags  = (e.skills || []).slice(0, 3).map(s => `<span class="hs-tag hs-tag--skill">${esc(s)}</span>`).join('');
    return `
            <a class="hs-tile" href="/uebung/${esc(e.url_slug)}">
              <img src="${esc(resolveUebungGrafik(e))}" alt="" width="480" height="320" loading="lazy" decoding="async">
              <div class="hs-tile-body">
                <p class="hs-tile-title">${esc(e.titel)}</p>
                <p class="hs-tile-desc">${esc(e.kurzbeschreibung || '')}</p>
                <div class="hs-tile-tags">${jugendTags}${skillTags}</div>
              </div>
            </a>`;
  }).join('');

  html = ersetzeBlock(html, 'neueste-uebungen', uebungenKacheln + '\n');

  fs.writeFileSync(homePath, html, 'utf-8');

  // ── Dieselbe Zahl in "Über uns" ──
  // Die Seite nennt den Umfang der Bibliothek im Fließtext. Ohne diesen
  // Schritt müsste die Zahl von Hand nachgezogen werden und wäre nach der
  // nächsten Übung falsch.
  if (fs.existsSync(ueberUnsPath)) {
    let uu = fs.readFileSync(ueberUnsPath, 'utf-8');
    uu = ersetzeBlock(uu, 'count', String(uebungen.length), 'ueber-uns.html');
    fs.writeFileSync(ueberUnsPath, uu, 'utf-8');
  }

  // ── Artikelliste auf /wissen ──
  // Bis 08/2026 lud diese Seite articles.json zur Laufzeit und zeigte bis
  // dahin nur "Artikel werden geladen..." – unsichtbar fuer jede Pruefung,
  // die kein JavaScript ausfuehrt. Sortierung bewusst nur nach Datum (kein
  // hervorheben-Vorrang wie im Artikel-Band der Startseite): Diese Seite
  // ist die vollstaendige Liste, nicht eine beworbene Auswahl.
  if (fs.existsSync(wissenPath)) {
    const alleArtikel = readJson(articlesPath)
      .filter(a => a.status === 'veroeffentlicht' && a.url_slug)
      .sort((a, b) => String(b.erstellt_am || '').localeCompare(String(a.erstellt_am || '')));

    const artikelListeHtml = alleArtikel.length
      ? alleArtikel.map(a => {
          const quelle = bildQuelle(a.foto_url);
          const thumb = quelle
            ? `<img class="card-thumb" src="${esc(quelle)}" alt="${esc(a.titel)}" loading="lazy" onerror="this.outerHTML='<div class=card-thumb-placeholder>📖</div>'">`
            : `<div class="card-thumb-placeholder">📖</div>`;
          return `
            <a href="/artikel/${esc(a.url_slug)}" class="article-card">
              ${thumb}
              <div class="card-body">
                <p class="card-title">${esc(a.titel)}</p>
              </div>
            </a>`;
        }).join('')
      : '<div style="padding:40px 0; text-align:center; color:#9aa3b0; font-size:14px;">Noch keine Artikel veröffentlicht.</div>';

    let wissen = fs.readFileSync(wissenPath, 'utf-8');
    wissen = ersetzeBlock(wissen, 'artikel-liste', artikelListeHtml, 'wissen.html');
    fs.writeFileSync(wissenPath, wissen, 'utf-8');
    console.log(`✓ wissen.html aktualisiert: ${alleArtikel.length} Artikel.`);
  }

  // ── Skill-Index für den Hero-Generator ──
  const skillIndex = baueSkillIndex(uebungen);
  fs.writeFileSync(skillIndexPath, JSON.stringify(skillIndex), 'utf-8');

  // ── Schlanker Index für die Übungsübersicht ──
  const uebungsIndex = baueUebungsIndex(uebungen);
  fs.writeFileSync(uebungsIndexPath, JSON.stringify(uebungsIndex), 'utf-8');

  const ohneThumb = artikel.filter(a => !bildQuelle(a.foto_url).startsWith('/images/artikel/thumbs/'));
  console.log(`✓ home.html + ueber-uns.html aktualisiert: ${uebungen.length} Übungen, ${artikel.length} Artikel.`);
  console.log(`✓ skills-index.json: ${Object.entries(skillIndex).map(([j, s]) => `${j} ${s.length}`).join(', ')} – ${Math.round(fs.statSync(skillIndexPath).size / 1024 * 10) / 10} KB.`);
  console.log(`✓ uebungen-index.json: ${uebungsIndex.length} Übungen – ${Math.round(fs.statSync(uebungsIndexPath).size / 1024)} KB (exercises.json: ${Math.round(fs.statSync(exercisesPath).size / 1024)} KB).`);
  if (ohneThumb.length) {
    console.warn(`  ⚠ Ohne lokales Thumbnail (nutzt das Originalbild): ${ohneThumb.map(a => a.url_slug).join(', ')}`);
  }
}

main();
