import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { Coupon } from '../../types';
import { Tag, Plus, Trash2, Check, X, Percent, Calendar } from 'lucide-react';

export const AdminCoupons: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useStore();
  const { language } = useLanguage();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage' as Coupon['discountType'],
    discountValue: 10,
    minOrderValue: 299,
    maxDiscount: 100,
    expiryDate: '2026-12-31',
    firstOrderOnly: false,
    isActive: true,
    descriptionEn: '',
    descriptionBn: ''
  });

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) return;

    addCoupon({
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: form.discountValue,
      minOrderValue: form.minOrderValue,
      maxDiscount: form.maxDiscount,
      expiryDate: form.expiryDate,
      usageLimit: 500,
      usedCount: 0,
      firstOrderOnly: form.firstOrderOnly,
      isActive: form.isActive,
      descriptionEn: form.descriptionEn || `${form.discountValue}% OFF on orders above ₹${form.minOrderValue}`,
      descriptionBn: form.descriptionBn || `₹${form.minOrderValue} এর বেশি অর্ডারে ছাড়`
    });

    setIsModalOpen(false);
    setForm({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 299,
      maxDiscount: 100,
      expiryDate: '2026-12-31',
      firstOrderOnly: false,
      isActive: true,
      descriptionEn: '',
      descriptionBn: ''
    });
  };

  const toggleCouponStatus = (id: string) => {
    const target = coupons.find(c => c.id === id);
    if (target) {
      updateCoupon(id, { isActive: !target.isActive });
    }
  };

  const handleDeleteCoupon = (id: string) => {
    if (window.confirm('Delete this coupon promotion?')) {
      deleteCoupon(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Promo Coupons & Discounts</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure percentage or fixed cart discount campaigns with min values
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#176B45] hover:bg-[#125436] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl border border-[#E5EAE5] p-5 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-mono text-base font-extrabold text-[#176B45] bg-green-50 px-3 py-1 rounded-xl border border-green-200">
                  {c.code}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                }`}>
                  {c.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>

              <p className="text-xs text-gray-700 font-medium">
                {language === 'bn' ? c.descriptionBn : c.descriptionEn}
              </p>

              <div className="text-[11px] text-gray-500 space-y-0.5 pt-1">
                <div>Discount: <strong>{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</strong></div>
                <div>Min Cart: <strong>₹{c.minOrderValue}</strong></div>
                <div>Redemptions: <strong>{c.usedCount} times</strong></div>
                <div>Expiry: <strong>{c.expiryDate}</strong></div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => toggleCouponStatus(c.id)}
                className="text-xs font-bold text-[#176B45] hover:underline"
              >
                {c.isActive ? 'Deactivate' : 'Activate'}
              </button>

              <button
                onClick={() => handleDeleteCoupon(c.id)}
                className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg"
                title="Delete coupon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#176B45] text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">Create Promotional Coupon</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. MONSOON20"
                  className="w-full p-2.5 border rounded-xl font-mono uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Type *</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value as any })}
                    className="w-full p-2.5 border rounded-xl bg-white font-semibold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Min Order Value (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.minOrderValue}
                    onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Expiry Date *</label>
                <input
                  type="date"
                  required
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Description (English)</label>
                <input
                  type="text"
                  value={form.descriptionEn}
                  onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                  placeholder="e.g. 10% OFF on fresh pantry orders above ₹299"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#176B45] text-white font-bold rounded-xl hover:bg-[#125436]"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
