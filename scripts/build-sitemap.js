const fs   = require('fs');
const path = require('path');

const exercisesPath = path.join(__dirname, '..', 'public', 'exercises.json');
const einheitenPath = path.join(__dirname, '..', 'public', 'einheiten.json');
const articlesPath  = path.join(__dirname, '..', 'public', 'articles.json');
const outputPath    = path.join(__dirname, '..', 'public', 'sitemap.xml');

// Kein pauschales Build-Datum als lastmod: Wenn bei jedem Deploy alle URLs als
// "heute geaendert" gemeldet werden, stuft Google das Signal als unzuverlaessig
// ein und ignoriert es. Lieber nur dort ein lastmod, wo ein echtes Datum vorliegt.
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const STATIC_PAGES = [
  { loc: '/',                              changefreq: 'daily',   priority: '1.0' },
  { loc: '/uebungen',                      changefreq: 'weekly',  priority: '0.9' },
  { loc: '/einheiten',                     changefreq: 'weekly',  priority: '0.8' },
  { loc: '/wissen',                        changefreq: 'weekly',  priority: '0.7' },
  { loc: '/einheit-generator',             changefreq: 'monthly', priority: '0.7' },
  { loc: '/ueber-uns',                     changefreq: 'monthly', priority: '0.4' },
  { loc: '/umgang-mit-ki',                 changefreq: 'monthly', priority: '0.4' },
  { loc: '/uebung-einreichen',             changefreq: 'monthly', priority: '0.4' },
  { loc: '/whatsapp-info',                 changefreq: 'monthly', priority: '0.4' },
  { loc: '/spenden',                       changefreq: 'monthly', priority: '0.3' },
  // /impressum und /datenschutz stehen bewusst nicht hier: beide tragen
  // <meta name="robots" content="noindex"> – in der Sitemap waeren sie ein Widerspruch.
  { loc: '/uebungen/alter',                changefreq: 'weekly',  priority: '0.8' },
  { loc: '/uebungen/alter/g-jugend',       changefreq: 'weekly',  priority: '0.8' },
  { loc: '/uebungen/alter/f-jugend',       changefreq: 'weekly',  priority: '0.8' },
  { loc: '/uebungen/alter/e-jugend',       changefreq: 'weekly',  priority: '0.8' },
  { loc: '/uebungen/alter/d-jugend',       changefreq: 'weekly',  priority: '0.8' },
  { loc: '/uebungen/phase',                changefreq: 'weekly',  priority: '0.8' },
  { loc: '/uebungen/phase/aufwaermen',     changefreq: 'weekly',  priority: '0.7' },
  { loc: '/uebungen/phase/hauptteil',      changefreq: 'weekly',  priority: '0.7' },
  { loc: '/uebungen/phase/spielformat',    changefreq: 'weekly',  priority: '0.7' },
  { loc: '/uebungen/skill',                changefreq: 'weekly',  priority: '0.8' },
  { loc: '/uebungen/skill/ballkontrolle',  changefreq: 'weekly',  priority: '0.7' },
  { loc: '/uebungen/skill/dribbeln',       changefreq: 'weekly',  priority: '0.7' },
  { loc: '/uebungen/skill/einwuerfe',      changefreq: 'weekly',  priority: '0.7' },
  { loc: '/uebungen/skill/flanken',        changefreq: 'weekly',  priority: '0.7' },
  { loc: '/uebungen/skill/kommunikation',  changefreq: 'weekly',  priority: '0.7' },
  { loc: '/uebungen/skill/koordination',   changefreq: 'weekly',  priority: '0.7' },
  { loc: '/uebungen/skill/passen',         changefreq: 'weekly',  priority: '0.7' },
  { loc: '/uebungen/skill/raumverhalten',  changefreq: 'weekly',  priority: '0.7' },
  { loc: '/uebungen/skill/schnelligkeit',  changefreq: 'weekly',  priority: '0.7' },
  { loc: '/uebungen/skill/taktik',         changefreq: 'weekly',  priority: '0.7' },
  { loc: '/uebungen/skill/torhueter',      changefreq: 'weekly',  priority: '0.7' },
  { loc: '/uebungen/skill/torschuss',      changefreq: 'weekly',  priority: '0.7' },
  { loc: '/uebungen/skill/umschalten',     changefreq: 'weekly',  priority: '0.7' },
  { loc: '/uebungen/skill/verteidigen',    changefreq: 'weekly',  priority: '0.7' },
  { loc: '/uebungen/skill/zweikampf',      changefreq: 'weekly',  priority: '0.7' },
];

function readJson(p) {
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf-8')) : [];
}

function main() {
  const exercises = readJson(exercisesPath).filter(e => e.status === 'veroeffentlicht' && e.url_slug);
  const einheiten = readJson(einheitenPath).filter(e => e.url_slug);
  const articles  = readJson(articlesPath).filter(a => a.status === 'veroeffentlicht' && a.url_slug);

  const entries = [
    ...STATIC_PAGES,
    ...exercises.map(e => ({ loc: `/uebung/${e.url_slug}`, changefreq: 'monthly', priority: '0.6' })),
    ...einheiten.map(e => ({ loc: `/einheit/${e.url_slug}`, changefreq: 'monthly', priority: '0.6' })),
    ...articles.map(a => ({
      loc: `/artikel/${a.url_slug}`,
      changefreq: 'monthly',
      priority: '0.5',
      lastmod: ISO_DATE.test(a.erstellt_am || '') ? a.erstellt_am : null,
    })),
  ];

  const body = entries.map(e => `  <url>
    <loc>https://coachunited.de${e.loc}</loc>${e.lastmod ? `
    <lastmod>${e.lastmod}</lastmod>` : ''}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  fs.writeFileSync(outputPath, xml, 'utf-8');
  console.log(`✓ sitemap.xml generiert: ${entries.length} URLs (${exercises.length} Übungen, ${einheiten.length} Einheiten, ${articles.length} Artikel).`);
}

main();
