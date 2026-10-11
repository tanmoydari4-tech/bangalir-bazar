import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { InvoiceModal } from '../components/invoice/InvoiceModal';
import {
  CheckCircle2,
  Package,
  Calendar,
  Clock,
  MapPin,
  Printer,
  ArrowRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

interface OrderConfirmationPageProps {
  orderId: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId, onNavigate }) => {
  const { getOrderById } = useStore();
  const { t, language } = useLanguage();
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold">Order details not found</h2>
        <button
          onClick={() => onNavigate('home')}
          className="px-5 py-2.5 bg-[#176B45] text-white rounded-xl text-xs font-bold"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Success Card */}
      <div className="bg-white rounded-3xl border border-[#E5EAE5] p-6 sm:p-10 shadow-sm text-center space-y-5">
        <div className="w-16 h-16 bg-green-100 text-[#176B45] rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#176B45] bg-green-50 px-3 py-1 rounded-full">
            ORDER CONFIRMED
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#252B27] mt-2">
            {t('orderConfirmedTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
            {t('orderConfirmedSubtitle')}
          </p>
        </div>

        <div className="p-4 bg-[#F7F9F5] rounded-2xl border border-[#E5EAE5] inline-flex items-center gap-3 text-xs">
          <span className="text-gray-500">{t('orderNumberLabel')}:</span>
          <strong className="font-mono text-base font-extrabold text-[#176B45]">{order.orderNumber}</strong>
        </div>

        {/* Schedule & Address Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1 text-xs">
            <div className="flex items-center gap-2 font-bold text-gray-800">
              <Calendar className="w-4 h-4 text-[#176B45]" />
              <span>{t('deliverySlotLabel')}</span>
            </div>
            <p className="text-gray-600 font-semibold">{order.deliveryDate}</p>
            <p className="text-gray-500 text-[11px]">{order.deliverySlot}</p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1 text-xs">
            <div className="flex items-center gap-2 font-bold text-gray-800">
              <MapPin className="w-4 h-4 text-[#176B45]" />
              <span>Delivery Address</span>
            </div>
            <p className="text-gray-700 truncate">{order.deliveryAddress.addressLine}</p>
            <p className="text-gray-500 text-[11px]">{order.deliveryAddress.locality}, PIN {order.deliveryAddress.pinCode}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('track-order', { id: order.id })}
            className="px-6 py-3 bg-[#176B45] hover:bg-[#125436] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>{t('trackOrder')}</span>
          </button>

          <button
            onClick={() => setIsInvoiceOpen(true)}
            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 shadow-xs"
          >
            <Printer className="w-4 h-4 text-[#176B45]" />
            <span>{t('viewInvoice')}</span>
          </button>
        </div>

        <div className="pt-4">
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-[#176B45] hover:underline inline-flex items-center gap-1"
          >
            <span>{t('continueShopping')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        order={order}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />

    </div>
  );
};
