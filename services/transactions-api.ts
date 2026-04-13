import { apiRequest } from './api';

export type Transaction = {
  id: string;
  amount: number;
  type: string;
  merchant: string;
  category: string;
  description: string;
  transaction_date: string;
  created_at: string;
};

export type TransactionGroup = {
  title: string;
  data: Transaction[];
};

export async function getTransactions(page = 1, limit = 50): Promise<Transaction[]> {
  const data = await apiRequest<{ transactions: Transaction[] }>(
    `/transactions?page=${page}&limit=${limit}`
  );
  return data.transactions ?? [];
}

export async function ingestManual(payload: {
  amount: number;
  type: string;
  merchant: string;
  category: string;
  description: string;
}): Promise<Transaction> {
  const data = await apiRequest<{ transaction: Transaction }>('/transactions/ingest/manual', {
    method: 'POST',
    body: payload,
  });
  return data.transaction;
}

export async function ingestSMS(smsText: string): Promise<Transaction> {
  const data = await apiRequest<{ transaction: Transaction }>('/transactions/ingest/sms', {
    method: 'POST',
    body: { sms_text: smsText },
  });
  return data.transaction;
}

export function groupByDate(transactions: Transaction[]): TransactionGroup[] {
  const map = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const d = new Date(tx.transaction_date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    let label: string;
    if (d.toDateString() === today.toDateString()) label = 'Today';
    else if (d.toDateString() === yesterday.toDateString()) label = 'Yesterday';
    else label = d.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(tx);
  }
  return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
}
