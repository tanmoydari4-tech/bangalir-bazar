import React from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/product/ProductCard';
import { Tag, Sparkles, Copy, Check, ArrowRight } from 'lucide-react';

interface OffersPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ onNavigate }) => {
  const { products, coupons, applyCoupon, appliedCoupon } = useStore();
  const { t, language } = useLanguage();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const discountedProducts = products.filter(
    p => p.isPublished && p.originalPrice > p.sellingPrice
  );

  const handleApply = (code: string) => {
    applyCoupon(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      
      {/* Offers Banner */}
      <div className="bg-gradient-to-r from-[#176B45] via-[#218155] to-[#299b66] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="max-w-xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-[#FFD166] text-[#252B27] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SUPER VALUE DISCOUNTS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            {t('specialOffersTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-green-100">
            {language === 'bn'
              ? 'বাঙালির বাজারে খাঁটি নিত্যপ্রয়োজনীয় মুদি সামগ্রীতে প্রতিদিন বিশেষ সাশ্রয়ী ছাড় উপভোগ করুন।'
              : 'Save more every day on fresh staples, cooking oils, aromatic teas, and monthly grocery bulk packs.'}
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Tag className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Active Store Coupons */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#176B45]" />
          <h2 className="text-xl font-extrabold text-[#252B27]">
            Active Store Promo Codes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {coupons.filter(c => c.isActive).map((coupon) => {
            const isApplied = appliedCoupon?.code === coupon.code;
            return (
              <div
                key={coupon.id}
                className={`bg-white rounded-2xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                  isApplied ? 'border-[#176B45] shadow-md bg-green-50/20' : 'border-[#E5EAE5] hover:border-[#4FA86B]'
                }`}
              >
                {/* Coupon Cutout Notch Styling */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F7F9F5] border-r-2 border-[#E5EAE5]" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F7F9F5] border-l-2 border-[#E5EAE5]" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-extrabold text-[#176B45] bg-green-100/80 px-3 py-1 rounded-lg border border-green-200">
                      {coupon.code}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-gray-500">
                      Expires: {coupon.expiryDate}
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 font-medium">
                    {language === 'bn' ? coupon.descriptionBn : coupon.descriptionEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-dashed border-gray-200 flex items-center justify-between">
                  <div className="text-[11px] text-gray-500">
                    Min Cart: <strong>₹{coupon.minOrderValue}</strong>
                  </div>
                  <button
                    onClick={() => handleApply(coupon.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      isApplied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#176B45] hover:bg-[#125436] text-white'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Applied</span>
                      </>
                    ) : copiedCode === coupon.code ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Apply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Discounted Groceries Product Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#252B27]">
              Discounted Grocery Specials ({discountedProducts.length})
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Limited-time discounts across pantry staples, tea, and cooking oils
            </p>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-[#176B45] hover:underline flex items-center gap-1"
          >
            <span>{t('shopAll')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-6">
          {discountedProducts.map((p) => (
            <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

    </div>
  );
};
