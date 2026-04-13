import { apiRequest } from './api';

export type SavingsGoal = {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  status: string;
  created_at: string;
};

export async function getSavingsGoals(): Promise<SavingsGoal[]> {
  const data = await apiRequest<{ goals: SavingsGoal[] }>('/savings');
  return data.goals ?? [];
}

export async function createSavingsGoal(payload: {
  name: string;
  target_amount: number;
  deadline?: string;
}): Promise<SavingsGoal> {
  const data = await apiRequest<{ goal: SavingsGoal }>('/savings', {
    method: 'POST',
    body: payload,
  });
  return data.goal;
}

export async function updateSavingsProgress(id: string, amount: number): Promise<void> {
  await apiRequest(`/savings/${id}/progress`, { method: 'PUT', body: { amount } });
}

export async function deleteSavingsGoal(id: string): Promise<void> {
  await apiRequest(`/savings/${id}`, { method: 'DELETE' });
}
