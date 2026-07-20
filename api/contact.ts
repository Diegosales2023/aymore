import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export default async function handler(req: any, res: any) {
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
    const { name, cpf, email, phone, subject, message } = req.body;

    if (!name || !cpf || !email || !phone) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const lead = {
      name,
      cpf,
      email,
      phone,
      subject: subject || "Atendimento Geral",
      message: message || "",
      created_at: new Date().toISOString()
    };

    // Save lead to local backup in /tmp
    const BACKUP_FILE = path.join("/tmp", "leads_backup.json");
    try {
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
      leads.unshift(lead);
      fs.writeFileSync(BACKUP_FILE, JSON.stringify(leads, null, 2), "utf-8");
    } catch (fsErr) {
      console.warn("Vercel Backup: Could not write to /tmp/leads_backup.json", fsErr);
    }

    // Send email dispatch to owner's address (atendimento@centralwebaymore.com)
    const recipient = "atendimento@centralwebaymore.com";
    
    // Create transporter dynamically using SMTP env variables
    const host = process.env.SMTP_HOST || "";
    const port = parseInt(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER || "";
    const pass = process.env.SMTP_PASS || "";
    const from = process.env.SMTP_FROM || "atendimento@centralwebaymore.com";

    let mailSent = false;
    let mailResultMsg = "";

    if (host && user && pass) {
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
        subject: `[Novo Lead - Site] ${lead.subject}`,
        text: `Novo lead recebido no formulário:\n\n` +
              `Nome: ${lead.name}\n` +
              `CPF/CNPJ: ${lead.cpf}\n` +
              `E-mail: ${lead.email}\n` +
              `Telefone: ${lead.phone}\n` +
              `Assunto: ${lead.subject}\n` +
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
                  <td style="padding: 10px; border: 1px solid #e4e4e7; font-weight: bold; color: #ec0000;">${lead.subject}</td>
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
      mailSent = true;
      mailResultMsg = "E-mail enviado com sucesso.";
    } else {
      mailResultMsg = "Simulação: SMTP não configurado no Vercel. Adicione SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS em suas variáveis de ambiente no painel da Vercel.";
    }

    return res.status(200).json({
      success: true,
      savedLocally: false,
      emailStatus: { sent: mailSent, message: mailResultMsg }
    });
  } catch (err: any) {
    console.error("Erro no processamento do lead Vercel:", err);
    return res.status(500).json({ error: err.message || "Erro interno do servidor" });
  }
}
