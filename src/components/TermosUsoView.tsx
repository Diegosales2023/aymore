import React from "react";
import { FileCheck, ShieldAlert, Scale, HelpCircle, Phone, ArrowLeft } from "lucide-react";

interface TermosUsoViewProps {
  onNavigateHome: () => void;
  whatsappUrl: string;
}

export const TermosUsoView: React.FC<TermosUsoViewProps> = ({
  onNavigateHome,
  whatsappUrl
}) => {
  return (
    <div id="termos-uso-page" className="space-y-10 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 text-white p-8 md:p-12 rounded-2xl border border-zinc-800 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          <span>Regulamento & Diretrizes Oficiais</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Termos e Condições Gerais de Uso do Portal
        </h1>
        <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-3xl">
          Leia atentamente as condições que regem a utilização deste portal oficial de autoatendimento financeiro da <strong>Aymoré Crédito, Financiamento e Investimento S.A.</strong> (Grupo Santander Brasil).
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-10 shadow-sm space-y-8 text-zinc-700 text-sm leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-150 pb-2">
            <FileCheck className="w-5 h-5 text-[#ec0000]" /> 1. Aceitação dos Termos
          </h2>
          <p>
            Ao acessar e utilizar os serviços eletrônicos deste portal (emissão de 2ª via de boleto, solicitação de quitação, simulação de parcelamentos e acordos), o usuário declara ter lido, compreendido e aceito integralmente todas as disposições destes Termos de Uso e da Política de Privacidade associada.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-150 pb-2">
            <Scale className="w-5 h-5 text-[#ec0000]" /> 2. Objeto e Serviços Disponíveis
          </h2>
          <p>
            O portal destina-se a facilitar o autoatendimento e a gestão digital de contratos de financiamento concedidos pela Aymoré / Santander Financiamentos, permitindo:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-600">
            <li>Emissão instantânea de 2ª via de boletos de parcelas vencidas e a vencer;</li>
            <li>Geração de código Pix com chave oficial CNPJ Santander para liquidação imediata;</li>
            <li>Simulação e cálculo do saldo para quitação antecipada com deságio de juros contratuais;</li>
            <li>Antecipação de parcelas futuras (de trás para frente) com abatimento proporcional;</li>
            <li>Renegociação de contratos em atraso e acordos financeiros.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-150 pb-2">
            <ShieldAlert className="w-5 h-5 text-[#ec0000]" /> 3. Responsabilidade do Usuário e Veracidade
          </h2>
          <p>
            O usuário se compromete a fornecer informações cadastrais verdadeiras, exatas e atualizadas (como CPF, CNPJ, telefone e e-mail). O uso indevido de dados de terceiros sem a devida procuração ou autorização legal constitui infração às normas vigentes e à legislação penal brasileira (Art. 299 e Art. 307 do Código Penal).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-150 pb-2">
            <HelpCircle className="w-5 h-5 text-[#ec0000]" /> 4. Segurança nas Operações Financeiras
          </h2>
          <p>
            Para sua segurança, certifique-se sempre de que está navegando no domínio seguro oficial e verifique a autenticidade dos boletos gerados antes do pagamento. O beneficiário do boleto deve sempre constar como <strong>SANTANDER SOCIEDADE DE CRÉDITO, FINANCIAMENTO E INVESTIMENTO S.A.</strong> (CNPJ 07.707.650/0001-10) ou <strong>BANCO SANTANDER (BRASIL) S.A.</strong>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2 border-b border-zinc-150 pb-2">
            <Scale className="w-5 h-5 text-[#ec0000]" /> 5. Foro e Legislação Aplicável
          </h2>
          <p>
            Estes Termos são regidos pelas leis da República Federativa do Brasil, em conformidade com o Código de Defesa do Consumidor (Lei nº 8.078/1990) e o Marco Civil da Internet (Lei nº 12.965/2014). Fica eleito o Foro da Comarca da Capital do Estado de São Paulo para dirimir eventuais litígios oriundos do presente termo.
          </p>
        </section>

      </div>

      {/* Footer Nav */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-zinc-200">
        <button
          onClick={onNavigateHome}
          className="text-xs font-bold text-zinc-700 hover:text-zinc-900 flex items-center gap-2 py-2 px-4 rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para a Página Inicial
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#ec0000] hover:bg-[#cc0000] text-white font-bold py-3 px-6 rounded-full text-xs uppercase tracking-wider shadow flex items-center gap-2 transition-all"
        >
          <Phone className="w-4 h-4" /> Atendimento Online
        </a>
      </div>
    </div>
  );
};
