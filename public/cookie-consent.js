(function () {
  var CONSENT_KEY = 'cu_cookie_consent';
  var ID_KEY = 'cu_consent_id';
  var BANNER_VERSION = '1.0';
  var GA_ID = 'G-5D2HZBJESR';

  function getConsentId() {
    var id = localStorage.getItem(ID_KEY);
    if (!id) {
      id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : ('cu-' + Date.now() + '-' + Math.random().toString(16).slice(2));
      localStorage.setItem(ID_KEY, id);
    }
    return id;
  }

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch (e) { return null; }
  }

  function saveConsent(statistics) {
    var consent = { necessary: true, statistics: !!statistics, timestamp: Date.now(), version: BANNER_VERSION };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    return consent;
  }

  function loadGA() {
    if (window.__cuGaLoaded) return;
    window.__cuGaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function logConsent(consent) {
    try {
      fetch('/api/consent-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consentId: getConsentId(),
          categories: { necessary: true, statistics: consent.statistics },
          timestamp: consent.timestamp,
          bannerVersion: BANNER_VERSION,
          page: window.location.pathname
        })
      }).catch(function () {});
    } catch (e) {}
  }

  function applyConsent(consent) {
    if (consent.statistics) loadGA();
  }

  var style = document.createElement('style');
  style.textContent =
    '.cu-cookie-banner { position: fixed; left: 50%; bottom: 0; transform: translateX(-50%); width: 100%; max-width: 375px; background: #fff; border-radius: 20px 20px 0 0; box-shadow: 0 -8px 32px rgba(14,20,48,0.22); padding: 20px 22px 22px; z-index: 100; font-family: "Inter Tight", system-ui, sans-serif; box-sizing: border-box; }' +
    '.cu-cookie-banner p { font-size: 13.5px; line-height: 1.6; color: #4a5568; margin: 0 0 14px; }' +
    '.cu-cookie-banner a { color: #1E6BFF; text-decoration: underline; }' +
    '.cu-cookie-actions { display: flex; gap: 8px; }' +
    '.cu-cookie-btn { flex: 1; padding: 12px 0; border-radius: 10px; font-size: 13.5px; font-weight: 700; border: none; cursor: pointer; font-family: inherit; }' +
    '.cu-cookie-btn.cu-reject { background: #f0eee9; color: #0E1430; }' +
    '.cu-cookie-btn.cu-accept { background: #1E6BFF; color: #fff; }' +
    '.cu-cookie-settings-link { display: block; width: 100%; text-align: center; margin-top: 12px; font-size: 12.5px; color: #6B7390; text-decoration: underline; cursor: pointer; background: none; border: none; font-family: inherit; }' +
    '.cu-cookie-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 110; display: flex; align-items: flex-end; justify-content: center; }' +
    '.cu-cookie-modal { width: 100%; max-width: 375px; background: #fff; border-radius: 20px 20px 0 0; padding: 22px; font-family: "Inter Tight", system-ui, sans-serif; max-height: 85vh; overflow-y: auto; box-sizing: border-box; }' +
    '.cu-cookie-modal h3 { font-size: 17px; font-weight: 800; color: #0E1430; margin: 0 0 14px; }' +
    '.cu-cookie-cat { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 14px 0; border-bottom: 1px solid #f0f2f5; }' +
    '.cu-cookie-cat-title { font-size: 14px; font-weight: 700; color: #0E1430; margin-bottom: 3px; }' +
    '.cu-cookie-cat-desc { font-size: 12.5px; line-height: 1.5; color: #6B7390; }' +
    '.cu-cookie-toggle { position: relative; width: 42px; height: 24px; flex-shrink: 0; }' +
    '.cu-cookie-toggle input { opacity: 0; width: 0; height: 0; }' +
    '.cu-cookie-toggle-slider { position: absolute; inset: 0; background: #d8dbe4; border-radius: 24px; cursor: pointer; transition: background 0.15s; }' +
    '.cu-cookie-toggle-slider::before { content: ""; position: absolute; width: 18px; height: 18px; left: 3px; top: 3px; background: #fff; border-radius: 50%; transition: transform 0.15s; }' +
    '.cu-cookie-toggle input:checked + .cu-cookie-toggle-slider { background: #1E6BFF; }' +
    '.cu-cookie-toggle input:checked + .cu-cookie-toggle-slider::before { transform: translateX(18px); }' +
    '.cu-cookie-toggle input:disabled + .cu-cookie-toggle-slider { opacity: 0.5; cursor: not-allowed; }' +
    '.cu-cookie-modal-actions { display: flex; gap: 8px; margin-top: 18px; }' +
    '@media print { .cu-cookie-banner, .cu-cookie-modal-overlay { display: none !important; } }';
  document.head.appendChild(style);

  function decide(statistics) {
    var consent = saveConsent(statistics);
    removeBanner();
    removeModal();
    applyConsent(consent);
    logConsent(consent);
  }

  function renderBanner() {
    if (document.getElementById('cu-cookie-banner')) return;
    var banner = document.createElement('div');
    banner.className = 'cu-cookie-banner';
    banner.id = 'cu-cookie-banner';
    banner.innerHTML =
      '<p>Wir nutzen technisch notwendige Cookies für den Betrieb der Seite. Mit deiner Einwilligung nutzen wir außerdem Google Analytics, um die Seite zu verbessern. Mehr dazu in unserer <a href="/datenschutz">Datenschutzerklärung</a>.</p>' +
      '<div class="cu-cookie-actions">' +
        '<button type="button" class="cu-cookie-btn cu-reject" id="cu-cookie-reject">Ablehnen</button>' +
        '<button type="button" class="cu-cookie-btn cu-accept" id="cu-cookie-accept">Akzeptieren</button>' +
      '</div>' +
      '<button type="button" class="cu-cookie-settings-link" id="cu-cookie-settings-open">Einstellungen</button>';
    document.body.appendChild(banner);

    document.getElementById('cu-cookie-reject').addEventListener('click', function () { decide(false); });
    document.getElementById('cu-cookie-accept').addEventListener('click', function () { decide(true); });
    document.getElementById('cu-cookie-settings-open').addEventListener('click', function () {
      removeBanner();
      renderModal();
    });
  }

  function removeBanner() {
    var el = document.getElementById('cu-cookie-banner');
    if (el) el.remove();
  }

  function renderModal() {
    if (document.getElementById('cu-cookie-modal-overlay')) return;
    var current = getConsent();
    var overlay = document.createElement('div');
    overlay.className = 'cu-cookie-modal-overlay';
    overlay.id = 'cu-cookie-modal-overlay';
    overlay.innerHTML =
      '<div class="cu-cookie-modal">' +
        '<h3>Cookie-Einstellungen</h3>' +
        '<div class="cu-cookie-cat">' +
          '<div><div class="cu-cookie-cat-title">Notwendig</div><div class="cu-cookie-cat-desc">Für den Betrieb der Seite erforderlich (z. B. Merkliste, Cookie-Auswahl). Kann nicht deaktiviert werden.</div></div>' +
          '<label class="cu-cookie-toggle"><input type="checkbox" checked disabled><span class="cu-cookie-toggle-slider"></span></label>' +
        '</div>' +
        '<div class="cu-cookie-cat">' +
          '<div><div class="cu-cookie-cat-title">Statistik</div><div class="cu-cookie-cat-desc">Google Analytics hilft uns zu verstehen, wie die Seite genutzt wird.</div></div>' +
          '<label class="cu-cookie-toggle"><input type="checkbox" id="cu-cookie-stat-toggle"' + ((current && current.statistics) ? ' checked' : '') + '><span class="cu-cookie-toggle-slider"></span></label>' +
        '</div>' +
        '<div class="cu-cookie-modal-actions">' +
          '<button type="button" class="cu-cookie-btn cu-reject" id="cu-cookie-modal-reject">Alle ablehnen</button>' +
          '<button type="button" class="cu-cookie-btn cu-accept" id="cu-cookie-modal-save">Speichern</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    document.getElementById('cu-cookie-modal-reject').addEventListener('click', function () { decide(false); });
    document.getElementById('cu-cookie-modal-save').addEventListener('click', function () {
      var statistics = document.getElementById('cu-cookie-stat-toggle').checked;
      decide(statistics);
    });
  }

  function removeModal() {
    var el = document.getElementById('cu-cookie-modal-overlay');
    if (el) el.remove();
  }

  window.cuOpenCookieSettings = function () {
    removeBanner();
    renderModal();
  };

  function injectDrawerLink() {
    var drawer = document.getElementById('drawer');
    if (!drawer || drawer.querySelector('#cu-cookie-drawer-link')) return;
    var link = document.createElement('a');
    link.href = '#';
    link.className = 'drawer-link';
    link.id = 'cu-cookie-drawer-link';
    link.textContent = 'Cookie-Einstellungen';
    link.addEventListener('click', function (e) {
      e.preventDefault();
      if (typeof closeDrawer === 'function') closeDrawer();
      window.cuOpenCookieSettings();
    });
    drawer.appendChild(link);
  }

  function init() {
    injectDrawerLink();
    var consent = getConsent();
    if (consent) {
      applyConsent(consent);
    } else {
      renderBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
