import React from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/product/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

interface WishlistPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate }) => {
  const { wishlist, products } = useStore();
  const { t, language } = useLanguage();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE5]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252B27]">
            {t('wishlist')}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {wishlistedProducts.length} saved grocery items
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

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5EAE5] space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            {language === 'bn' ? 'আপনার পছন্দের তালিকা বর্তমানে সম্পূর্ণ খালি' : 'Your wishlist is currently empty'}
          </h3>
          <p className="text-xs text-gray-500">
            {language === 'bn'
              ? 'যেকোনো পণ্যের ওপর হার্ট (পছন্দ) আইকনে ক্লিক করে আপনি পছন্দের তালিকায় সংরক্ষণ করতে পারবেন।'
              : 'Click the heart icon on any grocery item to save it for quick repeat ordering.'}
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-6 py-3 bg-[#176B45] text-white text-xs font-bold rounded-xl hover:bg-[#125436] transition-all shadow-xs"
          >
            {language === 'bn' ? 'মুদি সামগ্রী দেখুন' : 'Explore Groceries'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-5">
          {wishlistedProducts.map((p) => (
            <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
};
