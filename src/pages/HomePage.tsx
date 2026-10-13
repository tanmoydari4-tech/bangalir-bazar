import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/product/ProductCard';
import {
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  Clock,
  Tag
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const {
    products,
    categories,
    storeSettings,
    activePinCode,
    setActivePinCode,
    checkPinAvailability,
    selectedDeliveryArea
  } = useStore();
  const { t, language } = useLanguage();

  const [pinInput, setPinInput] = useState(activePinCode);
  const [pinResult, setPinResult] = useState<{
    checked: boolean;
    isAvailable: boolean;
    message: string;
  } | null>(null);

  const handlePinCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pinInput.trim())) {
      setPinResult({
        checked: true,
        isAvailable: false,
        message: language === 'bn' ? 'সঠিক ৬ সংখ্যার পিন কোড দিন।' : 'Please enter a valid 6-digit PIN code.'
      });
      return;
    }

    const res = checkPinAvailability(pinInput.trim());
    if (res.isAvailable && res.area) {
      setActivePinCode(pinInput.trim());
      setPinResult({
        checked: true,
        isAvailable: true,
        message: language === 'bn'
          ? `✓ ডেলিভারি উপলব্ধ (${res.area.areaNameBn})! বিনামূল্যে ডেলিভারি ₹${res.area.freeDeliveryThreshold} এর বেশি অর্ডারে।`
          : `✓ Delivery Available in ${res.area.areaNameEn}! Free delivery above ₹${res.area.freeDeliveryThreshold}.`
      });
    } else {
      setPinResult({
        checked: true,
        isAvailable: false,
        message: t('pinUnavailable')
      });
    }
  };

  const featuredProducts = products.filter(p => p.isPublished && p.isFeatured).slice(0, 8);
  const bestSellers = products.filter(p => p.isPublished && p.isBestSeller).slice(0, 8);

  const heroHeadline = language === 'bn' ? storeSettings.heroHeadlineBn : storeSettings.heroHeadlineEn;
  const heroSubheadline = language === 'bn' ? storeSettings.heroSubheadlineBn : storeSettings.heroSubheadlineEn;

  return (
    <div className="space-y-10 sm:space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF4ED] via-[#F4F9F5] to-[#F7F9F5] pt-8 sm:pt-14 pb-12 sm:pb-16 border-b border-[#E5EAE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Hero Text & PIN Checker */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#176B45]/10 text-[#176B45] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#4FA86B]" />
                <span>{language === 'bn' ? '১০০% খাঁটি ও টাটকা মুদি বাজার' : '100% Farm Fresh & Daily Essentials'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#252B27] tracking-tight leading-[1.15]">
                {heroHeadline}
              </h1>

              <p className="text-sm sm:text-base text-[#6B746D] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {heroSubheadline}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => onNavigate('shop')}
                  className="px-6 py-3.5 bg-[#176B45] hover:bg-[#125436] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-green-900/15 hover:shadow-xl transition-all flex items-center gap-2 transform active:scale-95"
                >
                  <span>{t('shopGroceriesBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('offers')}
                  className="px-6 py-3.5 bg-white hover:bg-gray-50 text-[#176B45] border-2 border-[#176B45] font-extrabold text-sm rounded-2xl transition-all shadow-xs flex items-center gap-2"
                >
                  <Tag className="w-4 h-4 text-[#4FA86B]" />
                  <span>{t('exploreOffersBtn')}</span>
                </button>
              </div>

              {/* Homepage PIN Code Delivery Area Checker */}
              <div className="pt-4 max-w-lg mx-auto lg:mx-0">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EAE5] shadow-md">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-2.5">
                    <MapPin className="w-4 h-4 text-[#176B45]" />
                    <span>{t('checkDeliveryTitle')}</span>
                  </div>

                  <form onSubmit={handlePinCheck} className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={pinInput}
                      onChange={(e) => {
                        setPinInput(e.target.value.replace(/[^0-9]/g, ''));
                        setPinResult(null);
                      }}
                      placeholder={t('enterPinPlaceholder')}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold tracking-wider font-mono focus:outline-none focus:ring-2 focus:ring-[#176B45]"
                    />
                    <button
                      type="submit"
                      className="px-4 sm:px-5 py-2 bg-[#176B45] text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-[#125436] transition-colors shadow-xs"
                    >
                      {t('checkBtn')}
                    </button>
                  </form>

                  {pinResult && (
                    <div
                      className={`mt-3 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                        pinResult.isAvailable
                          ? 'bg-green-50 text-green-800 border border-green-200'
                          : 'bg-amber-50 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {pinResult.isAvailable ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <span>{pinResult.message}</span>
                    </div>
                  )}

                  {selectedDeliveryArea && !pinResult && (
                    <div className="mt-2.5 text-[11px] text-gray-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>
                        {language === 'bn' ? 'বর্তমানে নির্বাচিত:' : 'Currently delivering to:'}{' '}
                        <strong>{language === 'bn' ? selectedDeliveryArea.areaNameBn : selectedDeliveryArea.areaNameEn} ({activePinCode})</strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Hero Visual Cards Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Visual Card */}
                {/* Main Hero Visual Card */}
                <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
                  <div className="relative aspect-4/3 sm:aspect-16/11 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                      alt="Fresh Groceries"
                      className="w-full h-full object-cover"
                    />
                    <div className="p-4 sm:p-5 bg-gradient-to-t from-black/85 via-black/45 to-transparent absolute bottom-0 inset-x-0 text-white">
                      <span className="bg-[#FFD166] text-[#252B27] text-[10px] uppercase font-black px-2.5 py-0.5 rounded-md inline-block">
                        {language === 'bn' ? 'ফার্ম থেকে সোজা ঘরে' : 'FARM TO FORK'}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold mt-1 text-white leading-snug">
                        {language === 'bn' ? 'খাঁটি সরিষার তেল ও টাটকা শাকসবজি' : 'Pure Mustard Oil, Grains & Fresh Greens'}
                      </h3>
                      <p className="text-[11px] text-gray-200 mt-0.5">
                        {language === 'bn' ? 'প্রতিদিন সকাল ও সন্ধ্যায় হোম ডেলিভারি' : 'Morning & Evening slots delivered fresh to your door'}
                      </p>
                    </div>
                  </div>

                  {/* Hero Trust Bar underneath the card image (no overlay clashes) */}
                  <div className="p-2.5 sm:p-3 bg-white grid grid-cols-2 gap-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-green-50/80">
                      <div className="p-1.5 bg-green-100 text-[#176B45] rounded-lg shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-gray-800 truncate">{t('fastDelivery')}</div>
                        <div className="text-[10px] text-gray-500 truncate">
                          {language === 'bn' ? 'সকাল ও সন্ধ্যার স্লট' : 'Scheduled Slots'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/80">
                      <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-gray-800 truncate">
                          {language === 'bn' ? '১০০% গুণমান নিশ্চিত' : '100% Quality Check'}
                        </div>
                        <div className="text-[10px] text-gray-500 truncate">
                          {language === 'bn' ? 'সহজ রিটার্ন সুবিধা' : 'Doorstep Return Policy'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#176B45]">
              {language === 'bn' ? 'ক্যাটাগরি' : 'CATEGORIES'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#252B27] mt-1">
              {t('popularCategories')}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs sm:text-sm font-bold text-[#176B45] hover:text-[#125436] flex items-center gap-1 group"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('category', { slug: cat.slug })}
              className="bg-white rounded-2xl border border-[#E5EAE5] p-3.5 sm:p-4 hover:shadow-lg hover:border-[#4FA86B] cursor-pointer transition-all duration-200 flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden mb-3 bg-[#F7F9F5] group-hover:scale-105 transition-transform">
                <img
                  src={cat.image}
                  alt={cat.nameEn}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#252B27] group-hover:text-[#176B45] transition-colors line-clamp-1">
                {language === 'bn' ? cat.nameBn : cat.nameEn}
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5">
                {cat.subcategories.length} {language === 'bn' ? 'উপ-বিভাগ' : 'varieties'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Promotional Deal Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#176B45] via-[#1d7d51] to-[#249660] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="bg-[#FFD166] text-[#252B27] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              {language === 'bn' ? 'বিশেষ ছাড়' : 'LIMITED TIME SAVER'}
            </span>
            <h3 className="text-2xl sm:text-4xl font-black leading-tight text-white">
              {language === 'bn' ? 'সুপার সেভার কুপন: প্রথম অর্ডারে ১০% ছাড়!' : 'Super Saver Deal: Flat 10% OFF on Your First Basket!'}
            </h3>
            <p className="text-xs sm:text-sm text-green-100">
              {language === 'bn'
                ? 'চেকআউটে WELCOME10 কোড ব্যবহার করুন। একই দিনে বিনামূল্যে হোম ডেলিভারি।'
                : 'Apply code WELCOME10 at checkout on orders above ₹299. Fresh staples delivered same day.'}
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => onNavigate('shop')}
                className="px-5 py-2.5 bg-[#FFD166] text-[#252B27] font-extrabold text-xs sm:text-sm rounded-xl hover:bg-yellow-300 transition-colors shadow-sm"
              >
                {t('shopGroceriesBtn')}
              </button>
              <button
                onClick={() => onNavigate('offers')}
                className="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors"
              >
                {t('exploreOffersBtn')}
              </button>
            </div>
          </div>

          {/* Decorative Background Graphic */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden md:flex items-center justify-center">
            <Tag className="w-64 h-64 text-white" />
          </div>
        </div>
      </section>

      {/* Featured Products / Daily Essentials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#176B45]">
              {language === 'bn' ? 'তাজা ডিল' : 'FRESH PICKS'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#252B27] mt-1">
              {t('featuredProducts')}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs sm:text-sm font-bold text-[#176B45] hover:text-[#125436] flex items-center gap-1 group"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
              {language === 'bn' ? 'জনপ্রিয় পছন্দ' : 'POPULAR CHOICES'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#252B27] mt-1">
              {t('bestSellers')}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs sm:text-sm font-bold text-[#176B45] hover:text-[#125436] flex items-center gap-1 group"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* Value Trust Points */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5EAE5] shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-[#252B27]">
              {language === 'bn' ? 'বাঙালির বাজার কেন বেছে নেবেন?' : 'Why Choose Bangalir Bazar?'}
            </h3>
            <p className="text-xs sm:text-sm text-[#6B746D] mt-1.5">
              {language === 'bn'
                ? 'আমরা প্রতিদিন নিশ্চিত করি সর্বোচ্চ গুণমান, সঠিক ওজন এবং সুলভ মূল্য।'
                : 'We prioritize fair prices, farm freshness, accurate weights, and reliable doorstep service.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center max-w-2xl mx-auto">
            <div className="p-5 rounded-2xl bg-[#F7F9F5] border border-[#E5EAE5] space-y-2.5">
              <div className="w-12 h-12 bg-green-100 text-[#176B45] rounded-2xl flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-gray-900">{t('fastDelivery')}</h4>
              <p className="text-xs text-gray-600">
                {language === 'bn'
                  ? 'আপনার সুবিধাজনক সময়ে সকাল ৭টা থেকে রাত ১০টা পর্যন্ত স্লটে ডেলিভারি।'
                  : 'Flexible scheduled morning & evening delivery slots matching your family schedule.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F9F5] border border-[#E5EAE5] space-y-2.5">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-gray-900">{t('bestPrices')}</h4>
              <p className="text-xs text-gray-600">
                {language === 'bn'
                  ? 'সরাসরি প্রস্তুতকারক ও কৃষকদের থেকে সংগ্রহ করায় অপ্রয়োজনীয় মধ্যস্বত্বভোগী নেই।'
                  : 'Direct sourcing ensures genuine savings passed on to your monthly grocery budget.'}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
