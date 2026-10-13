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
    <div className="bg-white rounded-2xl border border-[#E5EAE5] overflow-hidden hover:shadow-xl hover:border-[#4FA86B]/40 transition-all duration-200 flex flex-col justify-between group relative h-full">
      
      {/* Top Badges & Wishlist */}
      <div className="relative pt-[82%] bg-[#F7F9F5] overflow-hidden">
        {/* Product Image */}
        <img
          src={product.images[0]}
          alt={title}
          onClick={() => onNavigate('product', { id: product.id })}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          loading="lazy"
        />

        {/* Veg / Non-Veg Indicator & Discount Badge */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex items-center gap-1 sm:gap-1.5 z-10">
          <div
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 flex items-center justify-center rounded-xs bg-white/95 shadow-xs ${
              product.isVegetarian ? 'border-emerald-600' : 'border-amber-700'
            }`}
            title={product.isVegetarian ? t('veg') : t('nonVeg')}
          >
            <div
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                product.isVegetarian ? 'bg-emerald-600' : 'bg-amber-700'
              }`}
            />
          </div>

          {discountPercent > 0 && (
            <span className="bg-[#176B45] text-white text-[8px] sm:text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-xs tracking-wider">
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
          className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 p-1.5 sm:p-2 rounded-full backdrop-blur-xs transition-colors shadow-xs z-10 ${
            isWish
              ? 'bg-rose-50 text-rose-500'
              : 'bg-white/90 text-gray-400 hover:text-rose-500 hover:bg-white'
          }`}
          title={isWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Quick View Button on Hover (desktop only) */}
        <button
          onClick={() => onNavigate('product', { id: product.id })}
          className="hidden sm:group-hover:flex absolute bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-white/95 hover:bg-white text-gray-800 rounded-lg text-xs font-semibold shadow-md items-center gap-1.5 backdrop-blur-xs"
        >
          <Eye className="w-3.5 h-3.5 text-[#176B45]" />
          <span>{language === 'bn' ? 'বিস্তারিত' : 'View'}</span>
        </button>
      </div>

      {/* Card Content */}
      <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-2">
        <div className="space-y-1">
          {/* Brand & Pack Size */}
          <div className="flex items-center justify-between gap-1 text-[9px] sm:text-[10px] text-[#6B746D]">
            <span className="font-bold uppercase tracking-wider text-[#176B45] truncate">
              {product.brand}
            </span>
            <span className="bg-[#F0F4EF] text-[#252B27] px-1 sm:px-1.5 py-0.5 rounded font-semibold shrink-0 whitespace-nowrap text-[8px] sm:text-[9px]">
              {product.packSize}
            </span>
          </div>

          {/* Title - Fixed height so all cards align perfectly */}
          <h3
            onClick={() => onNavigate('product', { id: product.id })}
            className="text-[11px] sm:text-xs md:text-sm font-bold text-[#252B27] line-clamp-2 hover:text-[#176B45] cursor-pointer transition-colors leading-snug min-h-[2rem] sm:min-h-[2.4rem]"
            title={title}
          >
            {title}
          </h3>

          {/* Stock Notice */}
          <div className="pt-0.5">
            {isOutOfStock ? (
              <span className="text-[8px] sm:text-[9px] font-bold text-red-600 bg-red-50 px-1 py-0.5 rounded">
                {t('outOfStock')}
              </span>
            ) : isLowStock ? (
              <span className="text-[8px] sm:text-[9px] font-bold text-amber-600 bg-amber-50 px-1 py-0.5 rounded">
                {t('lowStock', { count: product.stockQuantity })}
              </span>
            ) : (
              <span className="text-[8px] sm:text-[9px] font-medium text-emerald-700">
                ✓ {t('inStock')}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Add to Cart Area - Sleek and mobile friendly */}
        <div className="pt-1.5 border-t border-[#E5EAE5]/70 flex items-center justify-between gap-1">
          {/* Price Block */}
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <div className="flex items-baseline gap-1 leading-none">
              <span className="text-xs sm:text-sm font-black text-[#176B45] tracking-tight">
                ₹{product.sellingPrice}
              </span>
              {discountPercent > 0 && (
                <span className="text-[8px] sm:text-[10px] text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            {discountPercent > 0 ? (
              <div className="text-[7.5px] sm:text-[8.5px] font-bold text-emerald-700 truncate mt-0.5 leading-tight">
                {t('save')} ₹{product.originalPrice - product.sellingPrice}
              </div>
            ) : (
              <div className="text-[7.5px] sm:text-[8.5px] font-medium text-transparent select-none mt-0.5 leading-tight">
                •
              </div>
            )}
          </div>

          {/* Add / Quantity Stepper - Sleek, small size that never distorts on any phone */}
          <div className="shrink-0">
            {isOutOfStock ? (
              <button
                disabled
                className="h-6 sm:h-7 px-1.5 bg-gray-100 text-gray-400 text-[8px] sm:text-[9px] font-bold rounded-lg cursor-not-allowed whitespace-nowrap min-w-[44px] sm:min-w-[52px] flex items-center justify-center"
              >
                {t('outOfStock')}
              </button>
            ) : inCart ? (
              <div className="flex items-center justify-between border border-[#176B45] rounded-lg bg-green-50/90 overflow-hidden shadow-2xs h-6 sm:h-7 min-w-[44px] sm:min-w-[52px]">
                <button
                  onClick={() => updateCartQuantity(product.id, quantity - 1)}
                  className="w-3.5 sm:w-4.5 h-full text-[#176B45] hover:bg-green-200/60 active:scale-90 transition-transform flex items-center justify-center shrink-0"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                </button>
                <span className="text-[9px] sm:text-xs font-black text-[#176B45] text-center px-0.5 flex-1 select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => updateCartQuantity(product.id, quantity + 1)}
                  disabled={quantity >= product.stockQuantity}
                  className="w-3.5 sm:w-4.5 h-full text-[#176B45] hover:bg-green-200/60 active:scale-90 disabled:opacity-30 transition-transform flex items-center justify-center shrink-0"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product, 1)}
                className="h-6 sm:h-7 px-1.5 sm:px-2 bg-[#176B45] hover:bg-[#125436] active:scale-95 text-white text-[9px] sm:text-[10px] font-black rounded-lg transition-all shadow-2xs flex items-center justify-center gap-0.5 min-w-[44px] sm:min-w-[52px] shrink-0 whitespace-nowrap select-none"
                title={t('addToCart')}
                aria-label={t('addToCart')}
              >
                <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                <span>{language === 'bn' ? 'যোগ' : 'ADD'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
