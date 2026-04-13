import { apiRequest } from './api';

export type Budget = {
  id: string;
  category: string;
  amount: number;
  period: string;
  created_at: string;
};

export async function getBudgets(): Promise<Budget[]> {
  const data = await apiRequest<{ budgets: Budget[] }>('/budgets');
  return data.budgets ?? [];
}

export async function createBudget(payload: {
  category: string;
  amount: number;
  period: string;
}): Promise<Budget> {
  const data = await apiRequest<{ budget: Budget }>('/budgets', {
    method: 'POST',
    body: payload,
  });
  return data.budget;
}

export async function updateBudget(
  id: string,
  payload: { category: string; amount: number; period: string }
): Promise<void> {
  await apiRequest(`/budgets/${id}`, { method: 'PUT', body: payload });
}

export async function deleteBudget(id: string): Promise<void> {
  await apiRequest(`/budgets/${id}`, { method: 'DELETE' });
}
