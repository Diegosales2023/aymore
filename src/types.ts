/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ActiveTab {
  HOME = "home",
  BOLETO = "boleto",
  QUITACAO = "quitacao",
  PARCELAMENTO = "parcelamento",
  ANTECIPACAO = "antecipacao",
  SOBRE_NOS = "sobre-nos",
  SERVICOS = "servicos",
  ACORDO = "solicitar-acordo",
  SIMULAR_PARCELAMENTO = "simular-parcelamento",
  RENEGOCIACAO = "renegociacao-online"
}

export interface Contract {
  id: string;
  type: string;
  model: string;
  plate?: string;
  totalInstallments: number;
  paidInstallments: number;
  installmentValue: number;
  interestRate: string;
  startDate: string;
  originalAmount: number;
  outstandingBalance: number;
  status: "regular" | "late";
  lateInstallmentsCount: number;
}

export interface Bill {
  id: string;
  contractId: string;
  installmentNumber: number;
  dueDate: string;
  value: number;
  status: "pending" | "late" | "paid";
  barcode: string;
  pixKey: string;
}

export interface ClientData {
  name: string;
  cpfCnpj: string;
  contracts: Contract[];
}
