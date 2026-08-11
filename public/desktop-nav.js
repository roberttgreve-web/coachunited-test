(function () {
  injectWhatsAppPromo();

  if (window.innerWidth < 768) return;

  // Auf Detailseiten: Scroll immer auf rechte Spalte lenken
  if (document.getElementById('exercise-content')) {
    window.addEventListener('wheel', function (e) {
      var content = document.querySelector('#exercise-content .content');
      if (content && !content.contains(e.target)) {
        e.preventDefault();
        content.scrollTop += e.deltaY;
      }
    }, { passive: false });
  }

  var path = window.location.pathname;

  function isActive(href) {
    return path === href || path.startsWith(href + '/') ? 'active' : '';
  }

  var nav = document.createElement('nav');
  nav.className = 'desktop-topnav';
  nav.innerHTML = `
    <a href="/home" class="desktop-topnav-logo">
      <img src="/logo.png" alt="Coach United">
    </a>
    <div class="desktop-topnav-links">
      <div class="desktop-topnav-dropdown">
        <a href="/uebungen" class="desktop-topnav-link ${isActive('/uebungen')}">
          Alle Übungen
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style="margin-left:4px;vertical-align:middle;opacity:0.5"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </a>
        <div class="desktop-topnav-submenu">
          <div class="desktop-topnav-megacol">
            <a href="/uebungen/alter" class="desktop-topnav-subheading">Nach Alter</a>
            <a href="/uebungen/alter/g-jugend" class="desktop-topnav-sublink">G-Jugend</a>
            <a href="/uebungen/alter/f-jugend" class="desktop-topnav-sublink">F-Jugend</a>
            <a href="/uebungen/alter/e-jugend" class="desktop-topnav-sublink">E-Jugend</a>
            <a href="/uebungen/alter/d-jugend" class="desktop-topnav-sublink">D-Jugend</a>
          </div>
          <div class="desktop-topnav-megacol">
            <a href="/uebungen/skill" class="desktop-topnav-subheading">Nach Skill</a>
            <a href="/uebungen/skill/ballkontrolle" class="desktop-topnav-sublink">Ballkontrolle</a>
            <a href="/uebungen/skill/dribbeln" class="desktop-topnav-sublink">Dribbeln</a>
            <a href="/uebungen/skill/einwuerfe" class="desktop-topnav-sublink">Einwürfe</a>
            <a href="/uebungen/skill/flanken" class="desktop-topnav-sublink">Flanken</a>
            <a href="/uebungen/skill/kommunikation" class="desktop-topnav-sublink">Kommunikation</a>
            <a href="/uebungen/skill/koordination" class="desktop-topnav-sublink">Koordination</a>
            <a href="/uebungen/skill/passen" class="desktop-topnav-sublink">Passen</a>
            <a href="/uebungen/skill/raumverhalten" class="desktop-topnav-sublink">Raumverhalten</a>
            <a href="/uebungen/skill/schnelligkeit" class="desktop-topnav-sublink">Schnelligkeit</a>
            <a href="/uebungen/skill/taktik" class="desktop-topnav-sublink">Taktik</a>
            <a href="/uebungen/skill/torhueter" class="desktop-topnav-sublink">Torhüter</a>
            <a href="/uebungen/skill/torschuss" class="desktop-topnav-sublink">Torschuss</a>
            <a href="/uebungen/skill/umschalten" class="desktop-topnav-sublink">Umschalten</a>
            <a href="/uebungen/skill/verteidigen" class="desktop-topnav-sublink">Verteidigen</a>
            <a href="/uebungen/skill/zweikampf" class="desktop-topnav-sublink">Zweikampf</a>
          </div>
          <div class="desktop-topnav-megacol">
            <a href="/uebungen/phase" class="desktop-topnav-subheading">Nach Phase</a>
            <a href="/uebungen/phase/aufwaermen" class="desktop-topnav-sublink">Aufwärmen</a>
            <a href="/uebungen/phase/hauptteil" class="desktop-topnav-sublink">Hauptteil</a>
            <a href="/uebungen/phase/spielformat" class="desktop-topnav-sublink">Spielformat</a>
          </div>
        </div>
      </div>
      <a href="/einheiten"     class="desktop-topnav-link ${isActive('/einheiten')}">Einheit erhalten</a>
      <a href="/merkliste"     class="desktop-topnav-link ${isActive('/merkliste')}">Merkliste</a>
      <a href="/wissen"        class="desktop-topnav-link ${isActive('/wissen')}">Wissen</a>
      <a href="/whatsapp-info" class="desktop-topnav-link ${isActive('/whatsapp-info')}">Nichts verpassen</a>
    </div>
  `;

  var container = document.querySelector('.container');
  if (container) {
    container.insertBefore(nav, container.firstChild);

    // Footer einfügen
    var footer = document.createElement('footer');
    footer.className = 'desktop-footer';
    footer.innerHTML = `
      <a href="/uebung-einreichen" class="desktop-footer-link ${isActive('/uebung-einreichen')}">Übung einreichen</a>
      <span class="desktop-footer-sep">·</span>
      <a href="/ueber-uns" class="desktop-footer-link ${isActive('/ueber-uns')}">Über uns</a>
      <span class="desktop-footer-sep">·</span>
      <a href="/umgang-mit-ki" class="desktop-footer-link ${isActive('/umgang-mit-ki')}">Umgang mit KI</a>
      <span class="desktop-footer-sep">·</span>
      <a href="/impressum" class="desktop-footer-link ${isActive('/impressum')}">Impressum</a>
    `;
    container.appendChild(footer);
  }
})();

// ── Sitewide Hinweis auf den WhatsApp-Kanal ──
//
// Scharfschalten: WA_PROMO_LIVE auf true setzen, sobald Google Ad Grants
// freigegeben ist. Auf Vorschau-Deployments und lokal ist der Störer ohnehin
// aktiv, damit er getestet werden kann, ohne live zu gehen.
//
// Testhilfen:  ?wa=1      erzwingt die Anzeige (auch auf coachunited.de)
//              ?wa=reset  löscht den gemerkten Zustand
function injectWhatsAppPromo() {
  var WA_PROMO_LIVE = false;

  var KANAL_URL   = 'https://www.whatsapp.com/channel/0029VbAqTP68kyyEFg3oyX2t';
  var STATUS_KEY  = 'cu_wa_status';    // 'subscribed' | 'has'
  var SNOOZE_KEY  = 'cu_wa_snooze';    // Zeitstempel des ✕
  var SHOWN_KEY   = 'cu_wa_shown';     // Anzahl bisheriger Einblendungen
  var PV_KEY      = 'cu_wa_pageviews'; // Seitenaufrufe dieser Sitzung
  var SNOOZE_TAGE = 30;
  var MAX_ANZEIGEN = 3;

  var such = window.location.search;

  if (/[?&]wa=reset/.test(such)) {
    try {
      localStorage.removeItem(STATUS_KEY);
      localStorage.removeItem(SNOOZE_KEY);
      localStorage.removeItem(SHOWN_KEY);
      sessionStorage.removeItem(PV_KEY);
    } catch (e) {}
  }

  var istVorschau = window.location.hostname !== 'coachunited.de';
  var erzwungen   = /[?&]wa=1/.test(such);
  if (!(WA_PROMO_LIVE || istVorschau || erzwungen)) return;

  // Auf der Infoseite zum Kanal wäre der Hinweis überflüssig.
  if (window.location.pathname.replace(/\/$/, '') === '/whatsapp-info') return;

  function lies(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function schreib(key, wert) { try { localStorage.setItem(key, wert); } catch (e) {} }

  if (!erzwungen) {
    // Wer abonniert hat oder "Hab ich schon" gewählt hat, sieht ihn nie wieder.
    if (lies(STATUS_KEY)) return;

    // Nach dem ✕ dreißig Tage Ruhe.
    var snooze = Number(lies(SNOOZE_KEY) || 0);
    if (snooze && Date.now() - snooze < SNOOZE_TAGE * 24 * 60 * 60 * 1000) return;

    // Dreimal ignoriert heißt: kein Interesse.
    if (Number(lies(SHOWN_KEY) || 0) >= MAX_ANZEIGEN) return;
  }

  function ereignis(name) {
    // gtag existiert nur nach erteilter Cookie-Einwilligung.
    if (typeof window.gtag === 'function') window.gtag('event', name);
  }

  var style = document.createElement('style');
  style.textContent = `
    .cu-wa {
      position: fixed; z-index: 40;
      font-family: 'Inter Tight', system-ui, sans-serif;
      background: #fff; border-radius: 14px;
      box-shadow: 0 12px 34px rgba(14, 20, 48, 0.26);
      padding: 15px 16px 14px;
      opacity: 0; transform: translateY(14px);
      transition: opacity 0.35s ease, transform 0.35s ease;
    }
    .cu-wa.cu-wa-in { opacity: 1; transform: translateY(0); }
    .cu-wa-close {
      position: absolute; top: 7px; right: 8px;
      background: none; border: none; cursor: pointer;
      font-size: 15px; line-height: 1; padding: 4px;
      color: #8890A8; opacity: 0.8;
    }
    .cu-wa-close:hover { opacity: 1; }
    .cu-wa-title {
      font-size: 15px; font-weight: 800; color: #0E1430;
      line-height: 1.3; letter-spacing: -0.01em; padding-right: 20px;
    }
    .cu-wa-sub {
      font-size: 13px; color: #6B7390; line-height: 1.45; margin-top: 4px;
    }
    .cu-wa-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .cu-wa-primary, .cu-wa-secondary {
      font-family: 'Inter Tight', system-ui, sans-serif;
      font-size: 13.5px; font-weight: 700;
      padding: 10px 15px; border-radius: 9px;
      cursor: pointer; text-decoration: none; border: 1.5px solid transparent;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
    }
    .cu-wa-primary { background: #1E6BFF; border-color: #1E6BFF; color: #fff; }
    .cu-wa-primary:hover { background: #1558d6; border-color: #1558d6; }
    .cu-wa-secondary { background: transparent; border-color: #D8DEEC; color: #46506E; }
    .cu-wa-secondary:hover { border-color: #1E6BFF; color: #1E6BFF; background: #F2F6FF; }

    /* Mobil: Leiste über der Bottom-Nav, nie darauf */
    @media (max-width: 767px) {
      .cu-wa { left: 12px; right: 12px; bottom: 16px; }
      .cu-wa.cu-wa-ueber-nav { bottom: var(--cu-wa-abstand, 92px); }
    }
    @media (min-width: 768px) {
      .cu-wa { right: 24px; bottom: 24px; width: 340px; }
    }
    @media print { .cu-wa { display: none !important; } }
  `;
  document.head.appendChild(style);

  var box = document.createElement('div');
  box.className = 'cu-wa';
  box.setAttribute('role', 'complementary');
  box.innerHTML =
      '<button class="cu-wa-close" aria-label="Hinweis schließen">✕</button>'
    + '<p class="cu-wa-title">Neue Übungen direkt aufs Handy?</p>'
    + '<p class="cu-wa-sub">Jede neue Übung im kostenlosen WhatsApp-Kanal.</p>'
    + '<div class="cu-wa-actions">'
    +   '<a class="cu-wa-primary" href="' + KANAL_URL + '" target="_blank" rel="noopener">Kanal ansehen</a>'
    +   '<button class="cu-wa-secondary" type="button">Hab ich schon</button>'
    + '</div>';

  function schliessen() {
    box.classList.remove('cu-wa-in');
    setTimeout(function () { box.remove(); }, 320);
  }

  box.querySelector('.cu-wa-close').addEventListener('click', function () {
    schreib(SNOOZE_KEY, String(Date.now()));
    ereignis('wa_promo_dismiss');
    schliessen();
  });

  box.querySelector('.cu-wa-secondary').addEventListener('click', function () {
    schreib(STATUS_KEY, 'has');
    ereignis('wa_promo_has');
    schliessen();
  });

  box.querySelector('.cu-wa-primary').addEventListener('click', function () {
    schreib(STATUS_KEY, 'subscribed');
    ereignis('wa_promo_click');
  });

  var gezeigt = false;

  function zeigen() {
    if (gezeigt) return;
    gezeigt = true;

    // Abstand zur mobilen Bottom-Nav zur Laufzeit messen – ihre Höhe hängt
    // davon ab, wie viele Zeilen die Beschriftungen brauchen.
    var nav = document.querySelector('.bottom-nav');
    if (nav && window.innerWidth < 768) {
      var hoehe = Math.round(nav.getBoundingClientRect().height);
      if (hoehe > 0) {
        box.style.setProperty('--cu-wa-abstand', (hoehe + 12) + 'px');
        box.classList.add('cu-wa-ueber-nav');
      }
    }

    document.body.appendChild(box);
    schreib(SHOWN_KEY, String(Number(lies(SHOWN_KEY) || 0) + 1));
    ereignis('wa_promo_shown');
    setTimeout(function () { box.classList.add('cu-wa-in'); }, 60);
  }

  if (erzwungen) { setTimeout(zeigen, 600); return; }

  // Ab der zweiten Seite einer Sitzung sofort – wer weiterklickt, hat den
  // Nutzen schon erlebt. Auf der ersten Seite erst nach echtem Interesse.
  var aufrufe = 0;
  try {
    aufrufe = Number(sessionStorage.getItem(PV_KEY) || 0) + 1;
    sessionStorage.setItem(PV_KEY, String(aufrufe));
  } catch (e) { aufrufe = 1; }

  if (aufrufe >= 2) {
    setTimeout(zeigen, 1200);
    return;
  }

  var zeitReif = false;
  var weitGenug = false;
  var pruefen = function () { if (zeitReif && weitGenug) zeigen(); };

  setTimeout(function () { zeitReif = true; pruefen(); }, 20000);

  window.addEventListener('scroll', function () {
    var maximum = document.documentElement.scrollHeight - window.innerHeight;
    if (maximum > 0 && window.scrollY / maximum > 0.5) {
      weitGenug = true;
      pruefen();
    }
  }, { passive: true });
}
