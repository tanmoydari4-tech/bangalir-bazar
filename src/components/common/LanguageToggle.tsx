import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Languages } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-[#F0F4EF] p-0.5 sm:p-1 rounded-xl border border-[#E5EAE5] shrink-0 shadow-xs">
      <Languages className="w-3.5 h-3.5 text-gray-500 ml-1.5 mr-1 hidden sm:block shrink-0" />
      <button
        onClick={() => setLanguage('en')}
        className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded-lg transition-all ${
          language === 'en'
            ? 'bg-[#176B45] text-white shadow-xs'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('bn')}
        className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded-lg transition-all ${
          language === 'bn'
            ? 'bg-[#176B45] text-white shadow-xs'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-label="বাংলা ভাষায় পরিবর্তন করুন"
      >
        <span className="sm:hidden">বাং</span>
        <span className="hidden sm:inline">বাংলা</span>
      </button>
    </div>
  );
};
