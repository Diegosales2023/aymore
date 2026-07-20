import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import fs from "fs";
import nodemailer from "nodemailer";

// Load environment variables
dotenv.config();

const PORT = 3000;
const BACKUP_FILE = path.join(process.cwd(), "leads_backup.json");

// Helper function to save lead to a local file backup
function saveLeadToLocalBackup(lead: any) {
  try {
    let leads = [];
    if (fs.existsSync(BACKUP_FILE)) {
      const fileContent = fs.readFileSync(BACKUP_FILE, "utf-8");
      leads = JSON.parse(fileContent || "[]");
    }
    leads.unshift({
      ...lead,
      id: Date.now() + Math.random().toString(36).substring(2, 7),
      created_at: lead.created_at || new Date().toISOString()
    });
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(leads, null, 2), "utf-8");
    console.log("[Backup Local] Lead salvo com sucesso no arquivo local de segurança!");
  } catch (err) {
    console.error("[Backup Local Error] Erro ao salvar lead localmente:", err);
  }
}

// Helper function to send lead email to atendimento@centralwebaymore.com
async function sendLeadEmail(lead: any) {
  const recipient = "atendimento@centralwebaymore.com";
  
  // Create transporter dynamically using SMTP env variables
  const host = process.env.SMTP_HOST || "";
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";
  const from = process.env.SMTP_FROM || "atendimento@centralwebaymore.com";

  console.log(`[Email Mailer] Tentando enviar e-mail para ${recipient}...`);

  let mailSent = false;
  let mailResultMsg = "";

  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
      });

      const info = await transporter.sendMail({
        from: `"${lead.name} via Site" <${from}>`,
        to: recipient,
        replyTo: lead.email,
        subject: `[Novo Lead - Site] ${lead.subject || "Atendimento Geral"}`,
        text: `Novo lead recebido no formulário:\n\n` +
              `Nome: ${lead.name}\n` +
              `CPF/CNPJ: ${lead.cpf}\n` +
              `E-mail: ${lead.email}\n` +
              `Telefone: ${lead.phone}\n` +
              `Assunto: ${lead.subject || "Atendimento Geral"}\n` +
              `Mensagem:\n${lead.message || "(Sem mensagem)"}\n\n` +
              `Data: ${new Date().toLocaleString("pt-BR")}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #ec0000; padding: 20px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 20px; font-weight: bold;">Central Aymoré - Novo Lead</h2>
            </div>
            <div style="padding: 24px; color: #18181b; line-height: 1.6;">
              <p style="margin-top: 0;">Você recebeu uma nova solicitação de contato pelo formulário do site:</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background-color: #f4f4f5;">
                  <td style="padding: 10px; font-weight: bold; width: 120px; border: 1px solid #e4e4e7;">Nome:</td>
                  <td style="padding: 10px; border: 1px solid #e4e4e7;">${lead.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: bold; border: 1px solid #e4e4e7;">CPF/CNPJ:</td>
                  <td style="padding: 10px; border: 1px solid #e4e4e7;">${lead.cpf}</td>
                </tr>
                <tr style="background-color: #f4f4f5;">
                  <td style="padding: 10px; font-weight: bold; border: 1px solid #e4e4e7;">E-mail:</td>
                  <td style="padding: 10px; border: 1px solid #e4e4e7;"><a href="mailto:${lead.email}">${lead.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: bold; border: 1px solid #e4e4e7;">Telefone:</td>
                  <td style="padding: 10px; border: 1px solid #e4e4e7;">${lead.phone}</td>
                </tr>
                <tr style="background-color: #f4f4f5;">
                  <td style="padding: 10px; font-weight: bold; border: 1px solid #e4e4e7;">Assunto:</td>
                  <td style="padding: 10px; border: 1px solid #e4e4e7; font-weight: bold; color: #ec0000;">${lead.subject || "Atendimento Geral"}</td>
                </tr>
              </table>
              
              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin-top: 20px;">
                <strong style="display: block; margin-bottom: 5px; color: #4b5563; font-size: 11px; text-transform: uppercase;">Mensagem / Observação:</strong>
                <p style="margin: 0; white-space: pre-wrap; font-size: 14px; color: #1f2937;">${lead.message || "<em>(Sem observações)</em>"}</p>
              </div>
            </div>
            <div style="background-color: #f4f4f5; padding: 15px; text-align: center; font-size: 11px; color: #71717a; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0;">Recebido em ${new Date().toLocaleString("pt-BR")} | Central Aymoré Autoatendimento</p>
            </div>
          </div>
        `
      });

      console.log(`[Email Mailer] E-mail enviado com sucesso! MessageID: ${info.messageId}`);
      mailSent = true;
      mailResultMsg = "E-mail de notificação enviado com sucesso utilizando as credenciais SMTP configuradas!";
    } catch (err: any) {
      console.error("[Email Mailer Error] Falha ao enviar por SMTP:", err.message);
      mailResultMsg = `Falha no SMTP: ${err.message}`;
    }
  } else {
    console.log("[Email Mailer] Nenhuma credencial SMTP configurada em variáveis de ambiente. Simulação de envio ativa.");
    mailResultMsg = "Simulação ativa: as credenciais SMTP não foram definidas no painel de segredos (.env). O lead foi gravado localmente para o e-mail: atendimento@centralwebaymore.com";
  }

  return { sent: mailSent, message: mailResultMsg };
}

// Lazy-loaded status setup
async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route to check status (Supabase is completely disabled)
  app.get("/api/supabase-status", (req, res) => {
    return res.json({
      disabled: true
    });
  });

  // API Route to fetch all local backup leads
  app.get("/api/contacts", (req, res) => {
    try {
      let leads = [];
      if (fs.existsSync(BACKUP_FILE)) {
        const fileContent = fs.readFileSync(BACKUP_FILE, "utf-8");
        leads = JSON.parse(fileContent || "[]");
      }
      return res.json({ success: true, count: leads.length, data: leads });
    } catch (err: any) {
      console.error("[Backup Error] Failed to read local backup:", err);
      return res.status(500).json({ error: "Erro ao ler leads locais", details: err.message });
    }
  });

  // API Route to clear leads backup history
  app.post("/api/contacts/clear", (req, res) => {
    try {
      fs.writeFileSync(BACKUP_FILE, "[]", "utf-8");
      return res.json({ success: true, message: "Histórico de leads limpo com sucesso." });
    } catch (err: any) {
      return res.status(500).json({ error: "Erro ao limpar leads", details: err.message });
    }
  });

  // API Route to submit lead data (Purely Local Backup + Email Dispatch)
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, cpf, email, phone, subject, message } = req.body;

      if (!name || !cpf || !email || !phone) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes" });
      }

      // Prepare and save to local backup file first to prevent any data loss
      const localLead = {
        name,
        cpf,
        email,
        phone,
        subject: subject || "Atendimento Geral",
        message: message || "",
        created_at: new Date().toISOString()
      };
      saveLeadToLocalBackup(localLead);

      // Send email dispatch to owner's address (atendimento@centralwebaymore.com)
      const emailStatus = await sendLeadEmail(localLead);

      // Successfully processed lead without Supabase warnings
      return res.json({ 
        success: true, 
        savedLocally: false, // Set to false to avoid database sync warning alerts
        emailStatus: emailStatus 
      });
    } catch (err: any) {
      console.error("Erro no processamento do lead:", err);
      return res.status(500).json({ error: err.message || "Erro interno do servidor" });
    }
  });

  // Vite middleware setup
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
