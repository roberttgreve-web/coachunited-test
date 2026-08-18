const fs   = require('fs');
const path = require('path');

/**
 * Backt die Übungskarten serverseitig in /uebungen und die 22
 * Alter/Skill/Phase-Landingpages ein.
 *
 * Vorher: Alle 23 Seiten zeigten im rohen HTML "0 Übungen" / "Übungen werden
 * geladen…" – die Karten kamen ausschließlich per clientseitigem JavaScript
 * dazu. Die 22 Landingpages luden dafür sogar exercises.json (2,6 MB) direkt
 * von raw.githubusercontent.com statt von der eigenen Domain – der GitHub-
 * Fix vom 08/2026-Umbau (Abschnitt 14.2) hatte diese Dateien übersehen, weil
 * sie nicht im Muster `fetch('/…')` liegen, sondern `fetch('https://raw...')`.
 *
 * Für Google Ad Grants ist das kein Performance-, sondern ein Sichtbarkeits-
 * problem: Die Seite, die die 177 echten Übungen beweisen soll, zeigte ohne
 * JavaScript-Ausführung nichts davon – genau die Art "thin content" bzw.
 * "pages primarily linking elsewhere", die die Richtlinien ausdrücklich
 * nennen (siehe Übergabe.md, Abschnitt 16/17).
 */

const exercisesPath = path.join(__dirname, '..', 'public', 'exercises.json');
const uebungenPath  = path.join(__dirname, '..', 'public', 'uebungen.html');
const publicDir      = path.join(__dirname, '..', 'public');

const LANDING_PAGES = [
  ...['g-jugend', 'f-jugend', 'e-jugend', 'd-jugend'].map(s => `alter/${s}.html`),
  ...['aufwaermen', 'hauptteil', 'spielformat'].map(s => `phase/${s}.html`),
  ...[
    'ballkontrolle', 'dribbeln', 'einwuerfe', 'flanken', 'kommunikation',
    'koordination', 'passen', 'raumverhalten', 'schnelligkeit', 'taktik',
    'torhueter', 'torschuss', 'umschalten', 'verteidigen', 'zweikampf',
  ].map(s => `skill/${s}.html`),
];

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function ersetzeBlock(html, name, inhalt, datei) {
  const start = `<!--cu:${name}-->`;
  const ende  = `<!--/cu:${name}-->`;
  const i = html.indexOf(start);
  const j = html.indexOf(ende);
  if (i === -1 || j === -1 || j < i) {
    throw new Error(`Marker cu:${name} fehlt oder ist vertauscht in ${datei}`);
  }
  return html.slice(0, i + start.length) + inhalt + html.slice(j);
}

const PHASE_COLORS = { 'Aufwärmen': '#C2611F', 'Hauptteil': '#0E6A45', 'Spielformat': '#0F3FA8' };
const KARTEN_FELDER = ['id', 'titel', 'url_slug', 'kurzbeschreibung', 'jugend', 'skills', 'trainingsphase'];

function schlank(ex) {
  const out = {};
  for (const feld of KARTEN_FELDER) {
    if (ex[feld] !== undefined && ex[feld] !== null && ex[feld] !== '') out[feld] = ex[feld];
  }
  return out;
}

/** Kartenmarkup – exakt wie es das jeweilige Client-JS selbst erzeugt, damit
 *  ein späteres Neu-Rendern (Sekundärfilter auf den Landingpages, oder
 *  jede Filteränderung auf /uebungen) keinen sichtbaren Unterschied macht. */
function renderKarte(ex, mitDataPhase) {
  const href = ex.url_slug ? `/uebung/${ex.url_slug}` : '#';
  const phaseColor = PHASE_COLORS[ex.trainingsphase] || '#0E1430';
  const phaseTag = ex.trainingsphase ? `<span class="tag-phase" style="background:${phaseColor}">${esc(ex.trainingsphase)}</span>` : '';
  const jahrgangStr = (ex.jugend || []).map(j => j.replace('-Jugend', '')).join('·');
  const jahrgangTag = jahrgangStr ? `<span class="tag-jahrgang">${esc(jahrgangStr)}</span>` : '';
  const skills = ex.skills || [];
  const visSkills = skills.slice(0, 2).map(s => `<span class="tag-skill">${esc(s)}</span>`).join('');
  const more = skills.length > 2 ? `<span class="tag-more">+${skills.length - 2}</span>` : '';
  const dataPhase = mitDataPhase ? ` data-phase="${esc(ex.trainingsphase || '')}"` : '';
  return `
          <a href="${href}" class="exercise-card"${dataPhase}>
            <div class="card-grid">
              <div class="card-left">
                <h3 class="card-title">${esc(ex.titel)}</h3>
              </div>
              <div class="card-right">
                ${ex.kurzbeschreibung ? `<p class="card-desc">${esc(ex.kurzbeschreibung)}</p>` : ''}
                <div class="card-tags">${phaseTag}${jahrgangTag}${visSkills}${more}</div>
              </div>
            </div>
          </a>`;
}

/** JS-Unicode-Escapes (\\u00fc) im rohen Dateitext auflösen – FILTER_VALUE
 *  steht z. B. als 'Torh\\u00fcter' im Quelltext, nicht als echtes "ü". */
function entschluesseln(str) {
  return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function main() {
  if (!fs.existsSync(exercisesPath)) {
    console.log('exercises.json nicht gefunden – Build übersprungen.');
    return;
  }

  const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf-8'));
  const published = exercises.filter(e => e.status === 'veroeffentlicht' && e.url_slug);
  const sortiert = published.slice().sort((a, b) => b.id - a.id);

  // ── /uebungen: vollständige, ungefilterte Liste ──
  if (fs.existsSync(uebungenPath)) {
    let html = fs.readFileSync(uebungenPath, 'utf-8');
    const karten = sortiert.map(ex => renderKarte(ex, true)).join('');
    html = ersetzeBlock(html, 'karten', karten, 'uebungen.html');
    html = ersetzeBlock(html, 'anzahl', `${sortiert.length} Übungen`, 'uebungen.html');
    fs.writeFileSync(uebungenPath, html, 'utf-8');
    console.log(`✓ uebungen.html: ${sortiert.length} Karten gebacken.`);
  }

  // ── 22 Landingpages: je Seite nach FILTER_KEY/FILTER_VALUE gefiltert ──
  let anzahlSeiten = 0;
  for (const rel of LANDING_PAGES) {
    const seitePfad = path.join(publicDir, rel);
    if (!fs.existsSync(seitePfad)) {
      console.warn(`  ⚠ ${rel} nicht gefunden – übersprungen.`);
      continue;
    }
    let html = fs.readFileSync(seitePfad, 'utf-8');

    const keyMatch = html.match(/const FILTER_KEY = '([^']+)';/);
    const valMatch = html.match(/const FILTER_VALUE = '([^']+)';/);
    if (!keyMatch || !valMatch) throw new Error(`FILTER_KEY/FILTER_VALUE nicht gefunden in ${rel}`);
    const filterKey = keyMatch[1];
    const filterValue = entschluesseln(valMatch[1]);

    let gefiltert;
    if (filterKey === 'jugend') gefiltert = sortiert.filter(e => (e.jugend || []).includes(filterValue));
    else if (filterKey === 'phase') gefiltert = sortiert.filter(e => e.trainingsphase === filterValue);
    else if (filterKey === 'skill') gefiltert = sortiert.filter(e => (e.skills || []).includes(filterValue));
    else throw new Error(`Unbekannter FILTER_KEY '${filterKey}' in ${rel}`);

    const karten = gefiltert.map(ex => renderKarte(ex, false)).join('');
    const anzahlText = `${gefiltert.length} Übung${gefiltert.length !== 1 ? 'en' : ''}`;
    const skills = [...new Set(gefiltert.flatMap(e => e.skills || []))].sort();
    const skillDropdown = skills.map(s =>
      `<label class="filter-option" onclick="toggleOption(this,'skill','${s.replace(/'/g, "\\'")}')"><span class="checkmark"></span>${esc(s)}</label>`
    ).join('');
    // Nur die 7 Kartenfelder je Übung, nicht die ganze Datenbank – ersetzt
    // den früheren fetch() vollständig, kein Netzwerk-Aufruf mehr nötig.
    const pageDaten = JSON.stringify(gefiltert.map(schlank)).replace(/</g, '\\u003c');

    html = ersetzeBlock(html, 'karten', karten, rel);
    html = ersetzeBlock(html, 'anzahl', anzahlText, rel);
    html = ersetzeBlock(html, 'skill-dropdown', skillDropdown, rel);

    // ⚠️ HTML-Kommentar-Marker (<!--cu:…-->) funktionieren NICHT innerhalb
    // eines <script>-Blocks: "<!--" ist gültige, legacy JS-Syntax für einen
    // Zeilenkommentar (Annex B) und frisst alles bis zum Zeilenende – die
    // Zuweisung reißt dann quer über mehrere Zeilen weiter, bis der Parser
    // wieder auf einen echten Ausdruck trifft. Deshalb hier reiner Text-
    // Ersatz derselben Art wie SHEET_DATA in build-exercise-pages.js, keine
    // Marker im Script.
    const alteZeile = '  let allExercises = [];';
    if (!html.includes(alteZeile)) throw new Error(`'let allExercises = [];' nicht gefunden in ${rel}`);
    html = html.replace(alteZeile, `  let allExercises = ${pageDaten};`);

    fs.writeFileSync(seitePfad, html, 'utf-8');
    anzahlSeiten++;
  }

  console.log(`✓ ${anzahlSeiten} Landingpages aktualisiert (Alter/Skill/Phase) – kein GitHub-Fetch mehr, Karten stehen im HTML.`);
}

main();
