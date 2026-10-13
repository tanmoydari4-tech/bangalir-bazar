import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, User, Lock, Mail, Phone, CheckCircle2, AlertCircle, Eye, EyeOff, UserPlus, LogIn, ArrowRight } from 'lucide-react';

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
  const { login, registerUser, registeredUsers } = useStore();
  const { t, language } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode || 'login');
  const [identifier, setIdentifier] = useState(''); // email or mobile
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'not_registered' | 'wrong_password' | 'duplicate' | 'validation' | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync mode if initialMode prop updates
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
      setError(null);
      setErrorType(null);
    }
  }, [initialMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorType(null);
    setSuccessMessage(null);

    if (mode === 'login') {
      const cleanId = identifier.trim();
      const cleanPass = password.trim();

      if (!cleanId || !cleanPass) {
        setError(
          language === 'bn'
            ? 'অনুগ্রহ করে ইমেইল/মোবাইল এবং পাসওয়ার্ড উভয়ই লিখুন।'
            : 'Please enter both your email/mobile and password.'
        );
        setErrorType('validation');
        return;
      }

      const isAdmin =
        cleanId.toLowerCase() === 'admin@bangalirbazar.com' ||
        cleanId.toLowerCase().includes('admin');

      // Attempt login
      const result = login(cleanId, cleanPass, isAdmin ? 'admin' : 'customer');

      if (!result.success) {
        // Login failed because account does not exist or password was wrong
        if (result.message && (result.message.includes('পাওয়া যায়নি') || result.message.includes('NOT_FOUND') || result.message.includes('অ্যাকাউন্ট তৈরি না করে'))) {
          setError(
            language === 'bn'
              ? 'কোনো অ্যাকাউন্ট পাওয়া যায়নি! অ্যাকাউন্ট তৈরি না করে কোনো ব্যবহারকারী লগইন করতে পারবেন না। অনুগ্রহ করে প্রথমে একটি নতুন অ্যাকাউন্ট তৈরি করুন।'
              : 'No account found! You cannot log in without creating an account first. Please create an account to continue.'
          );
          setErrorType('not_registered');
        } else if (result.message && (result.message.includes('ভুল পাসওয়ার্ড') || result.message.includes('password'))) {
          setError(
            language === 'bn'
              ? 'ভুল পাসওয়ার্ড! দয়া করে সঠিক পাসওয়ার্ড দিন।'
              : 'Incorrect password! Please check your password and try again.'
          );
          setErrorType('wrong_password');
        } else {
          setError(result.message || (language === 'bn' ? 'লগইন করতে সমস্যা হয়েছে।' : 'Login failed. Please try again.'));
          setErrorType('validation');
        }
        return;
      }

      // Successful login
      if (isAdmin) {
        onNavigate('admin');
      } else if (redirectTo) {
        onNavigate(redirectTo);
      } else {
        onNavigate('account');
      }
    } else {
      // mode === 'register'
      const cleanName = name.trim();
      const cleanEmail = regEmail.trim();
      const cleanMobile = regMobile.trim();
      const cleanPass = regPassword.trim();

      if (!cleanName || !cleanEmail || !cleanMobile || !cleanPass) {
        setError(
          language === 'bn'
            ? 'অনুগ্রহ করে সব তথ্য পূরণ করুন (নাম, মোবাইল, ইমেইল ও পাসওয়ার্ড)।'
            : 'Please fill in all registration fields (Name, Mobile, Email, and Password).'
        );
        setErrorType('validation');
        return;
      }

      if (!/^\d{10}$/.test(cleanMobile.replace(/\D/g, ''))) {
        setError(
          language === 'bn'
            ? 'অনুগ্রহ করে একটি সঠিক ১০ সংখ্যার মোবাইল নম্বর দিন।'
            : 'Please enter a valid 10-digit mobile number.'
        );
        setErrorType('validation');
        return;
      }

      if (cleanPass.length < 4) {
        setError(
          language === 'bn'
            ? 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।'
            : 'Password must be at least 4 characters.'
        );
        setErrorType('validation');
        return;
      }

      // Register user
      const result = registerUser(cleanName, cleanEmail, cleanMobile, cleanPass);

      if (!result.success) {
        setError(result.message || (language === 'bn' ? 'অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে।' : 'Failed to create account.'));
        if (result.message && (result.message.includes('ইতিমধ্যেই') || result.message.includes('exists'))) {
          setErrorType('duplicate');
        } else {
          setErrorType('validation');
        }
        return;
      }

      // Account created successfully! User is now officially registered and logged in
      setSuccessMessage(
        language === 'bn'
          ? 'আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে এবং আপনি লগইন হয়েছেন!'
          : 'Your account has been created successfully and you are now signed in!'
      );

      setTimeout(() => {
        if (redirectTo) {
          onNavigate(redirectTo);
        } else {
          onNavigate('account');
        }
      }, 500);
    }
  };

  const handleSwitchToRegisterFromError = () => {
    setMode('register');
    // Pre-fill email or mobile if entered
    if (identifier.includes('@')) {
      setRegEmail(identifier.trim());
    } else if (/^\d+$/.test(identifier.replace(/\D/g, ''))) {
      setRegMobile(identifier.replace(/\D/g, '').slice(-10));
    }
    setError(null);
    setErrorType(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12 space-y-6">
      
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
          {mode === 'login' ? (language === 'bn' ? 'লগইন করুন' : 'Sign In') : (language === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create Account')}
        </h1>
        <p className="text-xs text-gray-500">
          {mode === 'login'
            ? (language === 'bn' ? 'আপনার অর্ডার ও সংরক্ষিত তথ্য দেখতে লগইন করুন' : 'Sign in to access your orders and saved addresses')
            : (language === 'bn' ? 'মুদি বাজার অর্ডার করতে মাত্র ১ মিনিটে অ্যাকাউন্ট খুলুন' : 'Create an account to place grocery orders and track delivery')}
        </p>

        {(message || redirectTo === 'checkout') && (
          <div className="mt-3 p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs flex items-center gap-3 text-left font-medium shadow-xs">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
            <span className="leading-relaxed">
              {message || (language === 'bn'
                ? 'পণ্য অর্ডার করার আগে দয়া করে একটি অ্যাকাউন্ট তৈরি করুন অথবা লগইন করুন।'
                : 'Please log in or create an account before purchasing this product.')}
            </span>
          </div>
        )}
      </div>

      {/* Main Form Box */}
      <div className="bg-white rounded-3xl border border-[#E5EAE5] p-5 sm:p-7 shadow-sm space-y-5">
        
        {/* Toggle Mode Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
              setErrorType(null);
            }}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'login' ? 'bg-white text-[#176B45] shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'লগইন (Sign In)' : 'Sign In'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
              setErrorType(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'register' ? 'bg-white text-[#176B45] shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'নতুন অ্যাকাউন্ট (Register)' : 'Create Account'}</span>
          </button>
        </div>

        {/* Informational tip reminding about mandatory account creation */}
        {mode === 'login' && !error && (
          <div className="p-3 bg-emerald-50/70 border border-emerald-100 text-emerald-900 text-[11px] rounded-xl leading-relaxed flex items-center gap-2">
            <span className="font-bold shrink-0 text-emerald-700">ℹ️ {language === 'bn' ? 'লক্ষ্য করুন:' : 'Notice:'}</span>
            <span>
              {language === 'bn'
                ? 'অ্যাকাউন্ট তৈরি না করে কোনো ব্যবহারকারী লগইন করতে পারবেন না। অ্যাকাউন্ট না থাকলে পাশের "নতুন অ্যাকাউন্ট" ট্যাবে ক্লিক করুন।'
                : 'Users cannot log in without creating an account first. If you do not have an account, click the "Create Account" tab.'}
            </span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Notification with Direct Action */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl font-medium space-y-2.5">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>

            {/* If user tries to login without an account -> give them a 1-click button to register */}
            {mode === 'login' && errorType === 'not_registered' && (
              <div className="pt-2 border-t border-rose-200/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <span className="text-[11px] text-rose-700 font-semibold">
                  {language === 'bn' ? 'আপনার কি এখনো অ্যাকাউন্ট নেই?' : 'Do not have an account yet?'}
                </span>
                <button
                  type="button"
                  onClick={handleSwitchToRegisterFromError}
                  className="px-3.5 py-1.5 bg-[#176B45] hover:bg-[#125436] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#FFD166]" />
                  <span>{language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন (Register)' : 'Create Account Now'}</span>
                </button>
              </div>
            )}

            {/* If user tries to register with existing email/phone -> give them a button to switch to login */}
            {mode === 'register' && errorType === 'duplicate' && (
              <div className="pt-2 border-t border-rose-200/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <span className="text-[11px] text-rose-700 font-semibold">
                  {language === 'bn' ? 'আপনার ইতিমধ্যে অ্যাকাউন্ট রয়েছে?' : 'Already have an account?'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setIdentifier(regEmail || regMobile);
                    setError(null);
                    setErrorType(null);
                  }}
                  className="px-3.5 py-1.5 bg-[#176B45] hover:bg-[#125436] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#FFD166]" />
                  <span>{language === 'bn' ? 'লগইন করুন (Sign In)' : 'Sign In Now'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          
          {/* REGISTER MODE FIELDS */}
          {mode === 'register' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {language === 'bn' ? 'আপনার পুরো নাম' : 'Full Name'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'bn' ? 'উদা: তন্ময় দাস' : 'e.g. Tanmoy Das'}
                    autoComplete="off"
                    className="w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-[#176B45] focus:outline-none bg-[#F7F9F5]/40"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {language === 'bn' ? '১০ সংখ্যার মোবাইল নম্বর' : '10-Digit Mobile Number'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="9830012345"
                    autoComplete="off"
                    className="w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#176B45] focus:outline-none bg-[#F7F9F5]/40"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  {language === 'bn' ? 'ডেলিভারি আপডেট ও অর্ডার স্ট্যাটাস এই নম্বরে জানানো হবে' : 'Delivery updates will be sent to this number'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="off"
                    className="w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-[#176B45] focus:outline-none bg-[#F7F9F5]/40"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {language === 'bn' ? 'পাসওয়ার্ড (কমপক্ষে ৪ অক্ষর)' : 'Password (min. 4 characters)'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full pl-9 pr-10 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-[#176B45] focus:outline-none bg-[#F7F9F5]/40"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* LOGIN MODE FIELDS */
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {language === 'bn' ? 'নিবন্ধিত ইমেইল অথবা মোবাইল নম্বর' : 'Registered Email or Mobile Number'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={language === 'bn' ? 'আপনার নিবন্ধিত ইমেইল বা মোবাইল' : 'Registered email or phone number'}
                    autoComplete="off"
                    className="w-full pl-9 pr-3 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-[#176B45] focus:outline-none bg-[#F7F9F5]/40"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  {language === 'bn'
                    ? 'পূর্ববর্তী তৈরি করা অ্যাকাউন্টের ইমেইল অথবা মোবাইল নম্বর দিন'
                    : 'Enter the email or phone number used when creating your account'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-9 pr-10 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-[#176B45] focus:outline-none bg-[#F7F9F5]/40"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-[#176B45] hover:bg-[#125436] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            {mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4 text-[#FFD166]" />
                <span>{language === 'bn' ? 'লগইন করুন (Sign In)' : 'Sign In to Account'}</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 text-[#FFD166]" />
                <span>{language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন (Create Account)' : 'Create Free Account'}</span>
              </>
            )}
          </button>
        </form>

        {/* Bottom Switch Tab Prompt */}
        <div className="pt-3 border-t border-gray-100 text-center text-xs text-gray-600">
          {mode === 'login' ? (
            <div className="space-y-1.5">
              <span>{language === 'bn' ? 'আপনার কি এখনো কোনো অ্যাকাউন্ট নেই?' : "Don't have an account yet?"}</span>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                    setErrorType(null);
                  }}
                  className="font-extrabold text-[#176B45] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>{language === 'bn' ? 'এখানে ক্লিক করে নতুন অ্যাকাউন্ট তৈরি করুন' : 'Click here to create a new account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <span>{language === 'bn' ? 'ইতিমধ্যেই একটি অ্যাকাউন্ট রয়েছে?' : 'Already have an account?'}</span>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setErrorType(null);
                  }}
                  className="font-extrabold text-[#176B45] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>{language === 'bn' ? 'এখানে ক্লিক করে লগইন করুন' : 'Click here to sign in'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

