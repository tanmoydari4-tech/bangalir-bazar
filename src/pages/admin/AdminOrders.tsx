import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { Order, OrderStatus } from '../../types';
import { InvoiceModal } from '../../components/invoice/InvoiceModal';
import {
  ShoppingBag,
  Search,
  Printer,
  Edit2,
  CheckCircle2,
  Clock,
  Truck,
  User,
  Phone,
  Filter,
  X
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  const { language } = useLanguage();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Status edit form
  const [newStatus, setNewStatus] = useState<OrderStatus>('Order Placed');
  const [deliveryPersonName, setDeliveryPersonName] = useState('');
  const [deliveryPersonPhone, setDeliveryPersonPhone] = useState('');

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerSnapshot.name.toLowerCase().includes(q) ||
        o.customerSnapshot.mobile.includes(q) ||
        o.deliveryAddress.pinCode.includes(q)
      );
    }
    return true;
  });

  const openStatusModal = (ord: Order) => {
    setEditingOrder(ord);
    setNewStatus(ord.orderStatus);
    setDeliveryPersonName(ord.deliveryPerson?.name || 'Debasis Roy');
    setDeliveryPersonPhone(ord.deliveryPerson?.phone || '+91 98311 44552');
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    updateOrderStatus(editingOrder.id, newStatus, {
      name: deliveryPersonName,
      phone: deliveryPersonPhone
    });
    setEditingOrder(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Customer Orders & Fulfillment</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Process orders through the packing pipeline, assign riders, and print retail slips
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EAE5] flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name, mobile, or PIN..."
            className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-xl text-xs font-semibold bg-white"
        >
          <option value="all">All Statuses ({orders.length})</option>
          <option value="Order Placed">Order Placed</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Packed">Packed</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-3xl border border-[#E5EAE5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F5] border-b border-[#E5EAE5] text-gray-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Delivery Slot & Locality</th>
                <th className="p-4">Items</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((ord) => {
                const totalItemCount = ord.items.reduce((sum, i) => sum + i.quantity, 0);

                return (
                  <tr key={ord.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-bold text-gray-900 block text-xs">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-gray-900">{ord.customerSnapshot.name}</div>
                      <div className="text-[11px] text-gray-500 font-mono">{ord.customerSnapshot.mobile}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-gray-800">{ord.deliveryDate}</div>
                      <div className="text-[11px] text-gray-500">{ord.deliverySlot}</div>
                      <div className="text-[10px] text-gray-400 truncate max-w-[150px]">
                        {ord.deliveryAddress.locality} ({ord.deliveryAddress.pinCode})
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded-md text-[11px]">
                        {totalItemCount} units
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <span className="font-black font-mono text-[#176B45] text-sm block">
                        ₹{ord.total}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {ord.paymentMethod} ({ord.paymentStatus})
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.orderStatus === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-[#176B45]'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openStatusModal(ord)}
                        className="px-3 py-1.5 bg-[#176B45] text-white rounded-xl text-xs font-bold hover:bg-[#125436] transition-colors"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => setSelectedInvoiceOrder(ord)}
                        className="p-1.5 text-gray-600 hover:text-[#176B45] hover:bg-green-50 rounded-lg transition-colors"
                        title="Print Invoice Slip"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Order Status & Assign Partner Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#176B45] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-green-200 uppercase font-bold">Fulfillment Pipeline</span>
                <h3 className="font-bold text-base mt-0.5">Order #{editingOrder.orderNumber}</h3>
              </div>
              <button onClick={() => setEditingOrder(null)} className="p-1 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Update Status Stage</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full p-2.5 border rounded-xl font-bold bg-white text-gray-800"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Packed">Packed & Quality Checked</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered Successfully</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-3">
                <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">
                  Assigned Delivery Partner
                </h4>
                <div>
                  <label className="block text-gray-600 mb-1">Rider Name</label>
                  <input
                    type="text"
                    value={deliveryPersonName}
                    onChange={(e) => setDeliveryPersonName(e.target.value)}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Rider Phone</label>
                  <input
                    type="text"
                    value={deliveryPersonPhone}
                    onChange={(e) => setDeliveryPersonPhone(e.target.value)}
                    className="w-full p-2 border rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 border rounded-xl font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#176B45] text-white font-bold rounded-xl hover:bg-[#125436]"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
