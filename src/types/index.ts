export interface User {
  id: string;
  name: string;
  mobile: string;
  password: string;
  balance: number;
  invested: number;
  earned: number;
  vipLevel: number;
  totalInvestment: number;
  bankAccount?: BankAccount;
  createdAt: string;
}

export interface BankAccount {
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  accountHolderName: string;
}

export interface Investment {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  dailyIncome: number;
  days: number;
  totalIncome: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed';
  dailyReturns: DailyReturn[];
}

export interface DailyReturn {
  date: string;
  amount: number;
  credited: boolean;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  investment: number;
  dailyIncome: number;
  days: number;
  totalIncome: number;
  vipRequired: number;
  isHot?: boolean;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  requestDate: string;
  status: 'pending' | 'successful' | 'rejected';
  bankAccount: BankAccount;
  processedDate?: string;
}

export interface Admin {
  id: string;
  username: string;
  password: string;
}