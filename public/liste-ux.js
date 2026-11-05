// Gemeinsame Bedienhilfen fuer die 23 Uebungslisten mit Filterleiste
// (/uebungen und die Alter/Skill/Phase/Ort-Landingpages). Eingebunden per
// <script src="/liste-ux.js" defer> NACH dem Seitenskript, nutzt dessen
// globale Namen (selected, updatePill, renderExercises bzw. renderEx/applyFilters).
//
// 1) Filter-Dropdown schliessen: Vorher blieb ein geoeffneter Filter einfach
//    stehen, man musste "irgendwo daneben" tippen - das findet niemand. Jetzt
//    hat jedes Dropdown unten eine feste Leiste mit "Zuruecksetzen" und dem
//    Hauptbutton "N Uebungen anzeigen", der schliesst. Zusaetzlich schliesst
//    es beim Wischen durch die Kacheln und mit Esc. Mehrfachauswahl bleibt.
//
// 2) Zurueck zur Liste: Beim Tippen auf eine Kachel werden Filter und
//    Scroll-Position (Slider + Seite) in sessionStorage gemerkt. "Uebersicht"
//    auf der Uebungsseite geht per history.back() zurueck (bzw. auf die Liste
//    mit Wiederherstellung), auch die Zurueck-Geste des Handys stellt den
//    Stand wieder her. Ein normaler neuer Aufruf der Liste startet leer.

(function () {
  var KEYS = ['jugend', 'skill', 'phase', 'ort'];
  var LISTE_KEY = 'cu_liste';            // sessionStorage: Stand der zuletzt verlassenen Liste
  var RESTORE_KEY = 'cu_liste_restore';  // sessionStorage: "beim naechsten Laden wiederherstellen" (Pfad)
  var list = document.getElementById('exercises-list');
  if (!list || typeof selected === 'undefined') return;

  function ss(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  function ssDel(k) { try { sessionStorage.removeItem(k); } catch (e) {} }
  function hier() { return location.pathname + location.search; }

  function neuZeichnen() {
    if (typeof renderExercises === 'function') renderExercises();
    else if (typeof renderEx === 'function') renderEx(applyFilters());
  }
  function anzahlText() {
    var el = document.getElementById('count-label');
    var n = parseInt(el ? el.textContent : '', 10);
    if (isNaN(n)) return 'Fertig';
    return n === 1 ? '1 Übung anzeigen' : n + ' Übungen anzeigen';
  }
  function alleSchliessen() {
    document.querySelectorAll('.filter-wrap.open').forEach(function (w) { w.classList.remove('open'); });
  }

  // ── Stil ──
  var style = document.createElement('style');
  style.textContent =
    '.filter-dropdown{min-width:250px;max-height:min(62vh,440px);overflow-y:auto;overscroll-behavior:contain;padding-bottom:0}' +
    '.filter-dropdown .cu-drop-foot{position:sticky;bottom:0;display:flex;gap:8px;align-items:center;' +
      'margin:6px -6px 0;padding:8px;background:#fff;border-top:1px solid #E6E8EF;border-radius:0 0 12px 12px}' +
    '.cu-drop-reset{flex:none;border:0;background:none;color:#4A5270;font:600 13px "Inter Tight",system-ui,sans-serif;' +
      'padding:10px 8px;cursor:pointer;text-decoration:underline;text-underline-offset:3px}' +
    '.cu-drop-reset[disabled]{opacity:.4;cursor:default;text-decoration:none}' +
    '.cu-drop-done{flex:1;min-height:44px;padding:0 14px;border:0;border-radius:10px;background:#1E6BFF;color:#fff;' +
      'font:700 14px "Inter Tight",system-ui,sans-serif;cursor:pointer;white-space:nowrap}' +
    '.cu-drop-done:active{background:#1458D6}';
  document.head.appendChild(style);

  // ── 1) Fusszeile in jedem Dropdown ──
  function fussAktualisieren() {
    KEYS.forEach(function (k) {
      var drop = document.getElementById('drop-' + k);
      if (!drop) return;
      var foot = drop.querySelector('.cu-drop-foot');
      if (!foot) {
        foot = document.createElement('div');
        foot.className = 'cu-drop-foot';
        foot.innerHTML = '<button type="button" class="cu-drop-reset">Zurücksetzen</button>' +
                         '<button type="button" class="cu-drop-done"></button>';
        foot.querySelector('.cu-drop-reset').addEventListener('click', function (e) {
          e.stopPropagation();
          selected[k].clear();
          drop.querySelectorAll('.filter-option.selected').forEach(function (o) { o.classList.remove('selected'); });
          updatePill(k);
          neuZeichnen();
          fussAktualisieren();
        });
        foot.querySelector('.cu-drop-done').addEventListener('click', function (e) {
          e.stopPropagation();
          alleSchliessen();
        });
        drop.appendChild(foot);
      } else if (foot !== drop.lastElementChild) {
        drop.appendChild(foot);   // Skill-Dropdown wird per innerHTML neu gebaut
      }
      foot.querySelector('.cu-drop-done').textContent = anzahlText();
      foot.querySelector('.cu-drop-reset').disabled = selected[k].size === 0;
    });
  }
  // Nach jedem Klick in ein Dropdown (das Seitenskript filtert zuerst, dann wir)
  document.addEventListener('click', function (e) {
    if (e.target.closest('.filter-wrap')) setTimeout(fussAktualisieren, 0);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') alleSchliessen(); });
  // Wischen durch die Kacheln = "ich schaue mir das Ergebnis an"
  list.addEventListener('scroll', function () {
    if (document.querySelector('.filter-wrap.open')) alleSchliessen();
  }, { passive: true });

  // ── 2) Stand merken und wiederherstellen ──
  function scrollBox() { return document.querySelector('.content'); }
  function standMerken(slug) {
    var sel = {};
    KEYS.forEach(function (k) { sel[k] = Array.from(selected[k]); });
    var box = scrollBox();
    ssSet(LISTE_KEY, JSON.stringify({
      pfad: hier(), sel: sel, slug: slug || null,
      x: list.scrollLeft, y: window.scrollY, boxY: box ? box.scrollTop : 0, t: Date.now()
    }));
  }
  list.addEventListener('click', function (e) {
    var a = e.target.closest('a.uc-tile');
    if (!a) return;
    var ziel = a.getAttribute('href') || '';
    standMerken(ziel.replace(/^\/uebung\//, ''));
    ssSet('cu_back', JSON.stringify({ target: ziel, url: hier(), label: 'Übersicht' }));
  });

  function wiederherstellen() {
    var s;
    try { s = JSON.parse(ss(LISTE_KEY) || 'null'); } catch (e) { s = null; }
    if (!s || s.pfad !== hier() || Date.now() - s.t > 6 * 3600 * 1000) return;
    KEYS.forEach(function (k) {
      selected[k].clear();
      (s.sel[k] || []).forEach(function (v) { selected[k].add(v); });
      var drop = document.getElementById('drop-' + k);
      if (drop) drop.querySelectorAll('.filter-option').forEach(function (o) {
        o.classList.toggle('selected', selected[k].has(o.textContent.trim()));
      });
      if (document.getElementById('pill-' + k)) updatePill(k);
    });
    neuZeichnen();
    fussAktualisieren();
    function position() {
      var kachel = s.slug ? list.querySelector('a.uc-tile[href="/uebung/' + s.slug + '"]') : null;
      var stil = getComputedStyle(list);
      if (stil.overflowX === 'auto' || stil.overflowX === 'scroll') {
        list.scrollLeft = kachel ? kachel.offsetLeft - list.offsetLeft - parseFloat(stil.paddingLeft || 0) : s.x;
      }
      var box = scrollBox();
      if (box) box.scrollTop = s.boxY || 0;
      window.scrollTo(0, s.y || 0);
    }
    // Sofort (Layout steht, Kacheln haben feste Breiten) und nach dem Laden der
    // Bilder noch einmal, falls sich Hoehen fuer das senkrechte Scrollen geaendert haben.
    position();
    if (document.readyState !== 'complete') window.addEventListener('load', position, { once: true });
  }

  var nav = (performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || {};
  var sollWiederherstellen = ss(RESTORE_KEY) === hier() || nav.type === 'back_forward';
  ssDel(RESTORE_KEY);

  function start() {
    fussAktualisieren();
    if (sollWiederherstellen) wiederherstellen();
  }
  // /uebungen laedt die Kacheln per fetch nach - erst starten, wenn sie da sind
  if (list.querySelector('a.uc-tile') || list.querySelector('.empty-state')) start();
  else {
    var mo = new MutationObserver(function () {
      if (list.querySelector('a.uc-tile') || list.querySelector('.empty-state')) { mo.disconnect(); start(); }
    });
    mo.observe(list, { childList: true });
  }
})();
