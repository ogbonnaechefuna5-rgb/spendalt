export type BankAccount = {
  id: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  balance: string;
  emoji: string;
  color: string;
  lastSync: string;
  status: 'active' | 'error' | 'pending';
};

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    id: '1',
    bankName: 'First Bank Nigeria',
    accountType: 'Current Account',
    accountNumber: '•••• •••• 4821',
    balance: '₦1,240,000.00',
    emoji: '🏦',
    color: '#2563EB',
    lastSync: '2 mins ago',
    status: 'active',
  },
  {
    id: '2',
    bankName: 'GTBank',
    accountType: 'Savings Account',
    accountNumber: '•••• •••• 7703',
    balance: '₦580,450.00',
    emoji: '🟠',
    color: '#F97316',
    lastSync: '1 hour ago',
    status: 'active',
  },
  {
    id: '3',
    bankName: 'Zenith Bank',
    accountType: 'Domiciliary Account',
    accountNumber: '•••• •••• 1195',
    balance: '$2,300.00',
    emoji: '🔴',
    color: '#DC2626',
    lastSync: 'Sync failed',
    status: 'error',
  },
];
