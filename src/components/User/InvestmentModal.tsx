import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { investmentPlans } from '../../utils/investment-plans';
import { storage } from '../../utils/storage';
import { User, Investment, DailyReturn } from '../../types';

interface InvestmentModalProps {
  planId: string;
  user: User;
  onClose: () => void;
  onInvest: () => void;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ 
  planId, 
  user, 
  onClose, 
  onInvest 
}) => {
  const [step, setStep] = useState<'rules' | 'confirm' | 'success'>('rules');
  const [loading, setLoading] = useState(false);
  
  const plan = investmentPlans.find(p => p.id === planId);
  
  if (!plan) return null;

  const handleInvest = async () => {
    if (user.balance < plan.investment) {
      alert('Insufficient balance! Please add funds to your account.');
      return;
    }

    setLoading(true);

    // Create daily returns array
    const dailyReturns: DailyReturn[] = [];
    const startDate = new Date();
    
    for (let i = 0; i < plan.days; i++) {
      const returnDate = new Date(startDate);
      returnDate.setDate(returnDate.getDate() + i + 1);
      
      dailyReturns.push({
        date: returnDate.toISOString(),
        amount: plan.dailyIncome,
        credited: false
      });
    }

    // Create investment record
    const investment: Investment = {
      id: Date.now().toString(),
      userId: user.id,
      planId: plan.id,
      amount: plan.investment,
      dailyIncome: plan.dailyIncome,
      days: plan.days,
      totalIncome: plan.totalIncome,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      dailyReturns
    };

    // Update user data
    const users = storage.getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      users[userIndex].balance -= plan.investment;
      users[userIndex].invested += plan.investment;
      users[userIndex].totalInvestment += plan.investment;
      
      // Update VIP level based on total investment
      if (users[userIndex].totalInvestment >= 800) {
        users[userIndex].vipLevel = 2;
      } else if (users[userIndex].totalInvestment >= 250) {
        users[userIndex].vipLevel = 1;
      }
    }

    // Save investment
    const investments = storage.getInvestments();
    investments.push(investment);
    storage.saveInvestments(investments);
    
    // Save updated users
    storage.saveUsers(users);
    
    // Update current user in storage
    if (userIndex !== -1) {
      storage.setCurrentUser(users[userIndex]);
    }

    setLoading(false);
    setStep('success');
  };

  const handleSuccess = () => {
    onInvest();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">{plan.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 'rules' && (
            <div>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white mb-6">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Investment Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-200">Investment</p>
                      <p className="text-xl font-bold">₹{plan.investment}</p>
                    </div>
                    <div>
                      <p className="text-blue-200">Daily Income</p>
                      <p className="text-xl font-bold">₹{plan.dailyIncome}</p>
                    </div>
                    <div>
                      <p className="text-blue-200">Duration</p>
                      <p className="text-xl font-bold">{plan.days} days</p>
                    </div>
                    <div>
                      <p className="text-blue-200">Total Return</p>
                      <p className="text-xl font-bold">₹{plan.totalIncome}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                  Important Rules & Terms
                </h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>Daily returns are automatically credited to your wallet at midnight (12:00 AM).</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>Investment period starts immediately after confirmation and cannot be cancelled.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>Withdrawal requests can be made between 9:00 AM to 5:00 PM only.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>Minimum withdrawal amount is ₹90. Processing time: 24-48 hours.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>VIP levels are upgraded automatically based on total investment amount.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <p className="text-red-600 font-medium">Ensure sufficient balance before investing. Amount will be deducted immediately.</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h4 className="text-green-800 font-semibold mb-2">Your Current Status</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-green-600">Available Balance</p>
                    <p className="text-lg font-bold text-green-800">₹{user.balance}</p>
                  </div>
                  <div>
                    <p className="text-green-600">After Investment</p>
                    <p className="text-lg font-bold text-green-800">₹{user.balance - plan.investment}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('confirm')}
                disabled={user.balance < plan.investment}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {user.balance < plan.investment ? 'Insufficient Balance' : 'Proceed to Invest'}
              </button>
            </div>
          )}

          {step === 'confirm' && (
            <div>
              <div className="text-center mb-6">
                <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Your Investment</h3>
                <p className="text-gray-600">Please review the details before confirming</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-semibold">{plan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Investment Amount</span>
                    <span className="font-semibold">₹{plan.investment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Returns</span>
                    <span className="font-semibold text-green-600">₹{plan.dailyIncome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Profit</span>
                    <span className="font-semibold text-blue-600">₹{plan.totalIncome - plan.investment}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Balance</span>
                    <span className="font-semibold">₹{user.balance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Balance After Investment</span>
                    <span className="font-semibold">₹{user.balance - plan.investment}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep('rules')}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Go Back
                </button>
                <button
                  onClick={handleInvest}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Confirm Investment'}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div>
              <div className="text-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Investment Successful!</h3>
                <p className="text-gray-600">Your investment has been activated</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h4 className="text-green-800 font-semibold mb-2">What happens next?</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <p>• Your first daily return of ₹{plan.dailyIncome} will be credited tonight at midnight</p>
                  <p>• Daily returns will continue for {plan.days} days</p>
                  <p>• Total profit: ₹{plan.totalIncome - plan.investment}</p>
                  <p>• You can withdraw your earnings anytime (Min: ₹90)</p>
                </div>
              </div>

              <button
                onClick={handleSuccess}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all"
              >
                Continue to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;