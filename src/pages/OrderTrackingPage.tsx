import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { OrderStatus } from '../types';
import { InvoiceModal } from '../components/invoice/InvoiceModal';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Printer,
  XCircle,
  Phone,
  User,
  ArrowLeft,
  Calendar
} from 'lucide-react';

interface OrderTrackingPageProps {
  orderId: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

const ORDER_STEPS: OrderStatus[] = [
  'Order Placed',
  'Confirmed',
  'Packed',
  'Out for Delivery',
  'Delivered'
];

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ orderId, onNavigate }) => {
  const { getOrderById, updateOrderStatus } = useStore();
  const { t, language } = useLanguage();
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold">Order not found</h2>
        <button
          onClick={() => onNavigate('orders')}
          className="px-5 py-2.5 bg-[#176B45] text-white rounded-xl text-xs font-bold"
        >
          View All Orders
        </button>
      </div>
    );
  }

  const currentStepIndex = ORDER_STEPS.indexOf(order.orderStatus as any);
  const isCancelled = order.orderStatus === 'Cancelled';

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this grocery order?')) {
      updateOrderStatus(order.id, 'Cancelled');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5EAE5]">
        <div>
          <button
            onClick={() => onNavigate('orders')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#176B45] hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>My Orders</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-[#252B27]">
              Order #{order.orderNumber}
            </h1>
            <span
              className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                order.orderStatus === 'Delivered'
                  ? 'bg-emerald-100 text-emerald-800'
                  : order.orderStatus === 'Cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-[#176B45]'
              }`}
            >
              {order.orderStatus}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInvoiceOpen(true)}
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-[#176B45]" />
            <span>{t('viewInvoice')}</span>
          </button>

          {!isCancelled && (order.orderStatus === 'Order Placed' || order.orderStatus === 'Confirmed') && (
            <button
              onClick={handleCancelOrder}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Live Order Timeline */}
      <div className="bg-white rounded-3xl border border-[#E5EAE5] p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#176B45]" />
          <span>{t('orderStatusTimeline')}</span>
        </h3>

        {isCancelled ? (
          <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-2xl flex items-center gap-3 text-xs font-medium">
            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>This order was cancelled. Any online payment has been refunded to your original payment method.</span>
          </div>
        ) : (
          <div className="relative">
            {/* Progress line */}
            <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-gray-200 z-0">
              <div
                className="h-full bg-[#176B45] transition-all duration-500"
                style={{
                  width: `${(Math.max(0, currentStepIndex) / (ORDER_STEPS.length - 1)) * 100}%`
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
              {ORDER_STEPS.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                        isPassed
                          ? 'bg-[#176B45] text-white shadow-md'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      } ${isCurrent ? 'ring-4 ring-green-200 animate-pulse-subtle' : ''}`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isPassed ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step}
                      </div>
                      {isCurrent && (
                        <div className="text-[10px] text-emerald-700 font-semibold">
                          In Progress
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Assigned Executive details if out for delivery */}
        {order.deliveryPerson && !isCancelled && (
          <div className="mt-4 p-4 rounded-2xl bg-[#F7F9F5] border border-[#E5EAE5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 text-[#176B45] flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500">{t('assignedDeliveryExecutive')}</span>
                <p className="font-extrabold text-sm text-gray-900">{order.deliveryPerson.name}</p>
              </div>
            </div>
            <a
              href={`tel:${order.deliveryPerson.phone}`}
              className="px-4 py-2 bg-white hover:bg-gray-100 rounded-xl border border-gray-200 font-bold text-xs text-[#176B45] inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{order.deliveryPerson.phone}</span>
            </a>
          </div>
        )}
      </div>

      {/* Order Item Snapshots and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E5EAE5] p-5 sm:p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-gray-900 pb-2 border-b border-gray-100">
            Items in this order ({order.items.reduce((s, i) => s + i.quantity, 0)})
          </h3>

          <div className="divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3.5 first:pt-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">
                      {language === 'bn' ? item.productNameBn : item.productNameEn}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {item.packSize} • {item.brand}
                    </p>
                    <p className="text-[11px] text-gray-600 font-mono">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="font-mono font-extrabold text-xs text-gray-900 shrink-0">
                  ₹{item.subtotal}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address & Payment snapshot */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-[#E5EAE5] p-5 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-gray-900 pb-2 border-b border-gray-100">
              Delivery Details
            </h4>
            <div className="space-y-1.5 text-gray-600">
              <p className="font-bold text-gray-900">{order.customerSnapshot.name}</p>
              <p>{order.deliveryAddress.addressLine}</p>
              <p>{order.deliveryAddress.locality}, PIN {order.deliveryAddress.pinCode}</p>
              <p className="text-gray-500">Contact: {order.deliveryAddress.mobile}</p>
            </div>

            <div className="pt-2 border-t border-gray-100 text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Date:</span>
                <strong className="text-gray-800">{order.deliveryDate}</strong>
              </div>
              <div className="flex justify-between">
                <span>Slot:</span>
                <strong className="text-gray-800">{order.deliverySlot}</strong>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#E5EAE5] p-5 shadow-sm space-y-2.5 text-xs">
            <h4 className="font-bold text-gray-900 pb-2 border-b border-gray-100">
              Payment Summary
            </h4>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({order.couponCode}):</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee:</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between font-extrabold text-sm text-gray-900">
              <span>Total Paid:</span>
              <span className="text-[#176B45]">₹{order.total}</span>
            </div>
            <div className="pt-1 text-[11px] text-gray-500">
              Method: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
            </div>
          </div>
        </div>
      </div>

      <InvoiceModal
        order={order}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />

    </div>
  );
};
