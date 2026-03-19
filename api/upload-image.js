export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-filename');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return res.status(500).json({ error: 'Blob storage not configured. Add BLOB_READ_WRITE_TOKEN in Vercel environment variables.' });

  try {
    const filename = req.headers['x-filename'] || 'upload.png';
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);

    const blobRes = await fetch(`https://blob.vercel-storage.com/${encodeURIComponent(filename)}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': req.headers['content-type'] || 'image/png',
        'x-content-type': req.headers['content-type'] || 'image/png',
      },
      body,
    });

    if (!blobRes.ok) {
      const err = await blobRes.text();
      return res.status(blobRes.status).json({ error: err });
    }

    const data = await blobRes.json();
    return res.status(200).json({ url: data.url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
