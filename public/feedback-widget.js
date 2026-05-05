(function () {
  const ACCESS_KEY = '178bfb57-6bf5-45c0-9788-064568110b35';

  /* ── Styles ─────────────────────────────────────────────────── */
  const css = `
    .cu-fb-tab {
      position: fixed;
      right: 0;
      top: 75%;
      transform: translateY(-50%);
      z-index: 890;
      background: #1E6BFF;
      color: #fff;
      border: none;
      border-radius: 10px 0 0 10px;
      padding: 14px 10px;
      cursor: pointer;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      transform: translateY(-50%) rotate(180deg);
      font-family: 'Inter Tight', system-ui, sans-serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.04em;
      box-shadow: -3px 0 16px rgba(30,107,255,0.35);
      transition: background 0.15s, box-shadow 0.15s;
    }
    .cu-fb-tab:hover { background: #1558d6; box-shadow: -4px 0 20px rgba(30,107,255,0.5); }

    .cu-fb-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      z-index: 900;
      backdrop-filter: blur(2px);
    }
    .cu-fb-overlay.open { display: block; }

    .cu-fb-sheet {
      position: fixed;
      bottom: -100%;
      left: 0; right: 0;
      background: #fff;
      border-radius: 20px 20px 0 0;
      padding: 20px 20px 40px;
      z-index: 910;
      transition: bottom 0.3s cubic-bezier(0.32,0.72,0,1);
      max-width: 500px;
      margin: 0 auto;
    }
    .cu-fb-sheet.open { bottom: 0; }

    .cu-fb-handle {
      width: 36px; height: 4px;
      background: #E6E8EF; border-radius: 2px;
      margin: 0 auto 20px;
    }

    .cu-fb-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 6px;
    }
    .cu-fb-title {
      font-family: 'Inter Tight', system-ui, sans-serif;
      font-size: 17px; font-weight: 800; color: #0E1430;
      letter-spacing: -0.02em;
    }
    .cu-fb-close {
      background: #f0f2f5; border: none; border-radius: 50%;
      width: 28px; height: 28px; font-size: 14px; cursor: pointer;
      color: #6B7390; display: flex; align-items: center; justify-content: center;
    }
    .cu-fb-subtitle {
      font-family: 'Inter Tight', system-ui, sans-serif;
      font-size: 13px; color: #6B7390; margin-bottom: 18px; line-height: 1.5;
    }

    .cu-fb-label {
      font-family: 'Inter Tight', system-ui, sans-serif;
      font-size: 12px; font-weight: 600; color: #3B4565;
      margin-bottom: 5px; display: block;
    }
    .cu-fb-textarea {
      width: 100%; min-height: 110px;
      padding: 12px; border-radius: 10px;
      border: 1.5px solid #E6E8EF;
      font-family: 'Inter Tight', system-ui, sans-serif;
      font-size: 14px; color: #0E1430;
      resize: none; outline: none;
      transition: border-color 0.15s;
      margin-bottom: 10px;
    }
    .cu-fb-textarea:focus { border-color: #1E6BFF; }
    .cu-fb-textarea::placeholder { color: #adb5c2; }
    .cu-fb-input {
      width: 100%; padding: 11px 12px;
      border-radius: 10px; border: 1.5px solid #E6E8EF;
      font-family: 'Inter Tight', system-ui, sans-serif;
      font-size: 14px; color: #0E1430;
      outline: none; transition: border-color 0.15s;
      margin-bottom: 14px;
    }
    .cu-fb-input:focus { border-color: #1E6BFF; }
    .cu-fb-input::placeholder { color: #adb5c2; }

    .cu-fb-submit {
      width: 100%; padding: 14px;
      background: #1E6BFF; color: #fff; border: none;
      border-radius: 10px;
      font-family: 'Inter Tight', system-ui, sans-serif;
      font-size: 15px; font-weight: 700;
      cursor: pointer; transition: background 0.15s, opacity 0.15s;
    }
    .cu-fb-submit:hover { background: #1558d6; }
    .cu-fb-submit:disabled { opacity: 0.6; cursor: default; }

    .cu-fb-success {
      display: none;
      flex-direction: column; align-items: center;
      text-align: center; padding: 16px 0 8px;
      gap: 12px;
    }
    .cu-fb-success.show { display: flex; }
    .cu-fb-success-icon {
      width: 48px; height: 48px; background: #e8f5ee;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
    }
    .cu-fb-success-title {
      font-family: 'Inter Tight', system-ui, sans-serif;
      font-size: 16px; font-weight: 800; color: #0E1430;
    }
    .cu-fb-success-text {
      font-family: 'Inter Tight', system-ui, sans-serif;
      font-size: 13px; color: #6B7390; line-height: 1.5;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── HTML ────────────────────────────────────────────────────── */
  const html = `
    <button class="cu-fb-tab" id="cu-fb-tab" onclick="cuFB.open()">Beta-Feedback</button>
    <div class="cu-fb-overlay" id="cu-fb-overlay" onclick="cuFB.close()"></div>
    <div class="cu-fb-sheet" id="cu-fb-sheet">
      <div class="cu-fb-handle"></div>
      <div id="cu-fb-form-wrap">
        <div class="cu-fb-header">
          <p class="cu-fb-title">Beta-Feedback</p>
          <button class="cu-fb-close" onclick="cuFB.close()">✕</button>
        </div>
        <p class="cu-fb-subtitle">Was läuft gut? Was nervt? Hilf uns, Coach United besser zu machen.</p>
        <label class="cu-fb-label">Dein Feedback</label>
        <textarea class="cu-fb-textarea" id="cu-fb-text" placeholder="Deine Gedanken zur Beta…"></textarea>
        <label class="cu-fb-label">E-Mail <span style="font-weight:400;color:#adb5c2;">(optional – für Rückfragen)</span></label>
        <input class="cu-fb-input" id="cu-fb-email" type="email" placeholder="deine@email.de">
        <button class="cu-fb-submit" id="cu-fb-submit" onclick="cuFB.submit()">Feedback absenden</button>
      </div>
      <div class="cu-fb-success" id="cu-fb-success">
        <div class="cu-fb-success-icon">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 11l5 5 9-9" stroke="#0E6A45" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p class="cu-fb-success-title">Danke für dein Feedback!</p>
        <p class="cu-fb-success-text">Wir lesen jede Nachricht und arbeiten daran, Coach United stetig zu verbessern.</p>
      </div>
    </div>
  `;

  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  document.body.appendChild(wrap);

  /* ── Logic ───────────────────────────────────────────────────── */
  window.cuFB = {
    open() {
      document.getElementById('cu-fb-overlay').classList.add('open');
      document.getElementById('cu-fb-sheet').classList.add('open');
      setTimeout(() => document.getElementById('cu-fb-text')?.focus(), 320);
    },
    close() {
      document.getElementById('cu-fb-overlay').classList.remove('open');
      document.getElementById('cu-fb-sheet').classList.remove('open');
    },
    async submit() {
      const text = document.getElementById('cu-fb-text').value.trim();
      const email = document.getElementById('cu-fb-email').value.trim();
      if (!text) {
        document.getElementById('cu-fb-text').focus();
        return;
      }
      const btn = document.getElementById('cu-fb-submit');
      btn.disabled = true;
      btn.textContent = 'Wird gesendet…';
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: ACCESS_KEY,
            subject: 'Beta-Feedback – Coach United',
            from_name: 'Coach United Beta',
            message: text,
            email: email || 'nicht angegeben',
            seite: window.location.pathname,
          }),
        });
        if (res.ok) {
          document.getElementById('cu-fb-form-wrap').style.display = 'none';
          document.getElementById('cu-fb-success').classList.add('show');
          setTimeout(() => this.close(), 3200);
          setTimeout(() => {
            document.getElementById('cu-fb-form-wrap').style.display = '';
            document.getElementById('cu-fb-success').classList.remove('show');
            document.getElementById('cu-fb-text').value = '';
            document.getElementById('cu-fb-email').value = '';
            btn.disabled = false;
            btn.textContent = 'Feedback absenden';
          }, 3400);
        } else {
          throw new Error();
        }
      } catch {
        btn.disabled = false;
        btn.textContent = 'Erneut versuchen';
      }
    },
  };
})();
