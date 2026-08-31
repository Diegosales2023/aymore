import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, ShieldCheck, Send, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
import { formatCpfCnpj } from "../data";

interface ContatoViewProps {
  onNavigateHome: () => void;
  whatsappUrl: string;
}

export const ContatoView: React.FC<ContatoViewProps> = ({
  onNavigateHome,
  whatsappUrl
}) => {
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    email: "",
    phone: "",
    subject: "2ª Via de Boleto",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.cpf || !formData.phone) {
      setErrorMsg("Por favor, preencha todos os campos obrigatórios (Nome, CPF e Telefone).");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMsg(errData.error || "Erro ao registrar solicitação. Tente novamente ou use o WhatsApp.");
      }
    } catch (err: any) {
      setErrorMsg("Erro de conexão ao enviar. Por favor, utilize o atendimento via WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contato-page" className="space-y-10 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 text-white p-8 md:p-12 rounded-2xl border border-zinc-800 space-y-4 shadow-xl text-center">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-red-400 bg-red-950/60 border border-red-900 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5" /> Canais Oficiais de Atendimento
        </span>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
          Fale Conosco • Central Aymoré
        </h1>
        <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Estamos à disposição para atender você com rapidez e segurança. Escolha o canal de sua preferência ou envie uma mensagem através do formulário abaixo.
        </p>
      </div>

      {/* Grid: Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: WhatsApp */}
        <div className="bg-white border-2 border-emerald-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-zinc-900">WhatsApp Oficial</h3>
            <p className="text-xs text-zinc-500 mt-1">Atendimento imediato para 2ª via de boletos e quitações com desconto.</p>
          </div>
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl shadow-sm transition-all"
            >
              Iniciar Conversa
            </a>
          </div>
        </div>

        {/* Card 2: Telefones */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 text-[#ec0000] flex items-center justify-center mx-auto">
            <Phone className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-zinc-900">Centrais Telefônicas</h3>
            <div className="text-xs text-zinc-600 space-y-1.5 mt-2">
              <p>Capitais e Regiões Metr.: <strong className="text-zinc-900 font-bold">4004 9090</strong></p>
              <p>Demais Localidades: <strong className="text-zinc-900 font-bold">0800 722 9090</strong></p>
              <p>SAC Aymoré: <strong className="text-zinc-900 font-bold">0800 704 9090</strong></p>
              <p>Ouvidoria: <strong className="text-zinc-900 font-bold">0800 726 0322</strong></p>
            </div>
          </div>
        </div>

        {/* Card 3: E-mail e Horário */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 text-center">
          <div className="w-14 h-14 rounded-full bg-zinc-100 text-zinc-800 flex items-center justify-center mx-auto">
            <Mail className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-zinc-900">E-mail e Horários</h3>
            <div className="text-xs text-zinc-600 space-y-1.5 mt-2">
              <p className="font-medium">
                <a href="mailto:atendimento@centralwebaymore.com" className="text-[#ec0000] font-bold hover:underline">
                  atendimento@centralwebaymore.com
                </a>
              </p>
              <div className="pt-2 text-[11px] text-zinc-500 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Seg a Sex: 08h às 20h | Sáb: 08h às 14h</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Contact Form Section */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-10 shadow-sm space-y-6">
        <div className="border-b border-zinc-150 pb-4">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#ec0000]" /> Enviar Mensagem para a Central de Atendimento
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Preencha os dados abaixo e nosso time entrará em contato com a solução do seu contrato.</p>
        </div>

        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-950">Solicitação Enviada com Sucesso!</h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              Recebemos sua mensagem. Um consultor entrará em contato via telefone ou WhatsApp em instantes para prestar o suporte solicitado.
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider shadow inline-flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Acompanhar via WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">CPF / CNPJ *</label>
                <input
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: formatCpfCnpj(e.target.value) })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-red-600 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Telefone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">E-mail</label>
                <input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Assunto da Demanda</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
              >
                <option value="2ª Via de Boleto">Emissão de 2ª Via de Boleto ou Pix</option>
                <option value="Quitação com Desconto">Quitação Antecipada de Contrato</option>
                <option value="Antecipação de Parcelas">Antecipação de Parcelas Futuras</option>
                <option value="Renegociação de Dívida">Renegociação e Acordo Financeiro</option>
                <option value="Baixa de Gravame">Baixa de Gravame e Desalienação</option>
                <option value="Outros Assuntos">Outras Dúvidas e Informações</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Mensagem ou Detalhes do Contrato</label>
              <textarea
                rows={3}
                placeholder="Descreva detalhes do seu contrato ou parcela se desejar..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#ec0000] hover:bg-[#cc0000] text-white font-bold py-3 px-8 rounded-xl text-xs uppercase tracking-wider shadow flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {loading ? "Enviando..." : <><Send className="w-4 h-4" /> Enviar Mensagem</>}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Corporate Address Footer Box */}
      <div className="bg-zinc-950 text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-zinc-900">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-red-500 font-bold text-xs uppercase">
            <MapPin className="w-4 h-4" /> Sede Corporativa
          </div>
          <h4 className="font-bold text-base text-white">SANTANDER / AYMORÉ S.A.</h4>
          <p className="text-xs text-zinc-400">
            Avenida Presidente Juscelino Kubitschek, 2041 e 2235, Bloco A, Vila Olímpia, São Paulo - SP, CEP 04543-011
          </p>
        </div>
        <div className="shrink-0 text-center md:text-right text-xs text-zinc-400">
          <span className="block font-bold text-zinc-200">CNPJ: 07.707.650/0001-10</span>
          <span>Instituição Financeira Regulada pelo Banco Central</span>
        </div>
      </div>
    </div>
  );
};
