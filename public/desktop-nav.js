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
          <a href="/uebungen/alter" class="desktop-topnav-sublink">Nach Alter</a>
          <a href="/uebungen/skill" class="desktop-topnav-sublink">Nach Skill</a>
          <a href="/uebungen/phase" class="desktop-topnav-sublink">Nach Phase</a>
        </div>
      </div>
      <a href="/einheiten"     class="desktop-topnav-link ${isActive('/einheiten')}">Einheit erhalten</a>
      <a href="/whatsapp-info" class="desktop-topnav-link ${isActive('/whatsapp-info')}">WhatsApp-Kanal</a>
      <a href="/uebung-einreichen" class="desktop-topnav-link ${isActive('/uebung-einreichen')}">Übung einreichen</a>
    </div>
  `;

  var container = document.querySelector('.container');
  if (container) {
    container.insertBefore(nav, container.firstChild);

    // Footer einfügen
    var footer = document.createElement('footer');
    footer.className = 'desktop-footer';
    footer.innerHTML = `
      <a href="/wissen" class="desktop-footer-link ${isActive('/wissen')}">Wissen</a>
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
