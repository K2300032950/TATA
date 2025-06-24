import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, AlertCircle, Edit, Eye, EyeOff } from 'lucide-react';
import Layout from '../Layout';
import { Admin, User, WithdrawalRequest } from '../../types';
import { storage } from '../../utils/storage';

interface AdminDashboardProps {
  admin: Admin;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ admin, onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);
  const [editingUser, setEditingUser] = useState<{
    id: string;
    balance: number;
    earned: number;
    invested: number;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(storage.getUsers());
    setWithdrawals(storage.getWithdrawals());
  };

  const handleUpdateUser = (userId: string, field: 'balance' | 'earned' | 'invested', value: number) => {
    const usersList = storage.getUsers();
    const userIndex = usersList.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      usersList[userIndex][field] = value;
      
      // Recalculate VIP level if total investment changed
      if (field === 'invested') {
        usersList[userIndex].totalInvestment = value;
        if (value >= 800) {
          usersList[userIndex].vipLevel = 2;
        } else if (value >= 250) {
          usersList[userIndex].vipLevel = 1;
        } else {
          usersList[userIndex].vipLevel = 0;
        }
      }
      
      storage.saveUsers(usersList);
      setUsers(usersList);
      
      // Update current user if they're logged in
      const currentUser = storage.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        storage.setCurrentUser(usersList[userIndex]);
      }
    }
  };

  const handleUpdateWithdrawal = (withdrawalId: string, status: 'pending' | 'successful' | 'rejected') => {
    const withdrawalsList = storage.getWithdrawals();
    const withdrawalIndex = withdrawalsList.findIndex(w => w.id === withdrawalId);
    
    if (withdrawalIndex !== -1) {
      const withdrawal = withdrawalsList[withdrawalIndex];
      withdrawal.status = status;
      withdrawal.processedDate = new Date().toISOString();
      
      // If rejected, add money back to user balance
      if (status === 'rejected') {
        const usersList = storage.getUsers();
        const userIndex = usersList.findIndex(u => u.id === withdrawal.userId);
        if (userIndex !== -1) {
          usersList[userIndex].balance += withdrawal.amount;
          storage.saveUsers(usersList);
          setUsers(usersList);
        }
      }
      
      storage.saveWithdrawals(withdrawalsList);
      setWithdrawals(withdrawalsList);
    }
  };

  const totalUsers = users.length;
  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);
  const totalInvested = users.reduce((sum, user) => sum + user.invested, 0);
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;

  return (
    <Layout title="Admin Dashboard" onLogout={onLogout}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
            </div>
            <Users className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Balance</p>
              <p className="text-2xl font-bold text-gray-800">₹{totalBalance}</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Invested</p>
              <p className="text-2xl font-bold text-gray-800">₹{totalInvested}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Withdrawals</p>
              <p className="text-2xl font-bold text-gray-800">{pendingWithdrawals}</p>
            </div>
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Users Management</h2>
            <button
              onClick={() => setShowPasswords(!showPasswords)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showPasswords ? 'Hide' : 'Show'} Passwords</span>
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {users.map((user) => (
              <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.mobile}</p>
                    {showPasswords && (
                      <p className="text-sm text-red-600 font-mono">Password: {user.password}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Balance</p>
                    <p className="font-semibold">₹{user.balance}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Earned</p>
                    <p className="font-semibold">₹{user.earned}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Invested</p>
                    <p className="font-semibold">₹{user.invested}</p>
                  </div>
                </div>

                {selectedUser?.id === user.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3">Edit User Data</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Balance</label>
                        <input
                          type="number"
                          value={editingUser?.id === user.id ? editingUser.balance : user.balance}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            setEditingUser({ id: user.id, balance: value, earned: user.earned, invested: user.invested });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Earned</label>
                        <input
                          type="number"
                          value={editingUser?.id === user.id ? editingUser.earned : user.earned}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            setEditingUser({ id: user.id, balance: user.balance, earned: value, invested: user.invested });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Invested</label>
                        <input
                          type="number"
                          value={editingUser?.id === user.id ? editingUser.invested : user.invested}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            setEditingUser({ id: user.id, balance: user.balance, earned: user.earned, invested: value });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            if (editingUser) {
                              handleUpdateUser(user.id, 'balance', editingUser.balance);
                              handleUpdateUser(user.id, 'earned', editingUser.earned);
                              handleUpdateUser(user.id, 'invested', editingUser.invested);
                              setEditingUser(null);
                              setSelectedUser(null);
                            }
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingUser(null);
                            setSelectedUser(null);
                          }}
                          className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Withdrawals Management */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Withdrawal Requests</h2>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {withdrawals
              .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
              .map((withdrawal) => {
                const user = users.find(u => u.id === withdrawal.userId);
                return (
                  <div key={withdrawal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">₹{withdrawal.amount}</h3>
                        <p className="text-sm text-gray-600">{user?.name} ({user?.mobile})</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        withdrawal.status === 'successful' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {withdrawal.status}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      <p><strong>Bank:</strong> {withdrawal.bankAccount.bankName}</p>
                      <p><strong>Account:</strong> {withdrawal.bankAccount.accountNumber}</p>
                      <p><strong>IFSC:</strong> {withdrawal.bankAccount.ifscCode}</p>
                      <p><strong>Requested:</strong> {new Date(withdrawal.requestDate).toLocaleString()}</p>
                    </div>

                    {withdrawal.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateWithdrawal(withdrawal.id, 'successful')}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateWithdrawal(withdrawal.id, 'rejected')}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;