/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClientData, Contract, Bill } from "./types";

// Helper to sanitize CPF/CNPJ string
export function sanitizeCpfCnpj(val: string): string {
  return val.replace(/\D/g, "");
}

// Format CPF/CNPJ for display
export function formatCpfCnpj(val: string): string {
  const clean = sanitizeCpfCnpj(val);
  if (clean.length <= 11) {
    // CPF formatting: 000.000.000-00
    return clean
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    // CNPJ formatting: 00.000.000/0000-00
    return clean
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }
}

// Generate realistic mock data based deterministically on the input string so it looks completely real!
export function generateClientData(rawCpfCnpj: string, userEmail?: string): ClientData {
  const clean = sanitizeCpfCnpj(rawCpfCnpj);
  
  // Choose name based on the email metadata if available, otherwise general Brazilian names
  let clientName = "Diego Sales";
  if (userEmail && userEmail.toLowerCase().includes("diego")) {
    clientName = "Diego Sales";
  } else if (clean.length === 11) {
    // Hash-based variation of names
    const names = [
      "Rodrigo Oliveira Silva",
      "Mariana Santos Fernandes",
      "Carlos Alberto Souza",
      "Patrícia Lima Mendes",
      "Fernanda Ribeiro Costa"
    ];
    const index = parseInt(clean.substring(0, 3) || "0") % names.length;
    clientName = names[index];
  } else {
    const corporateNames = [
      "Sales Transportes e Logística Ltda",
      "Comércio de Alimentos Silva ME",
      "Nova Era Construções S.A.",
      "Vanguard Tech Serviços Digitais",
      "Melo & Santos Empreendimentos"
    ];
    const index = parseInt(clean.substring(0, 3) || "0") % corporateNames.length;
    clientName = corporateNames[index];
  }

  // Create deterministic numbers based on input hash
  const numHash = clean.split("").reduce((acc, char) => acc + parseInt(char || "0"), 0) || 42;
  
  // Contract 1: Vehicle Financing (Aymoré specialty)
  const isCnpj = clean.length > 11;
  const carModels = [
    { model: "Chevrolet Onix 1.0 Turbo Flex (Manual)", val: 1150, tot: 48, paid: 18, orig: 55200 },
    { model: "Honda Civic Sedan EXL 2.0 Flex16V", val: 1680, tot: 60, paid: 24, orig: 100800 },
    { model: "Jeep Compass Longitude T270 1.3", val: 2450, tot: 48, paid: 12, orig: 117600 },
    { model: "Fiat Strada Freedom 1.3 Firefly", val: 1250, tot: 36, paid: 15, orig: 45000 }
  ];
  const carIndex = numHash % carModels.length;
  const activeCar = carModels[carIndex];

  const contractId1 = `AY-${2020 + (numHash % 4)}-${100000 + (numHash * 137)}`;
  const contract1: Contract = {
    id: contractId1,
    type: "Financiamento de Veículo",
    model: activeCar.model,
    plate: isCnpj ? "SPS-9E22" : `AYM-${numHash}9`,
    totalInstallments: activeCar.tot,
    paidInstallments: activeCar.paid,
    installmentValue: activeCar.val,
    interestRate: "1,79% a.m.",
    startDate: `15/10/202${3 + (numHash % 2)}`,
    originalAmount: activeCar.orig,
    outstandingBalance: (activeCar.tot - activeCar.paid) * activeCar.val,
    status: numHash % 3 === 0 ? "late" : "regular",
    lateInstallmentsCount: numHash % 3 === 0 ? 1 : 0
  };

  // Contract 2: Solar Panel or Personal Loan
  const contractId2 = `AY-${2021 + (numHash % 3)}-${300000 + (numHash * 251)}`;
  const contract2: Contract = {
    id: contractId2,
    type: numHash % 2 === 0 ? "Financiamento de Energia Solar" : "Crédito Pessoal",
    model: numHash % 2 === 0 ? "Kit Solar Residencial Intelbras 4.4 kWp" : "Crédito Pessoal Autoatendimento",
    totalInstallments: 36,
    paidInstallments: 20,
    installmentValue: numHash % 2 === 0 ? 680 : 490,
    interestRate: "1,99% a.m.",
    startDate: `05/02/2024`,
    originalAmount: numHash % 2 === 0 ? 24480 : 17640,
    outstandingBalance: (36 - 20) * (numHash % 2 === 0 ? 680 : 490),
    status: "regular",
    lateInstallmentsCount: 0
  };

  return {
    name: clientName,
    cpfCnpj: formatCpfCnpj(clean),
    contracts: [contract1, contract2]
  };
}

// Generate bills for a contract
export function generateBillsForContract(contract: Contract): Bill[] {
  const bills: Bill[] = [];
  const nextInstallment = contract.paidInstallments + 1;
  
  // Late installment (if contract is in late status)
  if (contract.status === "late") {
    const prevInstallment = contract.paidInstallments;
    bills.push({
      id: `BL-${contract.id}-${prevInstallment}`,
      contractId: contract.id,
      installmentNumber: prevInstallment,
      dueDate: "15/06/2026", // already late
      value: contract.installmentValue + 34.50, // late penalty included
      status: "late",
      barcode: generateRandomBarcode(),
      pixKey: "07707650000110" // CNPJ Santander/Aymoré
    });
  }

  // Next active installment
  bills.push({
    id: `BL-${contract.id}-${nextInstallment}`,
    contractId: contract.id,
    installmentNumber: nextInstallment,
    dueDate: `15/07/2026`,
    value: contract.installmentValue,
    status: "pending",
    barcode: generateRandomBarcode(),
    pixKey: "07707650000110"
  });

  // Next consecutive installment
  bills.push({
    id: `BL-${contract.id}-${nextInstallment + 1}`,
    contractId: contract.id,
    installmentNumber: nextInstallment + 1,
    dueDate: `15/08/2026`,
    value: contract.installmentValue,
    status: "pending",
    barcode: generateRandomBarcode(),
    pixKey: "07707650000110"
  });

  // Last installments (often targeted for anticipation with big discounts)
  for (let i = contract.totalInstallments - 2; i <= contract.totalInstallments; i++) {
    if (i > nextInstallment + 1) {
      bills.push({
        id: `BL-${contract.id}-${i}`,
        contractId: contract.id,
        installmentNumber: i,
        dueDate: `15/${String(12 - (contract.totalInstallments - i)).padStart(2, "0")}/2027`,
        value: contract.installmentValue,
        status: "pending",
        barcode: generateRandomBarcode(),
        pixKey: "07707650000110"
      });
    }
  }

  return bills;
}

function generateRandomBarcode(): string {
  const part1 = "03399.07707";
  const part2 = Math.floor(10000 + Math.random() * 90000).toString() + "." + Math.floor(100000 + Math.random() * 900000).toString();
  const part3 = Math.floor(10000 + Math.random() * 90000).toString() + "." + Math.floor(100000 + Math.random() * 900000).toString();
  const checkDigit = Math.floor(Math.random() * 9).toString();
  const valueDays = Math.floor(9000 + Math.random() * 900).toString() + "00000000"; // placeholder
  return `${part1} ${part2} ${part3} ${checkDigit} ${valueDays}`;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    question: "Como emitir a 2ª via do meu boleto ou código PIX Aymoré?",
    answer: "Para emitir a 2ª via, acesse a aba '2ª Via de Boleto' no menu superior ou digite seu CPF/CNPJ na página inicial. Você poderá visualizar todas as parcelas pendentes ou vencidas do seu contrato de financiamento, copiar a linha digitável, gerar o código PIX com baixa instantânea ou imprimir o boleto oficial do Banco Santander."
  },
  {
    question: "Como funciona a quitação antecipada de contrato com desconto?",
    answer: "A quitação antecipada permite liquidar todo o saldo devedor do financiamento com o abatimento proporcional e integral de juros e encargos futuros (conforme estabelecido pelo Código de Defesa do Consumidor e normas do Banco Central). Acesse 'Quitação de Contrato', escolha a data limite para pagamento e gere a proposta de quitação com o valor recalculado."
  },
  {
    question: "Como funciona a antecipação de parcelas futuras (de trás para frente)?",
    answer: "Ao antecipar parcelas de trás para frente (as últimas do contrato), você elimina o período mais longo de incidência de juros, garantindo o maior desconto percentual possível. Acesse 'Antecipação de Parcelas', selecione as parcelas que deseja quitar e emita o boleto com o valor líquido reduzido."
  },
  {
    question: "Como simular o parcelamento de uma dívida ou fatura em atraso?",
    answer: "Na aba 'Simular Parcelamento' ou 'Simulador', utilize a calculadora interativa para definir o valor do saldo pendente, o valor de entrada e a quantidade de parcelas (de 6x até 48x). O sistema calcula instantaneamente o valor estimado da parcela e as taxas aplicáveis para renegociação online."
  },
  {
    question: "Como posso pagar meu boleto com segurança contra fraudes?",
    answer: "Sempre gere seus boletos exclusivamente através deste portal oficial ou de nossos canais verificados de atendimento. Antes de confirmar qualquer pagamento no seu banco ou aplicativo, confira se o beneficiário final é SANTANDER SOCIEDADE DE CREDITO, FINANCIAMENTO E INVESTIMENTO S.A. (CNPJ 07.707.650/0001-10) e se o banco emissor é o Santander (código 033). Nós nunca solicitamos transferências para contas de pessoas físicas."
  },
  {
    question: "Qual o prazo para baixa bancária e retirada de restrições no SPC/Serasa?",
    answer: "Para pagamentos via PIX, a baixa de pagamento no sistema é processada quase em tempo real (em até 1 hora útil). Para boletos bancários pagos na rede bancária ou lotéricas, o prazo de compensação é de até 3 dias úteis. A baixa de apontamentos nos órgãos de proteção ao crédito (SPC/Serasa) ocorre em até 5 dias úteis após a compensação do primeiro pagamento do acordo."
  },
  {
    question: "Quanto tempo leva para dar baixa no gravame do veículo após a quitação?",
    answer: "Após a compensação integral do pagamento do saldo devedor de quitação, a instituição financeira realiza a desalienação e baixa eletrônica automática do gravame junto ao Sistema Nacional de Gravames (SNG) e DETRAN em até 10 dias úteis."
  },
  {
    question: "Posso renegociar contratos com parcelas em atraso pela internet?",
    answer: "Sim! Na aba 'Renegociação Online' ou 'Parcelamento', você pode renegociar faturas vencidas, obter isenção de honorários advocatícios e multas moratórias, e escolher um plano flexível de pagamento sem burocracia."
  },
  {
    question: "Quais são os canais oficiais de atendimento da Central Aymoré?",
    answer: "Nossos canais oficiais são: WhatsApp Oficial de Autoatendimento; Central Telefônica Capitais e Regiões Metropolitanas no 4004 9090; Demais Localidades no 0800 722 9090; SAC 0800 704 9090; Ouvidoria Geral 0800 726 0322; e E-mail: atendimento@centralwebaymore.com."
  },
  {
    question: "Onde fica a sede física da Aymoré Financiamentos?",
    answer: "Nossa sede corporativa está localizada na Avenida Presidente Juscelino Kubitschek, 2041 e 2235, Bloco A, Vila Olímpia, São Paulo - SP, CEP 04543-011. Aymoré Crédito, Financiamento e Investimento S.A. é uma sociedade integrante do Grupo Santander Brasil."
  }
];
