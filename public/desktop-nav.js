(function () {
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
