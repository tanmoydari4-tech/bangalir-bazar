import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/product/ProductCard';
import { ArrowLeft, Filter, Layers } from 'lucide-react';

interface CategoryPageProps {
  categorySlug: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categorySlug, onNavigate }) => {
  const { categories, products } = useStore();
  const { t, language } = useLanguage();

  const category = categories.find(c => c.slug === categorySlug) || categories[0];
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  const categoryProducts = products.filter(p => {
    if (p.categoryId !== category.id || !p.isPublished) return false;
    if (selectedSubcategory !== 'all' && p.subcategoryId !== selectedSubcategory) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Category Hero / Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#176B45] to-[#258257] text-white p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <button
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-1.5 text-xs text-green-200 hover:text-white font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('shopAll')}</span>
          </button>

          <h1 className="text-2xl sm:text-4xl font-black text-white">
            {language === 'bn' ? category.nameBn : category.nameEn}
          </h1>

          <p className="text-xs sm:text-sm text-green-100 leading-relaxed">
            {language === 'bn'
              ? 'সেরা গুণমানের তাজা ও খাঁটি খাদ্যপণ্য কিনুন ন্যায্যমূল্যে।'
              : 'Browse our curated collection of verified grocery staples, farm produce, and daily essentials.'}
          </p>
        </div>

        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-white/20 shrink-0 shadow-2xl">
          <img src={category.image} alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Subcategory Pills */}
      {category.subcategories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedSubcategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedSubcategory === 'all'
                ? 'bg-[#176B45] text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All Varieties ({products.filter(p => p.categoryId === category.id && p.isPublished).length})
          </button>

          {category.subcategories.map((sub) => {
            const count = products.filter(p => p.subcategoryId === sub.id && p.isPublished).length;
            const isSelected = selectedSubcategory === sub.id;

            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(sub.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#176B45] text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {language === 'bn' ? sub.nameBn : sub.nameEn} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Products Grid */}
      {categoryProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5EAE5] space-y-3">
          <p className="text-xs text-gray-500">No products found in this category currently.</p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-5 py-2.5 bg-[#176B45] text-white rounded-xl text-xs font-bold"
          >
            {t('shopAll')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-5">
          {categoryProducts.map((p) => (
            <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
          ))}
        </div>
      )}

    </div>
  );
};
