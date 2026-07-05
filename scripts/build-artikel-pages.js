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

    const heroImg = article.foto_url
      ? `<img id="hero-img" class="hero-img" src="${esc(article.foto_url)}" alt="${esc(article.foto_alt || displayTitle)}" style="display:block;">`
      : `<img id="hero-img" class="hero-img" src="" alt="" style="display:none;">`;

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
      .replace('<h1 id="titel"></h1>', `<h1 id="titel">${esc(displayTitle)}</h1>`)
      .replace('<div id="article-body" class="article-body"></div>', `<div id="article-body" class="article-body">${inhalt}</div>`);

    fs.writeFileSync(path.join(outputDir, `${slug}.html`), html, 'utf-8');
    count++;
  }

  console.log(`✓ ${count} Artikelseiten generiert.`);
}

main();
