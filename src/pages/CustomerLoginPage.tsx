import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, User, Lock, Mail, Phone, CheckCircle2 } from 'lucide-react';

interface CustomerLoginPageProps {
  redirectTo?: string;
  initialMode?: 'login' | 'register';
  message?: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const CustomerLoginPage: React.FC<CustomerLoginPageProps> = ({
  redirectTo,
  initialMode = 'login',
  message,
  onNavigate
}) => {
  const { login, registerUser } = useStore();
  const { t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        setError('Please enter both email and password.');
        return;
      }
      const isAdmin = email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin@bangalirbazar.com';
      login(email.trim(), isAdmin ? 'admin' : 'customer');
      if (isAdmin) {
        onNavigate('admin');
      } else if (redirectTo) {
        onNavigate(redirectTo);
      } else {
        onNavigate('account');
      }
    } else {
      if (!name.trim() || !email.trim() || !mobile.trim() || !password.trim()) {
        setError('Please fill in all registration fields.');
        return;
      }
      if (!/^\d{10}$/.test(mobile.trim())) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
      }
      registerUser(name.trim(), email.trim(), mobile.trim());
      if (redirectTo) {
        onNavigate(redirectTo);
      } else {
        onNavigate('account');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      
      {/* Brand logo & title */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-gradient-to-br from-[#176B45] to-[#4FA86B] rounded-2xl flex items-center justify-center mx-auto text-white shadow-md">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" stroke="#FFD166" strokeWidth="2.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-[#252B27]">
          {mode === 'login' ? t('login') : t('register')}
        </h1>
        <p className="text-xs text-gray-500">
          {mode === 'login' ? t('loginSubtitle') : t('registerSubtitle')}
        </p>

        {(message || redirectTo === 'checkout') && (
          <div className="mt-3 p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs flex items-center gap-3 text-left font-medium shadow-xs">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
            <span className="leading-relaxed">
              {message || (mode === 'register'
                ? 'Please log in or create an account before purchasing this product.'
                : 'Please log in or create an account before purchasing this product.')}
            </span>
          </div>
        )}
      </div>

      {/* Main Form Box */}
      <div className="bg-white rounded-3xl border border-[#E5EAE5] p-6 sm:p-8 shadow-sm space-y-5">
        
        {/* Toggle Mode Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
              mode === 'login' ? 'bg-white text-[#176B45] shadow-xs' : 'text-gray-600'
            }`}
          >
            {t('login')}
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
              mode === 'register' ? 'bg-white text-[#176B45] shadow-xs' : 'text-gray-600'
            }`}
          >
            {t('register')}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('fullName')}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tanmoy Dari"
                    className="w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-[#176B45] focus:outline-none"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t('mobileNumber')}</label>
                <div className="relative">
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="9830123456"
                    className="w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#176B45] focus:outline-none"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">{t('emailAddress')}</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-[#176B45] focus:outline-none"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">{t('password')}</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-[#176B45] focus:outline-none"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#176B45] hover:bg-[#125436] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md mt-2"
          >
            {mode === 'login' ? t('login') : t('register')}
          </button>
        </form>
      </div>

    </div>
  );
};
