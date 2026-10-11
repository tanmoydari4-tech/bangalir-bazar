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
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Brand & Pack Size */}
          <div className="flex items-center justify-between text-[11px] text-[#6B746D]">
            <span className="font-semibold uppercase tracking-wider text-[#176B45]">
              {product.brand}
            </span>
            <span className="bg-[#F0F4EF] px-2 py-0.5 rounded-md font-medium">
              {product.packSize}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onNavigate('product', { id: product.id })}
            className="text-xs sm:text-sm font-bold text-[#252B27] line-clamp-2 hover:text-[#176B45] cursor-pointer transition-colors leading-snug"
            title={title}
          >
            {title}
          </h3>

          {/* Stock Notice */}
          <div className="pt-0.5">
            {isOutOfStock ? (
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                {t('outOfStock')}
              </span>
            ) : isLowStock ? (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                {t('lowStock', { count: product.stockQuantity })}
              </span>
            ) : (
              <span className="text-[10px] font-medium text-emerald-700">
                ✓ {t('inStock')}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-2 border-t border-[#E5EAE5]/60 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-[#176B45]">
                ₹{product.sellingPrice}
              </span>
              {product.originalPrice > product.sellingPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            {product.originalPrice > product.sellingPrice && (
              <div className="text-[10px] font-semibold text-emerald-700">
                {t('save')} ₹{product.originalPrice - product.sellingPrice}
              </div>
            )}
          </div>

          {/* Add / Quantity Buttons */}
          <div>
            {isOutOfStock ? (
              <button
                disabled
                className="px-3 py-2 bg-gray-100 text-gray-400 text-xs font-semibold rounded-xl cursor-not-allowed"
              >
                {t('outOfStock')}
              </button>
            ) : inCart ? (
              <div className="flex items-center border-2 border-[#176B45] rounded-xl bg-green-50/50 overflow-hidden shadow-xs">
                <button
                  onClick={() => updateCartQuantity(product.id, quantity - 1)}
                  className="p-1.5 sm:p-2 text-[#176B45] hover:bg-green-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-xs sm:text-sm font-extrabold text-[#176B45] min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => updateCartQuantity(product.id, quantity + 1)}
                  disabled={quantity >= product.stockQuantity}
                  className="p-1.5 sm:p-2 text-[#176B45] hover:bg-green-100 disabled:opacity-30 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product, 1)}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-[#176B45] hover:bg-[#125436] text-white text-[11px] sm:text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1 sm:gap-1.5 active:scale-95 touch-manipulation"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">{t('addToCart')}</span>
                <span className="xs:hidden sm:hidden">{language === 'bn' ? 'যোগ' : 'Add'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
