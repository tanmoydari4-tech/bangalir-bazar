import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/product/ProductCard';
import {
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Truck,
  RotateCcw,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, onNavigate }) => {
  const {
    products,
    categories,
    cart,
    currentUser,
    addToCart,
    updateCartQuantity,
    isWishlisted,
    toggleWishlist,
    activePinCode,
    selectedDeliveryArea,
    checkPinAvailability,
    setActivePinCode
  } = useStore();
  const { t, language } = useLanguage();

  const product = products.find(p => p.id === productId) || products[0];
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [pinInput, setPinInput] = useState(activePinCode);
  const [pinCheckMsg, setPinCheckMsg] = useState<string | null>(null);
  const [pinAvailable, setPinAvailable] = useState<boolean | null>(null);

  const cartItem = cart.find(item => item.productId === product.id);
  const quantityInCart = cartItem?.quantity || 0;
  const isWish = isWishlisted(product.id);

  const discountPercent = product.originalPrice > product.sellingPrice
    ? Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)
    : 0;

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= product.lowStockThreshold;

  const category = categories.find(c => c.id === product.categoryId);
  const relatedProducts = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id && p.isPublished)
    .slice(0, 4);

  const title = language === 'bn' ? product.nameBn : product.nameEn;
  const description = language === 'bn' ? product.descriptionBn : product.descriptionEn;
  const ingredients = language === 'bn' ? product.ingredientsBn : product.ingredientsEn;
  const expiryNotice = language === 'bn' ? product.expiryNoticeBn : product.expiryNoticeEn;
  const storageInstructions = language === 'bn' ? product.storageInstructionsBn : product.storageInstructionsEn;

  const handlePinCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pinInput.trim())) {
      setPinAvailable(false);
      setPinCheckMsg(language === 'bn' ? 'সঠিক ৬ সংখ্যার পিন কোড দিন।' : 'Please enter a valid 6-digit PIN code.');
      return;
    }

    const res = checkPinAvailability(pinInput.trim());
    if (res.isAvailable && res.area) {
      setActivePinCode(pinInput.trim());
      setPinAvailable(true);
      setPinCheckMsg(
        language === 'bn'
          ? `✓ ডেলিভারি উপলব্ধ (${res.area.areaNameBn})! ${res.area.estimatedWindowBn}`
          : `✓ Delivery Available in ${res.area.areaNameEn}! ${res.area.estimatedWindowEn}`
      );
    } else {
      setPinAvailable(false);
      setPinCheckMsg(t('pinUnavailable'));
    }
  };

  const handleBuyNow = () => {
    if (quantityInCart === 0) {
      addToCart(product, 1);
    }
    if (!currentUser) {
      onNavigate('login', {
        mode: 'register',
        redirect: 'checkout',
        message: 'Please log in or create an account before purchasing this product.'
      });
      return;
    }
    onNavigate('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">
      
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center gap-1.5 font-bold text-[#176B45] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToShop')}</span>
        </button>
        <span>/</span>
        {category && (
          <>
            <span
              onClick={() => onNavigate('category', { slug: category.slug })}
              className="hover:text-gray-900 cursor-pointer"
            >
              {language === 'bn' ? category.nameBn : category.nameEn}
            </span>
            <span>/</span>
          </>
        )}
        <span className="text-gray-800 font-medium truncate max-w-xs">{title}</span>
      </div>

      {/* Main Product Showcase Box */}
      <div className="bg-white rounded-3xl border border-[#E5EAE5] p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-[#F7F9F5] border border-gray-100 aspect-square flex items-center justify-center">
              <img
                src={selectedImage}
                alt={title}
                className="w-full h-full object-cover object-center"
              />

              {/* Veg / Non-Veg emblem */}
              <div
                className={`absolute top-4 left-4 w-5 h-5 border-2 flex items-center justify-center rounded-xs bg-white/95 shadow-xs ${
                  product.isVegetarian ? 'border-emerald-600' : 'border-amber-700'
                }`}
                title={product.isVegetarian ? t('veg') : t('nonVeg')}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    product.isVegetarian ? 'bg-emerald-600' : 'bg-amber-700'
                  }`}
                />
              </div>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-xs transition-colors shadow-md ${
                  isWish ? 'bg-rose-50 text-rose-500' : 'bg-white/90 text-gray-500 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWish ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Thumbnails if multiple */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-[#176B45]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Meta, Pricing, Purchase & PIN */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-[#176B45] bg-green-50 px-2.5 py-1 rounded-md">
                  {product.brand}
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  SKU: {product.sku}
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl font-black text-[#252B27] leading-tight">
                {title}
              </h1>

              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <span>{t('packSize')}: <strong className="text-gray-800">{product.packSize}</strong></span>
                <span>•</span>
                <span>{product.isVegetarian ? '100% Vegetarian' : 'Non-Vegetarian'}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-[#F7F9F5] border border-[#E5EAE5] space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-[#176B45]">
                  ₹{product.sellingPrice}
                </span>
                {product.originalPrice > product.sellingPrice && (
                  <span className="text-sm sm:text-base text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-[#FFD166] text-[#252B27] text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                    {discountPercent}% {t('off')}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-gray-500">
                {t('taxesIncluded')} • (₹{(product.sellingPrice / (product.unit === 'g' ? 0.5 : 1)).toFixed(0)} per unit approx.)
              </div>
            </div>

            {/* Stock Indicator */}
            <div>
              {isOutOfStock ? (
                <div className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 inline-block">
                  {t('outOfStock')}
                </div>
              ) : isLowStock ? (
                <div className="text-xs font-bold text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 inline-block">
                  ⚠️ {t('lowStock', { count: product.stockQuantity })}
                </div>
              ) : (
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('inStock')} (Ready for immediate dispatch)</span>
                </div>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {/* Quantity */}
              {!isOutOfStock && (
                <div className="flex items-center border-2 border-[#176B45] rounded-xl bg-white overflow-hidden shadow-xs">
                  <button
                    onClick={() => {
                      if (quantityInCart > 0) updateCartQuantity(product.id, quantityInCart - 1);
                    }}
                    className="p-3 text-[#176B45] hover:bg-green-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-extrabold text-[#176B45] min-w-[36px] text-center">
                    {quantityInCart || 1}
                  </span>
                  <button
                    onClick={() => {
                      if (quantityInCart === 0) {
                        addToCart(product, 1);
                      } else {
                        updateCartQuantity(product.id, quantityInCart + 1);
                      }
                    }}
                    disabled={quantityInCart >= product.stockQuantity}
                    className="p-3 text-[#176B45] hover:bg-green-50 disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Add to Basket */}
              <button
                disabled={isOutOfStock}
                onClick={() => {
                  if (quantityInCart === 0) addToCart(product, 1);
                }}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#176B45] hover:bg-[#125436] text-white active:scale-98'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{quantityInCart > 0 ? `${t('addedToCart')} (${quantityInCart})` : t('addToCart')}</span>
              </button>

              {/* Buy Now */}
              {!isOutOfStock && (
                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-6 bg-[#FFD166] hover:bg-yellow-400 text-[#252B27] font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-sm active:scale-98"
                >
                  {t('buyNow')}
                </button>
              )}
            </div>

            {/* PIN Code Delivery Estimator */}
            <div className="pt-3 border-t border-gray-100">
              <div className="bg-[#F7F9F5] p-4 rounded-2xl border border-[#E5EAE5] space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                  <MapPin className="w-4 h-4 text-[#176B45]" />
                  <span>Check Delivery In Your Area</span>
                </div>
                <form onSubmit={handlePinCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value.replace(/[^0-9]/g, ''));
                      setPinCheckMsg(null);
                    }}
                    placeholder="Enter PIN Code"
                    className="flex-1 px-3 py-2 border rounded-xl text-xs font-mono font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#176B45]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#176B45] text-white font-bold text-xs rounded-xl hover:bg-[#125436]"
                  >
                    Check
                  </button>
                </form>

                {pinCheckMsg && (
                  <div
                    className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                      pinAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {pinAvailable ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span>{pinCheckMsg}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Promises */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-gray-600">
              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                <Clock className="w-4 h-4 text-[#176B45]" />
                <span>Same-day slot delivery</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                <RotateCcw className="w-4 h-4 text-[#176B45]" />
                <span>Doorstep return accepted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Product Specifications & Label Information */}
        <div className="mt-12 pt-8 border-t border-gray-100 space-y-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#252B27]">
            Product Details & Declarations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-bold uppercase tracking-wider text-gray-500">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed bg-[#F7F9F5] p-4 rounded-2xl border border-[#E5EAE5]">
                {description}
              </p>
            </div>

            {/* Declared Ingredients */}
            {ingredients && (
              <div className="space-y-2">
                <h3 className="font-bold uppercase tracking-wider text-gray-500">
                  {t('ingredients')}
                </h3>
                <p className="text-gray-700 leading-relaxed bg-[#F7F9F5] p-4 rounded-2xl border border-[#E5EAE5]">
                  {ingredients}
                </p>
              </div>
            )}

            {/* Manufacturer Information */}
            {product.manufacturer && (
              <div className="space-y-2">
                <h3 className="font-bold uppercase tracking-wider text-gray-500">
                  {t('manufacturer')}
                </h3>
                <p className="text-gray-700 leading-relaxed bg-[#F7F9F5] p-4 rounded-2xl border border-[#E5EAE5]">
                  {product.manufacturer}
                </p>
              </div>
            )}

            {/* Storage & Expiry Instructions */}
            <div className="space-y-2">
              <h3 className="font-bold uppercase tracking-wider text-gray-500">
                {t('storage')} & {t('expiryNotice')}
              </h3>
              <div className="text-gray-700 leading-relaxed bg-[#F7F9F5] p-4 rounded-2xl border border-[#E5EAE5] space-y-1">
                {storageInstructions && <div>• {storageInstructions}</div>}
                {expiryNotice && <div>• {expiryNotice}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#252B27]">
              {t('relatedProducts')}
            </h2>
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs font-bold text-[#176B45] hover:underline"
            >
              {t('viewAll')} →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
