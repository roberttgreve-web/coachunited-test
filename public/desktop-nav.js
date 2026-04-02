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
      <span>COACH UNITED</span>
    </a>
    <div class="desktop-topnav-links">
      <a href="/uebungen"     class="desktop-topnav-link ${isActive('/uebungen')}">Übungen</a>
      <a href="/einheiten"    class="desktop-topnav-link ${isActive('/einheiten')}">Einheiten</a>
      <a href="/wissen"       class="desktop-topnav-link ${isActive('/wissen')}">Wissen</a>
      <a href="/whatsapp-info" class="desktop-topnav-link ${isActive('/whatsapp-info')}">WhatsApp</a>
    </div>
  `;

  var container = document.querySelector('.container');
  if (container) {
    container.insertBefore(nav, container.firstChild);

    // Footer einfügen
    var footer = document.createElement('footer');
    footer.className = 'desktop-footer';
    footer.innerHTML = `
      <a href="/ueber-uns" class="desktop-footer-link ${isActive('/ueber-uns')}">Über uns</a>
      <span class="desktop-footer-sep">·</span>
      <a href="/spenden" class="desktop-footer-link ${isActive('/spenden')}">Spenden</a>
      <span class="desktop-footer-sep">·</span>
      <a href="/impressum" class="desktop-footer-link ${isActive('/impressum')}">Impressum</a>
    `;
    container.appendChild(footer);
  }
})();
