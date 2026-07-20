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

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const BACKUP_FILE = path.join("/tmp", "leads_backup.json");
    fs.writeFileSync(BACKUP_FILE, "[]", "utf-8");
    return res.status(200).json({ success: true, message: "Histórico de leads limpo com sucesso." });
  } catch (err: any) {
    console.error("Erro ao limpar leads Vercel:", err);
    return res.status(500).json({ error: err.message || "Erro interno do servidor" });
  }
}
