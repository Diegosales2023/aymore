import React, { useState } from "react";
import { Sliders, Calculator, Car, Handshake, Phone, ArrowRight, ShieldCheck, CheckCircle2, TrendingDown } from "lucide-react";

interface SimuladorViewProps {
  whatsappUrl: string;
}

export const SimuladorView: React.FC<SimuladorViewProps> = ({ whatsappUrl }) => {
  const [activeMode, setActiveMode] = useState<"veiculos" | "renegociacao">("veiculos");

  // Veículo Simulator State
  const [assetValue, setAssetValue] = useState<number>(65000);
  const [downPayment, setDownPayment] = useState<number>(15000);
  const [installments, setInstallments] = useState<number>(48);

  // Renegociação Simulator State
  const [debtBalance, setDebtBalance] = useState<number>(4800);
  const [debtDownPayment, setDebtDownPayment] = useState<number>(500);
  const [debtInstallments, setDebtInstallments] = useState<number>(12);

  // Vehicle calc
  const principalVehicle = Math.max(0, assetValue - downPayment);
  const rateVehicle = 0.0169; // 1.69% a.m.
  const installmentVehicle = principalVehicle > 0
    ? (principalVehicle * rateVehicle) / (1 - Math.pow(1 + rateVehicle, -installments))
    : 0;
  const totalPayableVehicle = installmentVehicle * installments;
  const totalInterestVehicle = totalPayableVehicle - principalVehicle;

  // Debt calc
  const principalDebt = Math.max(0, debtBalance - debtDownPayment);
  // Special discount on late charges
  const discountDebt = debtBalance * 0.15; // 15% discount on charges
  const discountedPrincipal = Math.max(0, principalDebt - (debtDownPayment > 0 ? 0 : discountDebt));
  const rateDebt = 0.0149; // 1.49% a.m.
  const installmentDebt = discountedPrincipal > 0
    ? (discountedPrincipal * rateDebt) / (1 - Math.pow(1 + rateDebt, -debtInstallments))
    : 0;
  const totalPayableDebt = installmentDebt * debtInstallments + debtDownPayment;

  return (
    <div id="simulador-page" className="space-y-10 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 text-white p-8 md:p-12 rounded-2xl border border-zinc-800 space-y-4 shadow-xl text-center">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-red-400 bg-red-950/60 border border-red-900 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
          <Calculator className="w-3.5 h-3.5" /> Simulador Oficial Santander Aymoré
        </span>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
          Simulador de Financiamento & Parcelamento
        </h1>
        <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Faça simulações em tempo real com as melhores taxas do mercado para financiar seu veículo ou renegociar contratos e dívidas pendentes.
        </p>

        {/* Mode Selector Tabs */}
        <div className="flex justify-center pt-2">
          <div className="bg-zinc-800/80 p-1.5 rounded-xl inline-flex border border-zinc-700">
            <button
              onClick={() => setActiveMode("veiculos")}
              className={`py-2.5 px-6 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeMode === "veiculos"
                  ? "bg-[#ec0000] text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Car className="w-4 h-4" /> Financiamento de Veículos
            </button>
            <button
              onClick={() => setActiveMode("renegociacao")}
              className={`py-2.5 px-6 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeMode === "renegociacao"
                  ? "bg-[#ec0000] text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Handshake className="w-4 h-4" /> Renegociação de Dívidas
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: VEÍCULOS */}
      {activeMode === "veiculos" && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 space-y-8 shadow-sm">
          <div className="border-b border-zinc-150 pb-4">
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <Car className="w-5 h-5 text-[#ec0000]" /> Simulação de Financiamento de Carros, Motos e Utilitários
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Ajuste os valores abaixo para calcular o plano ideal para a compra do seu veículo.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Sliders Column */}
            <div className="lg:col-span-2 space-y-6 bg-zinc-50/50 p-6 rounded-xl border border-zinc-200">
              
              {/* Asset Value Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <label className="font-bold text-zinc-700">Valor do Veículo:</label>
                  <span className="font-mono font-bold text-zinc-900 text-sm">
                    R$ {assetValue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                  </span>
                </div>
                <input
                  type="range"
                  min={15000}
                  max={250000}
                  step={5000}
                  value={assetValue}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAssetValue(val);
                    if (downPayment >= val) {
                      setDownPayment(Math.round(val * 0.2));
                    }
                  }}
                  className="w-full accent-[#ec0000] cursor-pointer h-2 bg-zinc-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>R$ 15.000</span>
                  <span>R$ 250.000</span>
                </div>
              </div>

              {/* Down Payment Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <label className="font-bold text-zinc-700">Valor da Entrada:</label>
                  <span className="font-mono font-bold text-zinc-900 text-sm">
                    R$ {downPayment.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={assetValue - 5000}
                  step={1000}
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full accent-[#ec0000] cursor-pointer h-2 bg-zinc-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>Sem Entrada (R$ 0)</span>
                  <span>Máximo: R$ {(assetValue - 5000).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</span>
                </div>
              </div>

              {/* Installments Buttons */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-700">Prazo Desejado:</label>
                <div className="grid grid-cols-5 gap-2">
                  {[12, 24, 36, 48, 60].map((t) => (
                    <button
                      key={t}
                      onClick={() => setInstallments(t)}
                      className={`py-2.5 px-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        installments === t
                          ? "border-[#ec0000] bg-red-50 text-[#ec0000] shadow-xs"
                          : "border-zinc-200 hover:bg-white text-zinc-600"
                      }`}
                    >
                      {t}x meses
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Summary Result Box */}
            <div className="bg-zinc-950 text-white rounded-xl p-6 flex flex-col justify-between space-y-6 border border-zinc-900">
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-white border-b border-white/10 pb-2">Resultado da Simulação</h3>
                
                <div className="space-y-1">
                  <span className="block text-[10px] uppercase text-zinc-400 font-bold">Valor da Parcela Estimada:</span>
                  <span className="text-3xl font-black text-[#ec0000]">
                    {installments}x de R$ {installmentVehicle.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="block text-[10px] text-zinc-400">Taxa estimada de 1,69% a.m. com aprovação rápida</span>
                </div>

                <div className="space-y-2 text-xs border-t border-white/10 pt-3">
                  <div className="flex justify-between text-zinc-400">
                    <span>Valor Financiado:</span>
                    <span className="font-semibold text-white">R$ {principalVehicle.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Total de Juros:</span>
                    <span className="font-semibold text-white">R$ {totalInterestVehicle.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Total do Contrato:</span>
                    <span className="font-bold text-white">R$ {totalPayableVehicle.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#ec0000] hover:bg-[#cc0000] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4" /> Solicitar Financiamento Online
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: RENEGOCIAÇÃO */}
      {activeMode === "renegociacao" && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 space-y-8 shadow-sm">
          <div className="border-b border-zinc-150 pb-4">
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <Handshake className="w-5 h-5 text-[#ec0000]" /> Simulação de Renegociação & Parcelamento de Dívida
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Calcule o desconto e as condições para regularizar suas parcelas em atraso com a Aymoré.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Sliders Column */}
            <div className="lg:col-span-2 space-y-6 bg-zinc-50/50 p-6 rounded-xl border border-zinc-200">
              
              {/* Debt Value Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <label className="font-bold text-zinc-700">Saldo Devedor em Aberto:</label>
                  <span className="font-mono font-bold text-zinc-900 text-sm">
                    R$ {debtBalance.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={30000}
                  step={500}
                  value={debtBalance}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setDebtBalance(val);
                    if (debtDownPayment >= val) {
                      setDebtDownPayment(Math.round(val * 0.1));
                    }
                  }}
                  className="w-full accent-[#ec0000] cursor-pointer h-2 bg-zinc-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>R$ 1.000</span>
                  <span>R$ 30.000</span>
                </div>
              </div>

              {/* Debt Down Payment Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <label className="font-bold text-zinc-700">Entrada Facilitada no Acordo:</label>
                  <span className="font-mono font-bold text-zinc-900 text-sm">
                    R$ {debtDownPayment.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={debtBalance - 500}
                  step={100}
                  value={debtDownPayment}
                  onChange={(e) => setDebtDownPayment(Number(e.target.value))}
                  className="w-full accent-[#ec0000] cursor-pointer h-2 bg-zinc-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>Sem Entrada (R$ 0)</span>
                  <span>Máximo: R$ {(debtBalance - 500).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</span>
                </div>
              </div>

              {/* Installments Buttons */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-700">Quantidade de Parcelas do Acordo:</label>
                <div className="grid grid-cols-5 gap-2">
                  {[6, 12, 18, 24, 36].map((t) => (
                    <button
                      key={t}
                      onClick={() => setDebtInstallments(t)}
                      className={`py-2.5 px-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                        debtInstallments === t
                          ? "border-[#ec0000] bg-red-50 text-[#ec0000] shadow-xs"
                          : "border-zinc-200 hover:bg-white text-zinc-600"
                      }`}
                    >
                      {t}x parcelas
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Summary Result Box */}
            <div className="bg-zinc-950 text-white rounded-xl p-6 flex flex-col justify-between space-y-6 border border-zinc-900">
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-white border-b border-white/10 pb-2">Proposta de Acordo</h3>
                
                <div className="space-y-1">
                  <span className="block text-[10px] uppercase text-zinc-400 font-bold">Parcela Mensal do Acordo:</span>
                  <span className="text-3xl font-black text-emerald-400">
                    {debtInstallments}x de R$ {installmentDebt.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  {debtDownPayment > 0 && (
                    <span className="block text-[10px] text-zinc-300">
                      + Entrada de R$ {debtDownPayment.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs border-t border-white/10 pt-3">
                  <div className="flex justify-between text-zinc-400">
                    <span>Desconto de Encargos:</span>
                    <span className="font-semibold text-emerald-400">- R$ {discountDebt.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Retirada do SPC/Serasa:</span>
                    <span className="font-semibold text-white">Em até 5 dias úteis</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Handshake className="w-4 h-4" /> Fechar Acordo via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
