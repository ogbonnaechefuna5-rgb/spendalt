export type Budget = {
  id: string;
  category: string;
  icon: string;
  spent: number;
  limit: number;
  color: string;
};

export const BUDGETS: Budget[] = [
  { id: '1', category: 'Food & Dining',  icon: '🍔', spent: 320,  limit: 500,  color: '#F59E0B' },
  { id: '2', category: 'Shopping',       icon: '🛍️', spent: 480,  limit: 400,  color: '#EF4444' },
  { id: '3', category: 'Transport',      icon: '🚗', spent: 95,   limit: 200,  color: '#3B82F6' },
  { id: '4', category: 'Bills',          icon: '💡', spent: 210,  limit: 300,  color: '#8B5CF6' },
  { id: '5', category: 'Entertainment',  icon: '🎬', spent: 60,   limit: 150,  color: '#EC4899' },
  { id: '6', category: 'Health',         icon: '💊', spent: 40,   limit: 100,  color: '#2ECC9A' },
];
