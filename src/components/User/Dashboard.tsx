import React, { useState, useEffect } from 'react';
import { TrendingUp, Wallet, DollarSign, Star, Clock, Gift } from 'lucide-react';
import Layout from '../Layout';
import { User } from '../../types';
import { storage } from '../../utils/storage';
import { investmentPlans, getVipLevelName } from '../../utils/investment-plans';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onViewPlan: (planId: string) => void;
  onProfile: () => void;
  onWithdrawals: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  onLogout, 
  onViewPlan, 
  onProfile, 
  onWithdrawals 
}) => {
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    // Refresh user data from storage
    const users = storage.getUsers();
    const updatedUser = users.find(u => u.id === user.id);
    if (updatedUser) {
      setCurrentUser(updatedUser);
      storage.setCurrentUser(updatedUser);
    }
  }, [user.id]);

  const availablePlans = investmentPlans.filter(plan => 
    currentUser.vipLevel >= plan.vipRequired
  );

  const lockedPlans = investmentPlans.filter(plan => 
    currentUser.vipLevel < plan.vipRequired
  );

  return (
    <Layout title={`Welcome, ${currentUser.name}!`} onLogout={onLogout}>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">Start Your Investment Journey</h1>
            <p className="text-blue-100 text-lg">
              Choose from our high-return investment plans and grow your wealth daily
            </p>
            <div className="flex items-center mt-4 space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-300" />
                <span className="text-sm">{getVipLevelName(currentUser.vipLevel)} Member</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-200" />
                <span className="text-sm">Daily Returns at Midnight</span>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <img 
              src="https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop" 
              alt="Financial Growth" 
              className="w-64 h-40 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Balance</p>
              <p className="text-2xl font-bold text-gray-800">₹{currentUser.balance}</p>
            </div>
            <Wallet className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Invested</p>
              <p className="text-2xl font-bold text-gray-800">₹{currentUser.invested}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Earned</p>
              <p className="text-2xl font-bold text-gray-800">₹{currentUser.earned}</p>
            </div>
            <DollarSign className="h-10 w-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">VIP Level</p>
              <p className="text-2xl font-bold text-gray-800">{getVipLevelName(currentUser.vipLevel)}</p>
            </div>
            <Star className="h-10 w-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={onProfile}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all text-left"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Manage Profile</h3>
          <p className="text-gray-600">Update bank details and personal information</p>
        </button>

        <button
          onClick={onWithdrawals}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all text-left"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Withdraw Funds</h3>
          <p className="text-gray-600">Request withdrawal (Min: ₹90)</p>
        </button>
      </div>

      {/* Available Investment Plans */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Investment Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availablePlans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all relative">
              {plan.isHot && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                  <Gift className="h-3 w-3" />
                  <span>HOT</span>
                </div>
              )}
              
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-blue-600 mb-1">₹{plan.investment}</div>
                <p className="text-gray-600 text-sm">Investment Amount</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Daily Income</span>
                  <span className="font-semibold text-green-600">₹{plan.dailyIncome}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">{plan.days} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Return</span>
                  <span className="font-semibold text-blue-600">₹{plan.totalIncome}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profit</span>
                  <span className="font-semibold text-green-600">₹{plan.totalIncome - plan.investment}</span>
                </div>
              </div>

              <button
                onClick={() => onViewPlan(plan.id)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Invest Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Locked Plans */}
      {lockedPlans.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">VIP Plans (Unlock with Higher Investment)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lockedPlans.map((plan) => (
              <div key={plan.id} className="bg-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200 relative opacity-75">
                <div className="absolute inset-0 bg-gray-200/50 rounded-2xl flex items-center justify-center">
                  <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                    <p className="text-sm font-semibold text-gray-700">
                      Requires {getVipLevelName(plan.vipRequired)}
                    </p>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-600 mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-gray-500 mb-1">₹{plan.investment}</div>
                  <p className="text-gray-500 text-sm">Investment Amount</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Daily Income</span>
                    <span className="font-semibold text-gray-500">₹{plan.dailyIncome}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Total Return</span>
                    <span className="font-semibold text-gray-500">₹{plan.totalIncome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trust Indicators */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Why Thousands Trust Us</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <img 
              src="https://images.pexels.com/photos/3760069/pexels-photo-3760069.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop" 
              alt="Secure Investment" 
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
            <h4 className="font-semibold text-gray-800 mb-2">Bank-Level Security</h4>
            <p className="text-gray-600 text-sm">Your investments are protected with advanced encryption</p>
          </div>
          <div className="text-center">
            <img 
              src="https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop" 
              alt="Daily Returns" 
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
            <h4 className="font-semibold text-gray-800 mb-2">Consistent Returns</h4>
            <p className="text-gray-600 text-sm">Daily profits credited automatically at midnight</p>
          </div>
          <div className="text-center">
            <img 
              src="https://images.pexels.com/photos/3184435/pexels-photo-3184435.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop" 
              alt="Support Team" 
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
            <h4 className="font-semibold text-gray-800 mb-2">24/7 Support</h4>
            <p className="text-gray-600 text-sm">Dedicated customer support for all your queries</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;