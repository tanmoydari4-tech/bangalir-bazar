import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Address } from '../types';
import { InvoiceModal } from '../components/invoice/InvoiceModal';
import {
  User,
  Package,
  MapPin,
  Heart,
  Plus,
  Trash2,
  Printer,
  ChevronRight,
  LogOut,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface CustomerDashboardPageProps {
  initialTab?: 'orders' | 'addresses' | 'profile';
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({
  initialTab = 'orders',
  onNavigate
}) => {
  const {
    currentUser,
    orders,
    logout,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    activePinCode,
    deliveryAreas
  } = useStore();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>(initialTab);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any | null>(null);

  // New Address form
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: currentUser?.name || '',
    mobile: currentUser?.mobile || '',
    addressLine: '',
    locality: '',
    landmark: '',
    pinCode: activePinCode,
    type: 'Home' as Address['type']
  });

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-[#176B45] to-[#4FA86B] rounded-3xl text-white flex items-center justify-center mx-auto shadow-md">
          <User className="w-8 h-8 text-[#FFD166]" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {language === 'bn' ? 'অ্যাকাউন্ট দেখতে লগইন করুন' : 'Sign in to view your account'}
        </h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          {language === 'bn'
            ? 'আপনার প্রোফাইল, অর্ডার হিস্ট্রি বা অ্যাড্রেস দেখতে পুনরায় লগইন করুন।'
            : 'Please sign in or create an account to view your orders, addresses, and saved profile.'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
          <button
            onClick={() => onNavigate('login', { mode: 'login', redirect: 'account' })}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#176B45] hover:bg-[#125436] text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            {t('login')}
          </button>
          <button
            onClick={() => onNavigate('login', { mode: 'register', redirect: 'account' })}
            className="w-full sm:w-auto px-6 py-2.5 bg-white border border-[#176B45] text-[#176B45] hover:bg-gray-50 rounded-xl text-xs font-bold transition-all"
          >
            {t('register')}
          </button>
        </div>
      </div>
    );
  }

  const userOrders = orders.filter(
    o => o.userId === currentUser.id || o.customerSnapshot.email === currentUser.email
  );

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.addressLine || !addressForm.locality || !addressForm.pinCode) return;

    addAddress({
      ...addressForm,
      isDefault: currentUser.addresses.length === 0
    });
    setIsAddingAddress(false);
    setAddressForm({
      name: currentUser.name,
      mobile: currentUser.mobile,
      addressLine: '',
      locality: '',
      landmark: '',
      pinCode: activePinCode,
      type: 'Home'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Account Header */}
      <div className="bg-white rounded-3xl border border-[#E5EAE5] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#176B45] to-[#4FA86B] text-white flex items-center justify-center font-black text-xl shadow-md">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">{currentUser.name}</h1>
            <p className="text-xs text-gray-500">{currentUser.email} • {currentUser.mobile}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className="px-4 py-2 bg-green-50 text-[#176B45] border border-green-200 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors"
            >
              Admin Portal ⚙
            </button>
          )}
          <button
            onClick={() => {
              logout();
              onNavigate('home');
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-xs font-semibold text-gray-700 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-3xl border border-[#E5EAE5] p-3 shadow-sm space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full p-3 rounded-2xl text-left text-xs font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'orders'
                ? 'bg-[#176B45] text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{t('myOrders')} ({userOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full p-3 rounded-2xl text-left text-xs font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'addresses'
                ? 'bg-[#176B45] text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{t('addresses')} ({currentUser.addresses.length})</span>
          </button>

          <button
            onClick={() => onNavigate('wishlist')}
            className="w-full p-3 rounded-2xl text-left text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <Heart className="w-4 h-4" />
            <span>{t('wishlist')}</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full p-3 rounded-2xl text-left text-xs font-bold flex items-center gap-3 transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#176B45] text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{t('personalInfo')}</span>
          </button>
        </aside>

        {/* Tab Content Area */}
        <main className="lg:col-span-9 bg-white rounded-3xl border border-[#E5EAE5] p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-lg font-extrabold text-gray-900 pb-2 border-b border-gray-100">
                {t('myOrders')}
              </h2>

              {userOrders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Package className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-xs text-gray-500">{t('noOrdersYet')}</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-5 py-2.5 bg-[#176B45] text-white text-xs font-bold rounded-xl"
                  >
                    {t('continueShopping')}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl border border-gray-200 hover:border-[#4FA86B]/50 transition-all space-y-4 bg-[#F7F9F5]/40"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-gray-900">
                              Order #{ord.orderNumber}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                ord.orderStatus === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.orderStatus === 'Cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-[#176B45]'
                              }`}
                            >
                              {ord.orderStatus}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })} • {ord.deliverySlot}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-base font-black text-[#176B45]">
                            ₹{ord.total}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {ord.paymentMethod}
                          </div>
                        </div>
                      </div>

                      {/* Items thumbnails */}
                      <div className="flex items-center gap-3 overflow-x-auto py-1">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 shrink-0 bg-white p-2 rounded-xl border border-gray-100">
                            <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                            <div className="text-[11px]">
                              <p className="font-bold text-gray-800 line-clamp-1 max-w-[120px]">
                                {language === 'bn' ? item.productNameBn : item.productNameEn}
                              </p>
                              <p className="text-gray-500">{item.packSize} • Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setSelectedInvoiceOrder(ord)}
                          className="px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#176B45]" />
                          <span>{t('viewInvoice')}</span>
                        </button>
                        <button
                          onClick={() => onNavigate('track-order', { id: ord.id })}
                          className="px-4 py-1.5 bg-[#176B45] hover:bg-[#125436] text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          {t('trackOrder')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h2 className="text-lg font-extrabold text-gray-900">
                  {t('addresses')}
                </h2>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="text-xs font-bold text-[#176B45] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingAddress ? 'Cancel' : t('addNewAddress')}</span>
                </button>
              </div>

              {isAddingAddress && (
                <form onSubmit={handleSaveAddress} className="p-5 rounded-2xl bg-[#F7F9F5] border border-[#E5EAE5] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">Add New Delivery Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Name</label>
                      <input
                        type="text"
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                        required
                        className="w-full p-2 border rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Phone</label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={addressForm.mobile}
                        onChange={(e) => setAddressForm({ ...addressForm, mobile: e.target.value })}
                        required
                        className="w-full p-2 border rounded-xl bg-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-gray-700 font-bold mb-1">Address</label>
                      <input
                        type="text"
                        value={addressForm.addressLine}
                        onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                        required
                        className="w-full p-2 border rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Locality</label>
                      <input
                        type="text"
                        value={addressForm.locality}
                        onChange={(e) => setAddressForm({ ...addressForm, locality: e.target.value })}
                        required
                        className="w-full p-2 border rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">PIN Code</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={addressForm.pinCode}
                        onChange={(e) => setAddressForm({ ...addressForm, pinCode: e.target.value })}
                        required
                        className="w-full p-2 border rounded-xl bg-white font-mono font-bold"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#176B45] text-white rounded-xl text-xs font-bold"
                  >
                    Save Address
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentUser.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-2xl border border-gray-200 bg-white space-y-2 relative"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-gray-900">{addr.name}</span>
                      <span className="text-[10px] bg-green-100 text-[#176B45] font-bold px-2 py-0.5 rounded-full uppercase">
                        {addr.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{addr.addressLine}</p>
                    <p className="text-xs text-gray-600">{addr.locality}, PIN {addr.pinCode}</p>
                    <p className="text-[11px] text-gray-500">Phone: {addr.mobile}</p>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      {addr.isDefault ? (
                        <span className="text-[11px] font-bold text-emerald-700">✓ Default Address</span>
                      ) : (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-[11px] text-[#176B45] hover:underline font-semibold"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-gray-400 hover:text-rose-600 p-1"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-extrabold text-gray-900 pb-2 border-b border-gray-100">
                {t('personalInfo')}
              </h2>
              <div className="max-w-md space-y-4 text-xs">
                <div>
                  <label className="block text-gray-500 font-bold uppercase text-[10px] mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.name}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 text-gray-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-bold uppercase text-[10px] mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-bold uppercase text-[10px] mb-1">Registered Mobile</label>
                  <input
                    type="tel"
                    disabled
                    value={currentUser.mobile}
                    className="w-full p-2.5 border rounded-xl bg-gray-50 text-gray-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-bold uppercase text-[10px] mb-1">Account Role</label>
                  <span className="px-3 py-1 bg-green-100 text-[#176B45] rounded-lg font-bold text-xs uppercase inline-block">
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          isOpen={!!selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

    </div>
  );
};
