import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MapPin
} from 'lucide-react';

interface CartPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    cartTotal,
    savingsTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    coupons,
    activePinCode,
    selectedDeliveryArea,
    storeSettings,
    currentUser
  } = useStore();
  const { t, language } = useLanguage();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const freeThreshold = selectedDeliveryArea?.freeDeliveryThreshold || storeSettings.defaultFreeDeliveryThreshold;
  const diffForFree = Math.max(0, freeThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-green-50 text-[#176B45] rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">{t('emptyCartTitle')}</h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          {t('emptyCartSubtitle')}
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="mt-2 px-6 py-3 bg-[#176B45] text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-[#125436] transition-colors shadow-md"
        >
          {t('continueShopping')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE5]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252B27]">
            {t('yourCart')}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {t('itemsInCart', { count: cart.reduce((sum, i) => sum + i.quantity, 0) })}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Basket</span>
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="bg-[#EBF5EE] p-4 rounded-2xl border border-green-200 text-xs">
        {diffForFree > 0 ? (
          <div>
            <div className="flex justify-between font-bold text-[#176B45] mb-2">
              <span>{t('addMoreForFreeDelivery', { amount: diffForFree })}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-green-200/80 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#176B45] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 font-bold text-[#176B45]">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{t('freeDeliveryUnlocked')}</span>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Cart Items Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E5EAE5] p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="divide-y divide-gray-100">
            {cart.map((item) => {
              const p = item.product;
              const title = language === 'bn' ? p.nameBn : p.nameEn;
              const lineTotal = p.sellingPrice * item.quantity;

              return (
                <div key={item.productId} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={p.images[0]}
                      alt={title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                    />
                    <div>
                      <h3
                        onClick={() => onNavigate('product', { id: p.id })}
                        className="text-xs sm:text-sm font-bold text-gray-900 hover:text-[#176B45] cursor-pointer line-clamp-2"
                      >
                        {title}
                      </h3>
                      <div className="text-xs text-gray-500 mt-1">
                        {p.packSize} • {p.brand}
                      </div>
                      <div className="text-xs text-[#176B45] font-extrabold mt-1 sm:hidden">
                        ₹{p.sellingPrice} each
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden shadow-xs">
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs sm:text-sm font-extrabold text-gray-900 min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= p.stockQuantity}
                        className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total Price */}
                    <div className="text-right min-w-[70px]">
                      <div className="text-sm sm:text-base font-extrabold text-[#176B45]">
                        ₹{lineTotal}
                      </div>
                      {p.originalPrice > p.sellingPrice && (
                        <div className="text-[10px] text-gray-400 line-through">
                          ₹{p.originalPrice * item.quantity}
                        </div>
                      )}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-gray-400 hover:text-rose-500 p-1.5 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs font-bold text-[#176B45] hover:underline flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>

        {/* Right: Coupon & Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Coupon Box */}
          <div className="bg-white rounded-3xl border border-[#E5EAE5] p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <Tag className="w-4 h-4 text-[#176B45]" />
              <span>{t('couponCode')}</span>
            </div>

            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-xl text-xs">
                <div>
                  <div className="font-bold text-[#176B45]">{appliedCoupon.code} Applied</div>
                  <div className="text-[10px] text-gray-600">Saved ₹{cartDiscount}</div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  {t('removeCoupon')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setCouponFeedback(null);
                  }}
                  placeholder="e.g. WELCOME10"
                  className="flex-1 px-3 py-2 border rounded-xl text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#176B45]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#176B45] text-white font-bold text-xs rounded-xl hover:bg-[#125436]"
                >
                  {t('applyCoupon')}
                </button>
              </form>
            )}

            {couponFeedback && (
              <div
                className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                  couponFeedback.success ? 'bg-green-50 text-green-800' : 'bg-rose-50 text-rose-800'
                }`}
              >
                {couponFeedback.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{couponFeedback.message}</span>
              </div>
            )}

            {/* Quick Coupon Codes */}
            {!appliedCoupon && (
              <div className="pt-2 text-[11px] text-gray-500">
                <span className="font-semibold text-gray-700">Available Offers: </span>
                <span
                  onClick={() => {
                    setCouponInput('WELCOME10');
                    applyCoupon('WELCOME10');
                  }}
                  className="text-[#176B45] font-mono font-bold cursor-pointer hover:underline"
                >
                  WELCOME10
                </span>
                {', '}
                <span
                  onClick={() => {
                    setCouponInput('FRESH50');
                    applyCoupon('FRESH50');
                  }}
                  className="text-[#176B45] font-mono font-bold cursor-pointer hover:underline"
                >
                  FRESH50
                </span>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-3xl border border-[#E5EAE5] p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-gray-900 pb-2 border-b border-gray-100">
              {t('orderSummary')}
            </h3>

            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-bold text-gray-900">₹{cartSubtotal}</span>
              </div>

              {savingsTotal > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>{t('itemDiscount')}</span>
                  <span className="font-bold">-₹{savingsTotal}</span>
                </div>
              )}

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount</span>
                  <span className="font-bold">-₹{cartDiscount}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span>{t('deliveryFee')}</span>
                  <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                    PIN {activePinCode}
                  </span>
                </div>
                <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-700' : 'text-gray-900'}`}>
                  {deliveryFee === 0 ? t('free') : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-gray-900">{t('grandTotal')}</span>
                <span className="text-xl font-black text-[#176B45]">₹{cartTotal}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (!currentUser) {
                  onNavigate('login', { mode: 'register', redirect: 'checkout' });
                } else {
                  onNavigate('checkout');
                }
              }}
              className="w-full py-3.5 bg-[#176B45] hover:bg-[#125436] text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <span>{currentUser ? t('proceedToCheckout') : (language === 'bn' ? 'অ্যাকাউন্ট তৈরি করে অর্ডার করুন' : 'Create Account & Checkout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!currentUser && (
              <p className="text-[11px] text-center text-gray-500 font-medium">
                {language === 'bn'
                  ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? '
                  : 'Already registered? '}
                <button
                  type="button"
                  onClick={() => onNavigate('login', { mode: 'login', redirect: 'checkout' })}
                  className="text-[#176B45] font-bold underline hover:text-[#125436]"
                >
                  {language === 'bn' ? 'লগইন করুন' : 'Sign In here'}
                </button>
              </p>
            )}

            <p className="text-[10px] text-center text-gray-400">
              {t('taxesIncluded')}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
