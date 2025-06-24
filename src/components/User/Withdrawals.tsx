import React, { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, Clock, CheckCircle, X, AlertCircle } from 'lucide-react';
import Layout from '../Layout';
import { User, WithdrawalRequest } from '../../types';
import { storage } from '../../utils/storage';

interface WithdrawalsProps {
  user: User;
  onBack: () => void;
  onLogout: () => void;
}

const Withdrawals: React.FC<WithdrawalsProps> = ({ user, onBack, onLogout }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);

  useEffect(() => {
    const allWithdrawals = storage.getWithdrawals();
    const userWithdrawals = allWithdrawals.filter(w => w.userId === user.id);
    setWithdrawals(userWithdrawals.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()));
  }, [user.id]);

  const isWithdrawalTime = () => {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 9 && hour < 17; // 9 AM to 5 PM
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const withdrawAmount = parseFloat(amount);

    if (!amount || withdrawAmount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      setLoading(false);
      return;
    }

    if (withdrawAmount < 90) {
      setMessage({ type: 'error', text: 'Minimum withdrawal amount is ₹90' });
      setLoading(false);
      return;
    }

    if (withdrawAmount > user.balance) {
      setMessage({ type: 'error', text: 'Insufficient balance' });
      setLoading(false);
      return;
    }

    if (!isWithdrawalTime()) {
      setMessage({ type: 'error', text: 'Withdrawal requests are only accepted between 9:00 AM to 5:00 PM' });
      setLoading(false);
      return;
    }

    if (!user.bankAccount) {
      setMessage({ type: 'error', text: 'Please add bank account details first from your profile' });
      setLoading(false);
      return;
    }

    // Create withdrawal request
    const withdrawalRequest: WithdrawalRequest = {
      id: Date.now().toString(),
      userId: user.id,
      amount: withdrawAmount,
      requestDate: new Date().toISOString(),
      status: 'pending',
      bankAccount: user.bankAccount
    };

    // Update user balance
    const users = storage.getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      users[userIndex].balance -= withdrawAmount;
      storage.saveUsers(users);
      storage.setCurrentUser(users[userIndex]);
    }

    // Save withdrawal request
    const allWithdrawals = storage.getWithdrawals();
    allWithdrawals.push(withdrawalRequest);
    storage.saveWithdrawals(allWithdrawals);

    // Update local state
    setWithdrawals([withdrawalRequest, ...withdrawals]);
    setAmount('');
    setMessage({ type: 'success', text: 'Withdrawal request submitted successfully! Processing time: 24-48 hours.' });
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'successful': return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'successful': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Layout title="Withdraw Funds" onLogout={onLogout}>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Withdrawal Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <DollarSign className="h-6 w-6 mr-2" />
              Request Withdrawal
            </h2>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Current Balance</h4>
              <p className="text-2xl font-bold text-blue-600">₹{user.balance}</p>
            </div>

            <form onSubmit={handleWithdrawal} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount (Min: ₹90)"
                  min="90"
                  max={user.balance}
                />
              </div>

              {!isWithdrawalTime() && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-red-600" />
                    <p className="text-red-700 font-medium">Withdrawal requests are only accepted between 9:00 AM to 5:00 PM</p>
                  </div>
                </div>
              )}

              {!user.bankAccount && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <p className="text-yellow-700 font-medium">Please add bank account details from your profile first</p>
                  </div>
                </div>
              )}

              {user.bankAccount && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Withdrawal will be sent to:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Bank:</strong> {user.bankAccount.bankName}</p>
                    <p><strong>Account:</strong> {user.bankAccount.accountNumber}</p>
                    <p><strong>IFSC:</strong> {user.bankAccount.ifscCode}</p>
                    <p><strong>Name:</strong> {user.bankAccount.accountHolderName}</p>
                  </div>
                </div>
              )}

              {message && (
                <div className={`p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-700' 
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isWithdrawalTime() || !user.bankAccount}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Request Withdrawal'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Withdrawal Information</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Minimum withdrawal: ₹90</li>
                <li>• Processing time: 24-48 hours</li>
                <li>• Withdrawal hours: 9:00 AM to 5:00 PM</li>
                <li>• No processing fees</li>
              </ul>
            </div>
          </div>

          {/* Withdrawal History */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Withdrawal History</h2>

            {withdrawals.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No withdrawal requests yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {withdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-800">₹{withdrawal.amount}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(withdrawal.status)}`}>
                          {getStatusIcon(withdrawal.status)}
                          <span className="capitalize">{withdrawal.status}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Request Date:</strong> {new Date(withdrawal.requestDate).toLocaleString()}</p>
                      {withdrawal.processedDate && (
                        <p><strong>Processed Date:</strong> {new Date(withdrawal.processedDate).toLocaleString()}</p>
                      )}
                      <p><strong>Bank:</strong> {withdrawal.bankAccount.bankName}</p>
                      <p><strong>Account:</strong> {withdrawal.bankAccount.accountNumber}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Withdrawals;