import { InvestmentPlan } from '../types';

export const investmentPlans: InvestmentPlan[] = [
  {
    id: 'basic-100',
    name: 'Starter Plan',
    investment: 100,
    dailyIncome: 50,
    days: 7,
    totalIncome: 350,
    vipRequired: 0
  },
  {
    id: 'vip-250',
    name: 'VIP Silver',
    investment: 250,
    dailyIncome: 150,
    days: 4,
    totalIncome: 600,
    vipRequired: 1,
    isHot: true
  },
  {
    id: 'vip-800',
    name: 'VIP Gold',
    investment: 800,
    dailyIncome: 400,
    days: 4,
    totalIncome: 1600,
    vipRequired: 2,
    isHot: true
  }
];

export const calculateVipLevel = (totalInvestment: number): number => {
  if (totalInvestment >= 800) return 2;
  if (totalInvestment >= 250) return 1;
  return 0;
};

export const getVipLevelName = (level: number): string => {
  switch (level) {
    case 0: return 'Basic';
    case 1: return 'VIP Silver';
    case 2: return 'VIP Gold';
    default: return 'Basic';
  }
};