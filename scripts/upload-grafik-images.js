const fs   = require('fs');
const path = require('path');

const grafikDir = path.join(__dirname, '..', 'public', 'images', 'uebungen');

function saveLocally(buffer, filename) {
  if (!fs.existsSync(grafikDir)) fs.mkdirSync(grafikDir, { recursive: true });
  fs.writeFileSync(path.join(grafikDir, filename), buffer);
  return `https://coachunited.de/images/uebungen/${filename}`;
}

async function main() {
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

    process.stdout.write(`  Speichere ${filename} ... `);
    try {
      const url = saveLocally(buffer, filename);
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
