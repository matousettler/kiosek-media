import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());

  // Proxy API route to avoid CORS issues
  app.get("/api/news", async (req, res) => {
    const apiUrl = "https://smysluplnaskola.cz/api/export/catposts?key=zsln-export-2026-a7f3b9c1d4e8&category=319&limit=4&page=1";
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({ error: "Failed to fetch data from source API" });
    }
  });

  // Proxy for images to avoid CORS/Referer issues
  app.get("/proxy-img", async (req, res) => {
    const url = req.query.url as string;
    if (!url) return res.status(400).send("No URL provided");
    try {
      const response = await fetch(url);
      const buffer = await response.buffer();
      res.set("Content-Type", response.headers.get("Content-Type") || "image/jpeg");
      res.send(buffer);
    } catch (e) {
      res.status(500).send("Failed to fetch image");
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
