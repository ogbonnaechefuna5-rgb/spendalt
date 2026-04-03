import { SymbolViewProps } from 'expo-symbols';

export type Transaction = {
  id: string;
  name: string;
  category: string;
  time: string;
  amount: string;
  positive: boolean;
  icon: SymbolViewProps['name'];
  iconBg: string;
  iconColor: string;
};

export type TransactionGroup = {
  title: string;
  data: Transaction[];
};

export const TRANSACTION_GROUPS: TransactionGroup[] = [
  {
    title: 'TODAY',
    data: [
      {
        id: '1',
        name: 'Starbucks Coffee',
        category: 'Food & Drinks',
        time: '10:24 AM',
        amount: '-$12.50',
        positive: false,
        icon: 'fork.knife',
        iconBg: '#2D1A0E',
        iconColor: '#FF6B4A',
      },
      {
        id: '2',
        name: 'Uber Trip',
        category: 'Transport',
        time: '08:15 AM',
        amount: '-$24.80',
        positive: false,
        icon: 'car.fill',
        iconBg: '#0E1A2D',
        iconColor: '#4A8FFF',
      },
    ],
  },
  {
    title: 'YESTERDAY',
    data: [
      {
        id: '3',
        name: 'Apple Store',
        category: 'Shopping',
        time: '04:30 PM',
        amount: '-$1,299.00',
        positive: false,
        icon: 'bag.fill',
        iconBg: '#1A0E2D',
        iconColor: '#A855F7',
      },
      {
        id: '4',
        name: 'Monthly Salary',
        category: 'Income',
        time: '09:00 AM',
        amount: '+$4,500.00',
        positive: true,
        icon: 'banknote.fill',
        iconBg: '#0D2B1E',
        iconColor: '#2ECC9A',
      },
      {
        id: '5',
        name: 'Electric Utility',
        category: 'Bills',
        time: '07:12 AM',
        amount: '-$84.20',
        positive: false,
        icon: 'bolt.fill',
        iconBg: '#2D1A0E',
        iconColor: '#FF6B4A',
      },
    ],
  },
  {
    title: '20 OCT 2023',
    data: [
      {
        id: '6',
        name: 'Whole Foods Market',
        category: 'Groceries',
        time: '06:45 PM',
        amount: '-$67.30',
        positive: false,
        icon: 'cart.fill',
        iconBg: '#0D2B1E',
        iconColor: '#2ECC9A',
      },
    ],
  },
];

// Flat list for dashboard (recent 4)
export const TRANSACTIONS = TRANSACTION_GROUPS.flatMap(g => g.data).slice(0, 4);
