# Generator: SEO Landing Pages fuer COACH UNITED
# Alle Sonderzeichen als HTML-Entities (encoding-sicher)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent

# ── Sub-Page Template ───────────────────────────────────────────────────────
$SUB_TEMPLATE = @'
<!DOCTYPE html>
<html lang="de">
<head>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-5D2HZBJESR"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-5D2HZBJESR');</script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta name="description" content="__META__">
  <meta property="og:type" content="website">
  <meta property="og:title" content="__TITLE__">
  <meta property="og:description" content="__META__">
  <meta property="og:image" content="https://coachunited.de/og-image.png">
  <meta property="og:url" content="https://coachunited.de__URL__">
  <meta property="og:site_name" content="COACH UNITED">
  <link rel="canonical" href="https://coachunited.de__URL__">
  <title>__TITLE__</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Inter Tight',system-ui,sans-serif;background:#f0eee9;display:flex;justify-content:center;align-items:flex-start;min-height:100vh;}
    .container{width:375px;min-height:100vh;background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.14);display:flex;flex-direction:column;}
    .header{background:#fff;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #E6E8EF;position:sticky;top:0;z-index:20;}
    .logo-link{display:flex;align-items:center;text-decoration:none;}
    .logo-link img{height:40px;width:auto;object-fit:contain;}
    .burger-btn{background:none;border:none;cursor:pointer;padding:4px;display:flex;flex-direction:column;gap:4.5px;}
    .burger-btn span{display:block;width:22px;height:2px;background:#0E1430;border-radius:2px;}
    .hero{background:#0E1430;padding:24px 20px 28px;}
    .breadcrumb{display:flex;align-items:center;gap:6px;margin-bottom:16px;}
    .bc-link{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:10px;font-weight:600;letter-spacing:0.08em;color:rgba(255,255,255,0.45);text-decoration:none;}
    .bc-link:hover{color:rgba(255,255,255,0.75);}
    .bc-sep{font-size:10px;color:rgba(255,255,255,0.25);}
    .bc-current{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:10px;font-weight:600;letter-spacing:0.08em;color:rgba(255,255,255,0.7);}
    .hero-h1{font-size:26px;font-weight:800;color:#fff;line-height:1.12;letter-spacing:-0.03em;margin-bottom:12px;}
    .hero-badge{display:inline-flex;align-items:center;padding:4px 10px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.18);border-radius:999px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:10px;font-weight:600;color:rgba(255,255,255,0.65);letter-spacing:0.06em;margin-bottom:14px;}
    .hero-lead{font-size:14px;line-height:1.6;color:rgba(255,255,255,0.72);max-width:320px;}
    .page-content{flex:1;overflow-y:auto;padding:28px 20px 100px;}
    .text-section{margin-bottom:28px;padding-bottom:28px;border-bottom:1px solid #E6E8EF;}
    .section-h2{font-size:18px;font-weight:700;color:#0E1430;letter-spacing:-0.02em;line-height:1.25;margin-bottom:12px;}
    .body-text{font-size:14px;line-height:1.65;color:#3B4565;margin-bottom:10px;}
    .body-text:last-child{margin-bottom:0;}
    .exercises-header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:16px;}
    .exercise-count{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;font-weight:600;color:#6B7390;letter-spacing:0.06em;}
    .exercise-card{display:flex;flex-direction:column;gap:10px;text-decoration:none;color:inherit;background:#fff;border:1px solid #E6E8EF;border-radius:16px;padding:16px 14px;margin-bottom:10px;transition:box-shadow .18s,transform .18s;}
    .exercise-card:hover{box-shadow:0 4px 16px rgba(0,0,0,0.08);transform:translateY(-1px);}
    .card-grid{display:flex;flex-direction:column;gap:10px;}
    .card-title{font-size:17px;font-weight:700;color:#0E1430;line-height:1.18;letter-spacing:-0.02em;}
    .card-desc{font-size:13px;line-height:1.5;color:#3B4565;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
    .card-tags{display:flex;align-items:center;gap:5px;flex-wrap:nowrap;overflow:hidden;}
    .tag-phase{display:inline-flex;align-items:center;padding:4px 9px;color:#fff;border-radius:4px;font-size:9.5px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;white-space:nowrap;flex-shrink:0;}
    .tag-jahrgang{display:inline-flex;align-items:center;padding:4px 9px;background:#EEF1F6;color:#0E1430;border-radius:4px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:10px;font-weight:700;white-space:nowrap;flex-shrink:0;}
    .tag-skill{display:inline-flex;align-items:center;padding:4px 9px;background:#0E1430;color:#fff;border-radius:4px;font-size:10px;font-weight:600;white-space:nowrap;flex-shrink:0;}
    .tag-more{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:9.5px;font-weight:600;color:#6B7390;flex-shrink:0;}
    .empty-state{text-align:center;padding:48px 24px;color:#6B7390;font-size:14px;line-height:1.6;}
    .bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:375px;background:#fff;border-top:1px solid #E6E8EF;display:flex;padding:10px 0 24px;z-index:20;box-shadow:0 -2px 12px rgba(0,0,0,0.05);}
    .nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;border:none;background:none;cursor:pointer;padding:4px;text-decoration:none;color:#6B7390;transition:color .15s;font-family:'Inter Tight',system-ui,sans-serif;font-size:10.5px;font-weight:600;}
    .nav-item.active{color:#1E6BFF;}
    .nav-icon{width:22px;height:22px;}
    .drawer-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:40;}
    .drawer-overlay.open{display:block;}
    .drawer{position:fixed;top:0;right:-280px;width:260px;height:100vh;background:#fff;z-index:50;padding:32px 24px;transition:right .25s ease;box-shadow:-8px 0 32px rgba(0,0,0,0.12);}
    .drawer.open{right:0;}
    .drawer-close{position:absolute;top:16px;right:16px;background:none;border:none;font-size:22px;cursor:pointer;color:#555;padding:4px;}
    .drawer-logo{width:48px;margin-bottom:24px;}
    .drawer-section-label{display:block;padding:8px 0 6px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:9.5px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9BA3B8;}
    .drawer-link{display:block;padding:11px 0;font-family:'Inter Tight',system-ui,sans-serif;font-size:15px;font-weight:500;color:#0E1430;text-decoration:none;border-bottom:1px solid #E6E8EF;}
    .drawer-link:last-child{border-bottom:none;}
    .drawer-link:hover{color:#1E6BFF;}
    .drawer-divider{height:1px;background:#E6E8EF;margin:10px 0 12px;}
    @media(min-width:768px){
      body{background:#0E1430;}
      .container{width:100%;max-width:860px;border-radius:0;min-height:100vh;}
      .page-content{padding:40px 48px 120px;max-width:720px;}
      .hero{padding:40px 48px 44px;}
      .hero-h1{font-size:36px;}
    }
  </style>
  <link rel="stylesheet" href="/desktop.css">
  <script src="/desktop-nav.js" defer></script>
  <script src="/feedback-widget.js" defer></script>
  __JSON_LD__
</head>
<body>
<div class="container">
  <header class="header">
    <a href="/home" class="logo-link"><img src="/logo.png" alt="Coach United"></a>
    <button class="burger-btn" onclick="openDrawer()"><span></span><span></span><span></span></button>
  </header>

  <div class="hero">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/uebungen" class="bc-link">&#220;bungen</a>
      <span class="bc-sep">&#8250;</span>
      <a href="__PARENT_URL__" class="bc-link">__PARENT_LABEL__</a>
      <span class="bc-sep">&#8250;</span>
      <span class="bc-current">__BREADCRUMB__</span>
    </nav>
    <h1 class="hero-h1">__H1__</h1>
    <span class="hero-badge">__BADGE__</span>
    <p class="hero-lead">__LEAD__</p>
  </div>

  <div class="page-content">
    <section class="text-section">
      <h2 class="section-h2">__H2_1__</h2>
      <p class="body-text">__BODY_1__</p>
      <p class="body-text">__BODY_2__</p>
    </section>
    <section>
      <div class="exercises-header">
        <h2 class="section-h2">__H2_2__</h2>
        <span class="exercise-count" id="count-label"></span>
      </div>
      <div id="exercises-list"><div class="empty-state">&#220;bungen werden geladen&#8230;</div></div>
    </section>
  </div>

  <nav class="bottom-nav">
    <a href="/uebungen" class="nav-item active">
      <svg class="nav-icon" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4 L6 17 L16 17 Z"/><line x1="7.5" y1="11" x2="14.5" y2="11"/><line x1="4.5" y1="17" x2="17.5" y2="17"/></svg>
      <span>Alle &#220;bungen</span>
    </a>
    <a href="/einheiten" class="nav-item">
      <svg class="nav-icon" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="14" height="16" rx="2"/><line x1="7" y1="8" x2="15" y2="8"/><line x1="7" y1="12" x2="15" y2="12"/><line x1="7" y1="16" x2="12" y2="16"/></svg>
      <span>Einheit erhalten</span>
    </a>
    <a href="/whatsapp-info" class="nav-item">
      <svg class="nav-icon" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2H9l-4 3v-3H6a2 2 0 01-2-2z"/><circle cx="8" cy="9.5" r="0.6" fill="currentColor" stroke="none"/><circle cx="11" cy="9.5" r="0.6" fill="currentColor" stroke="none"/><circle cx="14" cy="9.5" r="0.6" fill="currentColor" stroke="none"/></svg>
      <span>WhatsApp-Kanal</span>
    </a>
    <a href="/uebung-einreichen" class="nav-item">
      <svg class="nav-icon" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 2.5a2.121 2.121 0 013 3L7 17l-4 1 1-4 10.5-10.5z"/></svg>
      <span>Einreichen</span>
    </a>
  </nav>

  <div class="drawer-overlay" id="drawer-overlay" onclick="closeDrawer()"></div>
  <div class="drawer" id="drawer">
    <button class="drawer-close" onclick="closeDrawer()">&#x2715;</button>
    <img src="/logo.png" alt="Coach United" class="drawer-logo">
    <span class="drawer-section-label">&#220;bungen entdecken</span>
    <a href="/uebungen/alter" class="drawer-link">&#220;bungen nach Alter</a>
    <a href="/uebungen/skill" class="drawer-link">&#220;bungen nach Skill</a>
    <a href="/uebungen/phase" class="drawer-link">&#220;bungen nach Phase</a>
    <div class="drawer-divider"></div>
    <a href="/wissen" class="drawer-link">Wissen</a>
    <a href="/ueber-uns" class="drawer-link">&#220;ber uns</a>
    <a href="/umgang-mit-ki" class="drawer-link">Umgang mit KI</a>
    <a href="/impressum" class="drawer-link">Impressum</a>
  </div>
</div>
<script>
  const FILTER_KEY = '__FILTER_KEY__';
  const FILTER_VALUE = '__FILTER_VALUE__';
  const PHASE_COLORS = {'Aufwaermen':'#C2611F','Aufw\u00e4rmen':'#C2611F','Hauptteil':'#0E6A45','Spielformat':'#0F3FA8'};
  function filterEx(data){
    if(FILTER_KEY==='jugend') return data.filter(e=>(e.jugend||[]).includes(FILTER_VALUE));
    if(FILTER_KEY==='phase') return data.filter(e=>e.trainingsphase===FILTER_VALUE);
    if(FILTER_KEY==='skill') return data.filter(e=>(e.skills||[]).includes(FILTER_VALUE));
    return data;
  }
  function renderEx(list){
    const el=document.getElementById('exercises-list');
    const n=list.length;
    document.getElementById('count-label').textContent=n+' \u00dcbung'+(n!==1?'en':'');
    if(!n){el.innerHTML='<div class="empty-state">Keine \u00dcbungen gefunden.</div>';return;}
    el.innerHTML=list.map(ex=>{
      const href=ex.url_slug?`/uebung/${ex.url_slug}`:'#';
      const pc=PHASE_COLORS[ex.trainingsphase]||'#0E1430';
      const pt=ex.trainingsphase?`<span class="tag-phase" style="background:${pc}">${ex.trainingsphase}</span>`:'';
      const js=(ex.jugend||[]).map(j=>j.replace('-Jugend','')).join('\u00b7');
      const jt=js?`<span class="tag-jahrgang">${js}</span>`:'';
      const sk=ex.skills||[];
      const sv=sk.slice(0,2).map(s=>`<span class="tag-skill">${s}</span>`).join('');
      const sm=sk.length>2?`<span class="tag-more">+${sk.length-2}</span>`:'';
      return `<a href="${href}" class="exercise-card"><div class="card-grid"><div class="card-left"><h3 class="card-title">${ex.titel}</h3></div><div class="card-right">${ex.kurzbeschreibung?`<p class="card-desc">${ex.kurzbeschreibung}</p>`:''}<div class="card-tags">${pt}${jt}${sv}${sm}</div></div></div></a>`;
    }).join('');
  }
  fetch('https://raw.githubusercontent.com/roberttgreve-web/coachunited-test/main/public/exercises.json')
    .then(r=>r.json()).then(d=>renderEx(filterEx(d)))
    .catch(()=>{document.getElementById('exercises-list').innerHTML='<div class="empty-state">\u00dcbungen konnten nicht geladen werden.</div>';});
  function openDrawer(){document.getElementById('drawer').classList.add('open');document.getElementById('drawer-overlay').classList.add('open');}
  function closeDrawer(){document.getElementById('drawer').classList.remove('open');document.getElementById('drawer-overlay').classList.remove('open');}
</script>
</body>
</html>
'@

# ── Hub-Page Template ───────────────────────────────────────────────────────
$HUB_TEMPLATE = @'
<!DOCTYPE html>
<html lang="de">
<head>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-5D2HZBJESR"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-5D2HZBJESR');</script>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta name="description" content="__META__">
  <meta property="og:type" content="website">
  <meta property="og:title" content="__TITLE__">
  <meta property="og:description" content="__META__">
  <meta property="og:image" content="https://coachunited.de/og-image.png">
  <meta property="og:url" content="https://coachunited.de__URL__">
  <meta property="og:site_name" content="COACH UNITED">
  <link rel="canonical" href="https://coachunited.de__URL__">
  <title>__TITLE__</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Inter Tight',system-ui,sans-serif;background:#f0eee9;display:flex;justify-content:center;align-items:flex-start;min-height:100vh;}
    .container{width:375px;min-height:100vh;background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.14);display:flex;flex-direction:column;}
    .header{background:#fff;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #E6E8EF;position:sticky;top:0;z-index:20;}
    .logo-link{display:flex;align-items:center;text-decoration:none;}
    .logo-link img{height:40px;width:auto;object-fit:contain;}
    .burger-btn{background:none;border:none;cursor:pointer;padding:4px;display:flex;flex-direction:column;gap:4.5px;}
    .burger-btn span{display:block;width:22px;height:2px;background:#0E1430;border-radius:2px;}
    .hero{background:#0E1430;padding:28px 20px 32px;}
    .breadcrumb{display:flex;align-items:center;gap:6px;margin-bottom:16px;}
    .bc-link{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:10px;font-weight:600;letter-spacing:0.08em;color:rgba(255,255,255,0.45);text-decoration:none;}
    .bc-link:hover{color:rgba(255,255,255,0.75);}
    .bc-sep{font-size:10px;color:rgba(255,255,255,0.25);}
    .bc-current{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:10px;font-weight:600;letter-spacing:0.08em;color:rgba(255,255,255,0.7);}
    .hero-h1{font-size:26px;font-weight:800;color:#fff;line-height:1.12;letter-spacing:-0.03em;margin-bottom:10px;}
    .hero-lead{font-size:14px;line-height:1.6;color:rgba(255,255,255,0.72);}
    .page-content{flex:1;overflow-y:auto;padding:24px 16px 100px;}
    .hub-grid{display:flex;flex-direction:column;gap:12px;}
    .hub-card{display:block;text-decoration:none;background:#fff;border:1px solid #E6E8EF;border-radius:16px;padding:18px 16px;transition:box-shadow .18s,transform .18s;}
    .hub-card:hover{box-shadow:0 6px 20px rgba(0,0,0,0.09);transform:translateY(-2px);}
    .hub-card-tag{display:inline-block;margin-bottom:8px;padding:3px 10px;background:#0E1430;color:#fff;border-radius:4px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:9.5px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;}
    .hub-card-title{font-size:16px;font-weight:700;color:#0E1430;line-height:1.2;letter-spacing:-0.02em;margin-bottom:7px;}
    .hub-card-desc{font-size:13px;line-height:1.5;color:#3B4565;margin-bottom:10px;}
    .hub-card-cta{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:10.5px;font-weight:700;color:#1E6BFF;letter-spacing:0.04em;}
    .bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:375px;background:#fff;border-top:1px solid #E6E8EF;display:flex;padding:10px 0 24px;z-index:20;box-shadow:0 -2px 12px rgba(0,0,0,0.05);}
    .nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;border:none;background:none;cursor:pointer;padding:4px;text-decoration:none;color:#6B7390;transition:color .15s;font-family:'Inter Tight',system-ui,sans-serif;font-size:10.5px;font-weight:600;}
    .nav-item.active{color:#1E6BFF;}
    .nav-icon{width:22px;height:22px;}
    .drawer-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:40;}
    .drawer-overlay.open{display:block;}
    .drawer{position:fixed;top:0;right:-280px;width:260px;height:100vh;background:#fff;z-index:50;padding:32px 24px;transition:right .25s ease;box-shadow:-8px 0 32px rgba(0,0,0,0.12);}
    .drawer.open{right:0;}
    .drawer-close{position:absolute;top:16px;right:16px;background:none;border:none;font-size:22px;cursor:pointer;color:#555;padding:4px;}
    .drawer-logo{width:48px;margin-bottom:24px;}
    .drawer-section-label{display:block;padding:8px 0 6px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:9.5px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9BA3B8;}
    .drawer-link{display:block;padding:11px 0;font-family:'Inter Tight',system-ui,sans-serif;font-size:15px;font-weight:500;color:#0E1430;text-decoration:none;border-bottom:1px solid #E6E8EF;}
    .drawer-link:last-child{border-bottom:none;}
    .drawer-link:hover{color:#1E6BFF;}
    .drawer-divider{height:1px;background:#E6E8EF;margin:10px 0 12px;}
    @media(min-width:768px){
      body{background:#0E1430;}
      .container{width:100%;max-width:860px;border-radius:0;min-height:100vh;}
      .hero{padding:40px 48px 44px;}
      .hero-h1{font-size:36px;}
      .page-content{padding:36px 48px 120px;}
      .hub-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;}
    }
  </style>
  <link rel="stylesheet" href="/desktop.css">
  <script src="/desktop-nav.js" defer></script>
  <script src="/feedback-widget.js" defer></script>
  __JSON_LD__
</head>
<body>
<div class="container">
  <header class="header">
    <a href="/home" class="logo-link"><img src="/logo.png" alt="Coach United"></a>
    <button class="burger-btn" onclick="openDrawer()"><span></span><span></span><span></span></button>
  </header>

  <div class="hero">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/uebungen" class="bc-link">&#220;bungen</a>
      <span class="bc-sep">&#8250;</span>
      <span class="bc-current">__BREADCRUMB__</span>
    </nav>
    <h1 class="hero-h1">__H1__</h1>
    <p class="hero-lead">__LEAD__</p>
  </div>

  <div class="page-content">
    <div class="hub-grid">
__HUB_CARDS__
    </div>
  </div>

  <nav class="bottom-nav">
    <a href="/uebungen" class="nav-item active">
      <svg class="nav-icon" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4 L6 17 L16 17 Z"/><line x1="7.5" y1="11" x2="14.5" y2="11"/><line x1="4.5" y1="17" x2="17.5" y2="17"/></svg>
      <span>Alle &#220;bungen</span>
    </a>
    <a href="/einheiten" class="nav-item">
      <svg class="nav-icon" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="14" height="16" rx="2"/><line x1="7" y1="8" x2="15" y2="8"/><line x1="7" y1="12" x2="15" y2="12"/><line x1="7" y1="16" x2="12" y2="16"/></svg>
      <span>Einheit erhalten</span>
    </a>
    <a href="/whatsapp-info" class="nav-item">
      <svg class="nav-icon" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2H9l-4 3v-3H6a2 2 0 01-2-2z"/><circle cx="8" cy="9.5" r="0.6" fill="currentColor" stroke="none"/><circle cx="11" cy="9.5" r="0.6" fill="currentColor" stroke="none"/><circle cx="14" cy="9.5" r="0.6" fill="currentColor" stroke="none"/></svg>
      <span>WhatsApp-Kanal</span>
    </a>
    <a href="/uebung-einreichen" class="nav-item">
      <svg class="nav-icon" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 2.5a2.121 2.121 0 013 3L7 17l-4 1 1-4 10.5-10.5z"/></svg>
      <span>Einreichen</span>
    </a>
  </nav>

  <div class="drawer-overlay" id="drawer-overlay" onclick="closeDrawer()"></div>
  <div class="drawer" id="drawer">
    <button class="drawer-close" onclick="closeDrawer()">&#x2715;</button>
    <img src="/logo.png" alt="Coach United" class="drawer-logo">
    <span class="drawer-section-label">&#220;bungen entdecken</span>
    <a href="/uebungen/alter" class="drawer-link">&#220;bungen nach Alter</a>
    <a href="/uebungen/skill" class="drawer-link">&#220;bungen nach Skill</a>
    <a href="/uebungen/phase" class="drawer-link">&#220;bungen nach Phase</a>
    <div class="drawer-divider"></div>
    <a href="/wissen" class="drawer-link">Wissen</a>
    <a href="/ueber-uns" class="drawer-link">&#220;ber uns</a>
    <a href="/umgang-mit-ki" class="drawer-link">Umgang mit KI</a>
    <a href="/impressum" class="drawer-link">Impressum</a>
  </div>
</div>
<script>
  function openDrawer(){document.getElementById('drawer').classList.add('open');document.getElementById('drawer-overlay').classList.add('open');}
  function closeDrawer(){document.getElementById('drawer').classList.remove('open');document.getElementById('drawer-overlay').classList.remove('open');}
</script>
</body>
</html>
'@

# ── Page Data (alle Sonderzeichen als HTML-Entities) ─────────────────────────
$subPages = @(
  # ── ALTER ──────────────────────────────────────────────────────────────────
  @{
    file='public\alter\g-jugend.html'; url='/uebungen/alter/g-jugend'
    title='Fu&#223;ball&#252;bungen f&#252;r die G-Jugend (Bambini) | COACH UNITED'
    meta='Altersgerechtes Fu&#223;balltraining f&#252;r Bambinis und G-Jugend (5&#8211;7 Jahre). Kostenlose &#220;bungen mit Grafiken, Aufbau und Coaching-Tipps f&#252;r Trainer.'
    h1='Fu&#223;ball&#252;bungen f&#252;r die G-Jugend'
    badge='Bambini &#183; 5&#8211;7 Jahre'
    lead='Die G-Jugend ist der erste Kontakt mit dem Vereinsfu&#223;ball. Spa&#223;, viel Ballkontakt und spielerisches Lernen stehen im Mittelpunkt.'
    parent_url='/uebungen/alter'; parent_label='Nach Alter'; breadcrumb='G-Jugend'
    h2_1='Was macht gutes G-Jugend-Training aus?'
    body_1='Bambinis lernen am besten durch Spielen. Statt komplexer &#220;bungsformen brauchen sie viele Wiederholungen mit dem Ball, kurze Spielphasen und viele Erfolgserlebnisse. Das Ziel: jedes Kind soll den Ball so oft wie m&#246;glich ber&#252;hren.'
    body_2='Die &#220;bungen auf dieser Seite sind speziell f&#252;r die Anforderungen der G-Jugend ausgew&#228;hlt &#8211; mit einfachem Aufbau, klaren Regeln und spielerischem Charakter. Alle &#220;bungen eignen sich f&#252;r Teams mit 8&#8211;16 Spielern und ben&#246;tigen keine aufw&#228;ndige Ausr&#252;stung.'
    h2_2='Alle G-Jugend &#220;bungen'; filter_key='jugend'; filter_value='G-Jugend'
  },
  @{
    file='public\alter\f-jugend.html'; url='/uebungen/alter/f-jugend'
    title='Fu&#223;ball&#252;bungen f&#252;r die F-Jugend | COACH UNITED'
    meta='Fu&#223;balltraining f&#252;r die F-Jugend (8&#8211;9 Jahre). Kostenlose &#220;bungen mit Grafiken und Coaching-Tipps zum Dribbeln, Passen und Torschuss.'
    h1='Fu&#223;ball&#252;bungen f&#252;r die F-Jugend'
    badge='F-Jugend &#183; 8&#8211;9 Jahre'
    lead='In der F-Jugend beginnen Kinder, Grundtechniken zu festigen und erste taktische Grundbegriffe kennenzulernen. Der Spa&#223; steht weiter im Vordergrund &#8211; aber die Anforderungen wachsen.'
    parent_url='/uebungen/alter'; parent_label='Nach Alter'; breadcrumb='F-Jugend'
    h2_1='F-Jugend trainieren &#8211; worauf kommt es an?'
    body_1='F-Jugend-Spieler k&#246;nnen bereits einfache Spielprinzipien verstehen: Freilaufen, anspielen, nachsetzen. Die &#220;bungen sollten Technik (Dribbling, Passen, Torschuss) mit kleinen Spielformen kombinieren, damit der Transfer auf das Spiel gelingt.'
    body_2='Die &#220;bungen auf dieser Seite sind f&#252;r 8- bis 9-J&#228;hrige ausgelegt. Der Aufbau ist einfach erkl&#228;rt, die Grafiken zeigen auf einen Blick, wie die &#220;bung gespielt wird. Mit Varianten f&#252;r Leichter und Schwerer kannst du die &#220;bungen schnell anpassen.'
    h2_2='Alle F-Jugend &#220;bungen'; filter_key='jugend'; filter_value='F-Jugend'
  },
  @{
    file='public\alter\e-jugend.html'; url='/uebungen/alter/e-jugend'
    title='Fu&#223;ball&#252;bungen f&#252;r die E-Jugend | COACH UNITED'
    meta='Fu&#223;balltraining f&#252;r die E-Jugend (10&#8211;11 Jahre). Kostenlose &#220;bungen f&#252;r Dribbling, Zweikampf, Taktik und Spielverst&#228;ndnis mit Grafiken.'
    h1='Fu&#223;ball&#252;bungen f&#252;r die E-Jugend'
    badge='E-Jugend &#183; 10&#8211;11 Jahre'
    lead='Die E-Jugend ist die erste Altersklasse mit Meisterschaftsspielen in voller St&#228;rke. Spielverst&#228;ndnis, Zweikampf und Positionen werden jetzt gezielt trainiert.'
    parent_url='/uebungen/alter'; parent_label='Nach Alter'; breadcrumb='E-Jugend'
    h2_1='E-Jugend Fu&#223;ball &#8211; was ist wichtig?'
    body_1='In der E-Jugend beginnt der strukturiertere Aufbau: Positionen, Umschalten und einfache Taktik spielen eine gr&#246;&#223;ere Rolle. Gleichzeitig ist die technische Basis (Ball f&#252;hren, sicheres Passen, Torschuss) noch immer das Fundament jeder Trainingseinheit.'
    body_2='Die &#220;bungen f&#252;r die E-Jugend verbinden Techniktraining mit kleinen Spielformen und taktischen Elementen. Alle &#220;bungen haben klare Coaching-Fokuspunkte und Varianten f&#252;r verschiedene Leistungsst&#228;rken.'
    h2_2='Alle E-Jugend &#220;bungen'; filter_key='jugend'; filter_value='E-Jugend'
  },
  @{
    file='public\alter\d-jugend.html'; url='/uebungen/alter/d-jugend'
    title='Fu&#223;ball&#252;bungen f&#252;r die D-Jugend | COACH UNITED'
    meta='Fu&#223;balltraining f&#252;r die D-Jugend (12&#8211;13 Jahre). &#220;bungen f&#252;r Taktik, Zweikampf, Umschalten und Spielvorbereitung mit Grafiken und Coaching-Tipps.'
    h1='Fu&#223;ball&#252;bungen f&#252;r die D-Jugend'
    badge='D-Jugend &#183; 12&#8211;13 Jahre'
    lead='Die D-Jugend markiert den &#220;bergang zum leistungsorientierten Fu&#223;ball. Taktik, Umschalten und Positionsspiel r&#252;cken ins Zentrum des Trainings.'
    parent_url='/uebungen/alter'; parent_label='Nach Alter'; breadcrumb='D-Jugend'
    h2_1='D-Jugend Training &#8211; worauf kommt es an?'
    body_1='D-Jugend-Spieler k&#246;nnen komplexere Spielprinzipien verstehen und umsetzen: Pressing, Raumaufteilung, Konterspiel. Neben der Technik gewinnt das Stellungsspiel und das Verhalten in der Defensive deutlich an Bedeutung.'
    body_2='Die &#220;bungen decken die wichtigsten Trainingsbereiche der D-Jugend ab. Coaching-Fokuspunkte helfen dir als Trainer, die richtigen Akzente zu setzen und die Entwicklung jedes Spielers gezielt zu f&#246;rdern.'
    h2_2='Alle D-Jugend &#220;bungen'; filter_key='jugend'; filter_value='D-Jugend'
  },
  # ── PHASE ──────────────────────────────────────────────────────────────────
  @{
    file='public\phase\aufwaermen.html'; url='/uebungen/phase/aufwaermen'
    title='Aufw&#228;rm&#252;bungen Fu&#223;ball &#8211; Kinderf&#252;&#223;ball | COACH UNITED'
    meta='Kindgerechte Aufw&#228;rm&#252;bungen f&#252;r das Fu&#223;balltraining. Kostenlose &#220;bungen mit Spielcharakter f&#252;r G-, F-, E- und D-Jugend.'
    h1='Aufw&#228;rm&#252;bungen f&#252;r das Fu&#223;balltraining'
    badge='Trainingsphase &#183; Aufw&#228;rmen'
    lead='Ein gutes Aufw&#228;rmen bereitet K&#246;rper und Kopf auf das Training vor &#8211; und macht gleichzeitig Lust auf mehr. Diese &#220;bungen kombinieren Aufw&#228;rmen mit Bewegungsspa&#223;.'
    parent_url='/uebungen/phase'; parent_label='Nach Phase'; breadcrumb='Aufw&#228;rmen'
    h2_1='Warum ist das Aufw&#228;rmen so wichtig?'
    body_1='Aufw&#228;rmen ist mehr als ein pflichtgem&#228;&#223;es Rumgetrabe. Die richtige Aufw&#228;rmphase erh&#246;ht die Muskeltemperatur, sch&#228;rft die Konzentration und stimmt Kinder mental auf das Training ein. Besonders im Kinderfu&#223;ball sollte das Aufw&#228;rmen spielerisch gestaltet sein &#8211; mit Ball, mit Wettbewerb und mit Erfolgserlebnis.'
    body_2='Die Aufw&#228;rm&#252;bungen auf dieser Seite dauern typischerweise 8&#8211;15 Minuten und eignen sich f&#252;r alle Altersgruppen. Sie lassen sich ohne gro&#223;en Aufwand direkt am Trainingsanfang einsetzen.'
    h2_2='Alle Aufw&#228;rm&#252;bungen'; filter_key='phase'; filter_value='Aufw\u00e4rmen'
  },
  @{
    file='public\phase\hauptteil.html'; url='/uebungen/phase/hauptteil'
    title='Hauptteil-&#220;bungen f&#252;r das Fu&#223;balltraining | COACH UNITED'
    meta='Effektive Hauptteil-&#220;bungen f&#252;r das Fu&#223;balltraining mit Kindern. Technik, Taktik und Spielformen f&#252;r G-, F-, E- und D-Jugend.'
    h1='Hauptteil-&#220;bungen f&#252;r das Fu&#223;balltraining'
    badge='Trainingsphase &#183; Hauptteil'
    lead='Der Hauptteil ist das Herzst&#252;ck jeder Trainingseinheit. Hier wird die Kernkompetenz des Tages trainiert &#8211; mit voller Intensit&#228;t und maximalem Lerneffekt.'
    parent_url='/uebungen/phase'; parent_label='Nach Phase'; breadcrumb='Hauptteil'
    h2_1='Was geh&#246;rt in den Hauptteil?'
    body_1='Im Hauptteil stehen die Lerninhalte des Trainings im Mittelpunkt: Technik&#252;bungen, Spielprinzipien oder taktische Aufgaben. Die Intensit&#228;t ist hoch, die Anforderungen klar, und die Wiederholungen zahlreich. Gute Hauptteil-&#220;bungen fordern heraus, ohne zu &#252;berfordern.'
    body_2='Die &#220;bungen auf dieser Seite sind f&#252;r den Hauptteil des Trainings konzipiert und kombinieren Technik und Spielverst&#228;ndnis in einem strukturierten Rahmen. Alle &#220;bungen haben Coaching-Fokuspunkte, damit du als Trainer wei&#223;t, worauf du achten sollst.'
    h2_2='Alle Hauptteil-&#220;bungen'; filter_key='phase'; filter_value='Hauptteil'
  },
  @{
    file='public\phase\spielformat.html'; url='/uebungen/phase/spielformat'
    title='Spielformen und Spielformate im Kinderfu&#223;ball | COACH UNITED'
    meta='Spielformen und Spielformate f&#252;r das Fu&#223;balltraining mit Kindern. Kleine Spiele und wettkampfnahe &#220;bungen f&#252;r G-, F-, E- und D-Jugend.'
    h1='Spielformen und Spielformate f&#252;r den Kinderfu&#223;ball'
    badge='Trainingsphase &#183; Spielformat'
    lead='Spielformen sind der beste Lernkontext im Fu&#223;ball. Kinder &#252;ben in wettkampfnahen Situationen, m&#252;ssen Entscheidungen treffen und lernen durch das Spiel selbst.'
    parent_url='/uebungen/phase'; parent_label='Nach Phase'; breadcrumb='Spielformat'
    h2_1='Warum sind Spielformen so wertvoll?'
    body_1='Spielformen bringen alle Elemente des echten Spiels zusammen: Technik, Taktik, Entscheidungsfindung und Zweikampf &#8211; alles in einem. Kinder, die viel in Spielformen &#252;ben, entwickeln besseres Spielverst&#228;ndnis als durch isolierte Technik&#252;bungen.'
    body_2='Die Spielformate auf dieser Seite reichen von einfachen 1v1-Situationen bis hin zu kleinen Mannschaftsspielen. Sie eignen sich als Abschluss einer Trainingseinheit oder als spielerischer Hauptteil. Der Aufbau ist bewusst einfach gehalten &#8211; damit du schnell loslegen kannst.'
    h2_2='Alle Spielformate'; filter_key='phase'; filter_value='Spielformat'
  },
  # ── SKILL ──────────────────────────────────────────────────────────────────
  @{
    file='public\skill\ballkontrolle.html'; url='/uebungen/skill/ballkontrolle'
    title='Ballkontrolle trainieren &#8211; &#220;bungen f&#252;r Kinder | COACH UNITED'
    meta='&#220;bungen zur Ballkontrolle im Fu&#223;balltraining. Kostenlose &#220;bungen f&#252;r G-, F-, E- und D-Jugend mit Grafiken und Coaching-Tipps.'
    h1='Ballkontrolle trainieren im Kinderfu&#223;ball'
    badge='Skill &#183; Ballkontrolle'
    lead='Ballkontrolle ist die Grundlage jeder Fu&#223;ballbewegung. Wer den Ball sicher f&#252;hren kann, hat mehr Zeit f&#252;r die n&#228;chste Spielentscheidung.'
    parent_url='/uebungen/skill'; parent_label='Nach Skill'; breadcrumb='Ballkontrolle'
    h2_1='Warum ist Ballkontrolle so wichtig?'
    body_1='Gute Ballkontrolle bedeutet: Der Ball gehorcht dem Spieler &#8211; nicht umgekehrt. Kinder, die den Ball sicher unter Kontrolle haben, k&#246;nnen sich auf das Spiel konzentrieren statt auf den Ball. Im Kinderfu&#223;ball ist Ballkontrolle die wichtigste Grundtechnik &#8211; vor Passen und Torschuss.'
    body_2='Die Ballkontrolle-&#220;bungen auf dieser Seite sind f&#252;r alle Altersgruppen geeignet und reichen von einfachen Dribbelformen bis zu komplexen Kombinations&#252;bungen unter Zeitdruck.'
    h2_2='Alle &#220;bungen zur Ballkontrolle'; filter_key='skill'; filter_value='Ballkontrolle'
  },
  @{
    file='public\skill\dribbeln.html'; url='/uebungen/skill/dribbeln'
    title='Dribbling-&#220;bungen f&#252;r Kinder &#8211; Kinderfu&#223;ball | COACH UNITED'
    meta='Dribbling-&#220;bungen f&#252;r das Fu&#223;balltraining mit Kindern. Kostenlose &#220;bungen f&#252;r G-, F-, E- und D-Jugend mit Grafiken, Aufbau und Coaching-Tipps.'
    h1='Dribbling-&#220;bungen f&#252;r den Kinderfu&#223;ball'
    badge='Skill &#183; Dribbeln'
    lead='Dribbeln ist die K&#246;nigsdisziplin im Kinderfu&#223;ball. Wer fr&#252;h lernt, den Ball zu behaupten und am Gegner vorbeizukommen, legt das Fundament f&#252;r eine starke Entwicklung.'
    parent_url='/uebungen/skill'; parent_label='Nach Skill'; breadcrumb='Dribbeln'
    h2_1='Dribbeln lernen &#8211; wie geht das richtig?'
    body_1='Gutes Dribbeln beginnt mit dem richtigen Ballkontakt &#8211; kurze Ber&#252;hrungen, Ball eng am Fu&#223;, Blick nach vorne. Kinder sollten fr&#252;h lernen, beide F&#252;&#223;e einzusetzen und verschiedene T&#228;uschbewegungen auszuprobieren. Spielerische Wettkampfformen beschleunigen den Lernfortschritt enorm.'
    body_2='Die Dribbling-&#220;bungen decken alle Schwierigkeitsstufen ab: von einfachen Slaloms f&#252;r Bambinis bis zu komplexen 1v1-Situationen f&#252;r die D-Jugend. Alle &#220;bungen haben Varianten, mit denen du die Schwierigkeit schnell anpassen kannst.'
    h2_2='Alle Dribbling-&#220;bungen'; filter_key='skill'; filter_value='Dribbeln'
  },
  @{
    file='public\skill\einwuerfe.html'; url='/uebungen/skill/einwuerfe'
    title='Einwurf-&#220;bungen f&#252;r Kinder &#8211; Fu&#223;balltraining | COACH UNITED'
    meta='Einwurf-&#220;bungen f&#252;r das Fu&#223;balltraining mit Kindern. Kostenlose &#220;bungen zur Technik des Einwurfs f&#252;r G-, F-, E- und D-Jugend.'
    h1='Einwurf-&#220;bungen f&#252;r das Fu&#223;balltraining'
    badge='Skill &#183; Einw&#252;rfe'
    lead='Der Einwurf ist eine oft vernachl&#228;ssigte Technik &#8211; dabei entscheidet ein guter Einwurf h&#228;ufig &#252;ber Ballbesitz und Spielaufbau.'
    parent_url='/uebungen/skill'; parent_label='Nach Skill'; breadcrumb='Einw&#252;rfe'
    h2_1='Einwurf-Technik richtig trainieren'
    body_1='Beim Einwurf gelten klare Regeln: Der Ball muss mit beiden H&#228;nden &#252;ber den Kopf geworfen werden, beide F&#252;&#223;e m&#252;ssen Bodenkontakt haben. Technisch korrekte Einw&#252;rfe wollen ge&#252;bt sein &#8211; besonders bei j&#252;ngeren Spielern.'
    body_2='Die Einwurf-&#220;bungen trainieren sowohl die Wurftechnik als auch das Zusammenspiel nach dem Einwurf &#8211; damit der Ball nicht einfach ins Get&#252;mmel geworfen wird, sondern gezielt beim Mitspieler landet.'
    h2_2='Alle Einwurf-&#220;bungen'; filter_key='skill'; filter_value='Einw\u00fcrfe'
  },
  @{
    file='public\skill\flanken.html'; url='/uebungen/skill/flanken'
    title='Flanken-&#220;bungen f&#252;r Kinder &#8211; Fu&#223;balltraining | COACH UNITED'
    meta='Flanken-&#220;bungen f&#252;r das Fu&#223;balltraining mit Kindern. Kostenlose &#220;bungen zur Flanken-Technik f&#252;r F-, E- und D-Jugend.'
    h1='Flanken-&#220;bungen f&#252;r den Kinderfu&#223;ball'
    badge='Skill &#183; Flanken'
    lead='Flanken sind im Kinderfu&#223;ball ein wichtiger Baustein des Angriffsspiels. Wer pr&#228;zise flanken kann, schafft Torchancen aus weiten Positionen.'
    parent_url='/uebungen/skill'; parent_label='Nach Skill'; breadcrumb='Flanken'
    h2_1='Flanken im Kinderfu&#223;ball trainieren'
    body_1='Eine gute Flanke kombiniert Laufspeed, Ballkontrolle und Schusstechnik in einem. F&#252;r Kinder ist das eine Herausforderung &#8211; deshalb sollte die Flanken-Technik fr&#252;h und spielerisch eingef&#252;hrt werden. Der Fokus liegt zun&#228;chst auf der richtigen Anlauftechnik und dem sauberen Treffpunkt am Ball.'
    body_2='Die Flanken-&#220;bungen eignen sich vor allem f&#252;r F- bis D-Jugend. Sie trainieren das Flanken aus dem Dribbling, aus der &#220;bernahme und nach Zuspiel &#8211; verbunden direkt mit Abschlussaktionen.'
    h2_2='Alle Flanken-&#220;bungen'; filter_key='skill'; filter_value='Flanken'
  },
  @{
    file='public\skill\kommunikation.html'; url='/uebungen/skill/kommunikation'
    title='Kommunikation im Fu&#223;ball trainieren | COACH UNITED'
    meta='&#220;bungen zur Kommunikation im Fu&#223;balltraining. Kostenlose Trainingsformen f&#252;r Absprachen und Teamkommunikation im Kinderfu&#223;ball.'
    h1='Kommunikation im Fu&#223;ball trainieren'
    badge='Skill &#183; Kommunikation'
    lead='Fu&#223;ball ist ein Mannschaftssport &#8211; und Kommunikation ist der Klebstoff, der ein Team zusammenh&#228;lt. Fr&#252;h gelernt, macht Kommunikation den Unterschied auf dem Platz.'
    parent_url='/uebungen/skill'; parent_label='Nach Skill'; breadcrumb='Kommunikation'
    h2_1='Warum ist Kommunikation im Fu&#223;ball so wichtig?'
    body_1='&#8222;Ich hab!&#8220; &#8211; drei Buchstaben, die den Unterschied zwischen einem sicheren Zuspiel und einem verlorenen Ball machen k&#246;nnen. Kinder, die fr&#252;h lernen, sich laut abzusprechen, entwickeln besseres Spielverst&#228;ndnis und st&#228;rkeres Teamgef&#252;hl. Kommunikation ist eine Technik &#8211; und wie jede Technik muss sie trainiert werden.'
    body_2='Die &#220;bungen auf dieser Seite fordern aktiv zur Kommunikation auf: durch Ansagen, Handzeichen oder Absprachen als Teil der &#220;bungsregel. So wird Kommunikation zur Gewohnheit, nicht zur Ausnahme.'
    h2_2='Alle &#220;bungen zur Kommunikation'; filter_key='skill'; filter_value='Kommunikation'
  },
  @{
    file='public\skill\koordination.html'; url='/uebungen/skill/koordination'
    title='Koordinations&#252;bungen f&#252;r Kinder &#8211; Fu&#223;ball | COACH UNITED'
    meta='Koordinations&#252;bungen f&#252;r das Fu&#223;balltraining mit Kindern. Kostenlose &#220;bungen f&#252;r bessere K&#246;rperkontrolle, Reaktion und Motorik.'
    h1='Koordinations&#252;bungen im Kinderfu&#223;ball'
    badge='Skill &#183; Koordination'
    lead='Gute Koordination ist die unsichtbare Grundlage aller Fu&#223;balltechniken. Kinder mit guter K&#246;rperkoordination lernen neue Bewegungen schneller und sicherer.'
    parent_url='/uebungen/skill'; parent_label='Nach Skill'; breadcrumb='Koordination'
    h2_1='Koordination &#8211; die Basis aller Fu&#223;balltechniken'
    body_1='Koordination umfasst alle F&#228;higkeiten, die Bewegungen pr&#228;zise steuern: Gleichgewicht, Rhythmusgef&#252;hl, Reaktionsf&#228;higkeit und r&#228;umliches Wahrnehmungsverm&#246;gen. Im Fu&#223;ball ist besonders die Ball-K&#246;rper-Koordination entscheidend &#8211; das nahtlose Zusammenspiel zwischen Augen, Fu&#223; und Ball.'
    body_2='Die Koordinations&#252;bungen auf dieser Seite eignen sich besonders f&#252;r G- und F-Jugend, k&#246;nnen aber auch in Aufw&#228;rmeinheiten der &#228;lteren Jahrgange eingesetzt werden. Sie sind abwechslungsreich gestaltet und lassen sich schnell in jede Trainingseinheit integrieren.'
    h2_2='Alle Koordinations&#252;bungen'; filter_key='skill'; filter_value='Koordination'
  },
  @{
    file='public\skill\passen.html'; url='/uebungen/skill/passen'
    title='Passen-&#220;bungen f&#252;r Kinder &#8211; Fu&#223;balltraining | COACH UNITED'
    meta='Passen-&#220;bungen f&#252;r das Fu&#223;balltraining mit Kindern. Kostenlose &#220;bungen f&#252;r sicheres Passspiel f&#252;r G-, F-, E- und D-Jugend.'
    h1='Passen-&#220;bungen f&#252;r den Kinderfu&#223;ball'
    badge='Skill &#183; Passen'
    lead='Sicheres Passspiel ist das Herzst&#252;ck des modernen Fu&#223;balls. Kinder, die fr&#252;h lernen, pr&#228;zise zu passen, spielen intelligenter und schaffen mehr Torchancen.'
    parent_url='/uebungen/skill'; parent_label='Nach Skill'; breadcrumb='Passen'
    h2_1='Passen trainieren &#8211; was ist wichtig?'
    body_1='Beim Passen kommt es auf drei Dinge an: die richtige Technik (Innenrist, Au&#223;enrist, Spann), die Dosierung der Kraft und den richtigen Zeitpunkt. Im Kinderfu&#223;ball beginnt Passtraining mit einfachen Dreiecken und kurzen Distanzen &#8211; und wird mit zunehmendem Alter und K&#246;nnen komplexer.'
    body_2='Die Passen-&#220;bungen decken alle Schwierigkeitsstufen ab: von einfachen Zuspiel-&#220;bungen f&#252;r Bambinis bis zu schnellen Kombinationsspielen f&#252;r E- und D-Jugend. Alle &#220;bungen haben klare Coaching-Fokuspunkte zur Passtechnik.'
    h2_2='Alle Passen-&#220;bungen'; filter_key='skill'; filter_value='Passen'
  },
  @{
    file='public\skill\raumverhalten.html'; url='/uebungen/skill/raumverhalten'
    title='Raumverhalten trainieren &#8211; Kinderfu&#223;ball | COACH UNITED'
    meta='&#220;bungen zum Raumverhalten im Fu&#223;balltraining. Kostenlose Trainingsformen f&#252;r Stellungsspiel und Freilaufverhalten bei E- und D-Jugend.'
    h1='Raumverhalten und Stellungsspiel trainieren'
    badge='Skill &#183; Raumverhalten'
    lead='Wer den Raum liest, spielt intelligent. Kinder, die fr&#252;h lernen, sich richtig zu positionieren, haben immer eine gute L&#246;sung auf dem Platz.'
    parent_url='/uebungen/skill'; parent_label='Nach Skill'; breadcrumb='Raumverhalten'
    h2_1='Warum Raumverhalten so fr&#252;h wie m&#246;glich trainieren?'
    body_1='Raumverhalten bedeutet: zur richtigen Zeit am richtigen Ort zu stehen. Kinder m&#252;ssen lernen, R&#228;ume zu erkennen, sich freizulaufen, Dreiecke zu bilden und den Ball laufen zu lassen. Diese F&#228;higkeit ist schwerer zu trainieren als Technik &#8211; aber entscheidend f&#252;r den Sprung in h&#246;here Altersklassen.'
    body_2='Die &#220;bungen zum Raumverhalten setzen ab der E-Jugend an. Sie nutzen Spielformen und positionsspezifische Aufgaben, um Kinder spielerisch f&#252;r Raumaufteilung und Freilaufverhalten zu sensibilisieren.'
    h2_2='Alle &#220;bungen zum Raumverhalten'; filter_key='skill'; filter_value='Raumverhalten'
  },
  @{
    file='public\skill\schnelligkeit.html'; url='/uebungen/skill/schnelligkeit'
    title='Schnelligkeitstraining f&#252;r Kinder &#8211; Fu&#223;ball | COACH UNITED'
    meta='Schnelligkeits&#252;bungen f&#252;r das Fu&#223;balltraining mit Kindern. Kostenlose Sprints, Reaktions&#252;bungen und Tempodribbling f&#252;r alle Altersgruppen.'
    h1='Schnelligkeitstraining im Kinderfu&#223;ball'
    badge='Skill &#183; Schnelligkeit'
    lead='Schnelligkeit im Fu&#223;ball ist mehr als reine Sprintgeschwindigkeit &#8211; es geht um Reaktion, erste Schritte und das schnelle Handeln unter Druck.'
    parent_url='/uebungen/skill'; parent_label='Nach Skill'; breadcrumb='Schnelligkeit'
    h2_1='Was ist Schnelligkeit im Fu&#223;ball?'
    body_1='Fu&#223;ball-Schnelligkeit hat mehrere Dimensionen: Reaktionsschnelligkeit (auf Signale reagieren), Aktionsschnelligkeit (den ersten Schritt machen) und Antizipationsschnelligkeit (die Situation vorhersehen). Beim Training mit Kindern sollten alle drei Formen spielerisch trainiert werden.'
    body_2='Die Schnelligkeits&#252;bungen auf dieser Seite sind f&#252;r alle Altersgruppen geeignet und lassen sich gut als Aufw&#228;rm&#252;bungen oder als Hauptteil&#252;bungen einsetzen. Sie fordern Tempo, Reaktion und Beweglichkeit gleichzeitig.'
    h2_2='Alle Schnelligkeits&#252;bungen'; filter_key='skill'; filter_value='Schnelligkeit'
  },
  @{
    file='public\skill\taktik.html'; url='/uebungen/skill/taktik'
    title='Taktik-&#220;bungen f&#252;r Kinder &#8211; Fu&#223;balltraining | COACH UNITED'
    meta='Taktik-&#220;bungen f&#252;r das Fu&#223;balltraining mit Kindern. Kostenlose Spielformen f&#252;r Pressing, Umschalten und Positionsspiel f&#252;r E- und D-Jugend.'
    h1='Taktik-&#220;bungen f&#252;r den Kinderfu&#223;ball'
    badge='Skill &#183; Taktik'
    lead='Taktik ist kein Erwachsenenthema. Schon Kinder ab der E-Jugend k&#246;nnen einfache Spielprinzipien verstehen und umsetzen &#8211; wenn man sie richtig beibringt.'
    parent_url='/uebungen/skill'; parent_label='Nach Skill'; breadcrumb='Taktik'
    h2_1='Wie erkl&#228;rt man Kindern Taktik?'
    body_1='Kinder lernen Taktik am besten durch Spielen &#8211; nicht durch Erkl&#228;ren. Die beste Taktik-&#220;bung ist eine Spielform, die das gew&#252;nschte Verhalten erzwingt: enge R&#228;ume zwingen zum schnellen Umschalten, &#220;berzahlspiele lehren Freilaufen, Defensivaufgaben schulen Positionsverhalten.'
    body_2='Die Taktik-&#220;bungen setzen ab der E-Jugend an und decken die wichtigsten taktischen Grundbegriffe ab: Pressing, &#220;berzahl ausspielen, Umschalten und Raumaufteilung. Alle &#220;bungen sind als Spielformen aufgebaut, damit der Lerneffekt hoch bleibt.'
    h2_2='Alle Taktik-&#220;bungen'; filter_key='skill'; filter_value='Taktik'
  },
  @{
    file='public\skill\torhueter.html'; url='/uebungen/skill/torhueter'
    title='Torh&#252;ter-&#220;bungen f&#252;r Kinder &#8211; Kinderfu&#223;ball | COACH UNITED'
    meta='Torh&#252;ter-&#220;bungen f&#252;r das Fu&#223;balltraining mit Kindern. Kostenlose &#220;bungen f&#252;r Torh&#252;ter der G-, F-, E- und D-Jugend.'
    h1='Torh&#252;ter-&#220;bungen f&#252;r den Kinderfu&#223;ball'
    badge='Skill &#183; Torh&#252;ter'
    lead='Der Torh&#252;ter ist das Fundament einer Mannschaft. Mit den richtigen &#220;bungen entwickeln auch junge Torh&#252;ter Mut, Technik und Spielverst&#228;ndnis.'
    parent_url='/uebungen/skill'; parent_label='Nach Skill'; breadcrumb='Torh&#252;ter'
    h2_1='Torh&#252;ter-Training im Kinderfu&#223;ball &#8211; was z&#228;hlt?'
    body_1='Torh&#252;ter-Training im Kinderfu&#223;ball bedeutet: Grundtechniken (Abwehrposition, Beinarbeit, Ballannahme) spielerisch einf&#252;hren und viele Abschl&#252;sse auf das Tor inszenieren. Junge Torh&#252;ter brauchen vor allem Mut und Selbstvertrauen &#8211; das entsteht durch Erfolge im Training.'
    body_2='Die Torh&#252;ter-&#220;bungen auf dieser Seite sind in komplette &#220;bungsformen eingebettet, die auch die Feldspieler einbinden. So ist der Torh&#252;ter Teil des Trainings &#8211; nicht isoliert vom Rest der Gruppe.'
    h2_2='Alle Torh&#252;ter-&#220;bungen'; filter_key='skill'; filter_value='Torh\u00fcter'
  },
  @{
    file='public\skill\torschuss.html'; url='/uebungen/skill/torschuss'
    title='Torschuss-&#220;bungen f&#252;r Kinder &#8211; Fu&#223;ball | COACH UNITED'
    meta='Torschuss-&#220;bungen f&#252;r das Fu&#223;balltraining mit Kindern. Kostenlose &#220;bungen f&#252;r Abschluss, Schusstechnik und Torabschluss f&#252;r alle Altersgruppen.'
    h1='Torschuss-&#220;bungen f&#252;r den Kinderfu&#223;ball'
    badge='Skill &#183; Torschuss'
    lead='Tore schie&#223;en macht Spa&#223; &#8211; und das Torschusstraining geh&#246;rt zu den beliebtesten Trainingsinhalten f&#252;r Kinder. Mit den richtigen &#220;bungen lernen sie, effektiv und pr&#228;zise abzuschlie&#223;en.'
    parent_url='/uebungen/skill'; parent_label='Nach Skill'; breadcrumb='Torschuss'
    h2_1='Torschuss-Technik f&#252;r Kinder trainieren'
    body_1='Die h&#228;ufigsten Torschusstechniken im Kinderfu&#223;ball sind Innenrist, Spann und Vollspann. Kinder sollten fr&#252;h alle drei Varianten kennenlernen und in spielerischen &#220;bungsformen anwenden. Besonders wichtig: der Torschuss muss unter Zeitdruck, nach Dribbling oder nach Annahme trainiert werden &#8211; nicht nur aus dem Stand.'
    body_2='Die Torschuss-&#220;bungen kombinieren Schusstechnik mit realistischen Spielsituationen. Sie eignen sich sowohl als Hauptteil-&#220;bungen als auch als abschlussstarke Aufw&#228;rmformen. Alle &#220;bungen haben Coaching-Fokuspunkte zur Abschlusstechnik.'
    h2_2='Alle Torschuss-&#220;bungen'; filter_key='skill'; filter_value='Torschuss'
  },
  @{
    file='public\skill\umschalten.html'; url='/uebungen/skill/umschalten'
    title='Umschalten trainieren &#8211; Kinderfu&#223;ball | COACH UNITED'
    meta='&#220;bungen zum Umschalten im Fu&#223;balltraining. Kostenlose Trainingsformen f&#252;r schnelles Umschalten von Angriff auf Abwehr f&#252;r E- und D-Jugend.'
    h1='Umschalten trainieren im Kinderfu&#223;ball'
    badge='Skill &#183; Umschalten'
    lead='Der Moment, in dem eine Mannschaft vom Angriff in die Abwehr (oder umgekehrt) wechselt, entscheidet oft &#252;ber Sieg oder Niederlage. Schnelles Umschalten muss trainiert werden.'
    parent_url='/uebungen/skill'; parent_label='Nach Skill'; breadcrumb='Umschalten'
    h2_1='Was bedeutet Umschalten im Fu&#223;ball?'
    body_1='Umschalten bezeichnet den Moment direkt nach einem Ballgewinn oder Ballverlust. Im modernen Fu&#223;ball sind diese &#220;bergangsphasen entscheidend: Wer nach einem Ballverlust schnell defensiv steht, l&#228;sst keine Konter zu. Wer nach einem Ballgewinn sofort nach vorne spielt, schafft Torchancen in ungeordneten Situationen.'
    body_2='Die Umschalt-&#220;bungen sind als Spielformen konzipiert, die Ballgewinn und -verlust bewusst erzeugen und direkt trainieren, was danach passiert. Sie eignen sich ab der E-Jugend als Hauptteil-&#220;bung.'
    h2_2='Alle Umschalt-&#220;bungen'; filter_key='skill'; filter_value='Umschalten'
  },
  @{
    file='public\skill\verteidigen.html'; url='/uebungen/skill/verteidigen'
    title='Verteidigen trainieren &#8211; Kinderfu&#223;ball | COACH UNITED'
    meta='Verteidigungs-&#220;bungen f&#252;r das Fu&#223;balltraining mit Kindern. Kostenlose &#220;bungen f&#252;r Zweikampf, Abwehrverhalten und Pressing f&#252;r E- und D-Jugend.'
    h1='Verteidigungs-&#220;bungen f&#252;r den Kinderfu&#223;ball'
    badge='Skill &#183; Verteidigen'
    lead='Verteidigen ist eine Technik &#8211; und eine Einstellung. Kinder, die fr&#252;h defensives Bewusstsein entwickeln, werden zu kompletten Fu&#223;ballern.'
    parent_url='/uebungen/skill'; parent_label='Nach Skill'; breadcrumb='Verteidigen'
    h2_1='Verteidigen im Kinderfu&#223;ball &#8211; warum fr&#252;h anfangen?'
    body_1='Viele Trainer konzentrieren sich auf offensive Elemente &#8211; Dribbling, Torschuss, Passen. Dabei ist defensives Verhalten mindestens genauso wichtig: Wer den Gegner fr&#252;h unter Druck setzt, R&#228;ume schlie&#223;t und Zweik&#228;mpfe gewinnt, hat im Spiel deutliche Vorteile.'
    body_2='Die Verteidigungs-&#220;bungen decken alle wichtigen Defensivbereiche ab: 1v1-Zweik&#228;mpfe, Pressing-Spielformen und Absicherungsverhalten. Sie eignen sich vor allem f&#252;r E- und D-Jugend.'
    h2_2='Alle Verteidigungs-&#220;bungen'; filter_key='skill'; filter_value='Verteidigen'
  },
  @{
    file='public\skill\zweikampf.html'; url='/uebungen/skill/zweikampf'
    title='Zweikampf-&#220;bungen f&#252;r Kinder &#8211; Fu&#223;ball | COACH UNITED'
    meta='Zweikampf-&#220;bungen f&#252;r das Fu&#223;balltraining mit Kindern. Kostenlose &#220;bungen f&#252;r Zweikampftechnik und Ballbehauptung f&#252;r alle Altersgruppen.'
    h1='Zweikampf-&#220;bungen f&#252;r den Kinderfu&#223;ball'
    badge='Skill &#183; Zweikampf'
    lead='Den Zweikampf gewinnen ist eine F&#228;higkeit, die trainiert werden will. Kinder, die gelernt haben, B&#228;lle zu behaupten, haben im Spiel klare Vorteile.'
    parent_url='/uebungen/skill'; parent_label='Nach Skill'; breadcrumb='Zweikampf'
    h2_1='Zweikampf-Training im Kinderfu&#223;ball'
    body_1='Im Kinderfu&#223;ball ist der Zweikampf eine der wichtigsten technischen und mentalen F&#228;higkeiten. Es geht nicht ums brutale Einsteigen &#8211; sondern ums richtige Timing, die K&#246;rperposition und den Willen, den Ball zu holen. Kinder, die Zweik&#228;mpfe gewinnen, haben mehr Ballbesitzzeiten und schaffen mehr Chancen f&#252;r ihr Team.'
    body_2='Die Zweikampf-&#220;bungen reichen von einfachen 1v1-Situationen bis zu Spielformen mit Zweikampf-Fokus. Sie eignen sich f&#252;r alle Altersgruppen und k&#246;nnen als Aufw&#228;rm- oder Hauptteil-&#220;bung eingesetzt werden.'
    h2_2='Alle Zweikampf-&#220;bungen'; filter_key='skill'; filter_value='Zweikampf'
  }
)

# ── Hub Cards ───────────────────────────────────────────────────────────────
$alterCards = @'
      <a href="/uebungen/alter/g-jugend" class="hub-card">
        <span class="hub-card-tag">G-Jugend &#183; Bambini</span>
        <h2 class="hub-card-title">Fu&#223;ball&#252;bungen f&#252;r die G-Jugend</h2>
        <p class="hub-card-desc">Altersgerechte &#220;bungen f&#252;r Bambinis und Einsteiger (5&#8211;7 Jahre) &#8211; spielerisch, ballreich, motivierend.</p>
        <span class="hub-card-cta">Zu den &#220;bungen &#8594;</span>
      </a>
      <a href="/uebungen/alter/f-jugend" class="hub-card">
        <span class="hub-card-tag">F-Jugend</span>
        <h2 class="hub-card-title">Fu&#223;ball&#252;bungen f&#252;r die F-Jugend</h2>
        <p class="hub-card-desc">Grundtechniken festigen und erste Spielprinzipien kennenlernen (8&#8211;9 Jahre).</p>
        <span class="hub-card-cta">Zu den &#220;bungen &#8594;</span>
      </a>
      <a href="/uebungen/alter/e-jugend" class="hub-card">
        <span class="hub-card-tag">E-Jugend</span>
        <h2 class="hub-card-title">Fu&#223;ball&#252;bungen f&#252;r die E-Jugend</h2>
        <p class="hub-card-desc">Spielverst&#228;ndnis, Zweikampf und Positionsspiel in der ersten Meisterschaftsklasse (10&#8211;11 Jahre).</p>
        <span class="hub-card-cta">Zu den &#220;bungen &#8594;</span>
      </a>
      <a href="/uebungen/alter/d-jugend" class="hub-card">
        <span class="hub-card-tag">D-Jugend</span>
        <h2 class="hub-card-title">Fu&#223;ball&#252;bungen f&#252;r die D-Jugend</h2>
        <p class="hub-card-desc">Taktik, Umschalten und Positionsspiel auf dem n&#228;chsten Level (12&#8211;13 Jahre).</p>
        <span class="hub-card-cta">Zu den &#220;bungen &#8594;</span>
      </a>
'@

$skillCards = @'
      <a href="/uebungen/skill/ballkontrolle" class="hub-card"><span class="hub-card-tag">Skill</span><h2 class="hub-card-title">Ballkontrolle</h2><p class="hub-card-desc">Den Ball sicher beherrschen &#8211; die Grundlage aller Fu&#223;balltechniken.</p><span class="hub-card-cta">Zu den &#220;bungen &#8594;</span></a>
      <a href="/uebungen/skill/dribbeln" class="hub-card"><span class="hub-card-tag">Skill</span><h2 class="hub-card-title">Dribbeln</h2><p class="hub-card-desc">Am Gegner vorbeikommen und den Ball behaupten.</p><span class="hub-card-cta">Zu den &#220;bungen &#8594;</span></a>
      <a href="/uebungen/skill/passen" class="hub-card"><span class="hub-card-tag">Skill</span><h2 class="hub-card-title">Passen</h2><p class="hub-card-desc">Pr&#228;zises Passspiel als Herzst&#252;ck des modernen Fu&#223;balls.</p><span class="hub-card-cta">Zu den &#220;bungen &#8594;</span></a>
      <a href="/uebungen/skill/torschuss" class="hub-card"><span class="hub-card-tag">Skill</span><h2 class="hub-card-title">Torschuss</h2><p class="hub-card-desc">Effektiv und pr&#228;zise abschlie&#223;en &#8211; das Highlight jeder Einheit.</p><span class="hub-card-cta">Zu den &#220;bungen &#8594;</span></a>
      <a href="/uebungen/skill/zweikampf" class="hub-card"><span class="hub-card-tag">Skill</span><h2 class="hub-card-title">Zweikampf</h2><p class="hub-card-desc">B&#228;lle behaupten und Duelle gewinnen.</p><span class="hub-card-cta">Zu den &#220;bungen &#8594;</span></a>
      <a href="/uebungen/skill/koordination" class="hub-card"><span class="hub-card-tag">Skill</span><h2 class="hub-card-title">Koordination</h2><p class="hub-card-desc">Die unsichtbare Grundlage aller Bewegungstechniken.</p><span class="hub-card-cta">Zu den &#220;bungen &#8594;</span></a>
      <a href="/uebungen/skill/schnelligkeit" class="hub-card"><span class="hub-card-tag">Skill</span><h2 class="hub-card-title">Schnelligkeit</h2><p class="hub-card-desc">Reaktion, erste Schritte und Tempo unter Druck.</p><span class="hub-card-cta">Zu den &#220;bungen &#8594;</span></a>
      <a href="/uebungen/skill/taktik" class="hub-card"><span class="hub-card-tag">Skill</span><h2 class="hub-card-title">Taktik</h2><p class="hub-card-desc">Spielprinzipien verstehen und im Spiel anwenden.</p><span class="hub-card-cta">Zu den &#220;bungen &#8594;</span></a>
      <a href="/uebungen/skill/raumverhalten" class="hub-card"><span class="hub-card-tag">Skill</span><h2 class="hub-card-title">Raumverhalten</h2><p class="hub-card-desc">Zur richtigen Zeit am richtigen Ort stehen.</p><span class="hub-card-cta">Zu den &#220;bungen &#8594;</span></a>
      <a href="/uebungen/skill/verteidigen" class="hub-card"><span class="hub-card-tag">Skill</span><h2 class="hub-card-title">Verteidigen</h2><p class="hub-card-desc">Defensives Bewusstsein und Zweikampfst&#228;rke aufbauen.</p><span class="hub-card-cta">Zu den &#220;bungen &#8594;</span></a>
      <a href="/uebungen/skill/umschalten" class="hub-card"><span class="hub-card-tag">Skill</span><h2 class="hub-card-title">Umschalten</h2><p class="hub-card-desc">In &#220;bergangsphasen schnell und entschlossen reagieren.</p><span class="hub-card-cta">Zu den &#220;bungen &#8594;</span></a>
      <a href="/uebungen/skill/torhueter" class="hub-card"><span class="hub-card-tag">Skill</span><h2 class="hub-card-title">Torh&#252;ter</h2><p class="hub-card-desc">Das Fundament der Mannschaft gezielt f&#246;rdern.</p><span class="hub-card-cta">Zu den &#220;bungen &#8594;</span></a>
      <a href="/uebungen/skill/flanken" class="hub-card"><span class="hub-card-tag">Skill</span><h2 class="hub-card-title">Flanken</h2><p class="hub-card-desc">Torchancen aus weiten Positionen schaffen.</p><span class="hub-card-cta">Zu den &#220;bungen &#8594;</span></a>
      <a href="/uebungen/skill/kommunikation" class="hub-card"><span class="hub-card-tag">Skill</span><h2 class="hub-card-title">Kommunikation</h2><p class="hub-card-desc">Der Klebstoff, der ein Team zusammenh&#228;lt.</p><span class="hub-card-cta">Zu den &#220;bungen &#8594;</span></a>
      <a href="/uebungen/skill/einwuerfe" class="hub-card"><span class="hub-card-tag">Skill</span><h2 class="hub-card-title">Einw&#252;rfe</h2><p class="hub-card-desc">Einw&#252;rfe als taktisches Mittel im Spielaufbau nutzen.</p><span class="hub-card-cta">Zu den &#220;bungen &#8594;</span></a>
'@

$phaseCards = @'
      <a href="/uebungen/phase/aufwaermen" class="hub-card">
        <span class="hub-card-tag">Phase 1</span>
        <h2 class="hub-card-title">Aufw&#228;rmen</h2>
        <p class="hub-card-desc">K&#246;rper und Kopf auf das Training vorbereiten &#8211; spielerisch und mit viel Ballkontakt.</p>
        <span class="hub-card-cta">Zu den &#220;bungen &#8594;</span>
      </a>
      <a href="/uebungen/phase/hauptteil" class="hub-card">
        <span class="hub-card-tag">Phase 2</span>
        <h2 class="hub-card-title">Hauptteil</h2>
        <p class="hub-card-desc">Das Herzst&#252;ck der Trainingseinheit mit hoher Intensit&#228;t und maximalem Lerneffekt.</p>
        <span class="hub-card-cta">Zu den &#220;bungen &#8594;</span>
      </a>
      <a href="/uebungen/phase/spielformat" class="hub-card">
        <span class="hub-card-tag">Phase 3</span>
        <h2 class="hub-card-title">Spielformat</h2>
        <p class="hub-card-desc">Spielformen und wettkampfnahe Situationen als bester Lernkontext im Fu&#223;ball.</p>
        <span class="hub-card-cta">Zu den &#220;bungen &#8594;</span>
      </a>
'@

$hubPages = @(
  @{
    file='public\uebungen-nach-alter.html'; url='/uebungen/alter'
    title='Fu&#223;ball&#252;bungen nach Alter &#8211; G bis D-Jugend | COACH UNITED'
    meta='Fu&#223;balltraining nach Altersgruppe: Kostenlose &#220;bungen f&#252;r G-Jugend (Bambini), F-Jugend, E-Jugend und D-Jugend.'
    h1='Fu&#223;ball&#252;bungen nach Alter'; breadcrumb='Nach Alter'
    lead='Finde die richtigen &#220;bungen f&#252;r deine Altersgruppe. Alle &#220;bungen sind gezielt auf die motorischen und kognitiven F&#228;higkeiten der jeweiligen Jahrgangsstufe abgestimmt.'
    cards=$alterCards
  },
  @{
    file='public\uebungen-nach-skill.html'; url='/uebungen/skill'
    title='Fu&#223;ball&#252;bungen nach Skill &#8211; Alle Skills | COACH UNITED'
    meta='Fu&#223;balltraining nach Skill: Gezieltes Training f&#252;r Ballkontrolle, Dribbeln, Passen, Torschuss und 11 weitere Skills im Kinderfu&#223;ball.'
    h1='Fu&#223;ball&#252;bungen nach Skill'; breadcrumb='Nach Skill'
    lead='Gezieltes Training f&#252;r jeden Fu&#223;ball-Skill. W&#228;hle einen Skill und finde alle passenden &#220;bungen auf einen Blick.'
    cards=$skillCards
  },
  @{
    file='public\uebungen-nach-phase.html'; url='/uebungen/phase'
    title='Fu&#223;ball&#252;bungen nach Trainingsphase | COACH UNITED'
    meta='Fu&#223;balltraining strukturieren: Aufw&#228;rmen, Hauptteil und Spielformat mit kostenlosen &#220;bungen f&#252;r den Kinderfu&#223;ball.'
    h1='Fu&#223;ball&#252;bungen nach Trainingsphase'; breadcrumb='Nach Phase'
    lead='Struktur und Rhythmus bestimmen gutes Fu&#223;balltraining. Finde hier die richtigen &#220;bungen f&#252;r jede Phase deiner Trainingseinheit.'
    cards=$phaseCards
  }
)

# ── Helpers ─────────────────────────────────────────────────────────────────
function To-Unicode($s) {
  [regex]::Replace($s, '&#(\d+);', { param($m) [string][char][int]$m.Groups[1].Value })
}
# "Ubungen" with U-umlaut built from char code (encoding-safe)
$LD_UE = [string][char]220 + 'bungen'

# ── Generator ───────────────────────────────────────────────────────────────
function Write-Page($path, $content) {
  $fullPath = Join-Path $root $path
  $dir = Split-Path $fullPath
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force $dir | Out-Null }
  [System.IO.File]::WriteAllText($fullPath, $content, [System.Text.Encoding]::UTF8)
  Write-Host "  OK: $path"
}

Write-Host "`nGenerating sub-pages..."
foreach ($p in $subPages) {
  $html = $SUB_TEMPLATE
  $html = $html.Replace('__TITLE__',        $p.title)
  $html = $html.Replace('__META__',         $p.meta)
  $html = $html.Replace('__URL__',          $p.url)
  $html = $html.Replace('__H1__',           $p.h1)
  $html = $html.Replace('__BADGE__',        $p.badge)
  $html = $html.Replace('__LEAD__',         $p.lead)
  $html = $html.Replace('__PARENT_URL__',   $p.parent_url)
  $html = $html.Replace('__PARENT_LABEL__', $p.parent_label)
  $html = $html.Replace('__BREADCRUMB__',   $p.breadcrumb)
  $html = $html.Replace('__H2_1__',         $p.h2_1)
  $html = $html.Replace('__BODY_1__',       $p.body_1)
  $html = $html.Replace('__BODY_2__',       $p.body_2)
  $html = $html.Replace('__H2_2__',         $p.h2_2)
  $html = $html.Replace('__FILTER_KEY__',   $p.filter_key)
  $html = $html.Replace('__FILTER_VALUE__', $p.filter_value)
  $n2 = $p.parent_label
  $n3 = To-Unicode $p.breadcrumb
  $i1 = 'https://coachunited.de/uebungen'
  $i2 = 'https://coachunited.de' + $p.parent_url
  $i3 = 'https://coachunited.de' + $p.url
  $jsonLd = '<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"' + $LD_UE + '","item":"' + $i1 + '"},{"@type":"ListItem","position":2,"name":"' + $n2 + '","item":"' + $i2 + '"},{"@type":"ListItem","position":3,"name":"' + $n3 + '","item":"' + $i3 + '"}]}</script>'
  $html = $html.Replace('__JSON_LD__', $jsonLd)
  Write-Page $p.file $html
}

Write-Host "`nGenerating hub pages..."
foreach ($p in $hubPages) {
  $html = $HUB_TEMPLATE
  $html = $html.Replace('__TITLE__',      $p.title)
  $html = $html.Replace('__META__',       $p.meta)
  $html = $html.Replace('__URL__',        $p.url)
  $html = $html.Replace('__H1__',         $p.h1)
  $html = $html.Replace('__BREADCRUMB__', $p.breadcrumb)
  $html = $html.Replace('__LEAD__',       $p.lead)
  $html = $html.Replace('__HUB_CARDS__',  $p.cards)
  $n2 = $p.breadcrumb
  $i1 = 'https://coachunited.de/uebungen'
  $i2 = 'https://coachunited.de' + $p.url
  $jsonLd = '<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"' + $LD_UE + '","item":"' + $i1 + '"},{"@type":"ListItem","position":2,"name":"' + $n2 + '","item":"' + $i2 + '"}]}</script>'
  $html = $html.Replace('__JSON_LD__', $jsonLd)
  Write-Page $p.file $html
}

Write-Host "`nDone! $($subPages.Count) sub-pages + $($hubPages.Count) hub pages."
