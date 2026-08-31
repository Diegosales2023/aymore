import React from "react";
import { ShieldCheck, Lock, FileText, CheckCircle2, UserCheck, Mail, Phone, ExternalLink } from "lucide-react";

interface PoliticaPrivacidadeViewProps {
  onNavigateHome: () => void;
  whatsappUrl: string;
}

export const PoliticaPrivacidadeView: React.FC<PoliticaPrivacidadeViewProps> = ({
  onNavigateHome,
  whatsappUrl
}) => {
  return (
    <div id="politica-privacidade-page" className="space-y-10 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 text-white p-8 md:p-12 rounded-2xl border border-zinc-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>LGPD • Lei nº 13.709/2018</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Política de Privacidade e Proteção de Dados
        </h1>
        <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-3xl">
          Esta Política de Privacidade estabelece o compromisso da <strong>Aymoré Crédito, Financiamento e Investimento S.A.</strong> (integrante do Grupo Santander Brasil) com a segurança, transparência e confidencialidade no tratamento dos seus dados pessoais em nosso portal oficial de autoatendimento.
        </p>
        <div className="pt-2 flex flex-wrap gap-4 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-400" /> Criptografia SSL/TLS 256 bits</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Em conformidade com o Banco Central</span>
          <span className="text-zinc-500">Última atualização: Agosto de 2026</span>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-10 shadow-sm space-y-8 text-zinc-700 text-sm leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-150 pb-2">
            <span className="w-6 h-6 rounded-full bg-red-50 text-[#ec0000] text-xs flex items-center justify-center font-black">1</span>
            Compromisso e Finalidade
          </h2>
          <p>
            A <strong>Aymoré Financiamentos</strong> respeita a privacidade de seus clientes e usuários. Esta política descreve como coletamos, armazenamos, utilizamos e protegemos as informações fornecidas durante a utilização dos serviços de autoatendimento online, tais como emissão de 2ª via de boletos, solicitação de quitação antecipada, antecipação de parcelas e renegociação de dívidas.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-150 pb-2">
            <span className="w-6 h-6 rounded-full bg-red-50 text-[#ec0000] text-xs flex items-center justify-center font-black">2</span>
            Dados Pessoais Coletados
          </h2>
          <p>
            Para que você possa consultar e gerenciar seus contratos de financiamento, podemos solicitar e tratar os seguintes dados pessoais:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-2">
              <h3 className="font-bold text-zinc-900 text-xs uppercase tracking-wide flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#ec0000]" /> Dados Cadastrais e de Identificação
              </h3>
              <ul className="text-xs text-zinc-600 space-y-1 list-disc list-inside">
                <li>Nome completo ou Razão Social</li>
                <li>Número de CPF ou CNPJ</li>
                <li>Número de telefone / WhatsApp de contato</li>
                <li>Endereço de e-mail</li>
              </ul>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-2">
              <h3 className="font-bold text-zinc-900 text-xs uppercase tracking-wide flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ec0000]" /> Dados Contratuais e Financeiros
              </h3>
              <ul className="text-xs text-zinc-600 space-y-1 list-disc list-inside">
                <li>Número do contrato de financiamento</li>
                <li>Placa ou chassi do veículo financiado</li>
                <li>Valor e data de vencimento de parcelas</li>
                <li>Histórico de liquidação e amortizações</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-150 pb-2">
            <span className="w-6 h-6 rounded-full bg-red-50 text-[#ec0000] text-xs flex items-center justify-center font-black">3</span>
            Bases Legais e Finalidade do Tratamento
          </h2>
          <p>
            O tratamento de dados pessoais realizado pela Aymoré é fundamentado nas seguintes hipóteses legais previstas no art. 7º da LGPD:
          </p>
          <ul className="space-y-2 text-xs text-zinc-600 list-disc list-inside">
            <li><strong>Execução de Contrato:</strong> Para identificar o cliente, localizar contratos ativos de financiamento e viabilizar a emissão de boletos, guias de quitação ou cálculo de renegociação.</li>
            <li><strong>Cumprimento de Obrigação Legal e Regulatória:</strong> Para atender normas do Banco Central do Brasil (Bacen), Conselho Monetário Nacional (CMN) e Receita Federal.</li>
            <li><strong>Proteção do Crédito:</strong> Para análise de risco de crédito e prevenção à fraude no sistema financeiro nacional.</li>
            <li><strong>Legítimo Interesse:</strong> Para aprimoramento da segurança dos nossos serviços digitais e combate a tentativas de golpes ou fraudes eletrônicas.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-150 pb-2">
            <span className="w-6 h-6 rounded-full bg-red-50 text-[#ec0000] text-xs flex items-center justify-center font-black">4</span>
            Segurança da Informação e Criptografia
          </h2>
          <p>
            Adotamos medidas técnicas e organizacionais rigorosas para proteger seus dados contra acessos não autorizados, perdas ou alterações ilícitas. Todas as transmissões de dados são protegidas por protocolos de criptografia <strong>SSL/TLS de 256 bits</strong>, os mesmos utilizados pelos maiores bancos do Brasil.
          </p>
          <div className="bg-red-50/60 border border-red-200 rounded-xl p-4 text-xs text-red-900 space-y-1">
            <p className="font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#ec0000]" /> Alerta de Segurança e Boletos Falsos:
            </p>
            <p>
              A Aymoré Financiamentos nunca solicita depósitos ou transferências via PIX em nome de pessoas físicas (CPFs). Nossos boletos e QR Codes oficiais possuem como beneficiário exclusivo o <strong>Banco Santander (Brasil) S.A.</strong> ou a <strong>Santander Sociedade de Crédito, Financiamento e Investimento S.A.</strong> (CNPJ 07.707.650/0001-10).
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-150 pb-2">
            <span className="w-6 h-6 rounded-full bg-red-50 text-[#ec0000] text-xs flex items-center justify-center font-black">5</span>
            Direitos do Titular de Dados
          </h2>
          <p>
            Nos termos do artigo 18 da LGPD, você possui o direito de solicitar a qualquer momento:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">✓ Confirmação da existência de tratamento</div>
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">✓ Acesso aos dados pessoais mantidos</div>
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">✓ Correção de dados incompletos ou inexatos</div>
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">✓ Informações sobre compartilhamento com terceiros</div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-150 pb-2">
            <span className="w-6 h-6 rounded-full bg-red-50 text-[#ec0000] text-xs flex items-center justify-center font-black">6</span>
            Canal do Encarregado de Proteção de Dados (DPO)
          </h2>
          <p>
            Para exercer seus direitos de titular ou tirar dúvidas sobre esta Política de Privacidade, entre em contato diretamente com nossa equipe de Privacidade e Encarregado pelo Tratamento de Dados Pessoais:
          </p>
          <div className="bg-zinc-900 text-white rounded-xl p-5 space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-red-400" />
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase">E-mail do DPO / Privacidade:</span>
                <a href="mailto:atendimento@centralwebaymore.com" className="text-white font-bold hover:underline">
                  atendimento@centralwebaymore.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t border-zinc-800 pt-3">
              <Phone className="w-5 h-5 text-red-400" />
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase">Central Telefônica e SAC:</span>
                <span className="text-white font-bold">0800 704 9090 • Ouvidoria: 0800 726 0322</span>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-zinc-200">
        <button
          onClick={onNavigateHome}
          className="text-xs font-bold text-zinc-700 hover:text-zinc-900 flex items-center gap-2 py-2 px-4 rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-colors"
        >
          ← Voltar para a Página Inicial
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#ec0000] hover:bg-[#cc0000] text-white font-bold py-3 px-6 rounded-full text-xs uppercase tracking-wider shadow flex items-center gap-2 transition-all"
        >
          <Phone className="w-4 h-4" /> Falar com Atendente de Privacidade
        </a>
      </div>
    </div>
  );
};
