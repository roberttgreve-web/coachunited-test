(function () {
  if (window.innerWidth < 768) return;

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
  }
})();
