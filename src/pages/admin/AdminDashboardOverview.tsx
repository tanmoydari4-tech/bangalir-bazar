import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { AdminTab } from './AdminLayout';
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  Users,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Boxes,
  Plus
} from 'lucide-react';

interface AdminDashboardOverviewProps {
  onTabChange: (tab: AdminTab) => void;
  onViewOrder: (orderId: string) => void;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  onTabChange,
  onViewOrder
}) => {
  const { products, orders, currentUser, customerEnquiries } = useStore();
  const { language } = useLanguage();

  // Financial and operations calculations
  const validOrders = orders.filter(o => o.orderStatus !== 'Cancelled');
  const totalSales = validOrders.reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(
    o => o.orderStatus === 'Order Placed' || o.orderStatus === 'Confirmed' || o.orderStatus === 'Packed'
  );

  const outOfDeliveryOrders = orders.filter(o => o.orderStatus === 'Out for Delivery');
  const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered');

  const lowStockProducts = products.filter(
    p => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold
  );

  const outOfStockProducts = products.filter(p => p.stockQuantity <= 0);

  const topSellers = [...products]
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 5);

  const recentOrders = [...orders].slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">
            Operations Overview
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time live grocery store metrics & fulfillment pipeline
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onTabChange('data-sync')}
            className="px-3 sm:px-4 py-2 bg-[#FFD166] hover:bg-yellow-300 text-[#252B27] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <span>⚡ Change All Data / Sync</span>
          </button>
          <button
            onClick={() => onTabChange('products')}
            className="px-3 sm:px-4 py-2 bg-[#176B45] hover:bg-[#125436] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Grocery</span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#E5EAE5] shadow-xs space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <div className="p-1.5 sm:p-2 bg-green-50 text-[#176B45] rounded-xl">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#176B45] truncate">₹{totalSales.toLocaleString('en-IN')}</div>
          <p className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold flex items-center gap-1 truncate">
            <TrendingUp className="w-3 h-3 shrink-0" />
            <span className="truncate">{validOrders.length} orders</span>
          </p>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#E5EAE5] shadow-xs space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Pending Orders</span>
            <div className="p-1.5 sm:p-2 bg-amber-50 text-amber-700 rounded-xl">
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-900">{pendingOrders.length}</div>
          <p className="text-[10px] sm:text-[11px] text-amber-700 font-semibold truncate">
            {outOfDeliveryOrders.length} out for delivery
          </p>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#E5EAE5] shadow-xs space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Catalog Items</span>
            <div className="p-1.5 sm:p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900">{products.length}</div>
          <p className="text-[10px] sm:text-[11px] text-gray-500 truncate">
            {products.filter(p => p.isPublished).length} published active
          </p>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#E5EAE5] shadow-xs space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Low Stock</span>
            <div className="p-1.5 sm:p-2 bg-rose-50 text-rose-700 rounded-xl">
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-600">
            {lowStockProducts.length + outOfStockProducts.length}
          </div>
          <p className="text-[10px] sm:text-[11px] text-rose-700 font-semibold truncate">
            {outOfStockProducts.length} out of stock
          </p>
        </div>
      </div>

      {/* Stock Alerts Notice if any */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-extrabold text-sm">
                Inventory Alert: {outOfStockProducts.length} out of stock, {lowStockProducts.length} low stock items.
              </p>
              <p className="text-amber-700 mt-0.5">
                Restock basmati, flour, cooking oils or vegetables to prevent delivery order rejections.
              </p>
            </div>
          </div>
          <button
            onClick={() => onTabChange('inventory')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shrink-0 self-start sm:self-auto"
          >
            Manage Inventory
          </button>
        </div>
      )}

      {/* Recent Orders and Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E5EAE5] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="font-extrabold text-base text-gray-900">
              Recent Customer Orders
            </h3>
            <button
              onClick={() => onTabChange('orders')}
              className="text-xs font-bold text-[#176B45] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {recentOrders.map((ord) => (
              <div key={ord.id} className="py-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-900">
                      {ord.orderNumber}
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
                  <p className="text-gray-500 text-[11px] mt-0.5">
                    {ord.customerSnapshot.name} • {ord.deliveryAddress.locality} ({ord.deliveryAddress.pinCode})
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="font-extrabold text-gray-900 block font-mono">
                      ₹{ord.total}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {ord.items.length} items
                    </span>
                  </div>

                  <button
                    onClick={() => onTabChange('orders')}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl font-bold text-gray-700 text-xs"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Groceries */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E5EAE5] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="font-extrabold text-base text-gray-900">
              Top Selling Items
            </h3>
            <span className="text-[10px] font-bold uppercase text-gray-400">Units Sold</span>
          </div>

          <div className="divide-y divide-gray-100">
            {topSellers.map((item) => (
              <div key={item.id} className="py-2.5 first:pt-0 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={item.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover bg-gray-50 shrink-0" />
                  <div className="truncate">
                    <div className="font-bold text-gray-900 truncate">
                      {language === 'bn' ? item.nameBn : item.nameEn}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      ₹{item.sellingPrice} • Stock: {item.stockQuantity}
                    </div>
                  </div>
                </div>

                <span className="font-extrabold font-mono text-[#176B45] shrink-0">
                  {item.salesCount || 0}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onTabChange('products')}
            className="w-full py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 transition-colors"
          >
            View Full Catalogue
          </button>
        </div>
      </div>

    </div>
  );
};
