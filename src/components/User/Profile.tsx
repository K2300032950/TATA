import React, { useState } from 'react';
import { ArrowLeft, User, Smartphone, CreditCard, Building, Save } from 'lucide-react';
import Layout from '../Layout';
import { User as UserType, BankAccount } from '../../types';
import { storage } from '../../utils/storage';

interface ProfileProps {
  user: UserType;
  onBack: () => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onBack, onLogout }) => {
  const [bankAccount, setBankAccount] = useState<BankAccount>(
    user.bankAccount || {
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      accountHolderName: ''
    }
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!bankAccount.accountNumber || !bankAccount.ifscCode || !bankAccount.bankName || !bankAccount.accountHolderName) {
      setMessage({ type: 'error', text: 'Please fill in all bank details' });
      setLoading(false);
      return;
    }

    if (bankAccount.accountNumber.length < 9) {
      setMessage({ type: 'error', text: 'Account number must be at least 9 digits' });
      setLoading(false);
      return;
    }

    if (bankAccount.ifscCode.length !== 11) {
      setMessage({ type: 'error', text: 'IFSC code must be 11 characters' });
      setLoading(false);
      return;
    }

    const users = storage.getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      users[userIndex].bankAccount = bankAccount;
      storage.saveUsers(users);
      storage.setCurrentUser(users[userIndex]);
      setMessage({ type: 'success', text: 'Bank details saved successfully!' });
    }

    setLoading(false);
  };

  return (
    <Layout title="Profile Management" onLogout={onLogout}>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>

        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <User className="h-6 w-6 mr-2" />
            Personal Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={user.name}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={user.mobile}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Personal information cannot be modified for security reasons. 
              Contact support if you need to update these details.
            </p>
          </div>
        </div>

        {/* Bank Account Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <CreditCard className="h-6 w-6 mr-2" />
            Bank Account Details
          </h2>

          <form onSubmit={handleSaveBankDetails} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Holder Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={bankAccount.accountHolderName}
                  onChange={(e) => setBankAccount({...bankAccount, accountHolderName: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter account holder name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={bankAccount.bankName}
                  onChange={(e) => setBankAccount({...bankAccount, bankName: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter bank name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={bankAccount.accountNumber}
                  onChange={(e) => setBankAccount({...bankAccount, accountNumber: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter account number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={bankAccount.ifscCode}
                  onChange={(e) => setBankAccount({...bankAccount, ifscCode: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter IFSC code"
                  maxLength={11}
                />
              </div>
            </div>

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
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>{loading ? 'Saving...' : 'Save Bank Details'}</span>
            </button>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Important Security Information</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Bank details are encrypted and stored securely</li>
              <li>• These details will be used for withdrawal processing</li>
              <li>• Ensure accuracy to avoid withdrawal delays</li>
              <li>• Contact support immediately if you suspect any unauthorized access</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;