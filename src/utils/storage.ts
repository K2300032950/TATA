import { User, Investment, WithdrawalRequest, Admin } from '../types';

const STORAGE_KEYS = {
  USERS: 'tata_users',
  INVESTMENTS: 'tata_investments',
  WITHDRAWALS: 'tata_withdrawals',
  ADMINS: 'tata_admins',
  CURRENT_USER: 'tata_current_user',
  CURRENT_ADMIN: 'tata_current_admin'
};

export const storage = {
  // Users
  getUsers: (): User[] => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // Investments
  getInvestments: (): Investment[] => {
    const investments = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
    return investments ? JSON.parse(investments) : [];
  },

  saveInvestments: (investments: Investment[]) => {
    localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(investments));
  },

  // Withdrawals
  getWithdrawals: (): WithdrawalRequest[] => {
    const withdrawals = localStorage.getItem(STORAGE_KEYS.WITHDRAWALS);
    return withdrawals ? JSON.parse(withdrawals) : [];
  },

  saveWithdrawals: (withdrawals: WithdrawalRequest[]) => {
    localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(withdrawals));
  },

  // Admins
  getAdmins: (): Admin[] => {
    const admins = localStorage.getItem(STORAGE_KEYS.ADMINS);
    if (!admins) {
      // Initialize with default admin
      const defaultAdmins: Admin[] = [
        { id: '1', username: 'admin', password: 'admin123' }
      ];
      storage.saveAdmins(defaultAdmins);
      return defaultAdmins;
    }
    return JSON.parse(admins);
  },

  saveAdmins: (admins: Admin[]) => {
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
  },

  getCurrentAdmin: (): Admin | null => {
    const admin = localStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN);
    return admin ? JSON.parse(admin) : null;
  },

  setCurrentAdmin: (admin: Admin | null) => {
    if (admin) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(admin));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
    }
  }
};