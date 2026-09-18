/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from "react";
import { 
  FileText, 
  CheckCircle, 
  CreditCard, 
  Calendar, 
  TrendingDown, 
  Info, 
  Briefcase, 
  Search, 
  Phone, 
  Clock, 
  ChevronRight, 
  Lock, 
  Check, 
  Copy, 
  Printer, 
  AlertTriangle, 
  DollarSign, 
  User, 
  Mail, 
  Send,
  Sliders,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Download,
  Trash2,
  RefreshCw,
  Handshake,
  Calculator,
  MessageCircle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ActiveTab, Contract, Bill, ClientData } from "./types";
import { 
  generateClientData, 
  generateBillsForContract, 
  formatCpfCnpj, 
  sanitizeCpfCnpj, 
  FAQ_DATA 
} from "./data";
import { PoliticaPrivacidadeView } from "./components/PoliticaPrivacidadeView";
import { TermosUsoView } from "./components/TermosUsoView";
import { FaqView } from "./components/FaqView";
import { ContatoView } from "./components/ContatoView";
import { SimuladorView } from "./components/SimuladorView";

const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=5511920747530&text=*Suporte*%20AYMORÉ";
const WHATSAPP_FLOATING_URL = "https://api.whatsapp.com/send?phone=5511920747530&text=*Suporte*%20AYMORÉ";
const DEMO_CPF_CNPJ = "123.456.789-00";
const demoClientData = generateClientData(DEMO_CPF_CNPJ);

const CONTACT_SUBJECTS = [
  "Atendimento Geral",
  "Solicitação de Acordo",
  "Simulação de Parcelamento",
  "Renegociação Online",
  "2ª Via de Boleto / PIX",
  "Quitação de Contrato",
  "Parcelamento / Renegociação",
  "Antecipação de Parcelas",
  "Simulação de Financiamento",
  "Dúvidas ou Outros Assuntos"
];

const maskCpfCnpj = (value: string) => {
  const clean = value.replace(/\D/g, "");
  if (clean.length <= 11) {
    return clean
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .slice(0, 14);
  } else {
    return clean
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})/, "$1-$2")
      .slice(0, 18);
  }
};

const maskPhone = (value: string) => {
  const clean = value.replace(/\D/g, "");
  if (clean.length <= 10) {
    return clean
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})/, "$1-$2")
      .slice(0, 14);
  } else {
    return clean
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{1,4})/, "$1-$2")
      .slice(0, 15);
  }
};

const tabPathMap: Record<ActiveTab, string> = {
  [ActiveTab.HOME]: "/",
  [ActiveTab.BOLETO]: "/2via",
  [ActiveTab.QUITACAO]: "/quitacao",
  [ActiveTab.ACORDO]: "/solicitar-acordo",
  [ActiveTab.SIMULAR_PARCELAMENTO]: "/simular-parcelamento",
  [ActiveTab.SIMULADOR]: "/simulador",
  [ActiveTab.RENEGOCIACAO]: "/renegociacao-online",
  [ActiveTab.PARCELAMENTO]: "/parcelamento",
  [ActiveTab.ANTECIPACAO]: "/antecipacao",
  [ActiveTab.FAQ]: "/perguntas-frequentes",
  [ActiveTab.CONTATO]: "/contato",
  [ActiveTab.SOBRE_NOS]: "/sobre-nos",
  [ActiveTab.SERVICOS]: "/servicos",
  [ActiveTab.POLITICA_PRIVACIDADE]: "/politica-de-privacidade",
  [ActiveTab.TERMOS_USO]: "/termos-de-uso"
};

function getTabFromPathname(path: string): ActiveTab {
  let cleanPath = decodeURIComponent(path).toLowerCase().replace(/^\/+|\/+$/g, "");
  const normalized = cleanPath.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  if (normalized === "" || normalized === "inicio" || normalized === "home" || normalized === "index" || normalized === "index.html") {
    return ActiveTab.HOME;
  }
  if (normalized === "2via" || normalized === "2via-de-boleto" || normalized === "2-via" || normalized === "segunda-via" || normalized === "boleto") {
    return ActiveTab.BOLETO;
  }
  if (normalized === "quitacao" || normalized === "quitacao-de-contrato" || normalized === "quitacao-contrato" || normalized === "liquidacao") {
    return ActiveTab.QUITACAO;
  }
  if (normalized === "solicitar-acordo" || normalized === "acordo" || normalized === "solicitaracordo" || normalized === "acordos") {
    return ActiveTab.ACORDO;
  }
  if (normalized === "simular-parcelamento" || normalized === "simularparcelamento" || normalized === "simulador-parcelamento" || normalized === "simulacao-parcelamento") {
    return ActiveTab.SIMULAR_PARCELAMENTO;
  }
  if (normalized === "simulador" || normalized === "simulador-financiamento" || normalized === "simulacao" || normalized === "simular") {
    return ActiveTab.SIMULADOR;
  }
  if (normalized === "renegociacao-online" || normalized === "renegociacao" || normalized === "renegociacaoonline" || normalized === "renegociar") {
    return ActiveTab.RENEGOCIACAO;
  }
  if (normalized === "parcelamento" || normalized === "negociacao" || normalized === "parcelamento-de-fatura" || normalized === "parcelar") {
    return ActiveTab.PARCELAMENTO;
  }
  if (normalized === "antecipacao" || normalized === "antecipacao-de-parcelas" || normalized === "antecipacao-parcelas" || normalized === "antecipar-parcelas" || normalized === "amortizacao") {
    return ActiveTab.ANTECIPACAO;
  }
  if (normalized === "perguntas-frequentes" || normalized === "duvidas" || normalized === "duvidas-frequentes" || normalized === "faq" || normalized === "ajuda") {
    return ActiveTab.FAQ;
  }
  if (normalized === "contato" || normalized === "fale-conosco" || normalized === "atendimento" || normalized === "suporte" || normalized === "canais-de-atendimento") {
    return ActiveTab.CONTATO;
  }
  if (normalized === "sobrenos" || normalized === "sobre-nos" || normalized === "quem-somos" || normalized === "sobre") {
    return ActiveTab.SOBRE_NOS;
  }
  if (normalized === "servicos" || normalized === "servicos-prestados" || normalized === "nossos-servicos") {
    return ActiveTab.SERVICOS;
  }
  if (normalized === "politica-de-privacidade" || normalized === "politica-privacidade" || normalized === "privacidade" || normalized === "politicas-de-privacidade") {
    return ActiveTab.POLITICA_PRIVACIDADE;
  }
  if (normalized === "termos-de-uso" || normalized === "termos" || normalized === "termos-de-servico" || normalized === "termos-de-uso-do-portal") {
    return ActiveTab.TERMOS_USO;
  }
  
  return ActiveTab.HOME;
}

function getPathnameFromTab(tab: ActiveTab): string {
  return tabPathMap[tab] || "/";
}

// Helper function to resolve API URLs. Since the frontend and backend are hosted on the same origin (both on Vercel and locally), relative paths work perfectly.
const getApiUrl = (path: string): string => {
  return path;
};

export default function App() {
  // Navigation & Data State
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => getTabFromPathname(window.location.pathname));
  const [clientData] = useState<ClientData | null>(demoClientData);
  const [selectedContractIndex, setSelectedContractIndex] = useState(0);

  // Sync state with browser back/forward and handle URL navigation
  useEffect(() => {
    const handleUrlChange = () => {
      const currentPath = window.location.pathname;
      const currentTab = getTabFromPathname(currentPath);
      setActiveTab(currentTab);
    };

    window.addEventListener("popstate", handleUrlChange);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  // Update browser URL and dynamic SEO Meta Tags on activeTab changes
  useEffect(() => {
    const currentPath = decodeURIComponent(window.location.pathname).replace(/\/+$/, "") || "/";
    const targetPath = getPathnameFromTab(activeTab);
    
    if (currentPath !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }

    // Dynamic SEO Titles and Meta Descriptions per page
    const seoMap: Record<ActiveTab, { title: string; desc: string }> = {
      [ActiveTab.HOME]: {
        title: "Central Aymoré | 2ª Via de Boleto, Quitação e Autoatendimento",
        desc: "Portal oficial de autoatendimento Central Aymoré. Emita 2ª via de boleto, solicite quitação de contrato com desconto e consulte seus financiamentos pelo CPF."
      },
      [ActiveTab.BOLETO]: {
        title: "2ª Via de Boleto Aymoré Financiamentos | Emitir por CPF/CNPJ",
        desc: "Emita rapidamente a 2ª via do seu boleto ou código PIX de financiamento de veículo Aymoré. Atualize parcelas vencidas de forma segura."
      },
      [ActiveTab.QUITACAO]: {
        title: "Quitação de Contrato Aymoré | Desconto em Amortização",
        desc: "Solicite a quitação antecipada do seu financiamento Aymoré com descontos exclusivos nos juros pelo CDC. Calcule e gere a proposta online."
      },
      [ActiveTab.ACORDO]: {
        title: "Solicitar Acordo Financeiro | Central Aymoré Dívidas e Quitação",
        desc: "Solicite um acordo oficial para regularizar seu contrato Aymoré com redução de encargos e juros. Proposta rápida e segura."
      },
      [ActiveTab.SIMULAR_PARCELAMENTO]: {
        title: "Simular Parcelamento de Dívida | Calculadora Aymoré Financiamentos",
        desc: "Simule o parcelamento do seu contrato ou faturas Aymoré. Escolha o número de parcelas, simule valores e renegocie online."
      },
      [ActiveTab.SIMULADOR]: {
        title: "Simulador de Financiamento e Parcelamento | Central Aymoré",
        desc: "Simule parcelas de financiamento de veículos e renegociação de dívidas com taxas transparentes Santander Aymoré. Simulação rápida online."
      },
      [ActiveTab.RENEGOCIACAO]: {
        title: "Renegociação Online Aymoré | Descontos Especiais em Contratos",
        desc: "Renegocie seu contrato de financiamento de veículo Aymoré online. Descontos exclusivos em parcelas em atraso com aprovação imediata."
      },
      [ActiveTab.PARCELAMENTO]: {
        title: "Parcelamento e Renegociação de Dívida | Central Aymoré",
        desc: "Renegocie faturas em atraso e parcelas do financiamento Aymoré. Planos flexíveis em até 36x para regularizar seu contrato."
      },
      [ActiveTab.ANTECIPACAO]: {
        title: "Antecipação de Parcelas | Economize Juros na Central Aymoré",
        desc: "Antecipe parcelas futuras do seu financiamento de veículo Aymoré e ganhe desconto proporcional de juros na hora."
      },
      [ActiveTab.FAQ]: {
        title: "Perguntas Frequentes & Dúvidas | Central Aymoré Autoatendimento",
        desc: "Tire suas dúvidas sobre 2ª via de boleto, quitação antecipada, pagamento via PIX, baixa de gravame e renegociação Aymoré."
      },
      [ActiveTab.CONTATO]: {
        title: "Canais de Atendimento e Contato | Central Aymoré Financiamentos",
        desc: "Entre em contato com a Central Aymoré. WhatsApp oficial, SAC 0800 704 9090, Ouvidoria 0800 726 0322 e formulário de atendimento online."
      },
      [ActiveTab.SOBRE_NOS]: {
        title: "Sobre Nós | Central Aymoré Autoatendimento Oficial",
        desc: "Conheça a Central Aymoré de autoatendimento. Agilidade, transparência e segurança na gestão de contratos de financiamento de veículos."
      },
      [ActiveTab.SERVICOS]: {
        title: "Serviços Financeiros | Simulador e Soluções Central Aymoré",
        desc: "Confira todos os serviços de autoatendimento: simulação de financiamento, quitação, antecipação e 2ª via de boleto Aymoré."
      },
      [ActiveTab.POLITICA_PRIVACIDADE]: {
        title: "Política de Privacidade e Proteção de Dados LGPD | Central Aymoré",
        desc: "Conheça nossa Política de Privacidade em conformidade com a LGPD. Saiba como seus dados pessoais são protegidos com segurança e sigilo bancário."
      },
      [ActiveTab.TERMOS_USO]: {
        title: "Termos de Uso do Portal | Central Aymoré Autoatendimento",
        desc: "Termos e condições gerais de uso do portal de autoatendimento Central Aymoré. Normas de utilização, segurança e diretrizes contratuais."
      }
    };

    const currentSeo = seoMap[activeTab] || seoMap[ActiveTab.HOME];
    document.title = currentSeo.title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', currentSeo.desc);

    // Update Canonical URL tag
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const fullCanonicalUrl = `https://centralwebaymore.com${targetPath === "/" ? "/" : targetPath}`;
    canonical.setAttribute('href', fullCanonicalUrl);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', fullCanonicalUrl);

    let twUrl = document.querySelector('meta[name="twitter:url"]');
    if (twUrl) twUrl.setAttribute('content', fullCanonicalUrl);

    // Smooth scroll to top when changing tab
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);
  
  // Interaction States
  const [selectedBoleto, setSelectedBoleto] = useState<Bill | null>(null);
  const [selectedPixCode, setSelectedPixCode] = useState<Bill | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "warning" } | null>(null);
  
  // Quitação (Settlement) Page States
  const [quitacaoDays, setQuitacaoDays] = useState<number>(0); // 0 = Hoje, 3 = Em 3 dias, 7 = Em 7 dias
  const [showQuitacaoDoc, setShowQuitacaoDoc] = useState(false);

  // Parcelamento (Installments) Page States
  const [parcelasAcordo, setParcelasAcordo] = useState<number>(12);
  const [showAcordoConfirm, setShowAcordoConfirm] = useState(false);

  // Antecipação (Prepayment) Page States
  const [antecipadasSelected, setAntecipadasSelected] = useState<string[]>([]);
  const [showAntecipacaoDoc, setShowAntecipacaoDoc] = useState(false);

  // Serviços Simulator States
  const [simuladorAssetValue, setSimuladorAssetValue] = useState<number>(65000);
  const [simuladorDownPayment, setSimuladorDownPayment] = useState<number>(15000);
  const [simuladorInstallmentsCount, setSimuladorInstallmentsCount] = useState<number>(48);

  // Lead / Contact Form States
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [showSqlHelper, setShowSqlHelper] = useState(false);
  const [contactSubject, setContactSubject] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    cpf: "",
    email: "",
    phone: "",
    message: ""
  });
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSubmitSuccess, setContactSubmitSuccess] = useState(false);
  const [contactSubmitError, setContactSubmitError] = useState<string | null>(null);
  const [contactSubmitHint, setContactSubmitHint] = useState<string | null>(null);
  const [isSavedLocally, setIsSavedLocally] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ sent: boolean; message: string } | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminLeads, setAdminLeads] = useState<any[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<any>({ disabled: true });

  const checkSupabaseStatus = () => {
    setSupabaseStatus({ disabled: true });
  };

  const openContactForm = (_subject?: string) => {
    window.open(WHATSAPP_URL, "_blank");
  };

  const fetchBackupLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const res = await fetch(getApiUrl("/api/contacts"));
      if (res.ok) {
        const data = await res.json();
        setAdminLeads(data.data || []);
      } else {
        setToast({ message: "Erro ao carregar leads locais", type: "warning" });
      }
    } catch (e: any) {
      setToast({ message: `Erro de conexão: ${e.message}`, type: "warning" });
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const clearBackupLeads = async () => {
    if (!window.confirm("Deseja realmente limpar permanentemente todo o histórico de leads do backup local?")) {
      return;
    }
    try {
      const res = await fetch(getApiUrl("/api/contacts/clear"), { method: "POST" });
      if (res.ok) {
        setAdminLeads([]);
        setToast({ message: "Histórico de leads limpo com sucesso!", type: "success" });
      } else {
        setToast({ message: "Erro ao limpar histórico", type: "warning" });
      }
    } catch (e: any) {
      setToast({ message: `Erro de conexão: ${e.message}`, type: "warning" });
    }
  };

  const exportLeadsToCsv = () => {
    if (adminLeads.length === 0) {
      setToast({ message: "Não há leads para exportar", type: "info" });
      return;
    }
    
    const headers = ["Data/Hora", "Nome", "CPF", "E-mail", "Telefone", "Assunto", "Mensagem"];
    const rows = adminLeads.map(lead => [
      new Date(lead.created_at).toLocaleString("pt-BR"),
      lead.name || lead.nome || "",
      lead.cpf || "",
      lead.email || "",
      lead.phone || lead.telefone || "",
      lead.subject || lead.assunto || "",
      (lead.message || lead.mensagem || "").replace(/\n/g, " ")
    ]);
    
    const csvContent = "\uFEFF" + [
      headers.join(";"),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(";"))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_aymore_financiamentos_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast({ message: "Leads exportados para CSV com sucesso!", type: "success" });
  };

  useEffect(() => {
    if (isAdminOpen) {
      fetchBackupLeads();
    }
  }, [isAdminOpen]);

  // Auto-dismiss toasts
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Helper copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setToast({
      message: `${label} copiado para a área de transferência!`,
      type: "success"
    });
  };

  const activeContract = clientData?.contracts[selectedContractIndex] || null;
  const activeBills = activeContract ? generateBillsForContract(activeContract) : [];

  // Quitação Calculations
  const calcQuitacao = (contract: Contract, daysAhead: number) => {
    const totalRemaining = contract.outstandingBalance;
    // Discount factor: e.g. 1.25% monthly rebate compounded to remaining installments
    // The earlier they pay, the larger the rebate. If they pay in 7 days, they get slightly less discount
    const baseDiscountPercent = 0.165 - (daysAhead * 0.001); // ~16.5% discount minus daily decay
    const discountAmount = Math.round(totalRemaining * baseDiscountPercent * 100) / 100;
    const finalAmount = totalRemaining - discountAmount;

    return {
      originalValue: totalRemaining,
      discountPercent: (baseDiscountPercent * 100).toFixed(1),
      discountAmount,
      finalAmount
    };
  };

  // Refinancing simulation Calculations
  const calcAcordo = (contract: Contract, installments: number) => {
    const balance = contract.outstandingBalance;
    const lateCharge = contract.status === "late" ? 250 : 0;
    const totalToRefinance = balance + lateCharge;
    
    // Higher interest for longer terms
    const baseRate = 0.0199 + (installments * 0.0002); 
    const monthlyInstallment = (totalToRefinance * baseRate) / (1 - Math.pow(1 + baseRate, -installments));
    const totalCost = monthlyInstallment * installments;
    const cetAnual = (baseRate * 12 * 1.15 * 100).toFixed(2);

    return {
      principal: totalToRefinance,
      ratePercent: (baseRate * 100).toFixed(2),
      monthlyInstallment,
      totalCost,
      cetAnual
    };
  };

  // Selected Anticipation Calculations
  const calcAntecipacaoSelected = (contract: Contract, selectedIds: string[]) => {
    if (!selectedIds.length) return { originalSum: 0, discountSum: 0, finalSum: 0 };
    
    const bills = generateBillsForContract(contract);
    const selectedBills = bills.filter(b => selectedIds.includes(b.id));
    
    let originalSum = 0;
    let discountSum = 0;
    
    selectedBills.forEach(b => {
      originalSum += b.value;
      // Last installments (higher installment numbers) get much bigger discounts
      const installmentRank = b.installmentNumber;
      const totalInst = contract.totalInstallments;
      // Proportional discount: higher index = paid much earlier = higher discount
      const distance = totalInst - installmentRank; 
      const discountPercent = 0.05 + (distance * 0.012); // e.g., last installments get ~35% discount
      discountSum += Math.round(b.value * discountPercent * 100) / 100;
    });

    return {
      originalSum,
      discountSum,
      finalSum: originalSum - discountSum
    };
  };

  // Services simulator Calculations
  const calcSimulator = () => {
    const principal = simuladorAssetValue - simuladorDownPayment;
    if (principal <= 0) return { installment: 0, totalPayable: 0, totalInterest: 0 };
    
    const monthlyRate = 0.0169; // 1.69% a.m.
    const installment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -simuladorInstallmentsCount));
    const totalPayable = installment * simuladorInstallmentsCount;
    const totalInterest = totalPayable - principal;

    return {
      installment,
      totalPayable,
      totalInterest,
      principal
    };
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F4F4] text-[#444444] font-sans antialiased">
      
      {/* GLOBAL TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border text-sm md:text-base font-medium max-w-md w-[90%] ${
              toast.type === "success" 
                ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                : toast.type === "warning"
                ? "bg-amber-50 border-amber-200 text-amber-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
          >
            <div className="w-2 h-2 rounded-full shrink-0 animate-ping bg-current" />
            <span className="flex-1 text-center">{toast.message}</span>
            <button onClick={() => setToast(null)} className="hover:opacity-70 text-lg font-bold ml-2">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP COMPLIANCE BAR */}
      <div className="bg-zinc-950 text-stone-300 py-2.5 px-4 text-xs font-light border-b border-zinc-900 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> 
              Portal de Autoatendimento Oficial
            </span>
            <span className="hidden md:inline text-zinc-500">|</span>
            <span>CNPJ Aymoré: <strong>07.707.650/0001-10</strong></span>
            <span className="hidden md:inline text-zinc-500">|</span>
            <span className="text-stone-400">Sociedade integrante do Grupo Santander Brasil</span>
          </div>
          <div className="flex items-center gap-3.5">
            <span className="text-zinc-400">SAC: <strong>0800 704 9090</strong></span>
            <span className="text-zinc-500">|</span>
            <span className="text-zinc-400">Ouvidoria: <strong>0800 726 0322</strong></span>
          </div>
        </div>
      </div>

      {/* HEADER & BRANDING */}
      <header className="sticky top-0 z-30 bg-white border-b-4 border-[#ec0000] shadow-sm select-none">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo area */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab(ActiveTab.HOME)}>
              <img 
                src="/logo.svg" 
                alt="Aymoré Financiamentos Logo" 
                className="w-10 h-10 object-contain drop-shadow-sm select-none" 
              />
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-zinc-900 leading-none">Aymoré</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Crédito & Financiamento</span>
              </div>
            </div>

            {/* Atendimento Online Button */}
            <a 
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#ec0000] hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-bold py-2.5 px-5 rounded-full text-xs flex items-center gap-2 shadow-md cursor-pointer select-none border-0 no-underline"
            >
              <Phone className="w-4 h-4" /> Solicitar Atendimento
            </a>
          </div>

          {/* MAIN DESKTOP NAVIGATION BAR */}
          <nav className="flex items-center overflow-x-auto no-scrollbar scroll-smooth border-t border-zinc-100">
            <div className="flex space-x-1 py-1 min-w-max">
              {[
                { id: ActiveTab.HOME, label: "Início", icon: Info },
                { id: ActiveTab.BOLETO, label: "2ª Via de Boleto", icon: FileText },
                { id: ActiveTab.QUITACAO, label: "Quitação de Contrato", icon: CheckCircle },
                { id: ActiveTab.ACORDO, label: "Solicitar Acordo", icon: Handshake },
                { id: ActiveTab.SIMULAR_PARCELAMENTO, label: "Simular Parcelamento", icon: Calculator },
                { id: ActiveTab.SIMULADOR, label: "Simulador", icon: Sliders },
                { id: ActiveTab.RENEGOCIACAO, label: "Renegociação Online", icon: RefreshCw },
                { id: ActiveTab.PARCELAMENTO, label: "Parcelamento", icon: CreditCard },
                { id: ActiveTab.ANTECIPACAO, label: "Antecipação de Parcelas", icon: TrendingDown },
                { id: ActiveTab.FAQ, label: "Perguntas Frequentes", icon: MessageCircle },
                { id: ActiveTab.SOBRE_NOS, label: "Sobre Nós", icon: Info },
                { id: ActiveTab.SERVICOS, label: "Serviços Prestados", icon: Briefcase },
                { id: ActiveTab.CONTATO, label: "Contato", icon: Phone },
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative py-3.5 px-4 text-xs font-semibold tracking-wide transition-all duration-200 rounded-md flex items-center gap-2 outline-none select-none ${
                      isActive 
                        ? "text-[#ec0000] bg-red-50/50 font-bold" 
                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                    }`}
                  >
                    <IconComp className={`w-4 h-4 ${isActive ? "text-[#ec0000]" : "text-zinc-400"}`} />
                    {tab.label}
                    {isActive && (
                      <motion.div 
                        layoutId="activeTabUnderline" 
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#ec0000]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

        </div>
      </header>

      {/* SECURITY AND TRUST STATUS RIBBON */}
      <div className="bg-red-50 border-b border-red-100 py-2.5 px-4 text-xs text-red-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#ec0000] shrink-0" />
            <p className="font-medium">
              <strong className="text-red-950 font-extrabold">SITE 100% SEGURO:</strong> Conexão criptografada por protocolo SSL/TLS. Suas consultas e simulações são processadas de forma confidencial e protegida.
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-[#ec0000]/10 text-[#ec0000] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            <span>Ambiente Verificado</span>
          </div>
        </div>
      </div>

      {/* CORE WRAPPER */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18 }}
          >
            
            {/* ----------------- TAB: HOME ----------------- */}
            {activeTab === ActiveTab.HOME && (
              <div className="space-y-8">
                
                {/* BENTO GRID MAIN HERO SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* HERO / MAIN SERVICE CARD (lg:col-span-8) */}
                  <div className="lg:col-span-8 bg-white p-8 md:p-12 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between hover:border-[#ec0000] transition-all relative group overflow-hidden">
                    {/* Subtle decorative elements matching Bento layout */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-red-500/10 transition-colors" />
                    
                    <div className="space-y-6 relative">
                      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-50 text-[#ec0000] rounded-full text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-[#ec0000]" /> SOLUÇÕES FINANCEIRAS
                      </span>
                      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-zinc-950">
                        Facilitando seu crédito com transparência e segurança.
                      </h1>
                      <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl">
                        Gerencie seus contratos de financiamento, solicite segundas vias de boletos oficiais, liquide seu saldo devedor de forma antecipada ou faça simulações de novos empréstimos com a solidez e segurança do grupo Santander Brasil.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-8 relative">
                      <button 
                        onClick={() => setActiveTab(ActiveTab.BOLETO)}
                        className="bg-[#ec0000] hover:bg-red-700 transition-colors py-3.5 px-6 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        Acessar Minha Conta <ChevronRight className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setActiveTab(ActiveTab.SERVICOS)}
                        className="bg-gray-50 hover:bg-gray-100 transition-colors py-3.5 px-6 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-700 border border-zinc-200 flex items-center gap-2 cursor-pointer"
                      >
                        Simular Financiamento <Sliders className="w-4 h-4 text-zinc-500" />
                      </button>
                    </div>
                  </div>

                  {/* ATENDIMENTO IMEDIATO WHATSAPP BOX (lg:col-span-4) */}
                  <div className="lg:col-span-4 bg-[#ec0000] p-8 rounded-xl shadow-lg text-white flex flex-col justify-between border border-red-500/10 relative text-center min-h-[420px]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="text-center space-y-3 relative z-10">
                      <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto text-white shadow-inner">
                        <Phone className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold uppercase tracking-tight">
                        Atendimento Instantâneo
                      </h2>
                      <p className="text-red-100 text-xs leading-relaxed">
                        Gere boletos, simule acordos, consulte contratos ativos ou tire suas dúvidas de forma rápida e 100% segura diretamente com nossa central oficial no WhatsApp.
                      </p>
                    </div>

                    <div className="space-y-4 my-6 relative z-10 text-left">
                      <div className="bg-white/10 p-4 rounded-lg border border-white/15">
                        <p className="text-xs text-white leading-relaxed font-medium">
                          🔒 <strong>Portal Protegido por Lei</strong>
                        </p>
                        <p className="text-[11px] text-red-100 leading-relaxed mt-1">
                          Em conformidade com a LGPD e políticas de segurança, todos os dados privados e emissões de faturas são validados de forma criptografada pelo nosso canal oficial de atendimento.
                        </p>
                      </div>

                      <a 
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white hover:bg-red-50 active:scale-[0.98] text-[#ec0000] font-extrabold py-4 rounded-lg text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer text-center border-0 no-underline"
                      >
                        Iniciar Atendimento Online
                      </a>
                    </div>

                    <div className="border-t border-white/10 pt-4 text-center relative z-10">
                      <p className="text-[10px] text-red-200">
                        ✓ Canal Oficial Santander Financiamentos & Aymoré S.A.
                      </p>
                    </div>
                  </div>
                </div>

                {/* BENTO GRID QUICK SHORTCUTS */}
                <div className="space-y-4">
                  <div className="flex flex-col items-start gap-1">
                    <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Serviços Rápidos de Autoatendimento</h2>
                    <p className="text-xs text-zinc-500">Escolha um dos canais abaixo para prosseguir com a sua operação de forma imediata</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        title: "2ª Via de Boleto",
                        desc: "Gere o boleto da parcela atual ou as parcelas em atraso consolidadas.",
                        icon: FileText,
                        targetTab: ActiveTab.BOLETO
                      },
                      {
                        title: "Quitação",
                        desc: "Simule a liquidação completa e encerre seu contrato com descontos exclusivos.",
                        icon: CheckCircle,
                        targetTab: ActiveTab.QUITACAO
                      },
                      {
                        title: "Parcelamento",
                        desc: "Ficou com parcelas pendentes? Reorganize e renegocie seus pagamentos mensalmente.",
                        icon: CreditCard,
                        targetTab: ActiveTab.PARCELAMENTO
                      },
                      {
                        title: "Antecipação",
                        desc: "Pague as parcelas do final do seu contrato com descontos máximos de juros.",
                        icon: TrendingDown,
                        targetTab: ActiveTab.ANTECIPACAO
                      },
                    ].map((item, index) => {
                      const IconComp = item.icon;
                      return (
                        <div 
                          key={index}
                          onClick={() => {
                            if (clientData) {
                              setActiveTab(item.targetTab);
                            } else {
                              setToast({ message: "Por favor, faça a busca do seu CPF/CNPJ no painel de acesso primeiro.", type: "warning" });
                              // Smooth scroll to search form
                              window.scrollTo({ top: 150, behavior: 'smooth' });
                            }
                          }}
                          className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:border-[#ec0000] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                        >
                          <div className="space-y-4">
                            <div className="p-3 bg-gray-50 rounded-lg w-fit group-hover:bg-red-50 transition-colors">
                              <IconComp className="w-6 h-6 text-[#ec0000]" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-zinc-950 mb-1">{item.title}</h4>
                              <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                          <div className="mt-6 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] font-bold text-[#ec0000] uppercase tracking-wider">
                            <span>Acessar</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* TRUST & SECURITY FACTORS */}
                <div className="bg-zinc-50 rounded-xl p-8 border border-zinc-200 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="space-y-3">
                    <div className="inline-block bg-[#ec0000]/10 text-[#ec0000] text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                      Tradição & Transparência
                    </div>
                    <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight">
                      Por que utilizar nosso autoatendimento?
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Desenvolvemos uma estrutura focada na segurança de dados do cliente, permitindo uma experiência idêntica ao portal principal do Santander Brasil.
                    </p>
                  </div>
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "Descontos Garantidos por Lei",
                        desc: "Seguimos estritamente o Artigo 52, § 2º do Código de Defesa do Consumidor, garantindo o abatimento proporcional de juros em todas as amortizações."
                      },
                      {
                        title: "Atualizações de Baixa em Tempo Real",
                        desc: "Os pagamentos efetuados via PIX têm liquidação direta no contrato em até 1 hora, enquanto boletos bancários levam de 1 a 3 dias úteis."
                      },
                      {
                        title: "Emissão Segura e Certificada",
                        desc: "Todos os documentos são assinados digitalmente e integrados com o Banco Santander S.A., garantindo que o destino do seu pagamento seja sempre a Aymoré Crédito."
                      },
                      {
                        title: "Atendimento Especializado",
                        desc: "Contamos com analistas dedicados em nossos canais oficiais para auxiliar na renegociação e no refinanciamento das suas parcelas."
                      }
                    ].map((factor, fIdx) => (
                      <div key={fIdx} className="space-y-1.5">
                        <h4 className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {factor.title}
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed pl-5.5">{factor.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQ ACCORDION SECTION */}
                <div className="space-y-5">
                  <div className="text-center">
                    <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Dúvidas Frequentes (FAQ)</h2>
                    <p className="text-xs text-zinc-500 mt-1">Consulte as principais dúvidas sobre emissão, quitação e taxas dos contratos</p>
                  </div>
                  <div className="max-w-3xl mx-auto space-y-3">
                    {FAQ_DATA.map((faq, idx) => (
                      <div key={idx} className="bg-white border border-zinc-200 rounded-lg p-5 hover:border-zinc-300 transition-all">
                        <h3 className="font-bold text-sm text-zinc-900 mb-2 flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600 shrink-0">?</span>
                          {faq.question}
                        </h3>
                        <p className="text-xs text-zinc-500 leading-relaxed pl-7.5">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ----------------- TAB: 2ª VIA DE BOLETO ----------------- */}
            {activeTab === ActiveTab.BOLETO && (
              <div className="space-y-8 max-w-4xl mx-auto">
                
                {/* INFORMATIVE NOTICE & WHATSAPP DIRECT */}
                <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center space-y-6 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto text-[#ec0000] border border-red-100 shadow-sm">
                    <FileText className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-zinc-900">Emissão de 2ª Via do Boleto ou PIX</h2>
                    <p className="text-xs text-zinc-500 max-w-xl mx-auto leading-relaxed">
                      Para emitir com total segurança a segunda via atualizada do seu boleto ou obter o código Pix oficial do seu contrato Santander / Aymoré Crédito, fale diretamente com a nossa Central de Atendimento.
                    </p>
                  </div>

                  <div className="bg-red-50/50 border border-red-100 rounded-xl p-5 max-w-2xl mx-auto space-y-3 text-left">
                    <h4 className="font-bold text-xs text-red-950 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-[#ec0000]" /> Informações Importantes de Segurança:
                    </h4>
                    <p className="text-[11px] text-red-800 leading-relaxed">
                      Sempre verifique os dados do beneficiário antes de confirmar qualquer pagamento em sua conta bancária. A razão social oficial deve constar exatamente como <strong>SANTANDER SOCIEDADE DE CREDITO, FINANCIAMENTO E INVESTIMENTO S.A.</strong> (CNPJ <strong>07.707.650/0001-10</strong>). Evite golpes e nunca faça transferências para chaves Pix ou contas de pessoas físicas.
                    </p>
                  </div>

                  <div className="pt-4">
                    <a 
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#ec0000] hover:bg-[#cc0000] hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-black py-4 px-8 rounded-lg text-xs uppercase tracking-wider shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer select-none border-0 no-underline"
                    >
                      <Phone className="w-4 h-4" /> Solicitar 2ª Via de Boleto / PIX
                    </a>
                  </div>
                </div>

              </div>
            )}

            {/* ----------------- TAB: QUITAÇÃO DE CONTRATO ----------------- */}
            {activeTab === ActiveTab.QUITACAO && (
              <div className="space-y-8 max-w-4xl mx-auto">
                
                {/* INFORMATIVE NOTICE & WHATSAPP DIRECT */}
                <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center space-y-6 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto text-[#ec0000] border border-red-100 shadow-sm">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-zinc-900">Quitação Segura do Contrato com Desconto de Juros</h2>
                    <p className="text-xs text-zinc-500 max-w-xl mx-auto leading-relaxed">
                      De acordo com o Artigo 52, § 2º do Código de Defesa do Consumidor, você tem o direito garantido por lei à redução proporcional dos juros futuros ao quitar ou amortizar suas parcelas de forma antecipada.
                    </p>
                  </div>

                  <div className="bg-red-50/50 border border-red-100 rounded-xl p-5 max-w-2xl mx-auto space-y-3 text-left">
                    <h4 className="font-bold text-xs text-red-950 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-[#ec0000]" /> Informações Importantes de Segurança:
                    </h4>
                    <p className="text-[11px] text-red-800 leading-relaxed">
                      Para obter o boleto oficial unificado de quitação emitido pelo Banco Santander com desconto total dos juros futuros e baixa permanente do gravame do veículo, entre em contato de forma direta com o nosso atendimento verificado no WhatsApp. Verifique sempre o beneficiário antes do pagamento.
                    </p>
                  </div>

                  <div className="pt-4">
                    <a 
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#ec0000] hover:bg-[#cc0000] hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-black py-4 px-8 rounded-lg text-xs uppercase tracking-wider shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer select-none border-0 no-underline"
                    >
                      <Phone className="w-4 h-4" /> Solicitar Quitação Oficial
                    </a>
                  </div>
                </div>

              </div>
            )}

            {/* ----------------- TAB: SOLICITAR ACORDO ----------------- */}
            {activeTab === ActiveTab.ACORDO && (
              <div className="space-y-8 max-w-4xl mx-auto">
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-10 space-y-8 shadow-sm">
                  <div className="text-center space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[#ec0000] rounded-full text-xs font-bold uppercase tracking-wider">
                      <ShieldAlert className="w-3.5 h-3.5" /> Acordo de Regularização Oficial
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
                      Solicitar Acordo de Dívida e Quitação
                    </h2>
                    <p className="text-xs md:text-sm text-zinc-500 max-w-xl mx-auto leading-relaxed">
                      Regularize débitos pendentes com descontos de até 85% sobre juros moratórios e encargos. Escolha a condição ideal para fechar seu acordo com garantia e segurança.
                    </p>
                  </div>

                  {/* THREE AGREEMENT OPTIONS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-b from-red-50/50 to-white border-2 border-red-500 rounded-xl p-5 space-y-3 relative overflow-hidden">
                      <span className="absolute top-2 right-2 bg-[#ec0000] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">
                        Maior Desconto
                      </span>
                      <h3 className="font-extrabold text-sm text-zinc-900">Quitação à Vista</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Pague o saldo devedor de uma só vez com até <strong>85% de abatimento</strong> de juros e mora acumulados.
                      </p>
                      <div className="pt-2">
                        <span className="text-xl font-black text-[#ec0000]">Até 85% OFF</span>
                      </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-3 hover:border-red-300 transition-all">
                      <h3 className="font-extrabold text-sm text-zinc-900">Acordo Parcelado</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Consolide suas pendências em parcelas fixas que caibam no seu orçamento, com parcelamento em até 36x.
                      </p>
                      <div className="pt-2">
                        <span className="text-base font-bold text-zinc-800">Até 36x Fixas</span>
                      </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-3 hover:border-red-300 transition-all">
                      <h3 className="font-extrabold text-sm text-zinc-900">Isenção de Encargos</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Pague a parcela em atraso sem cobrança de honorários adicionais e retenha o nome limpo no SPC/Serasa.
                      </p>
                      <div className="pt-2">
                        <span className="text-base font-bold text-emerald-600">0% de Multa Adicional</span>
                      </div>
                    </div>
                  </div>

                  {/* INFORMATIONAL & DIRECT ACTION BOX */}
                  <div className="bg-zinc-950 text-white rounded-xl p-6 md:p-8 space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-lg font-black text-white">Como Funciona a Solicitação do Acordo?</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        1. Clique no botão abaixo para iniciar o atendimento via WhatsApp.<br/>
                        2. Nossa equipe do setor de regularização localizará seu contrato e calculará o maior desconto disponível.<br/>
                        3. Você receberá o termo de acordo com o boleto oficial em seu e-mail e WhatsApp verificado.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-xs text-zinc-400">
                        <span>Atendimento humano de Segunda a Sexta das 8h às 20h e Sábados das 8h às 14h.</span>
                      </div>
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto bg-[#ec0000] hover:bg-[#cc0000] text-white font-extrabold py-3.5 px-8 rounded-lg text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer border-0 shrink-0 text-center inline-block no-underline"
                      >
                        Solicitar Proposta de Acordo
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- TAB: SIMULAR PARCELAMENTO ----------------- */}
            {activeTab === ActiveTab.SIMULAR_PARCELAMENTO && (
              <div className="space-y-8 max-w-5xl mx-auto">
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-10 space-y-8 shadow-sm">
                  <div className="border-b border-zinc-100 pb-4 space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[#ec0000] rounded-full text-xs font-bold uppercase tracking-wider">
                      <Sliders className="w-3.5 h-3.5" /> Ferramenta de Simulação
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-zinc-900">
                      Simulador de Parcelamento de Fatura & Dívida
                    </h2>
                    <p className="text-xs md:text-sm text-zinc-500">
                      Calcule de forma transparente o valor das parcelas e veja a melhor condição para reprogramar seu financiamento Aymoré.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* SLIDERS & CONTROLS */}
                    <div className="lg:col-span-7 space-y-6 bg-zinc-50/80 p-6 rounded-xl border border-zinc-200">
                      
                      {/* Amount Slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline text-xs">
                          <label className="font-bold text-zinc-700">Valor do Saldo a Parcelar:</label>
                          <span className="font-mono font-bold text-[#ec0000] text-base">
                            R$ {simuladorAssetValue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                          </span>
                        </div>
                        <input 
                          type="range" 
                          min={1000} 
                          max={100000} 
                          step={1000}
                          value={simuladorAssetValue}
                          onChange={(e) => setSimuladorAssetValue(Number(e.target.value))}
                          className="w-full accent-[#ec0000] cursor-pointer h-2 bg-zinc-200 rounded-lg appearance-none"
                        />
                        <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                          <span>R$ 1.000</span>
                          <span>R$ 100.000</span>
                        </div>
                      </div>

                      {/* Terms Option Buttons */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-zinc-700 mb-1.5">Escolha o Prazo de Parcelamento:</label>
                        <div className="grid grid-cols-5 gap-2">
                          {[6, 12, 24, 36, 48].map((t) => (
                            <button
                              key={t}
                              onClick={() => setSimuladorInstallmentsCount(t)}
                              className={`py-2.5 px-2 rounded-lg text-xs font-bold transition-all border ${
                                simuladorInstallmentsCount === t 
                                  ? "border-[#ec0000] bg-[#ec0000] text-white shadow" 
                                  : "border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700"
                              }`}
                            >
                              {t}x
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Entrada Slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline text-xs">
                          <label className="font-bold text-zinc-700">Valor da Entrada Inicial:</label>
                          <span className="font-mono font-bold text-zinc-900 text-sm">
                            R$ {simuladorDownPayment.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                          </span>
                        </div>
                        <input 
                          type="range" 
                          min={0} 
                          max={Math.max(0, simuladorAssetValue - 500)} 
                          step={500}
                          value={simuladorDownPayment}
                          onChange={(e) => setSimuladorDownPayment(Number(e.target.value))}
                          className="w-full accent-[#ec0000] cursor-pointer h-2 bg-zinc-200 rounded-lg appearance-none"
                        />
                        <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                          <span>Sem entrada (R$ 0)</span>
                          <span>Até R$ {(simuladorAssetValue - 500).toLocaleString("pt-BR")}</span>
                        </div>
                      </div>
                    </div>

                    {/* CALCULATION RESULTS DISPLAY */}
                    <div className="lg:col-span-5 bg-zinc-950 text-white rounded-2xl p-6 space-y-6 border border-zinc-900 relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
                      
                      <h4 className="font-extrabold text-sm border-b border-zinc-800 pb-3 text-white">Resultado da Simulação</h4>

                      {(() => {
                        const calcs = calcSimulator();
                        return (
                          <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                              <span className="block text-[10px] uppercase text-zinc-400 font-bold">Valor Estimado por Parcela:</span>
                              <span className="text-3xl font-black text-[#ec0000]">
                                R$ {calcs.installment.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                              <span className="block text-[10px] text-zinc-400">Em {simuladorInstallmentsCount} parcelas mensais e fixas</span>
                            </div>

                            <div className="space-y-2.5 text-xs text-zinc-300">
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Valor do Crédito:</span>
                                <span className="font-bold text-white">R$ {calcs.principal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Entrada Informada:</span>
                                <span className="font-bold text-white">R$ {simuladorDownPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-400">Taxa de Juros Estimada:</span>
                                <span className="font-bold text-emerald-400">1.69% ao mês</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      <div className="pt-2">
                        <a
                          href={WHATSAPP_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-[#ec0000] hover:bg-[#cc0000] text-white font-extrabold py-3.5 rounded-lg text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer border-0 text-center inline-block no-underline"
                        >
                          Contratar Este Parcelamento
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- TAB: RENEGOCIAÇÃO ONLINE ----------------- */}
            {activeTab === ActiveTab.RENEGOCIACAO && (
              <div className="space-y-8 max-w-4xl mx-auto">
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-10 space-y-8 shadow-sm">
                  <div className="text-center space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[#ec0000] rounded-full text-xs font-bold uppercase tracking-wider">
                      <RefreshCw className="w-3.5 h-3.5" /> Portal de Renegociação
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
                      Renegociação Online de Contrato Aymoré
                    </h2>
                    <p className="text-xs md:text-sm text-zinc-500 max-w-xl mx-auto leading-relaxed">
                      Regularize suas faturas em atraso sem sair de casa. Condições exclusivas de parcelamento e eliminação de multas em ambiente 100% digital e seguro.
                    </p>
                  </div>

                  {/* RENEGOTIATION STEPS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-xl space-y-2 relative">
                      <span className="w-7 h-7 rounded-full bg-[#ec0000] text-white font-extrabold text-xs flex items-center justify-center">1</span>
                      <h3 className="font-extrabold text-sm text-zinc-900">1. Identificação</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Informe seu CPF ou número de contrato para consultar as propostas pré-aprovadas.
                      </p>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-xl space-y-2 relative">
                      <span className="w-7 h-7 rounded-full bg-[#ec0000] text-white font-extrabold text-xs flex items-center justify-center">2</span>
                      <h3 className="font-extrabold text-sm text-zinc-900">2. Escolha do Plano</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Selecione entre quitação integral com desconto ou divida a pendência em parcelas fixas.
                      </p>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-xl space-y-2 relative">
                      <span className="w-7 h-7 rounded-full bg-[#ec0000] text-white font-extrabold text-xs flex items-center justify-center">3</span>
                      <h3 className="font-extrabold text-sm text-zinc-900">3. Conclusão</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Receba o boleto de entrada por e-mail ou WhatsApp e retire os apontamentos dos órgãos de proteção ao crédito.
                      </p>
                    </div>
                  </div>

                  {/* RENEGOTIATION BENEFIT HIGHLIGHTS */}
                  <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-6 space-y-3">
                    <h4 className="font-extrabold text-sm text-emerald-950 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Benefícios da Renegociação Online:
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-emerald-900">
                      <li className="flex items-center gap-2">✓ Retirada de restrição em até 5 dias úteis após o pagamento da 1ª parcela</li>
                      <li className="flex items-center gap-2">✓ Desconto de até 80% nos juros moratórios acumulados</li>
                      <li className="flex items-center gap-2">✓ Opções de pagamento via PIX com baixa instantânea</li>
                      <li className="flex items-center gap-2">✓ Atendimento sem intermediários e sem taxa de contrato</li>
                    </ul>
                  </div>

                  <div className="text-center pt-2">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#ec0000] hover:bg-[#cc0000] hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-black py-4 px-10 rounded-full text-xs uppercase tracking-wider shadow-lg inline-flex items-center gap-2 cursor-pointer border-0 no-underline"
                    >
                      Iniciar Renegociação Online <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- TAB: PARCELAMENTO (AGREEMENT) ----------------- */}
            {activeTab === ActiveTab.PARCELAMENTO && (
              <div className="space-y-8 max-w-4xl mx-auto">
                
                {/* INFORMATIVE NOTICE & WHATSAPP DIRECT */}
                <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center space-y-6 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto text-[#ec0000] border border-red-100 shadow-sm">
                    <Calendar className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-zinc-900">Parcelamento & Renegociação de Contrato</h2>
                    <p className="text-xs text-zinc-500 max-w-xl mx-auto leading-relaxed">
                      Se você deseja unificar parcelas pendentes ou renegociar o saldo devedor do seu contrato com novas condições de prazo e parcelas reduzidas, nosso time está à disposição para estruturar um acordo sob medida.
                    </p>
                  </div>

                  <div className="bg-red-50/50 border border-red-100 rounded-xl p-5 max-w-2xl mx-auto space-y-3 text-left">
                    <h4 className="font-bold text-xs text-red-950 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-[#ec0000]" /> Informações Importantes de Segurança:
                    </h4>
                    <p className="text-[11px] text-red-800 leading-relaxed">
                      Todas as renegociações formais e termos de acordo são validados diretamente com o Santander e emitidos exclusivamente em canais oficiais. Nós nunca solicitamos depósitos em contas Pix de pessoas físicas ou chaves desconhecidas.
                    </p>
                  </div>

                  <div className="pt-4">
                    <a 
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#ec0000] hover:bg-[#cc0000] hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-black py-4 px-8 rounded-lg text-xs uppercase tracking-wider shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer select-none border-0 no-underline"
                    >
                      <Phone className="w-4 h-4" /> Solicitar Acordo de Parcelamento
                    </a>
                  </div>
                </div>

              </div>
            )}

            {/* ----------------- TAB: ANTECIPAÇÃO (PREPAYMENT) ----------------- */}
            {activeTab === ActiveTab.ANTECIPACAO && (
              <div className="space-y-8 max-w-4xl mx-auto">
                
                {/* INFORMATIVE NOTICE & WHATSAPP DIRECT */}
                <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center space-y-6 shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto text-[#ec0000] border border-red-100 shadow-sm">
                    <TrendingDown className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-zinc-900">Antecipação de Parcelas (Amortização)</h2>
                    <p className="text-xs text-zinc-500 max-w-xl mx-auto leading-relaxed">
                      Ao antecipar parcelas futuras (geralmente de trás para frente), você garante abatimentos substanciais nos juros e reduz o prazo residual do seu financiamento.
                    </p>
                  </div>

                  <div className="bg-red-50/50 border border-red-100 rounded-xl p-5 max-w-2xl mx-auto space-y-3 text-left">
                    <h4 className="font-bold text-xs text-red-950 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-[#ec0000]" /> Informações Importantes de Segurança:
                    </h4>
                    <p className="text-[11px] text-red-800 leading-relaxed">
                      Para emitir os boletos oficiais de amortização com desconto garantido, utilize exclusivamente nossos canais verificados de autoatendimento. Recuse boletos recebidos por intermediários não autorizados ou Pix que não sejam em nome da instituição oficial.
                    </p>
                  </div>

                  <div className="pt-4">
                    <a 
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#ec0000] hover:bg-[#cc0000] hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-black py-4 px-8 rounded-lg text-xs uppercase tracking-wider shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer select-none border-0 no-underline"
                    >
                      <Phone className="w-4 h-4" /> Solicitar Boleto de Antecipação
                    </a>
                  </div>
                </div>

              </div>
            )}

            /* ----------------- TAB: SOBRE NÓS (ABOUT) ----------------- */
            {activeTab === ActiveTab.SOBRE_NOS && (
              <div className="space-y-12">
                
                {/* HERO STATEMENT INTRO */}
                <div className="bg-gradient-to-r from-zinc-50 to-stone-100 p-8 md:p-12 rounded-2xl border border-zinc-200 text-center max-w-4xl mx-auto space-y-4">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#ec0000] bg-red-50 px-2.5 py-1 rounded">Quem Somos</span>
                  <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                    Aymoré Crédito, Financiamento e Investimento S.A.
                  </h2>
                  <p className="text-zinc-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                    A Aymoré é uma marca de grande tradição no mercado de crédito brasileiro. Desde a sua integração total ao Grupo Santander Brasil, passou a operar sob a bandeira de <strong>Santander Financiamentos</strong>, unindo a expertise consolidada no financiamento de veículos ao suporte e solidez de um dos maiores conglomerados financeiros do mundo.
                  </p>
                </div>

                {/* CORPORATE PILLARS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Nossa Missão",
                      desc: "Viabilizar o acesso simplificado ao crédito responsável para impulsionar os sonhos e conquistas de milhões de brasileiros, contribuindo para o desenvolvimento socioeconômico nacional.",
                      icon: Sparkles
                    },
                    {
                      title: "Nossa Visão",
                      desc: "Ser a instituição financeira de autoatendimento digital mais confiável, inovadora e ágil do Brasil, provendo canais transparentes e justos de simulação e liquidação de créditos.",
                      icon: Info
                    },
                    {
                      title: "Nossos Valores",
                      desc: "Atuar com transparência absoluta em todas as relações contratuais, segurança cibernética rigorosa, conformidade irrestrita às regulamentações e respeito integral às leis de proteção ao consumidor.",
                      icon: CheckCircle
                    }
                  ].map((pillar, pIdx) => {
                    const IconComp = pillar.icon;
                    return (
                      <div key={pIdx} className="bg-white border border-zinc-200 rounded-xl p-6 hover:shadow-lg transition-all space-y-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto text-[#ec0000] border border-red-100 shadow-sm">
                          <IconComp className="w-6 h-6" />
                        </div>
                        <h3 className="font-extrabold text-base text-zinc-900">{pillar.title}</h3>
                        <p className="text-xs text-zinc-500 leading-relaxed">{pillar.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* PHYSICAL DATA & CORPORATE SUMMARY */}
                <div className="bg-zinc-950 text-white rounded-2xl p-8 border border-zinc-900 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-5">
                    <h3 className="text-2xl font-black tracking-tight text-white">Dados Oficiais e Contatos Regulatórios</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Nos termos das normativas do Banco Central do Brasil, mantemos nossos dados societários atualizados para fins de transparência pública.
                    </p>
                    
                    <ul className="space-y-3.5 text-xs text-zinc-300">
                      <li>
                        <strong className="text-zinc-500 block uppercase text-[9px]">Razão Social Oficial:</strong>
                        SANTANDER SOCIEDADE DE CREDITO, FINANCIAMENTO E INVESTIMENTO S.A.
                      </li>
                      <li>
                        <strong className="text-zinc-500 block uppercase text-[9px]">CNPJ Registrado no Banco Central:</strong>
                        07.707.650/0001-10 (Situação Ativa)
                      </li>
                      <li>
                        <strong className="text-zinc-500 block uppercase text-[9px]">Sede de Operações Corporativas:</strong>
                        Avenida Presidente Juscelino Kubitschek, 2041 e 2235, Bloco A, Vila Olímpia, São Paulo - SP, CEP 04543-011
                      </li>
                      <li>
                        <strong className="text-zinc-500 block uppercase text-[9px]">Canais Ouvidoria Banco Central:</strong>
                        Ouvidoria: 0800 726 0322 | Atendimento ao Consumidor SAC: 0800 704 9090
                      </li>
                      <li>
                        <strong className="text-zinc-500 block uppercase text-[9px]">E-mail de Atendimento Oficial:</strong>
                        <a href="mailto:atendimento@centralwebaymore.com" className="text-[#ec0000] hover:underline font-bold">atendimento@centralwebaymore.com</a>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4 text-xs leading-relaxed text-zinc-300">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#ec0000]" /> Selo de Segurança Aymoré
                    </h4>
                    <p>
                      Todas as transações realizadas neste portal de autoatendimento são criptografadas de ponta a ponta. Nosso sistema é diretamente interligado à central de dados da Aymoré S.A. e do Banco Santander.
                    </p>
                    <p>
                      Qualquer inconsistência ou dúvida, não hesite em entrar em contato de forma direta com nossa Ouvidoria Reguladora ou com seu gerente de contas Santander mais próximo.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* ----------------- TAB: SERVIÇOS PRESTADOS ----------------- */}
            {activeTab === ActiveTab.SERVICOS && (
              <div className="space-y-12">
                
                {/* TAB HEADING */}
                <div className="text-center space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#ec0000] bg-red-50 px-2.5 py-1 rounded">Nossos Serviços</span>
                  <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight">Soluções Financeiras de Amplo Alcance</h2>
                  <p className="text-xs text-zinc-500 max-w-xl mx-auto">Oferecemos linhas de crédito estruturadas tanto para aquisições de bens pessoais quanto para infraestrutura comercial sustentável.</p>
                </div>

                {/* SERVICES GRID DESC */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      title: "Financiamento de Veículos",
                      desc: "Linha de crédito líder de mercado para aquisição de carros novos, seminovos, utilitários, motos e caminhões. Prazos estendidos de até 60 meses.",
                      accent: "border-red-100 hover:border-red-200"
                    },
                    {
                      title: "Financiamento de Energia Solar",
                      desc: "Crédito verde para instalação de kits fotovoltaicos residenciais ou corporativos. Economize até 95% na sua fatura de energia utilizando a luz solar.",
                      accent: "border-emerald-100 hover:border-emerald-200"
                    },
                    {
                      title: "Crédito Pessoal",
                      desc: "Empréstimos pessoais rápidos integrados em conta corrente para despesas emergenciais ou reformas estruturais, sem burocracia complexa.",
                      accent: "border-blue-100 hover:border-blue-200"
                    },
                    {
                      title: "Bens e Equipamentos para Empresas",
                      desc: "Financiamento para a ampliação ou modernização do parque fabril da sua empresa, incluindo maquinário agrícola, computadores e frotas de transporte.",
                      accent: "border-amber-100 hover:border-amber-200"
                    }
                  ].map((srv, sIdx) => (
                    <div key={sIdx} className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all space-y-3 ${srv.accent}`}>
                      <h3 className="font-extrabold text-sm text-zinc-950">{srv.title}</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">{srv.desc}</p>
                    </div>
                  ))}
                </div>

                {/* INTERACTIVE CREDIT SIMULATOR */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 md:p-8 space-y-6">
                  <div className="border-b border-zinc-200 pb-3">
                    <h3 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-[#ec0000]" /> Simulador de Financiamento Autoatendimento
                    </h3>
                    <p className="text-xs text-zinc-500">Realize um ensaio e descubra estimativas ideais de parcelamento para o seu orçamento</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* INPUTS SLIDERS CONTAINER */}
                    <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-xl border border-zinc-150">
                      
                      {/* Asset Value Slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline text-xs">
                          <label className="font-bold text-zinc-700">Valor Estimado do Bem:</label>
                          <span className="font-mono font-bold text-zinc-900 text-sm">
                            R$ {simuladorAssetValue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                          </span>
                        </div>
                        <input 
                          type="range" 
                          min={20000} 
                          max={200000} 
                          step={5000}
                          value={simuladorAssetValue}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setSimuladorAssetValue(val);
                            // Auto adjust down payment to keep it valid
                            if (simuladorDownPayment >= val) {
                              setSimuladorDownPayment(Math.round(val * 0.2));
                            }
                          }}
                          className="w-full accent-[#ec0000] cursor-pointer h-1.5 bg-zinc-200 rounded-lg appearance-none"
                        />
                        <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                          <span>R$ 20.000</span>
                          <span>R$ 200.000</span>
                        </div>
                      </div>

                      {/* Down Payment Slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline text-xs">
                          <label className="font-bold text-zinc-700">Entrada (Valor Pago no Início):</label>
                          <span className="font-mono font-bold text-zinc-900 text-sm">
                            R$ {simuladorDownPayment.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                          </span>
                        </div>
                        <input 
                          type="range" 
                          min={0} 
                          max={simuladorAssetValue - 5000} 
                          step={1000}
                          value={simuladorDownPayment}
                          onChange={(e) => setSimuladorDownPayment(Number(e.target.value))}
                          className="w-full accent-[#ec0000] cursor-pointer h-1.5 bg-zinc-200 rounded-lg appearance-none"
                        />
                        <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                          <span>Sem Entrada (R$ 0)</span>
                          <span>Máximo: R$ {(simuladorAssetValue - 5000).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</span>
                        </div>
                      </div>

                      {/* Repayment Terms Slider */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-zinc-700 mb-1.5">Prazo do Financiamento:</label>
                        <div className="grid grid-cols-5 gap-2">
                          {[12, 24, 36, 48, 60].map((t) => (
                            <button
                              key={t}
                              onClick={() => setSimuladorInstallmentsCount(t)}
                              className={`py-2 px-1.5 rounded text-xs font-bold transition-all border ${
                                simuladorInstallmentsCount === t 
                                  ? "border-[#ec0000] bg-red-50/50 text-[#ec0000]" 
                                  : "border-zinc-200 hover:bg-zinc-50 text-zinc-600"
                              }`}
                            >
                              {t} meses
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* DYNAMIC CALC SUMMARY BOX */}
                    <div className="bg-zinc-950 text-white rounded-xl p-6 flex flex-col justify-between space-y-6 border border-zinc-900 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/5 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="space-y-5 relative">
                        <h4 className="font-extrabold text-sm border-b border-white/10 pb-2.5 text-white">Resultado do Ensaio</h4>
                        
                        {(() => {
                          const calcs = calcSimulator();
                          return (
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <span className="block text-[10px] uppercase text-zinc-500 font-bold">Valor da Parcela Estimada:</span>
                                <span className="text-2xl font-black text-[#ec0000]">R$ {calcs.installment.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                                <span className="block text-[10px] text-zinc-400 font-light">Calculado com taxa média promocional de 1.69% a.m.</span>
                              </div>

                              <div className="space-y-2 text-xs border-t border-white/10 pt-3">
                                <div className="flex justify-between text-zinc-400">
                                  <span>Montante do Crédito:</span>
                                  <span className="font-semibold text-white">R$ {calcs.principal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-zinc-400">
                                  <span>Total de Juros Acumulados:</span>
                                  <span className="font-semibold text-white">R$ {calcs.totalInterest.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-zinc-400">
                                  <span>Soma Total Pagável:</span>
                                  <span className="font-bold text-white">R$ {calcs.totalPayable.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="pt-2 relative">
                        <a
                          href={WHATSAPP_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-[#ec0000] hover:bg-[#cc0000] text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2 cursor-pointer border-0 no-underline"
                        >
                          Contratar Financiamento Online
                        </a>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ----------------- TAB: SIMULADOR ----------------- */}
            {activeTab === ActiveTab.SIMULADOR && (
              <SimuladorView whatsappUrl={WHATSAPP_URL} />
            )}

            {/* ----------------- TAB: PERGUNTAS FREQUENTES (FAQ) ----------------- */}
            {activeTab === ActiveTab.FAQ && (
              <FaqView 
                onNavigateHome={() => setActiveTab(ActiveTab.HOME)} 
                whatsappUrl={WHATSAPP_URL} 
              />
            )}

            {/* ----------------- TAB: CONTATO ----------------- */}
            {activeTab === ActiveTab.CONTATO && (
              <ContatoView 
                onNavigateHome={() => setActiveTab(ActiveTab.HOME)} 
                whatsappUrl={WHATSAPP_URL} 
              />
            )}

            {/* ----------------- TAB: POLÍTICA DE PRIVACIDADE ----------------- */}
            {activeTab === ActiveTab.POLITICA_PRIVACIDADE && (
              <PoliticaPrivacidadeView 
                onNavigateHome={() => setActiveTab(ActiveTab.HOME)} 
                whatsappUrl={WHATSAPP_URL} 
              />
            )}

            {/* ----------------- TAB: TERMOS DE USO ----------------- */}
            {activeTab === ActiveTab.TERMOS_USO && (
              <TermosUsoView 
                onNavigateHome={() => setActiveTab(ActiveTab.HOME)} 
                whatsappUrl={WHATSAPP_URL} 
              />
            )}

         {/* BOTTOM QUICK INQUIRY WHATSAPP DIRECT */}
        <section className="mt-20 max-w-3xl mx-auto bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <Phone className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-zinc-900">Não localizou sua demanda? Atendimento Online</h3>
            <p className="text-xs text-zinc-500 max-w-lg mx-auto leading-relaxed">
              Nosso time especializado de suporte está disponível em tempo real para ajudar você com emissão de vias, quitações personalizadas, esclarecimento de dúvidas e qualquer outra demanda cadastral.
            </p>
          </div>

          <div className="pt-2">
            <a 
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#ec0000] hover:bg-[#cc0000] active:scale-[0.98] text-white font-extrabold py-3.5 px-8 rounded-full text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer border-0 no-underline"
            >
              Falar com Atendente Online <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <p className="text-[10px] text-zinc-400">
            Disponível de Segunda a Sexta das 08h às 20h, e aos Sábados das 08h às 14h.
          </p>
        </section>

          </motion.div>
        </AnimatePresence>
      </main>

      {/* FLOATING WHATSAPP BUTTON */}
      <a 
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#ec0000] hover:bg-[#cc0000] hover:scale-105 active:scale-95 transition-all text-white p-4 rounded-full shadow-2xl flex items-center justify-center gap-2 font-bold text-sm tracking-wide group cursor-pointer border-0 no-underline"
        title="Solicitar Atendimento Online"
      >
        <Phone className="w-5 h-5 animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap">
          Solicitar Atendimento Online
        </span>
      </a>

      {/* FOOTER */}
      <footer className="bg-zinc-950 text-[#888888] pt-16 pb-8 border-t border-zinc-900 select-none">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          
          {/* TOP SECTION: CONTACT LINKS & ACCREDITATIONS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.svg" 
                  alt="Aymoré Financiamentos Logo" 
                  className="w-8 h-8 object-contain select-none" 
                />
                <div className="flex flex-col">
                  <span className="text-white font-bold tracking-tight leading-none text-sm">Aymoré Financiamentos</span>
                  <span className="text-[9px] uppercase font-bold text-zinc-500">Grupo Santander</span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Sociedade financeira consolidada pelo Banco Central, provendo soluções justas de crédito a mais de 30 anos no Brasil.
              </p>
            </div>

            <div className="space-y-3.5">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Canais de Atendimento</h4>
              <ul className="space-y-2 text-xs">
                <li>Capitais e Regiões Metr.: <strong className="text-zinc-300">4004 9090</strong></li>
                <li>Demais Localidades: <strong className="text-zinc-300">0800 722 9090</strong></li>
                <li>SAC Deficiente Auditivo: <strong className="text-zinc-300">0800 771 0301</strong></li>
                <li>Ouvidoria Geral: <strong className="text-zinc-300">0800 726 0322</strong></li>
                <li>E-mail Oficial: <a href="mailto:atendimento@centralwebaymore.com" className="text-[#ec0000] hover:underline font-bold">atendimento@centralwebaymore.com</a></li>
              </ul>
            </div>

            <div className="space-y-3.5">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Links Regulatórios</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="https://www.bcb.gov.br/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Banco Central do Brasil <ExternalLink className="w-3 h-3" /></a></li>
                <li><a href="https://www.santander.com.br/atendimento-para-voce/seguranca" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Portal de Segurança Santander <ExternalLink className="w-3 h-3" /></a></li>
                <li><a href="https://www.consumidor.gov.br/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Consumidor.gov.br <ExternalLink className="w-3 h-3" /></a></li>
              </ul>
            </div>

            <div className="space-y-3.5">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Segurança Garantida</h4>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-[11px] text-zinc-400 space-y-2">
                <p>✓ Criptografia SSL integrada com servidores do Santander.</p>
                <p>✓ Baixa de gravames integrada com o RENAVAM.</p>
              </div>
            </div>

          </div>

          {/* COMPLIANCE DISCLOSURE PARAGRAPH (Exactly like official banks) */}
          <div className="border-t border-zinc-900 pt-8 text-[11px] text-zinc-500 leading-relaxed space-y-4">
            <p>
              SANTANDER SOCIEDADE DE CREDITO, FINANCIAMENTO E INVESTIMENTO S.A. (AYMORE CREDITO, FINANCIAMENTO E INVESTIMENTO S.A.) - CNPJ/MF nº 07.707.650/0001-10. Sede: Avenida Presidente Juscelino Kubitschek, 2041 e 2235, Bloco A, Vila Olímpia, São Paulo - SP, CEP 04543-011. Regulado e fiscalizado pelo Banco Central do Brasil.
            </p>
            <p>
              O crédito está sujeito à aprovação cadastral e creditícia por parte da instituição financeira no momento da contratação. Os custos tributários incidentes sobre as operações (como o IOF - Imposto sobre Operações Financeiras) e tarifas de cadastramento constam de forma explícita no respectivo Custo Efetivo Total (CET) apresentado previamente em todas as propostas comerciais físicas ou eletrônicas.
            </p>
            <p>
              A reprodução parcial ou integral de qualquer conteúdo visual, elementos de marca ou layouts deste portal de autoatendimento sem a devida concordância societária expressa é estritamente proibida por lei, sob as sanções civis e criminais cabíveis.
            </p>
          </div>

          {/* FINAL BOTTOM LINE */}
          <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-600 gap-4">
            <span>© 2026 Aymoré Financiamentos. Todos os direitos reservados. Grupo Santander Brasil.</span>
            <div className="flex gap-4 items-center">
              <span 
                onClick={() => setActiveTab(ActiveTab.POLITICA_PRIVACIDADE)} 
                className="cursor-pointer hover:text-white transition-colors"
              >
                Políticas de Privacidade
              </span>
              <span className="text-zinc-800">|</span>
              <span 
                onClick={() => setActiveTab(ActiveTab.TERMOS_USO)} 
                className="cursor-pointer hover:text-white transition-colors"
              >
                Termos de Uso do Portal
              </span>
              <span className="text-zinc-800">|</span>
              <span 
                onClick={() => setActiveTab(ActiveTab.FAQ)} 
                className="cursor-pointer hover:text-white transition-colors"
              >
                Perguntas Frequentes
              </span>
              <span className="text-zinc-800">|</span>
              <span 
                onClick={() => setActiveTab(ActiveTab.CONTATO)} 
                className="cursor-pointer hover:text-white transition-colors"
              >
                Contato
              </span>
              <span className="text-zinc-800">|</span>
              <button 
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="bg-transparent border-0 p-0 text-zinc-500 hover:text-red-500 font-semibold cursor-pointer flex items-center gap-1 transition-colors"
                title="Área exclusiva do proprietário do site para gerenciar leads recebidos"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Painel de Leads
              </button>
            </div>
          </div>

        </div>
      </footer>


      {/* ----------------- MODAL: DETAILED BOLETO VIEWER (PAYMENT SLIP) ----------------- */}
      <AnimatePresence>
        {selectedBoleto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 overflow-y-auto flex items-center justify-center p-4 backdrop-blur-xs"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-xl max-w-4xl w-full p-4 md:p-8 space-y-6 text-zinc-800 shadow-2xl relative border border-zinc-200"
            >
              
              {/* MODAL ACTIONS PANEL */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-200 pb-4 gap-4">
                <div>
                  <h4 className="font-extrabold text-base text-zinc-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#ec0000]" /> Boleto Bancário Santander
                  </h4>
                  <p className="text-xs text-zinc-500">Este é o documento de arrecadação unificado. pague em qualquer agência, internet banking ou app.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 sm:flex-none text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 py-2 px-3 rounded flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Imprimir
                  </button>
                  <button
                    onClick={() => setSelectedBoleto(null)}
                    className="flex-1 sm:flex-none text-xs bg-zinc-900 hover:bg-zinc-800 text-white py-2 px-4 rounded font-bold cursor-pointer"
                  >
                    Fechar Visualizador
                  </button>
                </div>
              </div>

              {/* PERFECT PIXEL REPRESENTATION OF BANCO SANTANDER BOLETO */}
              <div className="border border-zinc-400 p-4 md:p-6 bg-white overflow-x-auto text-zinc-900 font-mono text-[9px] md:text-[10px] space-y-4 select-text">
                
                {/* Header Banco code */}
                <div className="flex items-center justify-between border-b-2 border-black pb-2 gap-4">
                  <div className="flex items-center gap-2">
                    {/* Simulated logo */}
                    <div className="w-6 h-6 bg-[#ec0000] rounded flex items-center justify-center font-bold text-white text-xs">S</div>
                    <span className="font-extrabold text-base tracking-tight text-black">Santander</span>
                  </div>
                  <div className="border-x-2 border-black px-4 py-1 text-center">
                    <strong className="text-base font-black">033-7</strong>
                  </div>
                  <div className="flex-1 text-right">
                    <span className="text-[11px] font-black tracking-tight">{selectedBoleto.barcode}</span>
                  </div>
                </div>

                {/* Grid Fields row 1 */}
                <div className="grid grid-cols-4 border-b border-black">
                  <div className="col-span-3 border-r border-black p-1">
                    <span className="block text-[8px] uppercase text-zinc-500">Beneficiário</span>
                    <strong className="text-zinc-900 text-[10px] font-sans">SANTANDER SOCIEDADE DE CREDITO, FINANCIAMENTO E INVESTIMENTO S.A. — CNPJ: 07.707.650/0001-10</strong>
                  </div>
                  <div className="p-1">
                    <span className="block text-[8px] uppercase text-zinc-500">Agência / Código Beneficiário</span>
                    <strong className="text-zinc-900">3452 / 0770765-0</strong>
                  </div>
                </div>

                {/* Grid Fields row 2 */}
                <div className="grid grid-cols-4 border-b border-black">
                  <div className="border-r border-black p-1">
                    <span className="block text-[8px] uppercase text-zinc-500">Data do Documento</span>
                    <strong className="text-zinc-900">{new Date().toLocaleDateString("pt-BR")}</strong>
                  </div>
                  <div className="border-r border-black p-1">
                    <span className="block text-[8px] uppercase text-zinc-500">Nº do Documento</span>
                    <strong className="text-zinc-900">AY-{selectedBoleto.id.split("-").pop()}</strong>
                  </div>
                  <div className="border-r border-black p-1">
                    <span className="block text-[8px] uppercase text-zinc-500">Espécie Doc.</span>
                    <strong className="text-zinc-900">DM</strong>
                  </div>
                  <div className="p-1">
                    <span className="block text-[8px] uppercase text-zinc-500">Aceite</span>
                    <strong className="text-zinc-900">N</strong>
                  </div>
                </div>

                {/* Grid Fields row 3 */}
                <div className="grid grid-cols-4 border-b border-black">
                  <div className="border-r border-black p-1">
                    <span className="block text-[8px] uppercase text-zinc-500">Uso do Banco</span>
                    <strong className="text-zinc-900">G-033</strong>
                  </div>
                  <div className="border-r border-black p-1">
                    <span className="block text-[8px] uppercase text-zinc-500">Carteira</span>
                    <strong className="text-zinc-900">101 - Rápida</strong>
                  </div>
                  <div className="border-r border-black p-1">
                    <span className="block text-[8px] uppercase text-zinc-500">Espécie Moeda</span>
                    <strong className="text-zinc-900">REAL (R$)</strong>
                  </div>
                  <div className="p-1">
                    <span className="block text-[8px] uppercase text-zinc-500">Vencimento</span>
                    <strong className="text-zinc-900 text-xs text-[#ec0000]">{selectedBoleto.dueDate}</strong>
                  </div>
                </div>

                {/* Grid Fields row 4 (Instructions vs values) */}
                <div className="grid grid-cols-4 border-b-2 border-black">
                  <div className="col-span-3 border-r border-black p-1 space-y-2">
                    <span className="block text-[8px] uppercase text-zinc-500">Instruções de Responsabilidade do Beneficiário</span>
                    <div className="space-y-1.5 font-sans text-xs text-zinc-700 leading-relaxed">
                      <p>• NÃO RECEBER APÓS 30 DIAS DO VENCIMENTO.</p>
                      <p>• VALOR JÁ CONSOLIDA MULTA DE MORA DE ACORDO COM LEGISLAÇÃO BACEN.</p>
                      <p>• PAGÁVEL PREFERENCIALMENTE NOS CANAIS E CORRESPONDENTES DO SANTANDER.</p>
                      <p>• SAC AYMORE/SANTANDER FINANCIAMENTOS: 0800 704 9090.</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="p-1 border-b border-black">
                      <span className="block text-[8px] uppercase text-zinc-500">(=) Valor do Documento</span>
                      <strong className="text-zinc-950 text-sm">R$ {selectedBoleto.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
                    </div>
                    <div className="p-1 border-b border-black bg-zinc-50">
                      <span className="block text-[8px] uppercase text-zinc-500">(-) Desconto / Abatimento</span>
                      <strong className="text-zinc-500">R$ 0,00</strong>
                    </div>
                    <div className="p-1 bg-zinc-50">
                      <span className="block text-[8px] uppercase text-zinc-500">(=) Valor Cobrado</span>
                      <strong className="text-zinc-950 font-black">R$ {selectedBoleto.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
                    </div>
                  </div>
                </div>

                {/* Sacado (Payer) Details */}
                <div className="p-1.5 border-b border-black font-sans text-xs space-y-1">
                  <span className="block text-[8px] uppercase text-zinc-500">Sacado</span>
                  <div className="text-zinc-900">
                    <strong>{clientData?.name || "Diego Sales"}</strong> — CPF/CNPJ: {clientData?.cpfCnpj || "000.000.000-00"}
                  </div>
                  <div className="text-zinc-500 text-[10px]">
                    Endereço de Cadastro: Setor de Habitações Coletivas, São Paulo, SP
                  </div>
                </div>

                {/* Simulated Barcode block */}
                <div className="pt-4 flex flex-col items-center gap-2 select-none">
                  {/* Generated clean bar strips representation */}
                  <div className="h-14 w-full bg-zinc-900 flex items-center justify-around px-1 overflow-hidden">
                    {Array.from({ length: 65 }).map((_, bIdx) => (
                      <div 
                        key={bIdx} 
                        className="h-full bg-white" 
                        style={{ 
                          width: `${(bIdx % 3 === 0 ? 4 : (bIdx % 2 === 0 ? 2 : 1)) * 1.5}px` 
                        }} 
                      />
                    ))}
                  </div>
                  <span className="text-[10px] tracking-widest text-zinc-500 font-mono">Ficha de Compensação - Autenticação Mecânica no Verso</span>
                </div>

              </div>

              {/* ACTION QUICK COPY */}
              <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Linha Digitável de Cópia Rápida</span>
                  <p className="font-mono text-xs text-zinc-900 tracking-tight select-all">{selectedBoleto.barcode}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedBoleto.barcode, "Código de Barras")}
                  className="bg-[#ec0000] hover:bg-[#cc0000] text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer uppercase tracking-wider"
                >
                  <Copy className="w-4 h-4" /> Copiar Código
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------- MODAL: PIX QR CODE DIALOG ----------------- */}
      <AnimatePresence>
        {selectedPixCode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 overflow-y-auto flex items-center justify-center p-4 backdrop-blur-xs"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-xl max-w-md w-full p-6 text-zinc-800 shadow-2xl relative border border-zinc-200 text-center space-y-6"
            >
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded">Pagamento Instantâneo</span>
                <h4 className="font-extrabold text-lg text-zinc-950">PIX Copia e Cola Aymoré S.A.</h4>
                <p className="text-xs text-zinc-500">Liquidação do seu financiamento em tempo real (até 1 hora para baixa no contrato).</p>
              </div>

              {/* SIMULATED QR CODE ARTWORK */}
              <div className="w-48 h-48 mx-auto bg-white border border-zinc-300 rounded-lg p-2.5 flex items-center justify-center relative select-none shadow">
                {/* Simulated complex matrix of QR code */}
                <div className="grid grid-cols-8 gap-1 w-full h-full opacity-90">
                  {Array.from({ length: 64 }).map((_, qrIdx) => {
                    const isColored = (qrIdx % 3 === 0) || (qrIdx < 12) || (qrIdx > 48 && qrIdx % 2 === 0) || (qrIdx % 8 === 0 && qrIdx > 16);
                    return (
                      <div 
                        key={qrIdx} 
                        className={`rounded-xs ${isColored ? "bg-zinc-950" : "bg-transparent"}`} 
                      />
                    );
                  })}
                </div>
                {/* Floating mini brand flame inside center of QR Code */}
                <div className="absolute bg-[#ec0000] border-2 border-white text-white rounded p-1 text-[10px] font-bold">
                  S
                </div>
              </div>

              <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-200 space-y-2">
                <div className="text-xs font-bold text-zinc-900">Valor Atualizado: R$ {selectedPixCode.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                <div className="text-[10px] text-zinc-400">Beneficiário: SANTANDER SOCIEDADE DE CREDITO, FINANCIAMENTO E INVESTIMENTO S.A. (CNPJ: 07.707.650/0001-10)</div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    copyToClipboard(selectedPixCode.pixKey, "Chave PIX CNPJ");
                    setSelectedPixCode(null);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <Copy className="w-4 h-4" /> Copiar Chave PIX (CNPJ)
                </button>
                <button
                  onClick={() => setSelectedPixCode(null)}
                  className="w-full border border-zinc-300 hover:bg-zinc-50 text-zinc-700 py-2 rounded text-xs font-semibold cursor-pointer"
                >
                  Voltar ao Painel
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------- MODAL: ADMIN LEADS PANEL ----------------- */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 overflow-y-auto flex items-center justify-center p-4 backdrop-blur-xs font-sans"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-zinc-950 text-zinc-100 rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl relative border border-zinc-800 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="bg-zinc-900 border-b border-zinc-800 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Painel de Controle de Leads
                  </h3>
                  <p className="text-xs text-zinc-400">Gerenciamento offline-first e monitoramento do Supabase</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={exportLeadsToCsv}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1.5 border-0 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Exportar CSV
                  </button>
                  <button
                    type="button"
                    onClick={fetchBackupLeads}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1.5 border-0 cursor-pointer transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLeads ? "animate-spin" : ""}`} /> Atualizar
                  </button>
                  <button
                    type="button"
                    onClick={clearBackupLeads}
                    className="bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1.5 border-0 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Limpar Tudo
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAdminOpen(false)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 p-2 rounded-lg border-0 cursor-pointer transition-colors"
                    title="Fechar Painel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Database sync status widget */}
              {supabaseStatus && (
                <div className="bg-zinc-900/50 px-6 py-3 border-b border-zinc-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">Canal de Captação:</span>
                    {supabaseStatus.disabled ? (
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded text-[10px] font-bold">✉ ENVIANDO POR E-MAIL</span>
                    ) : supabaseStatus.configured ? (
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded text-[10px] font-bold">✓ CONECTADO</span>
                    ) : (
                      <span className="bg-amber-950 text-amber-400 border border-amber-900/50 px-2 py-0.5 rounded text-[10px] font-bold">⚠ MODO BACKUP LOCAL ATIVO</span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-400 leading-normal max-w-xl text-left">
                    {supabaseStatus.disabled
                      ? "Os leads preenchidos no site são enviados diretamente ao e-mail atendimento@centralwebaymore.com e guardados para consulta neste painel."
                      : supabaseStatus.configured 
                        ? "Os leads estão sendo sincronizados com seu Supabase. Caso haja atraso de cache de esquemas, use a instrução SQL Helper no formulário de contato." 
                        : "Os leads estão salvos em segurança no servidor. Configure SUPABASE_URL e SUPABASE_ANONKEY no seu .env para ativar a gravação em nuvem."}
                  </div>
                </div>
              )}

              {/* Leads list or empty state */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px]">
                {isLoadingLeads ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-3">
                    <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
                    <p className="text-sm text-zinc-400">Buscando leads no servidor local...</p>
                  </div>
                ) : adminLeads.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-zinc-800 rounded-xl space-y-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto text-zinc-500">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm">Nenhum lead recebido ainda</h4>
                      <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                        Os leads preenchidos no formulário de simulação ou contato aparecerão aqui instantaneamente.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs text-zinc-500 pb-1">
                      <span>Mostrando {adminLeads.length} lead(s) recebidos</span>
                      <span>Backup local garantido</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {adminLeads.map((lead, index) => {
                        const nameVal = lead.name || lead.nome || "Não informado";
                        const cpfVal = lead.cpf || "Não informado";
                        const emailVal = lead.email || "Não informado";
                        const phoneVal = lead.phone || lead.telefone || "Não informado";
                        const subjectVal = lead.subject || lead.assunto || "Geral";
                        const msgVal = lead.message || lead.mensagem || "";
                        const dateVal = new Date(lead.created_at).toLocaleString("pt-BR");

                        return (
                          <div 
                            key={lead.id || index}
                            className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3 hover:border-zinc-700 transition-colors text-left"
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-800/50 pb-2.5">
                              <div className="space-y-0.5">
                                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                                  {nameVal}
                                  <span className="text-[10px] bg-red-950/60 text-red-400 font-bold px-2 py-0.5 rounded border border-red-900/30">
                                    {subjectVal}
                                  </span>
                                </h4>
                                <p className="text-xs text-zinc-400 font-mono">CPF: {cpfVal}</p>
                              </div>
                              <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                                {dateVal}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                              <div className="flex items-center gap-1.5 p-1.5 bg-zinc-950/40 rounded border border-zinc-850">
                                <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                                <span className="truncate select-all" title="Clique duas vezes para selecionar">{emailVal}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(emailVal);
                                    setToast({ message: "E-mail copiado!", type: "success" });
                                  }}
                                  className="ml-auto bg-transparent border-0 text-zinc-500 hover:text-white cursor-pointer p-0.5"
                                  title="Copiar e-mail"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="flex items-center gap-1.5 p-1.5 bg-zinc-950/40 rounded border border-zinc-850">
                                <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                                <span className="truncate select-all" title="Clique duas vezes para selecionar">{phoneVal}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(phoneVal);
                                    setToast({ message: "Telefone copiado!", type: "success" });
                                  }}
                                  className="ml-auto bg-transparent border-0 text-zinc-500 hover:text-white cursor-pointer p-0.5"
                                  title="Copiar telefone"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {msgVal && (
                              <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-850 space-y-1">
                                <span className="block text-[10px] uppercase font-bold text-zinc-500">Mensagem:</span>
                                <p className="text-xs text-zinc-300 whitespace-pre-wrap break-words leading-relaxed">
                                  {msgVal}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-zinc-900 border-t border-zinc-800 p-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsAdminOpen(false)}
                  className="bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-lg cursor-pointer border-0 transition-colors"
                >
                  Fechar Painel
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href={WHATSAPP_FLOATING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba57] text-white p-3.5 md:p-4 rounded-full shadow-2xl flex items-center justify-center gap-2 transition-all transform hover:scale-110 active:scale-95 group border border-emerald-400/30"
        title="Suporte Aymoré via WhatsApp"
        aria-label="Atendimento via WhatsApp"
      >
        <span className="hidden sm:inline-block max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold pl-1 pr-1">
          Suporte Aymoré
        </span>
        <MessageCircle className="w-6 h-6 md:w-7 md:h-7 fill-current" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full" />
      </a>

    </div>
  );
}
