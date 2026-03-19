export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return res.status(500).json({ error: 'KV not configured' });

  try {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ error: 'key required' });

    // Get existing overrides, merge in the new one
    const getRes = await fetch(`${url}/get/strategy_overrides`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const getData = await getRes.json();
    const overrides = getData.result ? JSON.parse(getData.result) : {};

    if (value === null) {
      delete overrides[key];
    } else {
      overrides[key] = value;
    }

    await fetch(`${url}/set/strategy_overrides`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: JSON.stringify(overrides) })
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
