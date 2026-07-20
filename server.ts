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

  // API Route to check Supabase configuration status
  app.get("/api/supabase-status", (req, res) => {
    const url = process.env.SUPABASE_URL || process.env.SUPASE_URL;
    const key = process.env.SUPABASE_ANONKEY || process.env.SUPASE_ANONKEY;
    
    const isConfigured = !!(url && key && url !== "https://kpjkmegvfracwmqftntt.supabase.co" && !key.startsWith("sb_secret_"));
    
    return res.json({
      configured: isConfigured,
      url: url ? `${url.substring(0, 25)}...` : null,
      hasKey: !!key,
      isPlaceholder: !isConfigured
    });
  });

  // API Route to submit lead data to Supabase
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, cpf, email, phone, subject, message } = req.body;

      if (!name || !cpf || !email || !phone) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes" });
      }

      const supabase = getSupabase();
      
      const tableNames = ["contatos", "leads", "contato", "lead", "clientes", "leads_site", "contatos_site"];
      
      let existingTableError: any = null;
      let lastError: any = null;
      let successData = null;
      let usedTable = "";

      // We will try each table name
      for (const tableName of tableNames) {
        // Define Portuguese and English styled payloads
        const payloads = [
          // 1. Portuguese columns payload
          {
            nome: name,
            cpf: cpf,
            email: email,
            telefone: phone,
            assunto: subject || "Atendimento Geral",
            mensagem: message || "",
            created_at: new Date().toISOString()
          },
          // 2. English columns payload
          {
            name: name,
            cpf: cpf,
            email: email,
            phone: phone,
            subject: subject || "Atendimento Geral",
            message: message || "",
            created_at: new Date().toISOString()
          }
        ];

        for (const initialPayload of payloads) {
          let currentPayload = { ...initialPayload };
          let attempts = 0;
          const maxAttempts = 10; // Prevent infinite loops

          while (attempts < maxAttempts) {
            attempts++;
            const { data, error } = await supabase
              .from(tableName)
              .insert([currentPayload])
              .select();

            if (!error) {
              successData = data;
              usedTable = tableName;
              break;
            }

            const errMsg = error.message || "";
            const errCode = error.code || "";
            
            // If the error is NOT that the table doesn't exist, it means the table exists but has some other issue!
            if (errCode !== "42P01" && !errMsg.toLowerCase().includes("does not exist")) {
              if (errCode === "42501" || errMsg.toLowerCase().includes("row-level security") || errMsg.toLowerCase().includes("rls")) {
                existingTableError = {
                  message: `Violação de RLS (Segurança de Linha) na tabela '${tableName}'.`,
                  code: errCode,
                  hint: `A tabela '${tableName}' existe, mas o Supabase bloqueou a inserção de dados por motivos de segurança. Para resolver, acesse o painel do seu Supabase, clique em "SQL Editor" (no menu lateral esquerdo), cole e execute o comando: ALTER TABLE public.${tableName} DISABLE ROW LEVEL SECURITY;`
                };
              } else {
                existingTableError = error;
              }
            }

            // Check for RLS policy violation (code 42501)
            if (errCode === "42501" || errMsg.toLowerCase().includes("row-level security") || errMsg.toLowerCase().includes("rls")) {
              lastError = {
                message: `Violação de RLS (Segurança de Linha). Ative a inserção pública ou desative o RLS para a tabela '${tableName}'.`,
                code: errCode,
                hint: `Execute no SQL Editor: ALTER TABLE public.${tableName} DISABLE ROW LEVEL SECURITY;`
              };
              // This is a policy issue, not a column issue, so don't try to strip columns for this payload.
              break;
            }

            // Detect if the table does not exist
            if (errCode === "42P01" || (errMsg.toLowerCase().includes("does not exist") && errMsg.toLowerCase().includes("relation"))) {
              lastError = error;
              // Table doesn't exist, skip to the next table name
              break;
            }

            // Regex patterns to find which column does not exist
            const match1 = errMsg.match(/column ["'](.+?)["'] of relation/i);
            const match2 = errMsg.match(/column ["'](.+?)["'] does not exist/i);
            const match3 = errMsg.match(/Could not find the column ["']?(\w+)["']?/i);
            const match4 = errMsg.match(/Could not find the property ["']?(\w+)["']?/i);
            const match5 = errMsg.match(/column ["']?(\w+)["']? of/i);

            let missingColumn = null;
            if (match1) missingColumn = match1[1];
            else if (match2) missingColumn = match2[1];
            else if (match3) missingColumn = match3[1];
            else if (match4) missingColumn = match4[1];
            else if (match5) missingColumn = match5[1];

            if (missingColumn && missingColumn in currentPayload) {
              console.log(`[Auto-healing] Table '${tableName}' is missing column '${missingColumn}'. Stripping and retrying...`);
              delete (currentPayload as any)[missingColumn];
              
              // Ensure we still have basic data left to send
              const hasBasicData = ('nome' in currentPayload && currentPayload.nome) || ('name' in currentPayload && currentPayload.name);
              if (!hasBasicData) {
                lastError = error;
                break;
              }
              continue;
            } else {
              // It's some other database error (e.g., constraints), store and stop this payload try
              lastError = error;
              break;
            }
          }

          if (successData) break;
        }

        if (successData) break;
      }

      if (!successData) {
        const finalError = existingTableError || lastError;
        console.error("Todas as estratégias de inserção no Supabase falharam:", finalError);
        
        let customMessage = "Erro ao salvar no banco de dados Supabase.";
        if (finalError && finalError.hint) {
          customMessage = `${finalError.message} Dica: ${finalError.hint}`;
        } else if (finalError && finalError.message) {
          if (finalError.message.includes("relation") && finalError.message.includes("does not exist")) {
            customMessage = `A tabela não foi encontrada no seu Supabase. Crie uma tabela chamada 'contatos' no seu painel.`;
          } else {
            customMessage = `Erro do banco: ${finalError.message}`;
          }
        }

        return res.status(500).json({ 
          error: customMessage, 
          details: finalError ? finalError.message : "Erro desconhecido" 
        });
      }

      console.log(`[Success] Saved to Supabase table '${usedTable}'!`);
      return res.json({ success: true, table: usedTable, data: successData });
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
