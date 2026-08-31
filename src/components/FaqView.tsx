import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Search, Phone, ShieldCheck, ArrowRight, MessageSquare } from "lucide-react";
import { FAQ_DATA, FaqItem } from "../data";

interface FaqViewProps {
  onNavigateHome: () => void;
  whatsappUrl: string;
}

export const FaqView: React.FC<FaqViewProps> = ({
  onNavigateHome,
  whatsappUrl
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]); // Open first 2 by default

  const toggleAccordion = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const filteredFaqs = FAQ_DATA.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="perguntas-frequentes-page" className="space-y-10 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 text-white p-8 md:p-12 rounded-2xl border border-zinc-800 space-y-4 shadow-xl text-center">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-red-400 bg-red-950/60 border border-red-900 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" /> Central de Ajuda & Dúvidas
        </span>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
          Perguntas Frequentes (FAQ)
        </h1>
        <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Encontre respostas rápidas e orientações detalhadas sobre emissão de 2ª via de boletos, quitação com desconto, antecipação, regras de segurança e canais de atendimento.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto pt-2">
          <div className="relative">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Digite sua dúvida (ex: quitação, 2ª via, gravame, pix)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-zinc-900 text-sm pl-12 pr-4 py-3.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-red-600 shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 font-bold"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FAQ List Accordion */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-zinc-200 text-center space-y-3">
            <HelpCircle className="w-10 h-10 text-zinc-300 mx-auto" />
            <p className="text-zinc-600 font-bold text-sm">Nenhuma pergunta encontrada com o termo "{searchTerm}".</p>
            <p className="text-xs text-zinc-400">Tente buscar por palavras-chave como "boleto", "desconto", "santander", "prazo".</p>
          </div>
        ) : (
          filteredFaqs.map((faq: FaqItem, index: number) => {
            const isOpen = openIndices.includes(index);
            return (
              <div
                key={index}
                className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs hover:border-red-200 transition-all"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 cursor-pointer hover:bg-zinc-50/50 transition-colors"
                >
                  <span className="font-extrabold text-sm md:text-base text-zinc-900 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-red-50 text-[#ec0000] text-xs flex items-center justify-center font-bold shrink-0">
                      {index + 1}
                    </span>
                    {faq.question}
                  </span>
                  <div className="shrink-0 text-zinc-400">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-[#ec0000]" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-zinc-600 text-xs md:text-sm leading-relaxed border-t border-zinc-100 bg-zinc-50/30">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Support Direct Box */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-[#ec0000] font-bold text-xs">
            <ShieldCheck className="w-4 h-4" /> Suporte Especializado Aymoré
          </div>
          <h3 className="text-xl font-bold text-zinc-900">Ainda precisa de esclarecimentos sobre seu contrato?</h3>
          <p className="text-xs text-zinc-600 max-w-xl">
            Nossos consultores oficiais estão prontos para auxiliar você em tempo real com informações seguras e atendimento humanizado.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#ec0000] hover:bg-[#cc0000] text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2 transition-all"
          >
            <MessageSquare className="w-4 h-4" /> Falar via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
