import React, { useState, useEffect } from 'react';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import AdminLogin from './components/Auth/AdminLogin';
import Dashboard from './components/User/Dashboard';
import Profile from './components/User/Profile';
import Withdrawals from './components/User/Withdrawals';
import InvestmentModal from './components/User/InvestmentModal';
import AdminDashboard from './components/Admin/AdminDashboard';
import { User, Admin } from './types';
import { storage } from './utils/storage';

type View = 'login' | 'signup' | 'admin-login' | 'dashboard' | 'profile' | 'withdrawals' | 'admin-dashboard';

function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing user session
    const user = storage.getCurrentUser();
    const admin = storage.getCurrentAdmin();
    
    if (user) {
      setCurrentUser(user);
      setCurrentView('dashboard');
    } else if (admin) {
      setCurrentAdmin(admin);
      setCurrentView('admin-dashboard');
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleSignup = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleAdminLogin = (admin: Admin) => {
    setCurrentAdmin(admin);
    setCurrentView('admin-dashboard');
  };

  const handleLogout = () => {
    storage.setCurrentUser(null);
    storage.setCurrentAdmin(null);
    setCurrentUser(null);
    setCurrentAdmin(null);
    setCurrentView('login');
  };

  const handleViewPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleInvest = () => {
    // Refresh user data after investment
    if (currentUser) {
      const users = storage.getUsers();
      const updatedUser = users.find(u => u.id === currentUser.id);
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
    }
  };

  if (currentView === 'login') {
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToSignup={() => setCurrentView('signup')}
        onAdminLogin={() => setCurrentView('admin-login')}
      />
    );
  }

  if (currentView === 'signup') {
    return (
      <Signup
        onSignup={handleSignup}
        onSwitchToLogin={() => setCurrentView('login')}
      />
    );
  }

  if (currentView === 'admin-login') {
    return (
      <AdminLogin
        onLogin={handleAdminLogin}
        onBack={() => setCurrentView('login')}
      />
    );
  }

  if (currentView === 'admin-dashboard' && currentAdmin) {
    return (
      <AdminDashboard
        admin={currentAdmin}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === 'profile' && currentUser) {
    return (
      <Profile
        user={currentUser}
        onBack={() => setCurrentView('dashboard')}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === 'withdrawals' && currentUser) {
    return (
      <Withdrawals
        user={currentUser}
        onBack={() => setCurrentView('dashboard')}
        onLogout={handleLogout}
      />
    );
  }

  if (currentUser) {
    return (
      <>
        <Dashboard
          user={currentUser}
          onLogout={handleLogout}
          onViewPlan={handleViewPlan}
          onProfile={() => setCurrentView('profile')}
          onWithdrawals={() => setCurrentView('withdrawals')}
        />
        
        {selectedPlanId && (
          <InvestmentModal
            planId={selectedPlanId}
            user={currentUser}
            onClose={() => setSelectedPlanId(null)}
            onInvest={handleInvest}
          />
        )}
      </>
    );
  }

  return null;
}

export default App;