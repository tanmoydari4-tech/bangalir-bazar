import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

interface MiniCartDrawerProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const MiniCartDrawer: React.FC<MiniCartDrawerProps> = ({ onNavigate }) => {
  const {
    cart,
    isMiniCartOpen,
    setIsMiniCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    cartTotal,
    savingsTotal,
    selectedDeliveryArea,
    storeSettings,
    appliedCoupon,
    currentUser
  } = useStore();
  const { t, language } = useLanguage();

  if (!isMiniCartOpen) return null;

  const freeThreshold = selectedDeliveryArea?.freeDeliveryThreshold || storeSettings.defaultFreeDeliveryThreshold;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeThreshold) * 100));
  const diffForFree = Math.max(0, freeThreshold - cartSubtotal);

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsMiniCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-200 pb-[env(safe-area-inset-bottom,0px)]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#176B45] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/15 rounded-xl">
                <ShoppingBag className="w-5 h-5 text-[#FFD166]" />
              </div>
              <div>
                <h2 className="font-bold text-base leading-tight">{t('yourCart')}</h2>
                <p className="text-xs text-green-100">
                  {t('itemsInCart', { count: totalItemCount })}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsMiniCartOpen(false)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          <div className="bg-[#EBF5EE] p-3 px-5 border-b border-green-100 text-xs">
            {diffForFree > 0 ? (
              <div>
                <p className="text-[#176B45] font-medium mb-1.5 flex items-center justify-between">
                  <span>{t('addMoreForFreeDelivery', { amount: diffForFree })}</span>
                  <span className="font-bold text-emerald-800">{progressPercent}%</span>
                </p>
                <div className="w-full bg-green-200/70 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#176B45] h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[#176B45] font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t('freeDeliveryUnlocked')}</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800">{t('emptyCartTitle')}</h3>
                <p className="text-xs text-gray-500 max-w-xs">{t('emptyCartSubtitle')}</p>
                <button
                  onClick={() => {
                    setIsMiniCartOpen(false);
                    onNavigate('shop');
                  }}
                  className="mt-2 px-5 py-2.5 bg-[#176B45] text-white text-xs font-semibold rounded-xl hover:bg-[#125436] transition-colors"
                >
                  {t('continueShopping')}
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const prod = item.product;
                const title = language === 'bn' ? prod.nameBn : prod.nameEn;
                const itemTotal = prod.sellingPrice * item.quantity;

                return (
                  <div key={item.productId} className="pt-3.5 first:pt-0 flex gap-3">
                    <img
                      src={prod.images[0]}
                      alt={title}
                      className="w-16 h-16 rounded-xl object-cover border border-gray-100 bg-gray-50 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">
                          {title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-gray-400 hover:text-red-500 p-1 -mr-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {prod.packSize} • {prod.brand}
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#176B45] text-sm">
                            ₹{itemTotal}
                          </span>
                          {prod.originalPrice > prod.sellingPrice && (
                            <span className="text-[10px] text-gray-400 line-through">
                              ₹{prod.originalPrice * item.quantity}
                            </span>
                          )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 text-gray-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= prod.stockQuantity}
                            className="p-1 hover:bg-gray-200 text-gray-600 disabled:opacity-40 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Price Breakdown */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-[#F7F9F5] space-y-3">
              {appliedCoupon && (
                <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 p-2 rounded-lg text-xs font-medium border border-emerald-200">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon: <strong>{appliedCoupon.code}</strong></span>
                  </div>
                  <span className="font-bold">-₹{cartDiscount}</span>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span className="font-semibold text-gray-800">₹{cartSubtotal}</span>
                </div>
                {savingsTotal > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>{t('itemDiscount')}</span>
                    <span className="font-semibold">-₹{savingsTotal}</span>
                  </div>
                )}
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Coupon Discount</span>
                    <span className="font-semibold">-₹{cartDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t('deliveryFee')}</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-700' : 'text-gray-800'}`}>
                    {deliveryFee === 0 ? t('free') : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>{t('grandTotal')}</span>
                  <span className="text-[#176B45] text-base">₹{cartTotal}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setIsMiniCartOpen(false);
                    onNavigate('cart');
                  }}
                  className="py-2.5 px-3 border border-gray-300 rounded-xl font-semibold text-xs text-gray-700 hover:bg-gray-100 transition-colors text-center"
                >
                  {t('cart')}
                </button>
                <button
                  onClick={() => {
                    setIsMiniCartOpen(false);
                    if (!currentUser) {
                      onNavigate('login', { mode: 'register', redirect: 'checkout' });
                    } else {
                      onNavigate('checkout');
                    }
                  }}
                  className="py-2.5 px-3 bg-[#176B45] text-white font-bold text-xs rounded-xl hover:bg-[#125436] transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>{currentUser ? t('proceedToCheckout') : (language === 'bn' ? 'অ্যাকাউন্ট তৈরি ও চেকআউট' : 'Register & Checkout')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[10px] text-center text-gray-400">
                {t('taxesIncluded')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
