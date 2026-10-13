import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { PinCodeModal } from './PinCodeModal';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Tag,
  ShieldCheck,
  Package,
  Layers,
  LogOut,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const {
    products,
    categories,
    cart,
    wishlist,
    activePinCode,
    selectedDeliveryArea,
    currentUser,
    logout,
    setIsMiniCartOpen,
    cartTotal,
    storeSettings
  } = useStore();
  const { t, language } = useLanguage();

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Live filtered suggestions
  const searchResults = searchQuery.trim()
    ? products
        .filter(p =>
          p.isPublished &&
          (p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
           p.nameBn.includes(searchQuery) ||
           p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
           p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      onNavigate('shop', { q: searchQuery.trim() });
    }
  };

  const storeName = language === 'bn' ? storeSettings.storeNameBn : storeSettings.storeNameEn;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5EAE5] shadow-xs">
      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-1.5 sm:gap-6">
          
          {/* Mobile Menu Button + Brand Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-gray-700 hover:bg-gray-100 rounded-xl shrink-0"
              aria-label="Open navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            {/* Brand Logo & Tagline */}
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer select-none group min-w-0"
            >
              {/* Custom Brand SVG Logo with Fresh Leaf & Grocery Basket */}
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#176B45] to-[#4FA86B] p-1.5 sm:p-2 flex items-center justify-center shadow-md shadow-green-900/10 group-hover:scale-105 transition-transform shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" stroke="#FFD166" strokeWidth="2.5" />
                  <path d="M12 2v4" stroke="#FFD166" />
                </svg>
              </div>
              <div className="min-w-0 flex items-center gap-1.5 sm:gap-2">
                <span className="font-black text-sm sm:text-xl text-[#176B45] tracking-tight group-hover:text-[#125436] transition-colors truncate">
                  {storeName}
                </span>
                <span className="bg-[#FFD166]/40 text-[#176B45] text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0 select-none">
                  {language === 'bn' ? 'ফ্রেশ' : 'FRESH'}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Location / PIN Selector */}
          <div className="hidden md:flex items-center shrink-0">
            <button
              onClick={() => setIsPinModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-[#F7F9F5] hover:bg-gray-100/80 rounded-xl border border-[#E5EAE5] transition-all text-left group"
            >
              <div className="p-1.5 bg-green-100 text-[#176B45] rounded-lg group-hover:bg-[#176B45] group-hover:text-white transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                  {t('deliverTo')}
                </div>
                <div className="text-xs font-bold text-gray-900 flex items-center gap-1 truncate max-w-[130px]">
                  <span>{selectedDeliveryArea ? (language === 'bn' ? selectedDeliveryArea.areaNameBn : selectedDeliveryArea.areaNameEn) : activePinCode}</span>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </div>
              </div>
            </button>
          </div>

          {/* Search Bar with Autocomplete */}
          <div ref={searchRef} className="flex-1 max-w-xl relative hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-20 py-2.5 bg-[#F7F9F5] border border-[#E5EAE5] rounded-2xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#176B45] focus:bg-white transition-all shadow-inner/5"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#176B45] text-white rounded-xl text-xs font-semibold hover:bg-[#125436] transition-colors shadow-xs"
              >
                {t('searchButton')}
              </button>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-98 duration-150">
                <div className="p-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50/70 border-b border-gray-100">
                  {language === 'bn' ? 'প্রস্তাবিত পণ্যসমূহ' : 'Suggested Groceries'}
                </div>
                <div className="divide-y divide-gray-50">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setIsSearchFocused(false);
                        setSearchQuery('');
                        onNavigate('product', { id: item.id });
                      }}
                      className="p-3 hover:bg-green-50/50 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.images[0]}
                          alt={item.nameEn}
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-gray-800 truncate">
                            {language === 'bn' ? item.nameBn : item.nameEn}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {item.packSize} • {item.brand}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-xs text-[#176B45]">
                          ₹{item.sellingPrice}
                        </div>
                        {item.originalPrice > item.sellingPrice && (
                          <div className="text-[10px] text-gray-400 line-through">
                            ₹{item.originalPrice}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  onClick={handleSearchSubmit}
                  className="p-2.5 text-center text-xs font-semibold text-[#176B45] hover:bg-green-50/80 cursor-pointer border-t border-gray-100"
                >
                  {language === 'bn' ? `সব "${searchQuery}" ফলাফল দেখুন` : `View all results for "${searchQuery}"`}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Language Switcher */}
            <LanguageToggle />

            {/* Wishlist Button - Hidden on mobile, shown on tablet/desktop (accessible via bottom nav) */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="hidden sm:flex p-2 sm:p-2.5 text-gray-700 hover:text-[#176B45] hover:bg-gray-100 rounded-xl relative transition-colors"
              title={t('wishlist')}
              aria-label={t('wishlist')}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsMiniCartOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#176B45] hover:bg-[#125436] text-white rounded-xl shadow-xs transition-all group shrink-0"
              title={t('cart')}
              aria-label={t('cart')}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FFD166] text-[#252B27] text-[10px] font-extrabold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-[10px] text-green-200 font-semibold leading-tight">
                  {totalCartCount > 0 ? t('itemsInCart', { count: totalCartCount }) : t('cart')}
                </div>
                <div className="text-xs font-extrabold leading-tight">
                  ₹{cartTotal}
                </div>
              </div>
            </button>

            {/* Account / Login Dropdown - Hidden on mobile, shown on tablet/desktop */}
            <div ref={accountRef} className="relative hidden sm:block">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors border border-transparent hover:border-[#E5EAE5]"
              >
                <div className="w-7 h-7 bg-green-100 text-[#176B45] rounded-full flex items-center justify-center font-bold text-xs">
                  {currentUser ? currentUser.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-[10px] text-gray-500 font-medium leading-none">
                    {currentUser ? (currentUser.role === 'admin' ? 'Admin' : 'Hello,') : t('login')}
                  </div>
                  <div className="text-xs font-bold text-gray-800 leading-tight truncate max-w-[90px]">
                    {currentUser ? currentUser.name.split(' ')[0] : t('account')}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden md:block" />
              </button>

              {/* Account Dropdown Menu */}
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-800 truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                        {currentUser.role === 'admin' && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-md">
                            ADMINISTRATOR
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          onNavigate('account');
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 font-medium"
                      >
                        <UserIcon className="w-4 h-4 text-gray-500" />
                        <span>{t('myAccount')}</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          onNavigate('orders');
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 font-medium"
                      >
                        <Package className="w-4 h-4 text-gray-500" />
                        <span>{t('myOrders')}</span>
                      </button>

                      <div className="border-t border-gray-100 my-1" />

                      {/* Switch to Admin / Storefront */}
                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-[#176B45] hover:bg-green-50 flex items-center justify-between font-bold"
                      >
                        <div className="flex items-center gap-2.5">
                          <ShieldCheck className="w-4 h-4" />
                          <span>{t('adminDashboard')}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                      </button>

                      <div className="border-t border-gray-100 my-1" />

                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          logout();
                          onNavigate('home');
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('logout')}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2">
                        <button
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            onNavigate('login');
                          }}
                          className="w-full py-2 bg-[#176B45] text-white rounded-xl text-xs font-bold hover:bg-[#125436] transition-colors shadow-xs"
                        >
                          {t('login')}
                        </button>
                      </div>

                      <div className="border-t border-gray-100 my-1" />

                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-[#176B45] hover:bg-green-50 flex items-center gap-2.5 font-bold"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{t('adminPortal')}</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Input & Quick Location Bar */}
        <div className="mt-2 sm:hidden space-y-1.5">
          {/* Quick PIN location chip for mobile */}
          <div className="flex items-center justify-between px-0.5">
            <button
              onClick={() => setIsPinModalOpen(true)}
              className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 active:text-[#176B45] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#176B45] shrink-0" />
              <span className="text-gray-500 font-medium">{t('deliverTo')}:</span>
              <span className="truncate max-w-[140px] text-gray-900 underline decoration-dotted underline-offset-2">
                {selectedDeliveryArea ? (language === 'bn' ? selectedDeliveryArea.areaNameBn : selectedDeliveryArea.areaNameEn) : activePinCode}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400 shrink-0" />
            </button>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold shrink-0">
              ⚡ 30-45m
            </span>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-9 pr-20 py-2 bg-[#F7F9F5] border border-[#E5EAE5] rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#176B45] focus:bg-white transition-all shadow-inner/5"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#176B45] text-white rounded-lg text-xs font-bold active:scale-95 transition-transform shadow-xs"
            >
              {t('searchButton')}
            </button>
          </form>

          {/* Mobile search suggestions */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mt-1 divide-y divide-gray-50">
              {searchResults.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setIsSearchFocused(false);
                    setSearchQuery('');
                    onNavigate('product', { id: item.id });
                  }}
                  className="p-2.5 flex items-center justify-between gap-2.5 active:bg-green-50"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={item.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover bg-gray-100 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-gray-800 truncate">
                        {language === 'bn' ? item.nameBn : item.nameEn}
                      </div>
                      <div className="text-[10px] text-gray-500">{item.packSize}</div>
                    </div>
                  </div>
                  <div className="font-bold text-xs text-[#176B45] shrink-0">₹{item.sellingPrice}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Secondary Sticky Navigation Bar with Category Links */}
      <nav className="bg-[#176B45] text-white border-t border-[#145a3a] hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* All Categories Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-[#125436] hover:bg-[#0e442c] font-bold text-xs tracking-wider uppercase transition-colors"
              >
                <Layers className="w-4 h-4 text-[#FFD166]" />
                <span>{t('allCategories')}</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </button>

              {/* All Categories Mega Menu */}
              {isCategoriesDropdownOpen && (
                <div
                  onMouseLeave={() => setIsCategoriesDropdownOpen(false)}
                  className="absolute top-full left-0 w-72 bg-white text-gray-800 shadow-2xl rounded-b-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setIsCategoriesDropdownOpen(false);
                        onNavigate('category', { slug: cat.slug });
                      }}
                      className="px-4 py-2.5 hover:bg-green-50 hover:text-[#176B45] cursor-pointer flex items-center justify-between text-xs font-semibold transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={cat.image} alt={cat.nameEn} className="w-6 h-6 rounded-md object-cover" />
                        <span>{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 group-hover:text-[#176B45]">→</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Categories Quick Links */}
            <div className="flex items-center">
              <button
                onClick={() => onNavigate('home')}
                className={`px-3.5 py-3 text-xs font-semibold transition-colors hover:bg-white/10 ${currentPage === 'home' ? 'bg-white/15 text-[#FFD166]' : 'text-green-50'}`}
              >
                {t('home')}
              </button>
              <button
                onClick={() => onNavigate('shop')}
                className={`px-3.5 py-3 text-xs font-semibold transition-colors hover:bg-white/10 ${currentPage === 'shop' ? 'bg-white/15 text-[#FFD166]' : 'text-green-50'}`}
              >
                {t('shopAll')}
              </button>
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onNavigate('category', { slug: cat.slug })}
                  className="px-3.5 py-3 text-xs font-medium text-green-100 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  {language === 'bn' ? cat.nameBn : cat.nameEn}
                </button>
              ))}
              <button
                onClick={() => onNavigate('offers')}
                className="px-3.5 py-3 text-xs font-bold text-[#FFD166] hover:bg-white/10 transition-colors flex items-center gap-1.5"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>{t('offers')}</span>
              </button>
            </div>
          </div>

          {/* Right link: Free same-day delivery badge */}
          <div className="flex items-center gap-2 text-xs text-green-100 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD166]" />
            <span>{t('fastDelivery')}</span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <div className="p-4 bg-[#176B45] text-white flex items-center justify-between">
              <div className="font-extrabold text-base">{storeName}</div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-100">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsPinModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-2.5 bg-[#F7F9F5] rounded-xl border border-[#E5EAE5] text-xs font-bold text-gray-800"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#176B45]" />
                  <span>PIN: {activePinCode}</span>
                </div>
                <span className="text-[#176B45]">{t('changePin')}</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-1">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onNavigate('home'); }}
                  className="w-full text-left p-2.5 rounded-xl font-bold text-xs text-gray-800 hover:bg-green-50"
                >
                  {t('home')}
                </button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onNavigate('shop'); }}
                  className="w-full text-left p-2.5 rounded-xl font-bold text-xs text-gray-800 hover:bg-green-50"
                >
                  {t('shopAll')}
                </button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onNavigate('offers'); }}
                  className="w-full text-left p-2.5 rounded-xl font-bold text-xs text-emerald-700 bg-emerald-50"
                >
                  {t('offers')}
                </button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onNavigate('orders'); }}
                  className="w-full text-left p-2.5 rounded-xl font-bold text-xs text-gray-800 hover:bg-green-50"
                >
                  {t('myOrders')}
                </button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onNavigate('wishlist'); }}
                  className="w-full text-left p-2.5 rounded-xl font-bold text-xs text-gray-800 hover:bg-green-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>{t('wishlist')}</span>
                  </div>
                  {wishlist.length > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                </button>
                {currentUser ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); onNavigate('account'); }}
                      className="w-full text-left p-2.5 rounded-xl font-bold text-xs text-gray-800 hover:bg-green-50 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-600" />
                      <span>{t('myAccount')} ({currentUser.name.split(' ')[0]})</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                        onNavigate('home');
                      }}
                      className="w-full text-left p-2.5 rounded-xl font-bold text-xs text-red-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); onNavigate('login'); }}
                    className="w-full text-left p-2.5 rounded-xl font-bold text-xs text-white bg-[#176B45] hover:bg-[#125436] flex items-center justify-center gap-2 shadow-xs"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>{t('login')}</span>
                  </button>
                )}
              </div>

              <div className="border-t border-gray-100 pt-3">
                <div className="text-[10px] font-bold uppercase text-gray-400 mb-2 px-2.5">
                  {t('allCategories')}
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onNavigate('category', { slug: c.slug });
                      }}
                      className="w-full text-left p-2 rounded-lg text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <img src={c.image} alt="" className="w-5 h-5 rounded-md object-cover" />
                      <span>{language === 'bn' ? c.nameBn : c.nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onNavigate('admin'); }}
                  className="w-full p-2.5 rounded-xl bg-gray-100 text-[#176B45] text-xs font-bold flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t('adminDashboard')}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PIN Code Verification Modal */}
      <PinCodeModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
      />
    </header>
  );
};
