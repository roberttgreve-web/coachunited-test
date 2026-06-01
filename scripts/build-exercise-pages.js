const fs = require('fs');
const path = require('path');

const exercisesPath = path.join(__dirname, '..', 'public', 'exercises.json');
const templatePath  = path.join(__dirname, '..', 'public', 'uebung-detail.html');
const outputDir     = path.join(__dirname, '..', 'public', 'uebung');

if (!fs.existsSync(exercisesPath)) {
  console.log('exercises.json nicht gefunden – Build übersprungen.');
  process.exit(0);
}

const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf-8'));
const template  = fs.readFileSync(templatePath, 'utf-8');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const published = exercises.filter(e => e.status === 'veroeffentlicht' && e.url_slug);
let count = 0;

for (const ex of published) {
  const slug        = ex.url_slug;
  const displayTitle = ex.alt_titel || ex.titel || 'Fußballübung';
  const title       = `${displayTitle} | COACH UNITED`;
  const description = ex.seo_meta_description || ex.kurzbeschreibung || '';
  const canonical   = `https://coachunited.de/uebung/${slug}`;

  let faqSchema = '';
  if (Array.isArray(ex.faq) && ex.faq.length > 0) {
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: ex.faq.map(f => ({
        '@type': 'Question',
        name: f.frage,
        acceptedAnswer: { '@type': 'Answer', text: f.antwort }
      }))
    };
    faqSchema = `\n  <script type="application/ld+json">${JSON.stringify(ld)}</script>`;
  }

  const html = template
    .replace(
      '<meta name="description" content="">',
      `<meta name="description" content="${esc(description)}">`
    )
    .replace(
      'content="Fußballübung | COACH UNITED"',
      `content="${esc(title)}"`
    )
    .replace(
      '<meta property="og:description" content="">',
      `<meta property="og:description" content="${esc(description)}">`
    )
    .replace(
      '<meta property="og:url" content="">',
      `<meta property="og:url" content="${canonical}">`
    )
    .replace(
      '<link rel="canonical" href="">',
      `<link rel="canonical" href="${canonical}">${faqSchema}`
    )
    .replace(
      '<title>Fußballübung | COACH UNITED</title>',
      `<title>${esc(title)}</title>`
    );

  fs.writeFileSync(path.join(outputDir, `${slug}.html`), html, 'utf-8');
  count++;
}

console.log(`✓ ${count} Übungsseiten generiert.`);
