import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { DeliveryArea, DeliverySlot } from '../../types';
import { MapPin, Clock, Plus, Trash2, Edit2, X, Check } from 'lucide-react';

export const AdminDelivery: React.FC = () => {
  const {
    deliveryAreas,
    addDeliveryArea,
    updateDeliveryArea,
    deleteDeliveryArea,
    deliverySlots,
    updateDeliverySlot
  } = useStore();
  const { language } = useLanguage();

  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);

  const initialAreaForm = {
    pinCode: '',
    areaNameEn: '',
    areaNameBn: '',
    district: 'Kolkata',
    deliveryFee: 25,
    minOrderAmount: 199,
    freeDeliveryThreshold: 499,
    estimatedWindowEn: 'Delivery within 2 - 3 hours',
    estimatedWindowBn: '২ - ৩ ঘণ্টার মধ্যে ডেলিভারি',
    isCodAvailable: true,
    isActive: true
  };

  const [areaForm, setAreaForm] = useState(initialAreaForm);

  const handleAreaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!areaForm.pinCode || !areaForm.areaNameEn) return;

    if (editingAreaId) {
      updateDeliveryArea(editingAreaId, areaForm);
    } else {
      addDeliveryArea(areaForm);
    }

    setIsAreaModalOpen(false);
    setEditingAreaId(null);
    setAreaForm(initialAreaForm);
  };

  const openEditArea = (area: DeliveryArea) => {
    setAreaForm({
      pinCode: area.pinCode,
      areaNameEn: area.areaNameEn,
      areaNameBn: area.areaNameBn,
      district: area.district,
      deliveryFee: area.deliveryFee,
      minOrderAmount: area.minOrderAmount,
      freeDeliveryThreshold: area.freeDeliveryThreshold,
      estimatedWindowEn: area.estimatedWindowEn,
      estimatedWindowBn: area.estimatedWindowBn,
      isCodAvailable: area.isCodAvailable,
      isActive: area.isActive
    });
    setEditingAreaId(area.id);
    setIsAreaModalOpen(true);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Delivery Areas & Scheduling</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure serviceable PIN codes, delivery charges, free shipping thresholds, and time slots
          </p>
        </div>

        <button
          onClick={() => {
            setAreaForm(initialAreaForm);
            setEditingAreaId(null);
            setIsAreaModalOpen(true);
          }}
          className="px-4 py-2.5 bg-[#176B45] hover:bg-[#125436] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Serviceable PIN Code</span>
        </button>
      </div>

      {/* Serviceable PIN Codes Table */}
      <div className="bg-white rounded-3xl border border-[#E5EAE5] p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#176B45]" />
          <span>Configured PIN Codes ({deliveryAreas.length})</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F5] border-b border-[#E5EAE5] text-gray-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">PIN Code</th>
                <th className="p-3">Locality / Zone</th>
                <th className="p-3">District</th>
                <th className="p-3 text-right">Delivery Fee</th>
                <th className="p-3 text-right">Free Threshold</th>
                <th className="p-3 text-center">COD</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deliveryAreas.map((area) => (
                <tr key={area.id} className="hover:bg-gray-50/70">
                  <td className="p-3 font-mono font-extrabold text-[#176B45] text-sm">
                    {area.pinCode}
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-gray-900">{area.areaNameEn}</div>
                    <div className="text-[11px] text-gray-500 font-bengali">{area.areaNameBn}</div>
                  </td>
                  <td className="p-3 text-gray-600">{area.district}</td>
                  <td className="p-3 text-right font-mono font-bold text-gray-900">
                    ₹{area.deliveryFee}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-700">
                    ₹{area.freeDeliveryThreshold}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      area.isCodAvailable ? 'bg-green-100 text-[#176B45]' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {area.isCodAvailable ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => updateDeliveryArea(area.id, { isActive: !area.isActive })}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        area.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {area.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    <button
                      onClick={() => openEditArea(area)}
                      className="p-1.5 text-gray-600 hover:text-[#176B45] rounded-lg"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete PIN Code ${area.pinCode}?`)) {
                          deleteDeliveryArea(area.id);
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delivery Time Slots Configuration */}
      <div className="bg-white rounded-3xl border border-[#E5EAE5] p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#176B45]" />
          <span>Scheduled Time Slots & Order Capacity</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {deliverySlots.map((slot) => (
            <div
              key={slot.id}
              className="p-4 rounded-2xl border border-gray-200 bg-[#F7F9F5] space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-xs text-gray-900">{slot.timeRangeEn}</span>
                <button
                  onClick={() => updateDeliverySlot(slot.id, { isActive: !slot.isActive })}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    slot.isActive ? 'bg-green-100 text-[#176B45]' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {slot.isActive ? 'Enabled' : 'Paused'}
                </button>
              </div>

              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Slot Capacity:</span>
                  <input
                    type="number"
                    value={slot.capacity}
                    onChange={(e) => updateDeliverySlot(slot.id, { capacity: Number(e.target.value) })}
                    className="w-16 px-1 py-0.5 border rounded text-right font-mono"
                  />
                </div>
                <div className="flex justify-between">
                  <span>Current Bookings:</span>
                  <span className="font-mono font-bold text-gray-900">{slot.bookedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Cutoff:</span>
                  <span className="font-mono">{slot.cutoffHour}:00 hrs</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Area Modal */}
      {isAreaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#176B45] text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingAreaId ? 'Edit Delivery Area' : 'Add Supported PIN Code'}
              </h3>
              <button onClick={() => setIsAreaModalOpen(false)} className="p-1 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAreaSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">PIN Code (6 digits) *</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={areaForm.pinCode}
                    onChange={(e) => setAreaForm({ ...areaForm, pinCode: e.target.value.replace(/[^0-9]/g, '') })}
                    placeholder="700091"
                    className="w-full p-2.5 border rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">District / Region *</label>
                  <input
                    type="text"
                    required
                    value={areaForm.district}
                    onChange={(e) => setAreaForm({ ...areaForm, district: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Locality Name (English) *</label>
                <input
                  type="text"
                  required
                  value={areaForm.areaNameEn}
                  onChange={(e) => setAreaForm({ ...areaForm, areaNameEn: e.target.value })}
                  placeholder="e.g. Salt Lake Sector V"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Locality Name (বাংলা) *</label>
                <input
                  type="text"
                  required
                  value={areaForm.areaNameBn}
                  onChange={(e) => setAreaForm({ ...areaForm, areaNameBn: e.target.value })}
                  placeholder="e.g. সল্টলেক সেক্টর ৫"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Delivery Charge (₹)</label>
                  <input
                    type="number"
                    value={areaForm.deliveryFee}
                    onChange={(e) => setAreaForm({ ...areaForm, deliveryFee: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Free Delivery Min (₹)</label>
                  <input
                    type="number"
                    value={areaForm.freeDeliveryThreshold}
                    onChange={(e) => setAreaForm({ ...areaForm, freeDeliveryThreshold: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={areaForm.isCodAvailable}
                    onChange={(e) => setAreaForm({ ...areaForm, isCodAvailable: e.target.checked })}
                    className="accent-[#176B45]"
                  />
                  <span>Cash on Delivery Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={areaForm.isActive}
                    onChange={(e) => setAreaForm({ ...areaForm, isActive: e.target.checked })}
                    className="accent-[#176B45]"
                  />
                  <span>Active</span>
                </label>
              </div>

              <div className="pt-3 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAreaModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#176B45] text-white font-bold rounded-xl hover:bg-[#125436]"
                >
                  Save PIN Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
