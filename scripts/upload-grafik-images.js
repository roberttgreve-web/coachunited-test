const fs   = require('fs');
const path = require('path');
const https = require('https');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('Fehler: .env nicht gefunden. Bitte im Projekt-Root anlegen.');
    process.exit(1);
  }
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const eq = line.indexOf('=');
    if (eq > 0) {
      const key = line.slice(0, eq).trim();
      const val = line.slice(eq + 1).trim();
      if (key) process.env[key] = val;
    }
  }
}

function uploadToWordPress(buffer, mimeType, filename) {
  const auth = Buffer.from(
    `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
  ).toString('base64');

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'archiv.coachunited.de',
        path: '/wp-json/wp/v2/media',
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': mimeType,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': buffer.length,
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          try {
            const json = JSON.parse(raw);
            if (res.statusCode === 201) {
              resolve(json.source_url);
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${json.message || raw.slice(0, 200)}`));
            }
          } catch {
            reject(new Error(`Parse-Fehler: ${raw.slice(0, 200)}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(buffer);
    req.end();
  });
}

async function main() {
  loadEnv();

  const exercisesPath = path.join(__dirname, '..', 'public', 'exercises.json');
  const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf-8'));

  const toUpload = exercises.filter(
    (ex) => ex.grafik_url && ex.grafik_url.startsWith('data:')
  );

  if (toUpload.length === 0) {
    console.log('Keine base64-Bilder gefunden — alles OK.');
    return;
  }

  console.log(`${toUpload.length} Übung(en) mit base64-Grafik gefunden:\n`);

  let updated = 0;

  for (const ex of toUpload) {
    const match = ex.grafik_url.match(/^data:([^;]+);base64,(.+)$/s);
    if (!match) {
      console.warn(`  ⚠ ID ${ex.id} (${ex.url_slug}): Ungültige data URI, übersprungen.`);
      continue;
    }

    const mimeType = match[1];
    const ext      = mimeType.split('/')[1] || 'png';
    const filename = `uebung-${String(ex.id).padStart(3, '0')}-${ex.url_slug || 'grafik'}.${ext}`;
    const buffer   = Buffer.from(match[2], 'base64');

    process.stdout.write(`  Uploading ${filename} ... `);
    try {
      const url = await uploadToWordPress(buffer, mimeType, filename);
      console.log(`✓\n    → ${url}`);
      ex.grafik_url = url;
      updated++;
    } catch (err) {
      console.error(`✗\n    Fehler: ${err.message}`);
    }
  }

  if (updated > 0) {
    fs.writeFileSync(exercisesPath, JSON.stringify(exercises, null, 2), 'utf-8');
    console.log(`\n✓ ${updated} Übung(en) aktualisiert — exercises.json gespeichert.`);
    console.log('→ Nächster Schritt: git add + commit + push');
  }
}

main().catch((err) => {
  console.error('Fehler:', err.message);
  process.exit(1);
});
