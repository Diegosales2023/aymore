import type { IncomingMessage, ServerResponse } from "http";
import fs from "fs";
import path from "path";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400, stale-while-revalidate");

  try {
    const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
    if (fs.existsSync(sitemapPath)) {
      const xml = fs.readFileSync(sitemapPath, "utf-8");
      res.statusCode = 200;
      return res.end(xml);
    }
  } catch (err) {
    console.error("Error reading sitemap.xml:", err);
  }

  // Fallback XML
  const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://centralwebaymore.com/</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://centralwebaymore.com/2via</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://centralwebaymore.com/quitacao</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://centralwebaymore.com/antecipacao</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://centralwebaymore.com/solicitar-acordo</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://centralwebaymore.com/simular-parcelamento</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://centralwebaymore.com/renegociacao-online</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

  res.statusCode = 200;
  return res.end(fallbackXml);
}

