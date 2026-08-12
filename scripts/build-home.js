const fs   = require('fs');
const path = require('path');

const homePath      = path.join(__dirname, '..', 'public', 'home.html');
const ueberUnsPath  = path.join(__dirname, '..', 'public', 'ueber-uns.html');
const exercisesPath = path.join(__dirname, '..', 'public', 'exercises.json');
const articlesPath  = path.join(__dirname, '..', 'public', 'articles.json');
const thumbDir      = path.join(__dirname, '..', 'public', 'images', 'artikel', 'thumbs');
const skillIndexPath = path.join(__dirname, '..', 'public', 'skills-index.json');

// Alle veroeffentlichten Artikel als Kacheln; auf Desktop laufen sie in einem
// waagerecht scrollbaren Band, die nicht sichtbaren laden per loading="lazy".
const ARTIKEL_ANZAHL = 99;

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

  const kacheln = artikel.map(a => `
            <a class="hs-tile" href="/artikel/${esc(a.url_slug)}">
              <img src="${esc(bildQuelle(a.foto_url))}" alt="" width="480" height="320" loading="lazy" decoding="async">
              <div class="hs-tile-body">
                <p class="hs-tile-title">${esc(a.titel)}</p>
              </div>
            </a>`).join('');

  html = ersetzeBlock(html, 'artikel', kacheln + '\n');

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

  // ── Skill-Index für den Hero-Generator ──
  const skillIndex = baueSkillIndex(uebungen);
  fs.writeFileSync(skillIndexPath, JSON.stringify(skillIndex), 'utf-8');

  const ohneThumb = artikel.filter(a => !bildQuelle(a.foto_url).startsWith('/images/artikel/thumbs/'));
  console.log(`✓ home.html + ueber-uns.html aktualisiert: ${uebungen.length} Übungen, ${artikel.length} Artikel.`);
  console.log(`✓ skills-index.json: ${Object.entries(skillIndex).map(([j, s]) => `${j} ${s.length}`).join(', ')} – ${Math.round(fs.statSync(skillIndexPath).size / 1024 * 10) / 10} KB.`);
  if (ohneThumb.length) {
    console.warn(`  ⚠ Ohne lokales Thumbnail (nutzt das Originalbild): ${ohneThumb.map(a => a.url_slug).join(', ')}`);
  }
}

main();
