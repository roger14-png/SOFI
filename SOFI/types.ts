export enum TransactionStatus {
  Initiated = 'Initiated',
  Pending = 'Pending',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface Transaction {
  id: string;
  payee: string;
  amount: number;
  date: string;
  memo: string;
  status: TransactionStatus;
  isSuspicious?: boolean;
  location?: string;
  device?: string;
}

export interface User {
  name: string; // Person's full name or Business Name
  accountNumber: string;
  balance: number;
  email: string; // Used as the primary login identifier
  accountType: 'personal' | 'corporate';
  idNumber?: string; // For personal KYC
  businessId?: string; // For corporate verification
}