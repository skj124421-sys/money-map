/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionCategory = 
  | 'Housing' 
  | 'Food' 
  | 'Transport' 
  | 'Entertainment' 
  | 'Health' 
  | 'Shopping' 
  | 'Services' 
  | 'Income' 
  | 'Other';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: TransactionCategory;
  type: 'income' | 'expense';
  accountId?: string;
  notes?: string;
}

export interface Budget {
  category: TransactionCategory;
  limit: number;
  userId?: string;
}

export interface Holding {
  id: string;
  userId: string;
  assetName: string;
  assetType: 'Equity' | 'Mutual Fund' | 'Digital Asset' | 'Physical';
  value: number;
  investedValue?: number;
  units?: number;
  avgPrice?: number;
  lastUpdated: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'bank' | 'credit' | 'cash';
  balance: number;
}
