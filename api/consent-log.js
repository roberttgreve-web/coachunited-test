const https = require('https');

function redisCommand(command) {
  const restUrl = new URL(process.env.UPSTASH_REDIS_REST_URL);
  const body = JSON.stringify(command);

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: restUrl.hostname,
        path: restUrl.pathname || '/',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          if (res.statusCode === 200) resolve();
          else reject(new Error(`Redis HTTP ${res.statusCode}: ${raw.slice(0, 300)}`));
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

  const content = JSON.stringify(record);

  try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      await redisCommand(['RPUSH', 'consent_log', content]);
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('consent-log: Redis write failed', err.message);
    res.status(200).json({ ok: true, logged: false });
  }
};
