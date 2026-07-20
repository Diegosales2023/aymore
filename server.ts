import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

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

  // API Route to submit lead data to Supabase
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

      const supabase = getSupabase();
      
      const tableNames = ["contatos", "leads", "contato", "lead", "clientes", "leads_site", "contatos_site"];
      
      let existingTableError: any = null;
      let preferredTableError: any = null;
      let lastError: any = null;
      let successData = null;
      let usedTable = "";

      // Helper function to check if a table is missing/not found
      const isTableNotFoundError = (error: any): boolean => {
        if (!error) return false;
        const msg = (error.message || "").toLowerCase();
        const code = error.code || "";
        
        return (
          code === "42P01" ||
          code === "PGRST116" ||
          msg.includes("does not exist") ||
          msg.includes("schema cache") ||
          msg.includes("could not find") ||
          msg.includes("relation")
        );
      };

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

        let tableExists = false;

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
            
            // Check if this is a table not found error
            if (isTableNotFoundError(error)) {
              lastError = error;
              if (tableName === "contatos") {
                preferredTableError = error;
              }
              // Table doesn't exist, skip to the next table/payload
              break;
            }

            // If we are here, it means the table exists! (it returned RLS, unique constraint, or column errors)
            tableExists = true;

            // Check for RLS policy violation (code 42501)
            if (errCode === "42501" || errMsg.toLowerCase().includes("row-level security") || errMsg.toLowerCase().includes("rls")) {
              existingTableError = {
                message: `Acesso negado por políticas de segurança (RLS) no Supabase na tabela '${tableName}'.`,
                code: errCode,
                hint: `A tabela '${tableName}' existe no seu Supabase, mas o RLS está bloqueando a inserção anônima. Para resolver isso e permitir gravações, acesse o painel do seu Supabase, clique em "SQL Editor" (no menu lateral esquerdo), abra uma nova query, cole o comando abaixo e clique em RUN:\n\nALTER TABLE public.${tableName} DISABLE ROW LEVEL SECURITY;`
              };
              lastError = existingTableError;
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
                existingTableError = error;
                lastError = error;
                break;
              }
              continue;
            } else {
              // It's some other database error (e.g., constraints), store and stop this payload try
              existingTableError = error;
              lastError = error;
              break;
            }
          }

          if (successData) break;
        }

        // If the table exists but failed (e.g., due to RLS), we stop the search here so we don't report confusing errors from subsequent non-existent tables!
        if (successData || tableExists) break;
      }

      if (!successData) {
        const finalError = existingTableError || preferredTableError || lastError;
        console.error("Todas as estratégias de inserção no Supabase falharam, usando fallback local:", finalError);
        
        let customMessage = "Erro ao salvar no banco de dados Supabase.";
        let customHint = "";

        if (finalError) {
          const errMsg = (finalError.message || "").toLowerCase();
          const errCode = finalError.code || "";
          
          if (errMsg.includes("schema cache") || errMsg.includes("could not find the table")) {
            customMessage = `A tabela 'contatos' não foi encontrada no cache de esquemas do seu Supabase.`;
            customHint = `Para resolver isso e fazer o Supabase reconhecer a tabela imediatamente:\n\n1. Acesse o painel do seu Supabase.\n2. Vá em "SQL Editor" (no menu lateral esquerdo).\n3. Crie uma "New Query", cole o comando abaixo e clique em RUN:\n\nNOTIFY pgrst, 'reload schema';\n\nIsso força a API do Supabase a atualizar e reconhecer as tabelas novas na hora! Se você ainda não criou a tabela, use o botão "Configuração SQL" no topo direito deste modal para copiar o script completo de criação.`;
          } else if ((errMsg.includes("relation") && errMsg.includes("does not exist")) || errCode === "42P01") {
            customMessage = `A tabela 'contatos' não foi encontrada no seu Supabase.`;
            customHint = `Crie a tabela no seu painel do Supabase. Para fazer isso de forma simples:\n\n1. Clique no botão "Configuração SQL" no topo direito deste modal e copie o código.\n2. Acesse o painel do seu Supabase > "SQL Editor" > cole o código e clique em RUN.\n3. Isso criará a tabela e desativará as restrições de segurança (RLS) para permitir envios do formulário.`;
          } else if (errMsg.includes("row-level security") || errMsg.includes("rls") || errCode === "42501") {
            customMessage = `Acesso negado por políticas de segurança (RLS) no Supabase.`;
            customHint = `A tabela existe, mas o Supabase bloqueou a inserção pública de dados por segurança. Para resolver isso, acesse o painel do Supabase, abra o "SQL Editor", cole e execute:\n\nALTER TABLE public.contatos DISABLE ROW LEVEL SECURITY;`;
          } else if (finalError.hint) {
            customMessage = finalError.message;
            customHint = finalError.hint;
          } else {
            customMessage = `Erro do banco: ${finalError.message}`;
            customHint = `Verifique se as colunas criadas na tabela 'contatos' têm exatamente os mesmos nomes (id, name, cpf, email, phone, subject, message, created_at) e os tipos corretos.`;
          }
        }

        // Return a successful 200 OK response indicating successful backup save to keep the landing page fully functional!
        return res.json({ 
          success: true, 
          savedLocally: true,
          error: customMessage, 
          details: finalError ? finalError.message : "Erro desconhecido",
          hint: customHint || (finalError ? finalError.hint : undefined)
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
