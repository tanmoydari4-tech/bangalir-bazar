import React from 'react';
import { Order } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { Printer, X, Download, ShieldCheck } from 'lucide-react';

interface InvoiceModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  const { storeSettings } = useStore();
  const { language } = useLanguage();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 my-8">
        
        {/* Controls bar (hidden during print) */}
        <div className="bg-[#176B45] text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#FFD166]" />
            <span className="font-bold text-sm">Retail Grocery Invoice</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-8 space-y-6 text-gray-800 text-xs font-sans print:p-0">
          
          {/* Header */}
          <div className="flex justify-between items-start pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-xl font-extrabold text-[#176B45] tracking-tight">
                {language === 'bn' ? storeSettings.storeNameBn : storeSettings.storeNameEn}
              </h1>
              <p className="text-[11px] text-gray-500 font-medium">
                {language === 'bn' ? storeSettings.taglineBn : storeSettings.taglineEn}
              </p>
              <p className="text-[11px] text-gray-600 mt-2 max-w-xs">
                {storeSettings.addressEn}
              </p>
              <p className="text-[11px] text-gray-600">
                Phone: {storeSettings.contactPhone} | GSTIN: 19AAACB1234F1Z8
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block px-2.5 py-0.5 bg-green-100 text-[#176B45] font-extrabold rounded-md text-[10px] uppercase">
                ORIGINAL TAX INVOICE
              </span>
              <p className="text-xs font-mono font-bold text-gray-900 mt-1">
                Order ID: {order.orderNumber}
              </p>
              <p className="text-[11px] text-gray-500">
                Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-[11px] text-gray-500">
                Payment: <strong className="text-gray-800">{order.paymentMethod}</strong> ({order.paymentStatus})
              </p>
            </div>
          </div>

          {/* Customer & Delivery Slot details */}
          <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
            <div>
              <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[10px] mb-1">
                Billed & Delivered To:
              </h4>
              <p className="font-bold text-gray-900">{order.customerSnapshot.name}</p>
              <p className="text-gray-600">{order.deliveryAddress.addressLine}</p>
              <p className="text-gray-600">{order.deliveryAddress.locality}, PIN {order.deliveryAddress.pinCode}</p>
              <p className="text-gray-600">Mobile: {order.deliveryAddress.mobile}</p>
            </div>

            <div className="space-y-1 text-right sm:text-left">
              <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[10px] mb-1">
                Delivery Schedule:
              </h4>
              <p><span className="text-gray-500">Date:</span> <strong>{order.deliveryDate}</strong></p>
              <p><span className="text-gray-500">Time Slot:</span> <strong>{order.deliverySlot}</strong></p>
              <p><span className="text-gray-500">Status:</span> <strong className="text-emerald-700">{order.orderStatus}</strong></p>
              {order.deliveryPerson && (
                <p className="text-[11px] text-gray-600">Executive: {order.deliveryPerson.name} ({order.deliveryPerson.phone})</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 text-gray-600 font-bold uppercase text-[10px]">
                  <th className="py-2.5">Item Description</th>
                  <th className="py-2.5 text-center">Pack Size</th>
                  <th className="py-2.5 text-right">Price</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-2.5 pr-2 font-medium">
                      {language === 'bn' ? item.productNameBn : item.productNameEn}
                      <span className="block text-[10px] text-gray-400 font-mono">Brand: {item.brand}</span>
                    </td>
                    <td className="py-2.5 text-center text-gray-600">{item.packSize}</td>
                    <td className="py-2.5 text-right font-mono">₹{item.price}</td>
                    <td className="py-2.5 text-center font-bold font-mono">{item.quantity}</td>
                    <td className="py-2.5 text-right font-bold font-mono text-gray-900">₹{item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="pt-4 border-t border-gray-200 flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold">₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount ({order.couponCode}):</span>
                  <span className="font-mono font-bold">-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges:</span>
                <span className="font-mono">{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes (Included):</span>
                <span className="font-mono">₹0</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-extrabold text-[#176B45]">
                <span>Total Amount Paid:</span>
                <span className="font-mono text-base">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-6 border-t border-gray-200 text-center text-[10px] text-gray-400 space-y-1">
            <p>This is a computer generated retail invoice. Thank you for shopping with Bangalir Bazar.</p>
            <p>For return assistance or queries, please call {storeSettings.contactPhone} or write to {storeSettings.contactEmail}.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
