import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import fs from "fs";
import nodemailer from "nodemailer";

// Load environment variables
dotenv.config();

const PORT = 3000;
let BACKUP_FILE = path.join(process.cwd(), "leads_backup.json");

// Ensure the backup file is writable, otherwise fallback to /tmp
try {
  fs.writeFileSync(BACKUP_FILE, "", { flag: "a" });
} catch (e) {
  console.warn("[Backup Local] Diretório atual não é gravável, alterando o backup para /tmp/leads_backup.json");
  BACKUP_FILE = path.join("/tmp", "leads_backup.json");
}

// Helper function to save lead to a local file backup
function saveLeadToLocalBackup(lead: any) {
  try {
    let leads = [];
    if (fs.existsSync(BACKUP_FILE)) {
      const fileContent = fs.readFileSync(BACKUP_FILE, "utf-8");
      try {
        leads = JSON.parse(fileContent || "[]");
        if (!Array.isArray(leads)) {
          leads = [];
        }
      } catch (parseErr) {
        console.warn("[Backup Local] Arquivo de backup inválido, resetando...", parseErr);
        leads = [];
      }
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

  // Enable CORS for external domains (e.g. Vercel custom domains)
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

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
        try {
          leads = JSON.parse(fileContent || "[]");
          if (!Array.isArray(leads)) {
            leads = [];
          }
        } catch (e) {
          leads = [];
        }
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

  // Explicit SEO routes for sitemap.xml and robots.txt
  app.get("/sitemap.xml", (req, res) => {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
    if (fs.existsSync(sitemapPath)) {
      return res.sendFile(sitemapPath);
    }
    const distSitemap = path.join(process.cwd(), "dist", "sitemap.xml");
    if (fs.existsSync(distSitemap)) {
      return res.sendFile(distSitemap);
    }
    return res.status(404).send("<error>Sitemap not found</error>");
  });

  app.get("/robots.txt", (req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    const robotsPath = path.join(process.cwd(), "public", "robots.txt");
    if (fs.existsSync(robotsPath)) {
      return res.sendFile(robotsPath);
    }
    const distRobots = path.join(process.cwd(), "dist", "robots.txt");
    if (fs.existsSync(distRobots)) {
      return res.sendFile(distRobots);
    }
    return res.status(404).send("User-agent: *\nAllow: /\nSitemap: https://aymorefinceweb.com/sitemap.xml");
  });

  const seoRouteMap: Record<string, { title: string; desc: string }> = {
    "/": {
      title: "Central Aymoré | 2ª Via de Boleto, Quitação e Autoatendimento",
      desc: "Portal oficial de autoatendimento Central Aymoré. Emita 2ª via de boleto, solicite quitação de contrato com desconto e consulte seus financiamentos pelo CPF."
    },
    "/vite": {
      title: "Central Aymoré | 2ª Via de Boleto, Quitação e Autoatendimento",
      desc: "Portal oficial de autoatendimento Central Aymoré. Emita 2ª via de boleto, solicite quitação de contrato com desconto e consulte seus financiamentos pelo CPF."
    },
    "/2via": {
      title: "2ª Via de Boleto Aymoré Financiamentos | Emitir por CPF/CNPJ",
      desc: "Emita rapidamente a 2ª via do seu boleto ou código PIX de financiamento de veículo Aymoré. Atualize parcelas vencidas de forma segura."
    },
    "/quitacao": {
      title: "Quitação de Contrato Aymoré | Desconto em Amortização",
      desc: "Solicite a quitação antecipada do seu financiamento Aymoré com descontos exclusivos nos juros pelo CDC. Calcule e gere a proposta online."
    },
    "/solicitar-acordo": {
      title: "Solicitar Acordo Financeiro | Central Aymoré Dívidas e Quitação",
      desc: "Solicite um acordo oficial para regularizar seu contrato Aymoré com redução de encargos e juros. Proposta rápida e segura."
    },
    "/simular-parcelamento": {
      title: "Simular Parcelamento de Dívida | Calculadora Aymoré Financiamentos",
      desc: "Simule o parcelamento do seu contrato ou faturas Aymoré. Escolha o número de parcelas, simule valores e renegocie online."
    },
    "/simulador": {
      title: "Simulador de Financiamento e Parcelamento | Central Aymoré",
      desc: "Simule parcelas de financiamento de veículos e renegociação de dívidas com taxas transparentes Santander Aymoré. Simulação rápida online."
    },
    "/renegociacao-online": {
      title: "Renegociação Online Aymoré | Descontos Especiais em Contratos",
      desc: "Renegocie seu contrato de financiamento de veículo Aymoré online. Descontos exclusivos em parcelas em atraso com aprovação imediata."
    },
    "/parcelamento": {
      title: "Parcelamento e Renegociação de Dívida | Central Aymoré",
      desc: "Renegocie faturas em atraso e parcelas do financiamento Aymoré. Planos flexíveis em até 36x para regularizar seu contrato."
    },
    "/antecipacao": {
      title: "Antecipação de Parcelas | Economize Juros na Central Aymoré",
      desc: "Antecipe parcelas futuras do seu financiamento de veículo Aymoré e ganhe desconto proporcional de juros na hora."
    },
    "/perguntas-frequentes": {
      title: "Perguntas Frequentes & Dúvidas | Central Aymoré Autoatendimento",
      desc: "Tire suas dúvidas sobre 2ª via de boleto, quitação antecipada, pagamento via PIX, baixa de gravame e renegociação Aymoré."
    },
    "/faq": {
      title: "Perguntas Frequentes & Dúvidas | Central Aymoré Autoatendimento",
      desc: "Tire suas dúvidas sobre 2ª via de boleto, quitação antecipada, pagamento via PIX, baixa de gravame e renegociação Aymoré."
    },
    "/contato": {
      title: "Canais de Atendimento e Contato | Central Aymoré Financiamentos",
      desc: "Entre em contato com a Central Aymoré. WhatsApp oficial, SAC 0800 704 9090, Ouvidoria 0800 726 0322 e formulário de atendimento online."
    },
    "/sobre-nos": {
      title: "Sobre Nós | Central Aymoré Autoatendimento Oficial",
      desc: "Conheça a Central Aymoré de autoatendimento. Agilidade, transparência e segurança na gestão de contratos de financiamento de veículos."
    },
    "/servicos": {
      title: "Serviços Financeiros | Simulador e Soluções Central Aymoré",
      desc: "Confira todos os serviços de autoatendimento: simulação de financiamento, quitação, antecipação e 2ª via de boleto Aymoré."
    },
    "/politica-de-privacidade": {
      title: "Política de Privacidade e Proteção de Dados LGPD | Central Aymoré",
      desc: "Conheça nossa Política de Privacidade em conformidade com a LGPD. Saiba como seus dados pessoais são protegidos com segurança e sigilo bancário."
    },
    "/politica-privacidade": {
      title: "Política de Privacidade e Proteção de Dados LGPD | Central Aymoré",
      desc: "Conheça nossa Política de Privacidade em conformidade com a LGPD. Saiba como seus dados pessoais são protegidos com segurança e sigilo bancário."
    },
    "/termos-de-uso": {
      title: "Termos de Uso do Portal | Central Aymoré Autoatendimento",
      desc: "Termos e condições gerais de uso do portal de autoatendimento Central Aymoré. Normas de utilização, segurança e diretrizes contratuais."
    },
    "/termos": {
      title: "Termos de Uso do Portal | Central Aymoré Autoatendimento",
      desc: "Termos e condições gerais de uso do portal de autoatendimento Central Aymoré. Normas de utilização, segurança e diretrizes contratuais."
    }
  };

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { index: false }));
    app.get("*", (req, res) => {
      const htmlPath = path.join(distPath, "index.html");
      if (fs.existsSync(htmlPath)) {
        let html = fs.readFileSync(htmlPath, "utf-8");
        const cleanPath = req.path === "/" ? "/" : req.path.replace(/\/+$/, "");
        const seo = seoRouteMap[cleanPath] || seoRouteMap["/"];
        const host = req.headers.host || "aymorefinceweb.com";
        const proto = (req.headers["x-forwarded-proto"] as string) || "https";
        const canonicalUrl = `${proto}://${host}${cleanPath}`;

        html = html.replace(/<title>.*?<\/title>/gi, `<title>${seo.title}</title>`);
        html = html.replace(/<meta name="description" content=".*?"\s*\/?>/gi, `<meta name="description" content="${seo.desc}" />`);
        html = html.replace(/<link rel="canonical" href=".*?"\s*\/?>/gi, `<link rel="canonical" href="${canonicalUrl}" />`);
        html = html.replace(/<meta property="og:url" content=".*?"\s*\/?>/gi, `<meta property="og:url" content="${canonicalUrl}" />`);
        html = html.replace(/<meta property="og:title" content=".*?"\s*\/?>/gi, `<meta property="og:title" content="${seo.title}" />`);
        html = html.replace(/<meta property="og:description" content=".*?"\s*\/?>/gi, `<meta property="og:description" content="${seo.desc}" />`);
        html = html.replace(/<meta name="twitter:url" content=".*?"\s*\/?>/gi, `<meta name="twitter:url" content="${canonicalUrl}" />`);
        html = html.replace(/<meta name="twitter:title" content=".*?"\s*\/?>/gi, `<meta name="twitter:title" content="${seo.title}" />`);
        html = html.replace(/<meta name="twitter:description" content=".*?"\s*\/?>/gi, `<meta name="twitter:description" content="${seo.desc}" />`);

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.send(html);
      }
      return res.sendFile(htmlPath);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
