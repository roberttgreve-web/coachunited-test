// Zentrale Kanal-URL: Auf Mobil fuehren alle Kanal-Links seit 08/2026 direkt
// hierher (dort oeffnet das direkt die WhatsApp-App). Auf Desktop dagegen
// bewusst NICHT direkt: ohne WhatsApp Desktop landet man dort im Leeren.
// Stattdessen fuehrt Desktop auf /whatsapp-info, wo statt des Buttons ein
// QR-Code steht - Use-Case ist "am Rechner sehen, mit dem Handy scannen".
// Siehe istDesktopBreite() weiter unten, das genau diese Weiche zieht.
// Muss vor der IIFE stehen: var-Zuweisungen werden anders als
// Funktionsdeklarationen nicht gehoistet, die IIFE liest die Konstante sofort.
var CU_WA_KANAL_URL = 'https://www.whatsapp.com/channel/0029VbAqTP68kyyEFg3oyX2t';

function istDesktopBreite() {
  return window.innerWidth >= 768;
}

(function () {
  injectWhatsAppPromo();
  hervorhebeWhatsAppNav();
  injectWhatsAppAbbinder();
  injectSpendenLink();
  injectSupporterAbmeldenLink();
  restructureDrawerNav();

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
      <!-- Nur in der Desktop-Topnav. Die mobile Bottom-Nav hat vier Plaetze
           und die sind mit den Arbeitsseiten belegt; dort bleibt "Über uns"
           im Burger-Menue. -->
      <a href="/ueber-uns"     class="desktop-topnav-link ${isActive('/ueber-uns')}">Über uns</a>
      <a href="/whatsapp-info" class="desktop-topnav-link desktop-topnav-link--whatsapp ${isActive('/whatsapp-info')}">${cuWaIcon(15)}WhatsApp-Kanal</a>
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
      <a href="/spenden" class="desktop-footer-link ${isActive('/spenden')}">Spenden</a>
      <span class="desktop-footer-sep">·</span>
      <a href="/supporter-abmelden" class="desktop-footer-link ${isActive('/supporter-abmelden')}">Supporter abmelden</a>
      <span class="desktop-footer-sep">·</span>
      <a href="/umgang-mit-ki" class="desktop-footer-link ${isActive('/umgang-mit-ki')}">Umgang mit KI</a>
      <span class="desktop-footer-sep">·</span>
      <a href="/impressum" class="desktop-footer-link ${isActive('/impressum')}">Impressum</a>
    `;
    container.appendChild(footer);
  }

  // Startseite: Der Kanal-Button in der fest eingebauten Sektion (home.html,
  // Abschnitt 20.3) ist dort statisches Markup mit direktem Kanal-Link fuer
  // Mobil - auf Desktop wird auch dieser eine Link auf die Zwischenseite
  // umgebogen, aus demselben Grund wie beim Abbinder und der Topnav-Pille.
  var homeWaCta = document.querySelector('#whatsapp-home .hs-cta--whatsapp');
  if (homeWaCta) {
    homeWaCta.href = '/whatsapp-info';
    homeWaCta.removeAttribute('target');
    homeWaCta.removeAttribute('rel');
  }
})();

// Echtes WhatsApp-Glyph (gefuellt), wiederverwendet in Mobile-Nav,
// Desktop-Topnav und dem sitewide Abbinder - immer dieselbe Bilddatei-freie
// Quelle statt an drei Stellen kopiert.
function cuWaIcon(groesse) {
  return '<svg width="' + groesse + '" height="' + groesse + '" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>';
}

// ── Mobile Bottom-Nav: "Nichts verpassen" -> WhatsApp-Kanal, hervorgehoben ──
//
// Das Wort "WhatsApp" war bewusst aus der Navigation entfernt worden (siehe
// Uebergabe.md); diese Entscheidung wurde am 08/2026 revidiert - der Kanal
// ist der wichtigste CTA der Seite und soll das auch in der Navigation zeigen.
//
// Per DOM-Ersetzung statt Textaustausch in 42 Dateien: Die Bottom-Nav hat
// zwei Markup-Varianten (<span> vs. <span class="nav-label">), eine
// Ersetzung per Skript ueber Dateiinhalte muesste beide treffen. Ueber das
// DOM ist das egal, "ein span-Kind" matcht beide Varianten gleichermassen.
function hervorhebeWhatsAppNav() {
  var links = document.querySelectorAll('a.nav-item[href="/whatsapp-info"]');
  if (!links.length) return;

  links.forEach(function (a) {
    a.classList.add('cu-wa-nav-highlight');
    a.href = CU_WA_KANAL_URL;
    a.target = '_blank';
    a.rel = 'noopener';
    var svg = a.querySelector('svg');
    if (svg) svg.outerHTML = cuWaIcon(20).replace('<svg ', '<svg class="nav-icon" ');
    var span = a.querySelector('span');
    if (span) span.textContent = 'WhatsApp-Kanal';
  });

  var style = document.createElement('style');
  style.textContent = `
    .nav-item.cu-wa-nav-highlight {
      background: #25D366;
      border-radius: 12px;
      padding: 6px 4px 5px !important;
      margin: -6px -1px 0;
      color: #fff !important;
    }
    .nav-item.cu-wa-nav-highlight span { color: #fff !important; }
    .desktop-topnav-link--whatsapp {
      display: inline-flex !important;
      align-items: center;
      gap: 7px;
      background: #25D366 !important;
      color: #fff !important;
      border-radius: 999px !important;
      padding: 8px 16px !important;
    }
    .desktop-topnav-link--whatsapp:hover { background: #1ebd5b !important; }
    .desktop-topnav-link--whatsapp.active { background: #128C42 !important; color: #fff !important; }
    @media print { .cu-wa-nav-highlight { background: transparent !important; } }
    /* Einige Seitentypen (Uebungsdetail, Startseite mit Wappen, Auswahlseiten)
       setzen .desktop-topnav-link ueber body:has(#id)/body:has(.klasse) mit
       !important und hoeherer Spezifitaet auf dunkle Schrift - das traf sonst
       auch die gruene WhatsApp-Pille. Hier mit derselben Selektor-Struktur
       gegengehalten (gleiche Spezifitaet, aber spaeter im Dokument). */
    body:has(#exercise-content) .desktop-topnav-link--whatsapp,
    body:has(.crest-panel) .desktop-topnav-link--whatsapp,
    body:has(.selection-section) .desktop-topnav-link--whatsapp {
      background: #25D366 !important;
      color: #fff !important;
    }
    body:has(#exercise-content) .desktop-topnav-link--whatsapp:hover,
    body:has(.crest-panel) .desktop-topnav-link--whatsapp:hover,
    body:has(.selection-section) .desktop-topnav-link--whatsapp:hover {
      background: #1ebd5b !important;
      color: #fff !important;
    }
  `;
  document.head.appendChild(style);
}

// ── "Spenden" ins mobile Burger-Menue einfuegen ──
//
// Der Drawer (Burger-Menue) ist auf jeder Seite als eigenes, identisches
// Markup fest im HTML verdrahtet (~40 Dateien) - genau wie bei der
// WhatsApp-Bottom-Nav oben wird der Link deshalb per DOM statt per
// Text-Ersetzung in jeder einzelnen Datei ergaenzt. Der Desktop-Footer-Link
// steht bereits im footer.innerHTML weiter oben in dieser Datei.
function injectSpendenLink() {
  var drawer = document.getElementById('drawer');
  if (!drawer || drawer.querySelector('a[href="/spenden"]')) return;

  var ueberUns = drawer.querySelector('a.drawer-link[href="/ueber-uns"]');
  var link = document.createElement('a');
  link.href = '/spenden';
  link.className = 'drawer-link';
  link.textContent = 'Spenden';

  if (ueberUns) ueberUns.insertAdjacentElement('afterend', link);
  else drawer.appendChild(link);
}

// Muss NACH injectSpendenLink laufen (haengt sich an den frisch eingefuegten
// "Spenden"-Link an) - Reihenfolge im IIFE-Aufruf weiter unten beachten.
function injectSupporterAbmeldenLink() {
  var drawer = document.getElementById('drawer');
  if (!drawer || drawer.querySelector('a[href="/supporter-abmelden"]')) return;

  var spenden = drawer.querySelector('a.drawer-link[href="/spenden"]');
  var link = document.createElement('a');
  link.href = '/supporter-abmelden';
  link.className = 'drawer-link';
  link.textContent = 'Supporter abmelden';

  if (spenden) spenden.insertAdjacentElement('afterend', link);
  else drawer.appendChild(link);
}

// ── Mobiles Burger-Menue gruppieren ──
//
// Der Drawer war auf 12 flache Eintraege angewachsen (durch Spenden +
// Supporter abmelden zuletzt noch unuebersichtlicher). Muss NACH
// injectSpendenLink()/injectSupporterAbmeldenLink() laufen, damit beide
// Links schon existieren. appendChild auf ein bereits im DOM vorhandenes
// Element VERSCHIEBT es nur an die neue Position - deshalb reicht die
// richtige Aufruf-Reihenfolge unten, keine fragile Insert-Kette noetig.
// Rechtlich-Links (Impressum/Datenschutz) wandern in eine kompakte Zeile;
// "Cookie-Einstellungen" haengt sich in cookie-consent.js selbst dort an,
// falls .drawer-legal-row existiert (siehe injectDrawerLink() dort).
function restructureDrawerNav() {
  var drawer = document.getElementById('drawer');
  if (!drawer || drawer.dataset.cuGrouped) return;

  var wissen = drawer.querySelector('a[href="/wissen"]');
  var einreichen = drawer.querySelector('a[href="/uebung-einreichen"]');
  var ueberUns = drawer.querySelector('a[href="/ueber-uns"]');
  var umgangMitKi = drawer.querySelector('a[href="/umgang-mit-ki"]');
  var spenden = drawer.querySelector('a[href="/spenden"]');
  var supporterAbmelden = drawer.querySelector('a[href="/supporter-abmelden"]');
  var impressum = drawer.querySelector('a[href="/impressum"]');
  var datenschutz = drawer.querySelector('a[href="/datenschutz"]');

  // Bei abweichendem Markup lieber unveraendert lassen als kaputtgehen.
  if (!(wissen && einreichen && ueberUns && umgangMitKi && spenden && supporterAbmelden && impressum && datenschutz)) return;
  drawer.dataset.cuGrouped = '1';

  var style = document.createElement('style');
  style.textContent = `
    .drawer-section-label {
      display: block; padding: 8px 0 6px;
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: 9.5px; font-weight: 600; letter-spacing: 0.12em;
      text-transform: uppercase; color: #9BA3B8;
    }
    .drawer-legal-row {
      margin-top: 18px; padding-top: 14px;
      border-top: 1px solid #f0f2f5;
      display: flex; flex-wrap: wrap; align-items: center; gap: 0 6px;
    }
    .drawer-legal-link, .drawer-legal-sep {
      font-family: 'Inter Tight', system-ui, sans-serif;
      font-size: 12px; font-weight: 600; color: #9BA3B8;
      text-decoration: none;
    }
    .drawer-legal-link:hover { color: #1E6BFF; }
  `;
  document.head.appendChild(style);

  function label(text) {
    var s = document.createElement('span');
    s.className = 'drawer-section-label';
    s.textContent = text;
    return s;
  }

  drawer.appendChild(label('Wissen & Mitmachen'));
  drawer.appendChild(wissen);
  drawer.appendChild(einreichen);

  drawer.appendChild(label('Verein'));
  drawer.appendChild(ueberUns);
  drawer.appendChild(umgangMitKi);

  drawer.appendChild(label('Unterstützen'));
  drawer.appendChild(spenden);
  drawer.appendChild(supporterAbmelden);

  var legalRow = document.createElement('div');
  legalRow.className = 'drawer-legal-row';
  [impressum, datenschutz].forEach(function (a, i) {
    if (i > 0) {
      var sep = document.createElement('span');
      sep.className = 'drawer-legal-sep';
      sep.textContent = '·';
      legalRow.appendChild(sep);
    }
    a.className = 'drawer-legal-link';
    legalRow.appendChild(a);
  });
  drawer.appendChild(legalRow);
}

// ── Sitewide Abbinder: CTA zum WhatsApp-Kanal am Seitenende ──
//
// Wichtigster CTA der Seite (08/2026) - steht am Ende jeder Seite, direkt
// vor der Bottom-Nav (mobil) bzw. dem Footer (Desktop). Bewusst als fester
// Abschnitt statt Popup: kein Timing, kein Wegklicken noetig. Der aeltere
// Poup-Stoerer (injectWhatsAppPromo) bleibt im Code, aber deaktiviert
// (WA_PROMO_LIVE = false) - zwei gleichzeitige Werbeflaechen fuer dieselbe
// Sache wirken wie Spam.
function injectWhatsAppAbbinder() {
  // "/" und "/home" bewusst mit ausgeschlossen: die Startseite hat den
  // Kanal-Hinweis fest zwischen "Wissen" und "Übung einreichen" eingebaut
  // (siehe home.html), damit die Farbreihenfolge der Startseiten-Sektionen
  // stimmt - ein zusaetzlicher Abbinder am Seitenende waere dort die dritte
  // Einblendung derselben Sache auf einer Seite.
  var AUSGESCHLOSSEN = ['/', '/home', '/impressum', '/datenschutz', '/whatsapp-info', '/uebung-einreichen'];
  var pfad = window.location.pathname.replace(/\/$/, '') || '/';
  if (AUSGESCHLOSSEN.indexOf(pfad) !== -1) return;
  if (document.getElementById('cu-wa-abbinder')) return;

  var container = document.querySelector('.container');
  if (!container) return;

  var style = document.createElement('style');
  style.textContent = `
    .cu-wa-abbinder { background: #0E1430; padding: 26px 22px 46px; }
    .cu-wa-abbinder-inner { max-width: 960px; margin: 0 auto; }
    .cu-wa-abbinder-label {
      display: block; font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: 9px; font-weight: 700; letter-spacing: 0.14em;
      text-transform: uppercase; color: #6E9BFF; margin-bottom: 12px;
    }
    .cu-wa-abbinder-title {
      font-family: 'Inter Tight', system-ui, sans-serif;
      font-size: 22px; font-weight: 800; color: #fff;
      line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 12px;
    }
    .cu-wa-abbinder-text {
      font-family: 'Inter Tight', system-ui, sans-serif;
      font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.66); max-width: 52ch;
    }
    .cu-wa-abbinder-cta {
      display: inline-flex; align-items: center; gap: 9px;
      margin-top: 22px; padding: 13px 20px;
      background: #25D366; color: #fff !important; border-radius: 10px;
      font-family: 'Inter Tight', system-ui, sans-serif;
      font-size: 15px; font-weight: 700; text-decoration: none;
      transition: background 0.15s;
    }
    .cu-wa-abbinder-cta:hover { background: #1ebd5b; }
    /* /einheiten hat als letzte Sektion davor schon einen dunklen Hintergrund
       (#direkt-zu-den-uebungen, hs--dunkel) - hier also hell, damit nicht
       zwei dunkle Flaechen aufeinandertreffen. */
    .cu-wa-abbinder--hell { background: #fff; }
    .cu-wa-abbinder--hell .cu-wa-abbinder-label { color: #1E6BFF; }
    .cu-wa-abbinder--hell .cu-wa-abbinder-title { color: #0E1430; }
    .cu-wa-abbinder--hell .cu-wa-abbinder-text  { color: #5A6180; }
    /* Die Bottom-Nav ist fixiert und ~81px hoch. Ohne dieses Polster ist der
       Abbinder - jetzt das letzte Element im normalen Fluss jeder Seite -
       darunter verdeckt und der CTA-Button nicht antippbar (dasselbe Muster
       wie beim Cookie-Banner, siehe cu-cookie-banner weiter oben). */
    @media (max-width: 767px) {
      .cu-wa-abbinder { padding-bottom: 127px; }
    }
    @media (min-width: 768px) {
      .cu-wa-abbinder { padding: 32px 40px 56px; }
      .cu-wa-abbinder-title { font-size: 27px; }
      .cu-wa-abbinder-text { font-size: 15px; }
    }
    @media print { .cu-wa-abbinder { display: none !important; } }
  `;
  document.head.appendChild(style);

  // Auf Desktop ohne WhatsApp Desktop laeuft ein direkter Kanal-Link ins
  // Leere - dort auf die Zwischenseite mit QR-Code verlinken statt direkt.
  var ctaHref = istDesktopBreite() ? '/whatsapp-info' : CU_WA_KANAL_URL;
  var ctaExtra = istDesktopBreite() ? '' : ' target="_blank" rel="noopener"';

  var section = document.createElement('section');
  section.id = 'cu-wa-abbinder';
  section.className = 'cu-wa-abbinder' + (pfad === '/einheiten' ? ' cu-wa-abbinder--hell' : '');
  section.innerHTML =
      '<div class="cu-wa-abbinder-inner">'
    +   '<span class="cu-wa-abbinder-label">Kanal</span>'
    +   '<h2 class="cu-wa-abbinder-title">Komm in unseren WhatsApp-Kanal</h2>'
    +   '<p class="cu-wa-abbinder-text">Jede Woche posten wir dort neue Übungen. Keine Diskussionen, keine Chats – nur neue Ideen für dein Training.</p>'
    +   '<a class="cu-wa-abbinder-cta" href="' + ctaHref + '"' + ctaExtra + '>'
    +     cuWaIcon(18)
    +     'Zum Kanal'
    +   '</a>'
    + '</div>';

  var nav = container.querySelector('.bottom-nav');
  if (nav) container.insertBefore(section, nav);
  else container.appendChild(section);
}

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
