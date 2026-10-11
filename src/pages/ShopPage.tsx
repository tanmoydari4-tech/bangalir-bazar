import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/product/ProductCard';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Sparkles,
  ArrowUpDown,
  Check
} from 'lucide-react';

interface ShopPageProps {
  initialSearchQuery?: string;
  initialCategorySlug?: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialSearchQuery = '',
  initialCategorySlug = '',
  onNavigate
}) => {
  const { products, categories } = useStore();
  const { t, language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (initialCategorySlug) {
      const found = categories.find(c => c.slug === initialCategorySlug);
      return found ? found.id : 'all';
    }
    return 'all';
  });

  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [priceMax, setPriceMax] = useState<number>(500);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'best-seller' | 'newest'>('recommended');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extract unique brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
    return list.sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (!p.isPublished) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNameEn = p.nameEn.toLowerCase().includes(q);
        const matchesNameBn = p.nameBn.includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        if (!matchesNameEn && !matchesNameBn && !matchesBrand && !matchesSku) return false;
      }

      // Category
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }

      // Brand
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
        return false;
      }

      // Dietary
      if (dietaryFilter === 'veg' && !p.isVegetarian) return false;
      if (dietaryFilter === 'non-veg' && p.isVegetarian) return false;

      // In Stock
      if (inStockOnly && p.stockQuantity <= 0) return false;

      // Discounted
      if (discountOnly && p.originalPrice <= p.sellingPrice) return false;

      // Price
      if (p.sellingPrice > priceMax) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.sellingPrice - b.sellingPrice;
      if (sortBy === 'price-desc') return b.sellingPrice - a.sellingPrice;
      if (sortBy === 'best-seller') return (b.salesCount || 0) - (a.salesCount || 0);
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedBrand,
    dietaryFilter,
    inStockOnly,
    discountOnly,
    priceMax,
    sortBy
  ]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setDietaryFilter('all');
    setInStockOnly(false);
    setDiscountOnly(false);
    setPriceMax(500);
    setSortBy('recommended');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    dietaryFilter !== 'all' ||
    inStockOnly ||
    discountOnly ||
    priceMax < 500;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      
      {/* Page Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5EAE5]">
        <div>
          <div className="text-xs text-gray-500 flex items-center gap-1.5 mb-1">
            <span className="hover:text-gray-900 cursor-pointer" onClick={() => onNavigate('home')}>{t('home')}</span>
            <span>/</span>
            <span className="text-[#176B45] font-semibold">{t('shopAll')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252B27]">
            {t('shopAll')}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {t('showingProducts', { count: filteredProducts.length })}
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 shadow-xs"
          >
            <Filter className="w-4 h-4 text-[#176B45]" />
            <span>{t('filters')}</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#176B45]" />
            )}
          </button>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[11px] font-semibold text-gray-500">{t('sortBy')}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-bold text-gray-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="recommended">{t('sortRecommended')}</option>
              <option value="price-asc">{t('sortPriceLowHigh')}</option>
              <option value="price-desc">{t('sortPriceHighLow')}</option>
              <option value="best-seller">{t('sortBestSellers')}</option>
              <option value="newest">{t('sortNewArrivals')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block bg-white p-5 rounded-2xl border border-[#E5EAE5] shadow-xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
              <SlidersHorizontal className="w-4 h-4 text-[#176B45]" />
              <span>{t('filters')}</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline"
              >
                {t('clearFilters')}
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {t('categoryFilter')}
            </h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-green-50 text-[#176B45] font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{t('allCategories')}</span>
                {selectedCategory === 'all' && <Check className="w-3.5 h-3.5" />}
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedCategory === c.id
                      ? 'bg-green-50 text-[#176B45] font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate">{language === 'bn' ? c.nameBn : c.nameEn}</span>
                  {selectedCategory === c.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2.5 pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center text-xs">
              <h4 className="font-bold uppercase tracking-wider text-gray-500">
                {t('priceRange')}
              </h4>
              <span className="font-bold text-[#176B45]">Up to ₹{priceMax}</span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-[#176B45] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400 font-mono">
              <span>₹20</span>
              <span>₹500</span>
            </div>
          </div>

          {/* Dietary Attributes */}
          <div className="space-y-2 pt-3 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {t('dietaryFilter')}
            </h4>
            <div className="flex gap-2">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                  dietaryFilter === 'all'
                    ? 'border-[#176B45] bg-green-50 text-[#176B45]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDietaryFilter('veg')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 ${
                  dietaryFilter === 'veg'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Veg</span>
              </button>
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2 pt-3 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Brand
            </h4>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#176B45]"
            >
              <option value="all">All Brands</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="space-y-2.5 pt-3 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 font-medium">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded-sm accent-[#176B45] w-4 h-4"
              />
              <span>In-Stock Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 font-medium">
              <input
                type="checkbox"
                checked={discountOnly}
                onChange={(e) => setDiscountOnly(e.target.checked)}
                className="rounded-sm accent-[#176B45] w-4 h-4"
              />
              <span>Special Discount Offers</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200/70 text-xs">
              <span className="text-gray-500 font-semibold text-[11px]">Active:</span>
              {searchQuery && (
                <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200 flex items-center gap-1 font-medium text-gray-800">
                  Search: "{searchQuery}"
                  <X className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-700" onClick={() => setSearchQuery('')} />
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200 flex items-center gap-1 font-medium text-gray-800">
                  Category: {categories.find(c => c.id === selectedCategory)?.nameEn}
                  <X className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-700" onClick={() => setSelectedCategory('all')} />
                </span>
              )}
              {selectedBrand !== 'all' && (
                <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200 flex items-center gap-1 font-medium text-gray-800">
                  Brand: {selectedBrand}
                  <X className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-700" onClick={() => setSelectedBrand('all')} />
                </span>
              )}
              {dietaryFilter !== 'all' && (
                <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200 flex items-center gap-1 font-medium text-gray-800">
                  Diet: {dietaryFilter.toUpperCase()}
                  <X className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-700" onClick={() => setDietaryFilter('all')} />
                </span>
              )}
              {inStockOnly && (
                <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200 flex items-center gap-1 font-medium text-gray-800">
                  In-Stock
                  <X className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-700" onClick={() => setInStockOnly(false)} />
                </span>
              )}
              {discountOnly && (
                <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200 flex items-center gap-1 font-medium text-gray-800">
                  Discounts
                  <X className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-700" onClick={() => setDiscountOnly(false)} />
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:underline font-bold ml-auto"
              >
                {t('clearFilters')}
              </button>
            </div>
          )}

          {/* Product Cards */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E5EAE5] space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-gray-800">{t('noProductsFound')}</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'অন্যান্য কীওয়ার্ড দিয়ে চেষ্টা করুন অথবা ফিল্টার রিসেট করুন।'
                  : 'Try adjusting your search criteria or resetting filters to view all products.'}
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-[#176B45] text-white text-xs font-bold rounded-xl hover:bg-[#125436] transition-colors shadow-xs"
              >
                {t('resetFilters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-bold text-base text-gray-900">{t('filters')}</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile categories */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase">{t('categoryFilter')}</h4>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                >
                  <option value="all">{t('allCategories')}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{language === 'bn' ? c.nameBn : c.nameEn}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Price */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{t('priceRange')}</span>
                  <span>Up to ₹{priceMax}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#176B45]"
                />
              </div>

              {/* Mobile Toggles */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-[#176B45]"
                  />
                  <span>In-Stock Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={discountOnly}
                    onChange={(e) => setDiscountOnly(e.target.checked)}
                    className="accent-[#176B45]"
                  />
                  <span>Discounted Offers</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-[#176B45] text-white font-bold text-xs rounded-xl"
              >
                Apply Filters ({filteredProducts.length} items)
              </button>
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full py-2.5 border text-xs font-semibold rounded-xl text-gray-700"
              >
                {t('clearFilters')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
