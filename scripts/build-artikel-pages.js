const fs   = require('fs');
const path = require('path');

const articlesPath = path.join(__dirname, '..', 'public', 'articles.json');
const templatePath = path.join(__dirname, '..', 'public', 'artikel-detail.html');
const outputDir    = path.join(__dirname, '..', 'public', 'artikel');

if (!fs.existsSync(articlesPath)) {
  console.log('articles.json nicht gefunden – Build übersprungen.');
  process.exit(0);
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function main() {
  const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
  const template = fs.readFileSync(templatePath, 'utf-8');

  const published = articles.filter(a => a.status === 'veroeffentlicht' && a.url_slug);

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  let count = 0;

  for (const article of published) {
    const slug        = article.url_slug;
    const displayTitle = article.titel || 'Artikel';
    const title        = `${displayTitle} – COACH UNITED`;
    const description  = article.seo_meta_description || '';
    const canonical    = `https://coachunited.de/artikel/${slug}`;
    const inhalt       = article.inhalt || '';

    const isFerienkalender = article.url_slug === 'der-fussball-ferienkalender';

    const heroImgStyle = isFerienkalender ? 'display:block; object-position:center 42%;' : 'display:block;';
    const heroImg = article.foto_url
      ? `<img id="hero-img" class="hero-img" src="${esc(article.foto_url)}" alt="${esc(article.foto_alt || displayTitle)}" style="${heroImgStyle}">`
      : `<img id="hero-img" class="hero-img" src="" alt="" style="display:none;">`;

    // Sonder-Layout NUR für den Ferienkalender-Artikel (nicht global im Template)
    let titelBlock = `<h1 id="titel">${esc(displayTitle)}</h1>`;
    let articleInhalt = inhalt;
    if (isFerienkalender) {
      const subMatch = inhalt.match(/^\s*<p>\s*<em>([\s\S]*?)<\/em>\s*<\/p>/);
      const subText = subMatch ? subMatch[1].replace(/<[^>]+>/g, '') : '';
      if (subMatch) articleInhalt = inhalt.slice(subMatch[0].length);

      const downloadBtn = article.pdf_url
        ? `<a id="ferienkalender-download-btn" href="${esc(article.pdf_url)}" target="_blank" rel="noopener" style="flex-shrink:0; background:#1B6BF4; color:#fff; font-size:13px; font-weight:700; padding:10px 16px; border-radius:999px; text-decoration:none; white-space:nowrap; margin-top:4px;">Kostenlos herunterladen</a>`
        : '';

      titelBlock = `<div id="ferienkalender-row" style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap;">`
        + `<h1 id="titel" style="font-size:32px; margin-bottom:4px;">${esc(displayTitle)}</h1>`
        + downloadBtn
        + `</div>`
        + (subText ? `<div id="ferienkalender-sub" style="font-weight:700; color:#0a1628; margin:4px 0 20px; font-size:15px;">${esc(subText)}</div>` : '');
    }

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: displayTitle,
      description,
      keywords: article.seo_keyword || '',
      url: canonical,
      datePublished: article.erstellt_am || '',
      publisher: { '@type': 'Organization', name: 'COACH UNITED', url: 'https://coachunited.de' }
    };
    if (article.foto_url) jsonLd.image = article.foto_url;
    const ldScript = `\n  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;

    const html = template
      .replace('<meta name="description" id="meta-description" content="">', `<meta name="description" id="meta-description" content="${esc(description)}">`)
      .replace('<meta name="keywords" id="meta-keywords" content="">', `<meta name="keywords" id="meta-keywords" content="${esc(article.seo_keyword || '')}">`)
      .replace('<link rel="canonical" id="canonical" href="">', `<link rel="canonical" id="canonical" href="${canonical}">${ldScript}`)
      .replace('<meta property="og:title" id="og-title" content="">', `<meta property="og:title" id="og-title" content="${esc(title)}">`)
      .replace('<meta property="og:description" id="og-description" content="">', `<meta property="og:description" id="og-description" content="${esc(description)}">`)
      .replace('<meta property="og:url" id="og-url" content="">', `<meta property="og:url" id="og-url" content="${canonical}">`)
      .replace('<title>Artikel – COACH UNITED</title>', `<title>${esc(title)}</title>`)
      .replace('<img id="hero-img" class="hero-img" src="" alt="" style="display:none;">', heroImg)
      .replace('<h1 id="titel"></h1>', titelBlock)
      .replace('<div id="article-body" class="article-body"></div>', `<div id="article-body" class="article-body">${articleInhalt}</div>`);

    fs.writeFileSync(path.join(outputDir, `${slug}.html`), html, 'utf-8');
    count++;
  }

  console.log(`✓ ${count} Artikelseiten generiert.`);
}

main();
