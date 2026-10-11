import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { Settings, Save, CheckCircle2, RotateCcw, CloudUpload } from 'lucide-react';

export const AdminStoreSettings: React.FC = () => {
  const { storeSettings, updateStoreSettings, resetAllDataToDemo, syncAllToSupabase } = useStore();
  const [form, setForm] = useState({ ...storeSettings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent, syncToSupabase: boolean = false) => {
    e.preventDefault();
    updateStoreSettings(form);
    setSavedSuccess(true);
    if (syncToSupabase) {
      setSyncStatusMsg('Pushing updated settings to Supabase...');
      const res = await syncAllToSupabase();
      setSyncStatusMsg(res.success ? '✓ Settings synced to Supabase!' : res.message);
    }
    setTimeout(() => {
      setSavedSuccess(false);
      setSyncStatusMsg(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Store Settings & Branding</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure brand name, contact channels, announcement ribbon, and hero headlines
          </p>
        </div>

        <button
          onClick={resetAllDataToDemo}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-xs flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>Store settings saved successfully across all storefront and admin channels!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E5EAE5] p-6 sm:p-8 shadow-xs space-y-6 text-xs">
        
        {/* Brand Information */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm text-gray-900 pb-2 border-b border-gray-100">
            Brand Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Store Name (English) *</label>
              <input
                type="text"
                required
                value={form.storeNameEn}
                onChange={(e) => setForm({ ...form, storeNameEn: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Store Name (বাংলা) *</label>
              <input
                type="text"
                required
                value={form.storeNameBn}
                onChange={(e) => setForm({ ...form, storeNameBn: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Tagline (English) *</label>
              <input
                type="text"
                required
                value={form.taglineEn}
                onChange={(e) => setForm({ ...form, taglineEn: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Tagline (বাংলা) *</label>
              <input
                type="text"
                required
                value={form.taglineBn}
                onChange={(e) => setForm({ ...form, taglineBn: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="space-y-4 pt-2">
          <h3 className="font-extrabold text-sm text-gray-900 pb-2 border-b border-gray-100">
            Contact Channels
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Customer Phone *</label>
              <input
                type="text"
                required
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">WhatsApp Support Number *</label>
              <input
                type="text"
                required
                value={form.whatsappNumber}
                onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Support Email *</label>
              <input
                type="email"
                required
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Warehouse Address (English)</label>
              <input
                type="text"
                value={form.addressEn}
                onChange={(e) => setForm({ ...form, addressEn: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Warehouse Address (বাংলা)</label>
              <input
                type="text"
                value={form.addressBn}
                onChange={(e) => setForm({ ...form, addressBn: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Homepage Hero CMS */}
        <div className="space-y-4 pt-2">
          <h3 className="font-extrabold text-sm text-gray-900 pb-2 border-b border-gray-100">
            Homepage Hero Texts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Hero Headline (English)</label>
              <input
                type="text"
                value={form.heroHeadlineEn}
                onChange={(e) => setForm({ ...form, heroHeadlineEn: e.target.value })}
                className="w-full p-2.5 border rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Hero Headline (বাংলা)</label>
              <input
                type="text"
                value={form.heroHeadlineBn}
                onChange={(e) => setForm({ ...form, heroHeadlineBn: e.target.value })}
                className="w-full p-2.5 border rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Hero Subtitle (English)</label>
              <textarea
                rows={2}
                value={form.heroSubheadlineEn}
                onChange={(e) => setForm({ ...form, heroSubheadlineEn: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Hero Subtitle (বাংলা)</label>
              <textarea
                rows={2}
                value={form.heroSubheadlineBn}
                onChange={(e) => setForm({ ...form, heroSubheadlineBn: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Top Announcement Ribbon */}
        <div className="space-y-4 pt-2">
          <h3 className="font-extrabold text-sm text-gray-900 pb-2 border-b border-gray-100">
            Announcement Ribbon
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="annActive"
              checked={form.announcementActive}
              onChange={(e) => setForm({ ...form, announcementActive: e.target.checked })}
              className="accent-[#176B45]"
            />
            <label htmlFor="annActive" className="font-bold text-gray-700 cursor-pointer">
              Show Announcement Bar on Header
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Ribbon Text (English)</label>
              <input
                type="text"
                value={form.announcementTextEn}
                onChange={(e) => setForm({ ...form, announcementTextEn: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">Ribbon Text (বাংলা)</label>
              <input
                type="text"
                value={form.announcementTextBn}
                onChange={(e) => setForm({ ...form, announcementTextBn: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
              />
            </div>
          </div>
        </div>

        {syncStatusMsg && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold">
            {syncStatusMsg}
          </div>
        )}

        <div className="pt-4 border-t flex flex-wrap justify-end gap-2">
          <button
            type="submit"
            onClick={(e) => handleSubmit(e, false)}
            className="px-5 py-2.5 bg-[#176B45] hover:bg-[#125436] text-white font-extrabold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings Locally</span>
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className="px-5 py-2.5 bg-[#FFD166] hover:bg-yellow-300 text-[#252B27] font-extrabold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <CloudUpload className="w-4 h-4" />
            <span>Save & Sync to Supabase</span>
          </button>
        </div>
      </form>
    </div>
  );
};
