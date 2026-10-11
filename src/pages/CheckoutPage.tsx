import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Address, PaymentMethod } from '../types';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  ArrowLeft,
  Truck,
  QrCode,
  DollarSign,
  Lock
} from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    cartTotal,
    savingsTotal,
    currentUser,
    addAddress,
    deliverySlots,
    deliveryAreas,
    activePinCode,
    selectedDeliveryArea,
    createOrder
  } = useStore();
  const { t, language } = useLanguage();

  // Address state
  const savedAddresses = currentUser?.addresses || [];
  const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddr ? defaultAddr.id : 'new');

  const [newAddressForm, setNewAddressForm] = useState({
    name: currentUser?.name || '',
    mobile: currentUser?.mobile || '',
    addressLine: '',
    locality: '',
    landmark: '',
    pinCode: activePinCode,
    type: 'Home' as Address['type']
  });

  const [isAddingNewAddress, setIsAddingNewAddress] = useState(savedAddresses.length === 0);

  // Delivery slot state
  const [deliveryDate, setDeliveryDate] = useState<'Today' | 'Tomorrow'>('Today');
  const [selectedSlotId, setSelectedSlotId] = useState<string>(deliverySlots[0]?.id || '');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Your basket is empty</h2>
        <p className="text-xs text-gray-500">Add fresh groceries before proceeding to checkout.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-5 py-2.5 bg-[#176B45] text-white rounded-xl text-xs font-bold"
        >
          {t('continueShopping')}
        </button>
      </div>
    );
  }

  // Mandatory Authentication Gate: At first create account, next login, then order any product
  if (!currentUser) {
    return (
      <div className="max-w-lg mx-auto px-4 py-14 space-y-6">
        <div className="bg-white rounded-3xl border border-[#E5EAE5] p-6 sm:p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#176B45] to-[#4FA86B] rounded-3xl text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8 text-[#FFD166]" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-black tracking-widest text-[#176B45] uppercase bg-green-50 px-3 py-1 rounded-full">
              STEP 1: ACCOUNT REQUIRED
            </span>
            <h2 className="text-2xl font-black text-[#252B27]">
              {language === 'bn' ? 'অর্ডার করতে প্রথমে অ্যাকাউন্ট তৈরি বা লগইন করুন' : 'Create Account or Sign In to Place Order'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
              {language === 'bn'
                ? 'আপনার ঝুড়িতে পণ্য প্রস্তুত আছে। ডেলিভারির ঠিকানা সংরক্ষণ এবং অর্ডার ট্র্যাকিংয়ের জন্য প্রথমে অ্যাকাউন্ট তৈরি করুন অথবা লগইন করুন।'
                : 'Your grocery basket is saved. To ensure accurate doorstep delivery and real-time order tracking, please create an account or sign in first.'}
            </p>
          </div>

          {/* Basket preview badge */}
          <div className="p-3.5 bg-[#F7F9F5] rounded-2xl border border-[#E5EAE5] flex items-center justify-between text-xs">
            <div className="text-left">
              <span className="font-bold text-gray-900 block">
                {cart.length} {language === 'bn' ? 'টি আইটেম ঝুড়িতে আছে' : 'Items in Basket'}
              </span>
              <span className="text-gray-500 text-[11px]">
                {language === 'bn' ? 'লগইন করার পর ঝুড়ি অক্ষুণ্ণ থাকবে' : 'Basket will remain saved after sign in'}
              </span>
            </div>
            <span className="text-base font-black text-[#176B45]">
              ₹{cartTotal}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => onNavigate('login', { mode: 'register', redirect: 'checkout' })}
              className="w-full py-3.5 bg-[#176B45] hover:bg-[#125436] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#FFD166]" />
              <span>{language === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি করুন (Create Account)' : 'Create New Account First'}</span>
            </button>

            <button
              onClick={() => onNavigate('login', { mode: 'login', redirect: 'checkout' })}
              className="w-full py-3 bg-white hover:bg-gray-50 text-[#176B45] border-2 border-[#176B45] font-extrabold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'bn' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? সাইন ইন করুন (Sign In)' : 'Already Have an Account? Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Verified Sourcing & Secure Checkout</span>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    setErrorMessage(null);

    // 1. Resolve Delivery Address
    let finalAddress: Address;
    if (isAddingNewAddress || selectedAddressId === 'new') {
      if (!newAddressForm.name.trim() || !newAddressForm.mobile.trim() || !newAddressForm.addressLine.trim() || !newAddressForm.pinCode.trim()) {
        setErrorMessage('Please fill in all required address fields.');
        return;
      }
      if (!/^\d{10}$/.test(newAddressForm.mobile.trim())) {
        setErrorMessage('Please enter a valid 10-digit mobile number.');
        return;
      }
      if (!/^\d{6}$/.test(newAddressForm.pinCode.trim())) {
        setErrorMessage('Please enter a valid 6-digit PIN code.');
        return;
      }

      // Check if area is serviceable
      const serviceable = deliveryAreas.find(a => a.pinCode === newAddressForm.pinCode.trim() && a.isActive);
      if (!serviceable) {
        setErrorMessage(`Sorry, we do not deliver to PIN Code ${newAddressForm.pinCode}.`);
        return;
      }

      finalAddress = addAddress({
        ...newAddressForm,
        isDefault: savedAddresses.length === 0
      });
    } else {
      const found = savedAddresses.find(a => a.id === selectedAddressId);
      if (!found) {
        setErrorMessage('Please select a valid delivery address.');
        return;
      }
      finalAddress = found;
    }

    // 2. Resolve Slot
    const slotObj = deliverySlots.find(s => s.id === selectedSlotId) || deliverySlots[0];
    const slotText = language === 'bn' ? slotObj.timeRangeBn : slotObj.timeRangeEn;

    // 3. If online payment, show payment simulation gateway
    if (paymentMethod === 'Razorpay' || paymentMethod === 'UPI' || paymentMethod === 'Card') {
      setPaymentModalOpen(true);
    } else {
      executeOrderCreation(finalAddress, slotText, 'Cash on Delivery');
    }
  };

  const executeOrderCreation = (address: Address, slotText: string, pMethod: PaymentMethod) => {
    setIsProcessing(true);
    setTimeout(() => {
      const res = createOrder({
        deliveryAddress: address,
        deliveryDate,
        deliverySlot: slotText,
        paymentMethod: pMethod
      });

      setIsProcessing(false);
      setPaymentModalOpen(false);

      if (res.success && res.order) {
        // Confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore
        }
        onNavigate('order-confirmation', { id: res.order.id });
      } else {
        setErrorMessage(res.error || 'Failed to place order.');
      }
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE5]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252B27]">
            {t('checkoutTitle')}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            100% Secure Checkout with verified doorstep delivery
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#176B45] font-semibold bg-green-50 px-3 py-1.5 rounded-xl border border-green-200">
          <Lock className="w-3.5 h-3.5" />
          <span>SSL 256-bit Encrypted</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Steps 1, 2, 3 */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1: Delivery Address */}
          <section className="bg-white rounded-3xl border border-[#E5EAE5] p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-[#176B45] text-white rounded-full flex items-center justify-center font-extrabold text-xs">
                  1
                </div>
                <h2 className="font-extrabold text-base text-gray-900">
                  {t('step1ContactAddress')}
                </h2>
              </div>

              {savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                  className="text-xs font-bold text-[#176B45] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingNewAddress ? 'Choose Saved' : t('addNewAddress')}</span>
                </button>
              )}
            </div>

            {/* Saved Addresses List */}
            {!isAddingNewAddress && savedAddresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-[#176B45] bg-green-50/40 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-xs text-gray-900">{addr.name}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold uppercase">
                        {addr.type}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-0.5">
                      <p>{addr.addressLine}</p>
                      <p>{addr.locality} - <strong className="font-mono">{addr.pinCode}</strong></p>
                      <p className="text-[11px] text-gray-500 pt-1">Phone: {addr.mobile}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* New Address Form */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t('fullName')} *</label>
                  <input
                    type="text"
                    value={newAddressForm.name}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, name: e.target.value })}
                    placeholder="e.g. Tanmoy Dari"
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-[#176B45] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t('mobileNumber')} *</label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={newAddressForm.mobile}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, mobile: e.target.value.replace(/[^0-9]/g, '') })}
                    placeholder="9830123456"
                    className="w-full px-3 py-2 border rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#176B45] focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t('addressLine')} *</label>
                  <input
                    type="text"
                    value={newAddressForm.addressLine}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, addressLine: e.target.value })}
                    placeholder="Flat 4B, Sunflower Enclave, Street 14"
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-[#176B45] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t('localityArea')} *</label>
                  <input
                    type="text"
                    value={newAddressForm.locality}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, locality: e.target.value })}
                    placeholder="Salt Lake Sector V"
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-[#176B45] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t('pinCode')} *</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={newAddressForm.pinCode}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, pinCode: e.target.value.replace(/[^0-9]/g, '') })}
                    placeholder="700091"
                    className="w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-[#176B45] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t('landmark')}</label>
                  <input
                    type="text"
                    value={newAddressForm.landmark}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, landmark: e.target.value })}
                    placeholder="Near Webel More"
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-[#176B45] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t('addressType')}</label>
                  <div className="flex gap-2">
                    {(['Home', 'Work', 'Other'] as Address['type'][]).map((tType) => (
                      <button
                        key={tType}
                        type="button"
                        onClick={() => setNewAddressForm({ ...newAddressForm, type: tType })}
                        className={`flex-1 py-2 text-xs font-semibold rounded-xl border ${
                          newAddressForm.type === tType
                            ? 'bg-[#176B45] text-white border-[#176B45]'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        {tType}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* STEP 2: Delivery Slot */}
          <section className="bg-white rounded-3xl border border-[#E5EAE5] p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#176B45] text-white rounded-full flex items-center justify-center font-extrabold text-xs">
                2
              </div>
              <h2 className="font-extrabold text-base text-gray-900">
                {t('step2DeliverySlot')}
              </h2>
            </div>

            {/* Date Selection */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setDeliveryDate('Today')}
                className={`flex-1 p-3 rounded-2xl border-2 text-left transition-all ${
                  deliveryDate === 'Today'
                    ? 'border-[#176B45] bg-green-50/40 font-bold text-[#176B45]'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                <div className="text-xs uppercase tracking-wider">{t('today')}</div>
                <div className="text-sm font-extrabold mt-0.5">Express Slots</div>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryDate('Tomorrow')}
                className={`flex-1 p-3 rounded-2xl border-2 text-left transition-all ${
                  deliveryDate === 'Tomorrow'
                    ? 'border-[#176B45] bg-green-50/40 font-bold text-[#176B45]'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                <div className="text-xs uppercase tracking-wider">{t('tomorrow')}</div>
                <div className="text-sm font-extrabold mt-0.5">Morning & Evening</div>
              </button>
            </div>

            {/* Slots List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {deliverySlots.filter(s => s.isActive).map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                const slotText = language === 'bn' ? slot.timeRangeBn : slot.timeRangeEn;
                const availableSeats = slot.capacity - slot.bookedCount;

                return (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#176B45] bg-green-50/50 text-[#176B45]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className={`w-4 h-4 ${isSelected ? 'text-[#176B45]' : 'text-gray-400'}`} />
                      <div>
                        <div className="text-xs font-bold">{slotText}</div>
                        <div className="text-[10px] text-gray-500">{availableSeats} slots left</div>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#176B45]" />}
                  </div>
                );
              })}
            </div>
          </section>

          {/* STEP 3: Payment Method */}
          <section className="bg-white rounded-3xl border border-[#E5EAE5] p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#176B45] text-white rounded-full flex items-center justify-center font-extrabold text-xs">
                3
              </div>
              <h2 className="font-extrabold text-base text-gray-900">
                {t('step3Payment')}
              </h2>
            </div>

            <div className="space-y-3 pt-1">
              {/* Razorpay Online */}
              <label
                onClick={() => setPaymentMethod('Razorpay')}
                className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'Razorpay'
                    ? 'border-[#176B45] bg-green-50/40'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">
                      Razorpay Secure (UPI, GPay, Paytm, Cards & NetBanking)
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Instant verification • Zero transaction fees
                    </div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Razorpay'}
                  onChange={() => setPaymentMethod('Razorpay')}
                  className="accent-[#176B45]"
                />
              </label>

              {/* Instant UPI QR */}
              <label
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-[#176B45] bg-green-50/40'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">
                      Direct UPI QR Code (Scan with phone)
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Scan and pay directly via BHIM, PhonePe, Google Pay
                    </div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  className="accent-[#176B45]"
                />
              </label>

              {/* Cash On Delivery */}
              <label
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-[#176B45] bg-green-50/40'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">
                      {t('cashOnDelivery')}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Pay cash or UPI at delivery doorstep
                    </div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                  className="accent-[#176B45]"
                />
              </label>
            </div>
          </section>
        </div>

        {/* Right Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E5EAE5] p-6 shadow-sm space-y-4 sticky top-24">
            <h3 className="font-extrabold text-base text-gray-900 pb-2 border-b border-gray-100">
              {t('orderSummary')}
            </h3>

            {/* Items Mini List */}
            <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1 divide-y divide-gray-50 text-xs">
              {cart.map((item) => (
                <div key={item.productId} className="pt-2 first:pt-0 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={item.product.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-gray-800 truncate">
                        {language === 'bn' ? item.product.nameBn : item.product.nameEn}
                      </div>
                      <div className="text-[10px] text-gray-500">Qty: {item.quantity} × ₹{item.product.sellingPrice}</div>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">
                    ₹{item.product.sellingPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
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
              <div className="flex justify-between">
                <span>{t('deliveryFee')}</span>
                <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-700' : 'text-gray-900'}`}>
                  {deliveryFee === 0 ? t('free') : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-gray-900">{t('grandTotal')}</span>
                <span className="text-xl font-black text-[#176B45]">₹{cartTotal}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              disabled={isProcessing}
              onClick={handlePlaceOrder}
              className="w-full py-3.5 bg-[#176B45] hover:bg-[#125436] text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>{t('processingPayment')}</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('placeOrderBtn')} (₹{cartTotal})</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-gray-400">
              By confirming, you agree to Bangalir Bazar Terms & Conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Simulated Payment Gateway Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#176B45] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] bg-[#FFD166] text-[#252B27] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                  TEST PAYMENT GATEWAY
                </span>
                <h3 className="font-bold text-lg mt-1">Bangalir Bazar Checkout</h3>
              </div>
              <span className="text-sm font-extrabold text-[#FFD166]">₹{cartTotal}</span>
            </div>

            <div className="p-6 space-y-5">
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800">
                Simulating verified payment gateway transaction for India (Razorpay / UPI integration). Click below to authorize.
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Merchant:</span>
                  <span className="font-bold text-gray-900">Bangalir Bazar Retail</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Payable Amount:</span>
                  <span className="font-extrabold text-[#176B45] text-sm">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Payment Channel:</span>
                  <span className="font-semibold">{paymentMethod}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="flex-1 py-2.5 border rounded-xl text-xs font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => {
                    const resolvedAddr = isAddingNewAddress
                      ? addAddress({ ...newAddressForm, isDefault: savedAddresses.length === 0 })
                      : savedAddresses.find(a => a.id === selectedAddressId) || savedAddresses[0];
                    const slotObj = deliverySlots.find(s => s.id === selectedSlotId) || deliverySlots[0];
                    const slotText = language === 'bn' ? slotObj.timeRangeBn : slotObj.timeRangeEn;
                    executeOrderCreation(resolvedAddr, slotText, paymentMethod);
                  }}
                  className="flex-1 py-2.5 bg-[#176B45] text-white font-bold text-xs rounded-xl hover:bg-[#125436]"
                >
                  {isProcessing ? 'Verifying...' : 'Authorize & Pay'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
