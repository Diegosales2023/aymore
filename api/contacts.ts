import fs from "fs";
import path from "path";

export default function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const BACKUP_FILE = path.join("/tmp", "leads_backup.json");
    let leads = [];
    if (fs.existsSync(BACKUP_FILE)) {
      const fileContent = fs.readFileSync(BACKUP_FILE, "utf-8");
      try {
        leads = JSON.parse(fileContent || "[]");
        if (!Array.isArray(leads)) {
          leads = [];
        }
      } catch (e) {
        leads = [];
      }
    }
    return res.status(200).json({ success: true, count: leads.length, data: leads });
  } catch (err: any) {
    console.error("Erro no processamento do fetch leads Vercel:", err);
    return res.status(500).json({ error: err.message || "Erro interno do servidor" });
  }
}
