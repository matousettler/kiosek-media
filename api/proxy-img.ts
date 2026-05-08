import fetch from 'node-fetch';

export default async function handler(req, res) {
  const url = req.query.url;
  if (!url) return res.status(400).send("No URL");

  try {
    const response = await fetch(url as string);
    const buffer = await response.buffer();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache na 1 den
    res.send(buffer);
  } catch (e) {
    res.status(500).send("Proxy error");
  }
}
