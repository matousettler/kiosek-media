import fetch from 'node-fetch';

export default async function handler(req, res) {
  const apiUrl = "https://smysluplnaskola.cz/api/export/catposts?key=zsln-export-2026-a7f3b9c1d4e8&category=319&limit=4&page=1";
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // Povolení CORS pro volání z frontendu
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
