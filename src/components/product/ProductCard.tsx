import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { Heart, Plus, Minus, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { cart, addToCart, updateCartQuantity, isWishlisted, toggleWishlist } = useStore();
  const { t, language } = useLanguage();

  const cartItem = cart.find(item => item.productId === product.id);
  const inCart = !!cartItem;
  const quantity = cartItem?.quantity || 0;
  const isWish = isWishlisted(product.id);

  const discountPercent = product.originalPrice > product.sellingPrice
    ? Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)
    : 0;

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= product.lowStockThreshold;

  const title = language === 'bn' ? product.nameBn : product.nameEn;

  return (
    <div className="bg-white rounded-2xl border border-[#E5EAE5] overflow-hidden hover:shadow-xl hover:border-[#4FA86B]/40 transition-all duration-200 flex flex-col group relative">
      
      {/* Top Badges & Wishlist */}
      <div className="relative pt-[85%] bg-[#F7F9F5] overflow-hidden">
        {/* Product Image */}
        <img
          src={product.images[0]}
          alt={title}
          onClick={() => onNavigate('product', { id: product.id })}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          loading="lazy"
        />

        {/* Veg / Non-Veg Indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div
            className={`w-4 h-4 border-2 flex items-center justify-center rounded-xs bg-white/95 shadow-xs ${
              product.isVegetarian ? 'border-emerald-600' : 'border-amber-700'
            }`}
            title={product.isVegetarian ? t('veg') : t('nonVeg')}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                product.isVegetarian ? 'bg-emerald-600' : 'bg-amber-700'
              }`}
            />
          </div>

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span className="bg-[#176B45] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs tracking-wider">
              {discountPercent}% {t('off')}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors shadow-xs ${
            isWish
              ? 'bg-rose-50 text-rose-500'
              : 'bg-white/90 text-gray-400 hover:text-rose-500 hover:bg-white'
          }`}
          title={isWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWish ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <button
          onClick={() => onNavigate('product', { id: product.id })}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/95 hover:bg-white text-gray-800 rounded-xl text-xs font-semibold shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 backdrop-blur-xs"
        >
          <Eye className="w-3.5 h-3.5 text-[#176B45]" />
          <span>{language === 'bn' ? 'বিস্তারিত' : 'Quick View'}</span>
        </button>
      </div>

      {/* Card Content */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div className="space-y-1">
          {/* Brand & Pack Size */}
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-[#6B746D]">
            <span className="font-bold uppercase tracking-wider text-[#176B45] truncate">
              {product.brand}
            </span>
            <span className="bg-[#F0F4EF] text-[#252B27] px-1.5 sm:px-2 py-0.5 rounded-md font-semibold shrink-0 whitespace-nowrap text-[9px] sm:text-[10px]">
              {product.packSize}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onNavigate('product', { id: product.id })}
            className="text-xs sm:text-sm font-bold text-[#252B27] line-clamp-2 hover:text-[#176B45] cursor-pointer transition-colors leading-snug min-h-[2rem] sm:min-h-[2.5rem]"
            title={title}
          >
            {title}
          </h3>

          {/* Stock Notice */}
          <div className="pt-0.5">
            {isOutOfStock ? (
              <span className="text-[9px] sm:text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md">
                {t('outOfStock')}
              </span>
            ) : isLowStock ? (
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                {t('lowStock', { count: product.stockQuantity })}
              </span>
            ) : (
              <span className="text-[9px] sm:text-[10px] font-medium text-emerald-700">
                ✓ {t('inStock')}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Add to Cart Area - Perfectly aligned across all cards */}
        <div className="pt-2.5 border-t border-[#E5EAE5]/70 flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Price Block with consistent height */}
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <div className="flex items-baseline gap-1 sm:gap-1.5 leading-none">
              <span className="text-sm sm:text-base font-black text-[#176B45] tracking-tight">
                ₹{product.sellingPrice}
              </span>
              {discountPercent > 0 && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            {discountPercent > 0 ? (
              <div className="text-[9px] sm:text-[10px] font-bold text-emerald-700 truncate mt-0.5 leading-tight">
                {t('save')} ₹{product.originalPrice - product.sellingPrice}
              </div>
            ) : (
              <div className="text-[9px] sm:text-[10px] font-medium text-transparent select-none mt-0.5 leading-tight">
                •
              </div>
            )}
          </div>

          {/* Add / Quantity Buttons - Fixed matching dimensions */}
          <div className="shrink-0">
            {isOutOfStock ? (
              <button
                disabled
                className="h-8 sm:h-9 px-2 sm:px-3 bg-gray-100 text-gray-400 text-[10px] sm:text-xs font-bold rounded-xl cursor-not-allowed whitespace-nowrap min-w-[66px] sm:min-w-[76px] flex items-center justify-center"
              >
                {t('outOfStock')}
              </button>
            ) : inCart ? (
              <div className="flex items-center justify-between border-2 border-[#176B45] rounded-xl bg-green-50/90 overflow-hidden shadow-xs h-8 sm:h-9 min-w-[66px] sm:min-w-[76px]">
                <button
                  onClick={() => updateCartQuantity(product.id, quantity - 1)}
                  className="w-6 sm:w-7 h-full text-[#176B45] hover:bg-green-200/60 active:scale-90 transition-transform flex items-center justify-center shrink-0"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                </button>
                <span className="text-xs sm:text-sm font-black text-[#176B45] text-center px-0.5 flex-1 select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => updateCartQuantity(product.id, quantity + 1)}
                  disabled={quantity >= product.stockQuantity}
                  className="w-6 sm:w-7 h-full text-[#176B45] hover:bg-green-200/60 active:scale-90 disabled:opacity-30 transition-transform flex items-center justify-center shrink-0"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product, 1)}
                className="h-8 sm:h-9 px-2.5 sm:px-3 bg-[#176B45] hover:bg-[#125436] active:scale-95 text-white text-[11px] sm:text-xs font-black rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 min-w-[66px] sm:min-w-[76px] shrink-0 whitespace-nowrap select-none"
                title={t('addToCart')}
                aria-label={t('addToCart')}
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>{language === 'bn' ? 'যোগ' : 'ADD'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
