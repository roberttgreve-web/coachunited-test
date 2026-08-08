(function () {
  injectFerienPromo();

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
      <a href="/whatsapp-info" class="desktop-topnav-link ${isActive('/whatsapp-info')}">WhatsApp-Kanal</a>
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

// ── Sitewide Hinweis auf den Fußball-Ferienkalender ──
function injectFerienPromo() {
  var slug = 'der-fussball-ferienkalender';
  if (window.location.pathname.replace(/\/$/, '').split('/').pop() === slug) return;

  var DISMISS_KEY = 'cu_promo_ferienkalender_dismissed_at';
  var DISMISS_DAYS = 14;
  var dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
  if (dismissedAt && Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000) return;

  var url = '/artikel/' + slug;
  var tabText = '30 Übungen für die Ferien';
  var cardTitle = '30 Übungen für die Sommerferien – zum Selbermachen';
  // Eigenes 128px-Thumbnail statt des Artikelbilds: Die Karte zeigt das Bild mit
  // 64x64 an, das Original ist 1536x1024 und 2,9 MB gross - und wurde bisher auf
  // jeder Seite geladen, auf Mobilgeraeten sogar fuer die per CSS versteckte Karte.
  var img = '/images/artikel/fussball-ferienkalender-thumb.webp';
  var calendarIcon = '<svg width="15" height="15" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="16" height="14" rx="2"/><path d="M3 9h16M7 3v4M15 3v4"/></svg>';

  var style = document.createElement('style');
  style.textContent = `
    .cu-promo { position: fixed; z-index: 30; font-family: 'Inter Tight', system-ui, sans-serif; }
    .cu-promo-link { display: flex; text-decoration: none; color: inherit; }
    .cu-promo-close { position: absolute; background: none; border: none; cursor: pointer; opacity: 0.7; line-height: 1; padding: 4px; z-index: 1; }
    .cu-promo-close:hover { opacity: 1; }

    .cu-promo-tab {
      right: 0; top: 50%; transform: translateY(-50%);
      background: #1E6BFF;
      padding: 12px 6px 14px; border-radius: 10px 0 0 10px;
      box-shadow: -2px 2px 10px rgba(14, 20, 48, 0.22);
    }
    .cu-promo-tab .cu-promo-link { flex-direction: column; align-items: center; gap: 6px; color: #fff; }
    .cu-promo-tab-text { writing-mode: vertical-rl; font-size: 11.5px; font-weight: 700; letter-spacing: 0.02em; }
    .cu-promo-tab .cu-promo-close { top: 2px; right: 2px; font-size: 11px; color: #fff; }

    .cu-promo-card {
      right: 24px; bottom: 24px; width: 300px;
      background: #fff; border-radius: 16px;
      box-shadow: 0 16px 40px rgba(14, 20, 48, 0.22);
      padding: 16px;
      opacity: 0; transform: translateY(24px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .cu-promo-card.cu-promo-in { opacity: 1; transform: translateY(0); }
    .cu-promo-card .cu-promo-link { gap: 12px; }
    .cu-promo-card img { width: 64px; height: 64px; object-fit: cover; border-radius: 10px; flex-shrink: 0; }
    .cu-promo-card-label { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #1E6BFF; margin-bottom: 4px; }
    .cu-promo-card-title { font-size: 13.5px; font-weight: 700; color: #0E1430; line-height: 1.35; }
    .cu-promo-card .cu-promo-close { top: 6px; right: 6px; font-size: 14px; color: #8890A8; }

    @media (min-width: 768px) { .cu-promo-tab { display: none; } }
    @media (max-width: 767px) { .cu-promo-card { display: none; } }
    @media print { .cu-promo { display: none !important; } }
  `;
  document.head.appendChild(style);

  function dismiss(el) {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    el.remove();
  }

  var tab = document.createElement('div');
  tab.className = 'cu-promo cu-promo-tab';
  tab.innerHTML = '<button class="cu-promo-close" aria-label="Hinweis schließen">✕</button>'
    + '<a href="' + url + '" class="cu-promo-link" aria-label="' + cardTitle + '">'
    + calendarIcon
    + '<span class="cu-promo-tab-text">' + tabText + '</span></a>';
  tab.querySelector('.cu-promo-close').addEventListener('click', function () { dismiss(tab); });
  document.body.appendChild(tab);

  var card = document.createElement('div');
  card.className = 'cu-promo cu-promo-card';
  card.innerHTML = '<button class="cu-promo-close" aria-label="Hinweis schließen">✕</button>'
    + '<a href="' + url + '" class="cu-promo-link">'
    + '<img src="' + img + '" alt="" width="64" height="64" loading="lazy" decoding="async">'
    + '<div><div class="cu-promo-card-label">Kostenloser Download</div>'
    + '<div class="cu-promo-card-title">' + cardTitle + '</div></div></a>';
  card.querySelector('.cu-promo-close').addEventListener('click', function () { dismiss(card); });
  document.body.appendChild(card);

  setTimeout(function () { card.classList.add('cu-promo-in'); }, 900);
}
