import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const PORT = 3000;

// Lazy-loaded Supabase client
let supabaseClient: any = null;

function getSupabase() {
  if (!supabaseClient) {
    const url = process.env.SUPABASE_URL || process.env.SUPASE_URL || "https://kpjkmegvfracwmqftntt.supabase.co";
    const key = process.env.SUPABASE_ANONKEY || process.env.SUPASE_ANONKEY || "sb_secret_ZD_Ayd_vbCks2VutGLNkMw_gl5hrzlA";
    if (!url || !key) {
      throw new Error("Supabase URL and Anon Key are required");
    }
    // Clean the URL if it ends with /rest/v1/ or /rest/v1
    const cleanUrl = url.replace(/\/rest\/v1\/?$/, "");
    supabaseClient = createClient(cleanUrl, key);
  }
  return supabaseClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route to submit lead data to Supabase
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, cpf, email, phone, subject, message } = req.body;

      if (!name || !cpf || !email || !phone) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes" });
      }

      const supabase = getSupabase();
      
      const strategies = [
        // 1. contatos (English)
        async () => {
          return await supabase.from("contatos").insert([{
            name,
            cpf,
            email,
            phone,
            subject: subject || "Atendimento Geral",
            message: message || "",
            created_at: new Date().toISOString()
          }]).select();
        },
        // 2. contatos (Portuguese)
        async () => {
          return await supabase.from("contatos").insert([{
            nome: name,
            cpf,
            email,
            telefone: phone,
            assunto: subject || "Atendimento Geral",
            mensagem: message || "",
            created_at: new Date().toISOString()
          }]).select();
        },
        // 3. contatos (Portuguese minimal)
        async () => {
          return await supabase.from("contatos").insert([{
            nome: name,
            cpf,
            email,
            telefone: phone,
            assunto: subject || "Atendimento Geral",
            mensagem: message || ""
          }]).select();
        },
        // 4. leads (English)
        async () => {
          return await supabase.from("leads").insert([{
            name,
            cpf,
            email,
            phone,
            subject: subject || "Atendimento Geral",
            message: message || "",
            created_at: new Date().toISOString()
          }]).select();
        },
        // 5. leads (Portuguese)
        async () => {
          return await supabase.from("leads").insert([{
            nome: name,
            cpf,
            email,
            telefone: phone,
            assunto: subject || "Atendimento Geral",
            mensagem: message || "",
            created_at: new Date().toISOString()
          }]).select();
        },
        // 6. leads (Portuguese minimal)
        async () => {
          return await supabase.from("leads").insert([{
            nome: name,
            cpf,
            email,
            telefone: phone,
            assunto: subject || "Atendimento Geral",
            mensagem: message || ""
          }]).select();
        }
      ];

      let lastError = null;
      let successData = null;

      for (const strategy of strategies) {
        const { data, error } = await strategy();
        if (!error) {
          successData = data;
          break;
        } else {
          lastError = error;
          console.warn("Estratégia de inserção falhou, tentando próxima...", error.message);
        }
      }

      if (!successData && lastError) {
        console.error("Todas as estratégias de inserção no Supabase falharam:", lastError);
        return res.status(500).json({ 
          error: "Erro ao salvar no banco de dados Supabase. Verifique se a tabela 'contatos' ou 'leads' existe com as colunas adequadas.", 
          details: lastError.message 
        });
      }

      return res.json({ success: true, data: successData });
    } catch (err: any) {
      console.error("Erro no processamento:", err);
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
