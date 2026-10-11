import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Languages } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-[#F0F4EF] p-1 rounded-xl border border-[#E5EAE5]">
      <Languages className="w-3.5 h-3.5 text-gray-500 ml-1.5 mr-1" />
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-0.5 text-xs font-semibold rounded-lg transition-all ${
          language === 'en'
            ? 'bg-[#176B45] text-white shadow-xs'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('bn')}
        className={`px-2 py-0.5 text-xs font-semibold rounded-lg transition-all ${
          language === 'bn'
            ? 'bg-[#176B45] text-white shadow-xs'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        বাংলা
      </button>
    </div>
  );
};
