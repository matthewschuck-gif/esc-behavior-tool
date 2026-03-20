export default async function handler(req, res) {
  // CORS headers must be set on EVERY response including OPTIONS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight before anything else
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY is not set. Go to Vercel → your project → Settings → Environment Variables and add it, then redeploy.'
    });
  }

  if (!apiKey.startsWith('sk-ant-')) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY looks incorrect — it should start with sk-ant-. Go to Vercel → Settings → Environment Variables to fix it, then redeploy.'
    });
  }

  try {
    const { model, max_tokens, messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request — messages array required.' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model || 'claude-opus-4-6',
        max_tokens: max_tokens || 2000,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = data?.error?.message || `Anthropic returned status ${response.status}`;
      return res.status(response.status).json({ error: msg });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: `Server error: ${err.message}` });
  }
}
