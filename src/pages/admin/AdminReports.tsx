import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { BarChart3, TrendingUp, DollarSign, Package, PieChart, ShoppingBag } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { products, orders } = useStore();
  const { language } = useLanguage();

  const validOrders = orders.filter(o => o.orderStatus !== 'Cancelled');
  const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled');
  const totalNetSales = validOrders.reduce((sum, o) => sum + o.total, 0);

  // Status breakdown
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Payment method breakdown
  const paymentMethodCounts = validOrders.reduce((acc, o) => {
    acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top products
  const topProducts = [...products]
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Retail Sales & Order Analytics</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Verified financial performance based on actual checkout records (excluding cancellations)
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E5EAE5] shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Net Realized Revenue</span>
          <div className="text-3xl font-black text-[#176B45]">₹{totalNetSales.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-emerald-700 font-semibold">Excludes ₹{cancelledOrders.reduce((s, o) => s + o.total, 0)} cancelled</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5EAE5] shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Fulfilled Orders</span>
          <div className="text-3xl font-black text-gray-900">{validOrders.length}</div>
          <p className="text-[11px] text-gray-500">Avg. Basket Size: ₹{validOrders.length ? Math.round(totalNetSales / validOrders.length) : 0}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5EAE5] shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Units Dispatched</span>
          <div className="text-3xl font-black text-blue-900">
            {validOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)}
          </div>
          <p className="text-[11px] text-gray-500">Across {products.length} catalog grocery lines</p>
        </div>
      </div>

      {/* Visual Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Status Distribution */}
        <div className="bg-white rounded-3xl border border-[#E5EAE5] p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#176B45]" />
            <span>Order Pipeline Distribution</span>
          </h3>

          <div className="space-y-3 text-xs">
            {Object.entries(statusCounts).map(([status, count]) => {
              const pct = Math.round((count / orders.length) * 100);
              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-700">{status}</span>
                    <span className="font-mono text-gray-900">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        status === 'Delivered'
                          ? 'bg-emerald-600'
                          : status === 'Cancelled'
                          ? 'bg-rose-500'
                          : 'bg-[#176B45]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods Distribution */}
        <div className="bg-white rounded-3xl border border-[#E5EAE5] p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#176B45]" />
            <span>Payment Methods Adopted</span>
          </h3>

          <div className="space-y-3 text-xs">
            {Object.entries(paymentMethodCounts).map(([method, count]) => {
              const pct = Math.round((count / validOrders.length) * 100);
              return (
                <div key={method} className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-700">{method}</span>
                    <span className="font-mono text-gray-900">{count} orders ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Best Performing Grocery Items */}
      <div className="bg-white rounded-3xl border border-[#E5EAE5] p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#176B45]" />
          <span>Top Velocity Grocery Items</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F5] border-b border-[#E5EAE5] text-gray-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Item</th>
                <th className="p-3">Brand</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-center">Current Stock</th>
                <th className="p-3 text-right">Units Sold</th>
                <th className="p-3 text-right">Estimated Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topProducts.map((p) => (
                <tr key={p.id}>
                  <td className="p-3 font-semibold text-gray-900">{p.nameEn}</td>
                  <td className="p-3 text-gray-600">{p.brand}</td>
                  <td className="p-3 text-right font-mono font-bold">₹{p.sellingPrice}</td>
                  <td className="p-3 text-center font-mono">{p.stockQuantity}</td>
                  <td className="p-3 text-right font-mono font-extrabold text-[#176B45]">{p.salesCount}</td>
                  <td className="p-3 text-right font-mono font-bold text-gray-900">
                    ₹{((p.salesCount || 0) * p.sellingPrice).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
