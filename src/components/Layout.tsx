import React from 'react';
import { LogOut, Shield, TrendingUp, Users } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  onLogout?: () => void;
  showLogout?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, onLogout, showLogout = true }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-lg border-b border-blue-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Tata Consultancies</h1>
              <p className="text-sm text-gray-600">Your Trusted Financial Growth Partner</p>
            </div>
          </div>
          {showLogout && onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
        </div>
        {children}
      </main>

      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-300">Bank-level security with encrypted data protection</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">High Returns</h3>
              <p className="text-gray-300">Consistent daily returns with proven track record</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trusted by Thousands</h3>
              <p className="text-gray-300">Join our growing community of successful investors</p>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-400">&copy; 2024 Tata Consultancies. All rights reserved.</p>
            <p className="text-sm text-gray-500 mt-2">
              Withdrawal timings: 09:00 AM to 05:00 PM | Daily returns credited at midnight
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;