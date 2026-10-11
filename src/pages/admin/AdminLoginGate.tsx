import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Database, Sparkles } from 'lucide-react';
import { SUPABASE_PROJECT_ID } from '../../services/supabase';

interface AdminLoginGateProps {
  onSuccess: () => void;
  onNavigateStore: () => void;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({ onSuccess, onNavigateStore }) => {
  const { login, storeSettings } = useStore();
  const { language } = useLanguage();

  const [email, setEmail] = useState('admin@bangalirbazar.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please provide an admin email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(email.trim(), 'admin');
      setIsLoading(false);
      onSuccess();
    }, 400);
  };

  const handleQuickAdminLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      login('admin@bangalirbazar.com', 'admin');
      setIsLoading(false);
      onSuccess();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#125436] via-[#176B45] to-[#252B27] flex items-center justify-center p-4 sm:p-6 text-white">
      <div className="max-w-lg w-full space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-[#FFD166] text-[#252B27] flex items-center justify-center mx-auto shadow-2xl font-black text-2xl">
            BB
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {language === 'bn' ? storeSettings.storeNameBn : storeSettings.storeNameEn}
          </h1>
          <p className="text-xs sm:text-sm text-green-100 font-medium">
            Store Administration & Real-Time Master Data Panel
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white text-gray-900 rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-[#176B45]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900">Administrator Sign In</h2>
              <p className="text-xs text-gray-500">
                Log in to edit all products, pricing, categories, and store data
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-700 font-bold mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bangalirbazar.com"
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176B45] text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176B45] text-xs font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#176B45] hover:bg-[#125436] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{isLoading ? 'Authenticating...' : 'Enter Admin Panel & Change All Data'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="w-full py-2.5 bg-[#FFD166] hover:bg-yellow-300 text-[#252B27] rounded-xl font-extrabold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Instant 1-Click Admin Login (Demo)</span>
            </button>
          </div>

          {/* Capabilities note */}
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-[11px] text-gray-600 space-y-1.5">
            <div className="font-bold text-gray-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full Admin Control Granted On Login:</span>
            </div>
            <ul className="list-disc pl-4 space-y-0.5 text-gray-500">
              <li>Change store name, tagline, announcement bar, and hero banner</li>
              <li>Add, update, or remove products and adjust prices in bulk</li>
              <li>Manage delivery PIN codes, charges, and delivery slots</li>
              <li>Sync with Supabase cloud database ({SUPABASE_PROJECT_ID})</li>
            </ul>
          </div>
        </div>

        {/* Return to store link */}
        <div className="text-center">
          <button
            onClick={onNavigateStore}
            className="inline-flex items-center gap-1.5 text-xs text-green-200 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Customer Storefront</span>
          </button>
        </div>

      </div>
    </div>
  );
};
