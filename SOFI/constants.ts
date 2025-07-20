import { User, Transaction, TransactionStatus } from './types';

export const INITIAL_USER_DATA: User = {
  name: 'Alex Johnson',
  accountNumber: '**** **** **** 1234',
  balance: 25480.50,
  email: 'alex.j@example.com',
  accountType: 'personal',
  idNumber: '12345678',
};

// Mock user database for login simulation
export const USERS: Record<string, User & { password?: string }> = {
    'alex.j@example.com': {
        ...INITIAL_USER_DATA,
        password: 'password123',
    },
    'contact@kenyacoop.com': {
        name: 'Kenya Coop Inc.',
        accountNumber: '**** **** **** 5678',
        balance: 150230.75,
        email: 'contact@kenyacoop.com',
        accountType: 'corporate',
        businessId: 'KRA123456',
        password: 'password123'
    }
};

export const VALID_BUSINESS_IDS = ["KRA123456", "REG234567", "CO-OP-BIZ-1"];


export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'chq_1',
    payee: 'Green Energy Corp',
    amount: 1250.00,
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
    memo: 'Monthly Utilities',
    status: TransactionStatus.Completed,
  },
  {
    id: 'chq_8',
    payee: 'CoinVortex Exchange',
    amount: 780.00,
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
    memo: 'Crypto purchase',
    status: TransactionStatus.Pending,
    isSuspicious: true,
    location: 'Remote Server via VPN',
    device: 'Chrome on Linux'
  },
  {
    id: 'chq_2',
    payee: 'Innovate Solutions Ltd.',
    amount: 5000.00,
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0],
    memo: 'Project Deposit',
    status: TransactionStatus.Completed,
  },
  {
    id: 'chq_3',
    payee: 'Prime Real Estate',
    amount: 2200.00,
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
    memo: 'Rent Payment',
    status: TransactionStatus.Pending,
  },
  {
    id: 'chq_4',
    payee: 'The Corner Cafe',
    amount: 75.50,
    date: new Date().toISOString().split('T')[0],
    memo: 'Business Lunch',
    status: TransactionStatus.Initiated,
  },
  {
    id: 'chq_7',
    payee: 'QuickCash Services',
    amount: 3500.00,
    date: new Date().toISOString().split('T')[0],
    memo: 'Urgent withdrawal',
    status: TransactionStatus.Pending,
    isSuspicious: true,
    location: 'Lisbon, Portugal',
    device: 'Unknown Android Device'
  },
  {
    id: 'chq_5',
    payee: 'Tech Gadgets Inc.',
    amount: 499.99,
    date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0],
    memo: 'Office Supplies',
    status: TransactionStatus.Cancelled,
  },
  {
    id: 'chq_6',
    payee: 'Jane Doe',
    amount: 300.00,
    date: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString().split('T')[0],
    memo: 'Personal',
    status: TransactionStatus.Completed,
  },
];

export const KNOWN_BUSINESSES = [
  {
    name: 'Green Energy Corp',
    regNumber: 'REG-12345',
    tillNumber: '555111',
  },
  {
    name: 'Innovate Solutions Ltd.',
    regNumber: 'REG-67890',
    tillNumber: '555222',
  },
  {
    name: 'Tech Gadgets Inc.',
    regNumber: 'REG-54321',
    tillNumber: '555333',
  },
  {
    name: 'The Corner Cafe',
    regNumber: 'REG-98765',
    tillNumber: '555444',
  },
  {
    name: 'Kenya Coop Inc.',
    regNumber: 'KRA123456',
    tillNumber: '555999'
  }
];