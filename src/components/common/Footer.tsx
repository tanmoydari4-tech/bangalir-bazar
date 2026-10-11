import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  MessageCircle
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { storeSettings, categories } = useStore();
  const { t, language } = useLanguage();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1f2822] text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Value Propositions Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-10 border-b border-gray-800 text-xs">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
            <Truck className="w-6 h-6 text-[#4FA86B] shrink-0" />
            <div>
              <div className="font-bold text-white">{t('fastDelivery')}</div>
              <div className="text-[11px] text-gray-400">{t('fastDeliveryDesc')}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
            <Sparkles className="w-6 h-6 text-[#FFD166] shrink-0" />
            <div>
              <div className="font-bold text-white">{t('freshProduce')}</div>
              <div className="text-[11px] text-gray-400">{t('freshProduceDesc')}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
            <ShieldCheck className="w-6 h-6 text-[#4FA86B] shrink-0" />
            <div>
              <div className="font-bold text-white">{t('bestPrices')}</div>
              <div className="text-[11px] text-gray-400">{t('bestPricesDesc')}</div>
            </div>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-10 border-b border-gray-800">
          
          {/* Brand & Address */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#176B45] to-[#4FA86B] p-1.5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" stroke="#FFD166" strokeWidth="2.5" />
                </svg>
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                {language === 'bn' ? storeSettings.storeNameBn : storeSettings.storeNameEn}
              </span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              {language === 'bn' ? storeSettings.heroSubheadlineBn : storeSettings.heroSubheadlineEn}
            </p>

            <div className="space-y-2 text-xs text-gray-300 pt-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#4FA86B] shrink-0 mt-0.5" />
                <span>{language === 'bn' ? storeSettings.addressBn : storeSettings.addressEn}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FFD166] shrink-0" />
                <a href={`tel:${storeSettings.contactPhone}`} className="hover:text-white transition-colors">
                  {storeSettings.contactPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${storeSettings.contactEmail}`} className="hover:text-white transition-colors">
                  {storeSettings.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{language === 'bn' ? storeSettings.openingHoursBn : storeSettings.openingHoursEn}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t('popularCategories')}
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate('category', { slug: cat.slug })}
                    className="text-gray-400 hover:text-white transition-colors text-left"
                  >
                    {language === 'bn' ? cat.nameBn : cat.nameEn}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('shop')}
                  className="text-[#4FA86B] font-semibold hover:underline"
                >
                  {t('viewAll')} →
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('shop')} className="text-gray-400 hover:text-white transition-colors">
                  {t('shopAll')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('offers')} className="text-gray-400 hover:text-white transition-colors">
                  {t('offers')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('orders')} className="text-gray-400 hover:text-white transition-colors">
                  {t('myOrders')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wishlist')} className="text-gray-400 hover:text-white transition-colors">
                  {t('wishlist')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="text-gray-400 hover:text-white transition-colors">
                  {t('aboutUs')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="text-gray-400 hover:text-white transition-colors">
                  {t('contactUs')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="text-gray-400 hover:text-white transition-colors">
                  {t('faq')}
                </button>
              </li>
            </ul>
          </div>

          {/* Policies & Consumer Protection */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t('customerService')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('shipping-policy')} className="text-gray-400 hover:text-white transition-colors">
                  {t('shippingPolicy')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('return-policy')} className="text-gray-400 hover:text-white transition-colors">
                  {t('returnPolicy')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cancellation-policy')} className="text-gray-400 hover:text-white transition-colors">
                  {t('cancellationPolicy')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy-policy')} className="text-gray-400 hover:text-white transition-colors">
                  {t('privacyPolicy')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms-conditions')} className="text-gray-400 hover:text-white transition-colors">
                  {t('termsConditions')}
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => onNavigate('admin')}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#FFD166] font-bold rounded-lg text-xs transition-colors"
                >
                  ⚙ {t('adminPortal')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            {t('copyrightText', { year: currentYear })}
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>FSSAI Certified Sourcing</span>
            <span>•</span>
            <span>100% Genuine Packaging</span>
            <span>•</span>
            <span>Secure Indian Payments</span>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Support Button */}
      <a
        href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-30 p-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center group"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
          {t('whatsappSupport')}
        </span>
      </a>
    </footer>
  );
};
