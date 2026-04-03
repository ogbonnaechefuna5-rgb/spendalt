export type SavingsGoal = {
  id: string;
  name: string;
  subtitle: string;
  saved: number;
  target: number;
  color: string;
  status: 'ACTIVE' | 'ON TRACK' | 'SLOW' | 'COMPLETE';
};

export const SAVINGS_GOALS: SavingsGoal[] = [
  { id: '1', name: 'Laptop Fund',    subtitle: 'MacBook Pro M3',    saved: 120000,  target: 500000,  color: '#2ECC9A', status: 'ACTIVE'   },
  { id: '2', name: 'Emergency Fund', subtitle: '6 months expenses', saved: 700000,  target: 1000000, color: '#2ECC9A', status: 'ON TRACK' },
  { id: '3', name: 'Vacation 2024',  subtitle: 'Zanzibar Trip',     saved: 150000,  target: 1500000, color: '#F59E0B', status: 'SLOW'     },
];

export const TOTAL_SAVED = SAVINGS_GOALS.reduce((s, g) => s + g.saved, 0);
export const TOTAL_TARGET = SAVINGS_GOALS.reduce((s, g) => s + g.target, 0);
