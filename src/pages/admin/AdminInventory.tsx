import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { InventoryMovement } from '../../types';
import {
  Boxes,
  Plus,
  Minus,
  AlertTriangle,
  History,
  CheckCircle2,
  X,
  Search
} from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { products, adjustStock, inventoryMovements } = useStore();
  const { language } = useLanguage();

  const [search, setSearch] = useState('');
  const [adjustingProduct, setAdjustingProduct] = useState<any | null>(null);
  const [stockChange, setStockChange] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<InventoryMovement['reason']>('Restock');
  const [adjustNotes, setAdjustNotes] = useState('');

  const filteredProducts = products.filter(p => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.nameEn.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
  });

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct || stockChange === 0) return;

    adjustStock(adjustingProduct.id, stockChange, adjustReason, adjustNotes);
    setAdjustingProduct(null);
    setStockChange(10);
    setAdjustNotes('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Inventory & Stock Movements</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Real-time stock ledger, replenishment logging, and inventory write-offs
        </p>
      </div>

      {/* Products Stock Table */}
      <div className="bg-white rounded-3xl border border-[#E5EAE5] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-100">
          <h2 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-[#176B45]" />
            <span>Stock Ledger</span>
          </h2>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter items..."
              className="w-full pl-9 pr-3 py-1.5 border rounded-xl text-xs"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F5] border-b border-[#E5EAE5] text-gray-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">SKU</th>
                <th className="p-3 text-center">Current Stock</th>
                <th className="p-3 text-center">Alert Threshold</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Quick Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stockQuantity <= 0;
                const isLow = p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold;

                return (
                  <tr key={p.id} className="hover:bg-gray-50/70">
                    <td className="p-3 font-semibold text-gray-900">
                      {p.nameEn}
                      <span className="block text-[10px] text-gray-400 font-normal">{p.packSize} • {p.brand}</span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-gray-500">{p.sku}</td>
                    <td className="p-3 text-center font-mono font-extrabold text-sm text-[#176B45]">
                      {p.stockQuantity}
                    </td>
                    <td className="p-3 text-center font-mono text-gray-500">
                      {p.lowStockThreshold}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isOutOfStock
                            ? 'bg-rose-100 text-rose-800'
                            : isLow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-green-100 text-[#176B45]'
                        }`}
                      >
                        {isOutOfStock ? 'OUT OF STOCK' : isLow ? 'LOW STOCK' : 'HEALTHY'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setAdjustingProduct(p);
                          setStockChange(20);
                          setAdjustReason('Restock');
                        }}
                        className="px-3 py-1 bg-green-50 hover:bg-[#176B45] text-[#176B45] hover:text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Adjust / Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Movements Audit Log */}
      <div className="bg-white rounded-3xl border border-[#E5EAE5] p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
          <History className="w-5 h-5 text-[#176B45]" />
          <span>Movement Audit Log ({inventoryMovements.length})</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F5] border-b border-[#E5EAE5] text-gray-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Product</th>
                <th className="p-3">Reason</th>
                <th className="p-3 text-center">Change</th>
                <th className="p-3 text-center">Resulting Stock</th>
                <th className="p-3">Notes</th>
                <th className="p-3">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventoryMovements.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/70">
                  <td className="p-3 text-gray-500 text-[11px] whitespace-nowrap">
                    {new Date(m.timestamp).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="p-3 font-semibold text-gray-900">{m.productName}</td>
                  <td className="p-3">
                    <span className="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md text-[10px]">
                      {m.reason}
                    </span>
                  </td>
                  <td className={`p-3 text-center font-mono font-bold ${m.change > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {m.change > 0 ? `+${m.change}` : m.change}
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-gray-800">
                    {m.resultingStock}
                  </td>
                  <td className="p-3 text-gray-500 text-[11px] truncate max-w-xs">{m.notes || '—'}</td>
                  <td className="p-3 text-gray-600 font-medium">{m.performedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#176B45] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-green-200 uppercase font-bold">Stock Adjustment</span>
                <h3 className="font-bold text-base mt-0.5">{adjustingProduct.nameEn}</h3>
              </div>
              <button onClick={() => setAdjustingProduct(null)} className="p-1 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border flex justify-between items-center">
                <span className="text-gray-600">Current In-Stock:</span>
                <span className="font-mono font-bold text-base text-gray-900">{adjustingProduct.stockQuantity}</span>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Adjustment Quantity (+/-)</label>
                <input
                  type="number"
                  required
                  value={stockChange}
                  onChange={(e) => setStockChange(Number(e.target.value))}
                  placeholder="e.g. +20 or -5"
                  className="w-full p-2.5 border rounded-xl font-mono text-sm font-bold"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  New stock will become: <strong>{Math.max(0, adjustingProduct.stockQuantity + stockChange)}</strong>
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Adjustment Reason *</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value as any)}
                  className="w-full p-2.5 border rounded-xl bg-white font-semibold"
                >
                  <option value="Restock">Restock / Fresh Wholesale Delivery (+)</option>
                  <option value="Correction">Inventory Count Audit Correction (+/-)</option>
                  <option value="Damaged">Damaged / Expired Wastage (-)</option>
                  <option value="Return">Customer Return Restock (+)</option>
                  <option value="Sale">Direct Counter Offline Sale (-)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Audit Notes / PO Number</label>
                <input
                  type="text"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  placeholder="e.g. Received shipment from Hooghly mandal warehouse"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-4 py-2 border rounded-xl font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#176B45] text-white font-bold rounded-xl hover:bg-[#125436]"
                >
                  Confirm & Post Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
