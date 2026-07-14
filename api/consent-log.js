const https = require('https');

const WP_HOST = 'archiv.coachunited.de';

function wpCreatePrivatePost(title, content) {
  const auth = Buffer.from(`${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`).toString('base64');
  const body = JSON.stringify({ title, content, status: 'private' });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: WP_HOST,
        path: '/wp-json/wp/v2/posts',
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          if (res.statusCode === 201) resolve();
          else reject(new Error(`WP HTTP ${res.statusCode}: ${raw.slice(0, 300)}`));
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { consentId, categories, timestamp, bannerVersion, page } = req.body || {};

  if (!consentId || !categories || !timestamp) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();

  const record = {
    consentId,
    categories,
    timestamp,
    date: new Date(timestamp).toISOString(),
    bannerVersion,
    page,
    ip,
  };

  const title = `Cookie-Consent ${record.date} ${consentId}`;
  const content = JSON.stringify(record, null, 2);

  try {
    if (process.env.WP_USER && process.env.WP_APP_PASSWORD) {
      await wpCreatePrivatePost(title, content);
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('consent-log: WP write failed', err.message);
    res.status(200).json({ ok: true, logged: false });
  }
};
