import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { SUPABASE_PROJECT_ID } from '../../services/supabase';
import {
  Database,
  CloudUpload,
  CloudDownload,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Download,
  Sparkles,
  Save,
  DollarSign,
  Boxes,
  Store,
  Copy,
  Check,
  Code
} from 'lucide-react';
import { Product, StoreSettings } from '../../types';

export const AdminDataSync: React.FC = () => {
  const {
    products,
    categories,
    deliveryAreas,
    deliverySlots,
    coupons,
    storeSettings,
    updateStoreSettings,
    replaceStoreData,
    syncAllToSupabase,
    syncAllFromSupabase,
    resetAllDataToDemo
  } = useStore();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'core-data' | 'bulk-pricing' | 'presets' | 'supabase-sync' | 'json-editor'>('core-data');

  // Form for core store settings
  const [storeForm, setStoreForm] = useState<StoreSettings>({ ...storeSettings });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Bulk Price & Stock Adjustments state
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);
  const [bulkStockTarget, setBulkStockTarget] = useState<number>(50);
  const [bulkActionMsg, setBulkActionMsg] = useState<string | null>(null);

  // Supabase sync status
  const [syncStatus, setSyncStatus] = useState<{
    loading: boolean;
    success?: boolean;
    message?: string;
  }>({ loading: false });

  // SQL Query Modal state
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  // Raw JSON state
  const [jsonInput, setJsonInput] = useState('');
  const [isJsonEditorOpen, setIsJsonEditorOpen] = useState(false);
  const [jsonMessage, setJsonMessage] = useState<string | null>(null);

  // Save all core settings
  const handleSaveCoreData = async (syncToSupabase: boolean = false) => {
    updateStoreSettings(storeForm);
    if (syncToSupabase) {
      setSyncStatus({ loading: true, message: 'Saving and synchronizing store details with Supabase...' });
      const res = await syncAllToSupabase();
      setSyncStatus({
        loading: false,
        success: res.success,
        message: res.message
      });
      setSaveSuccessMsg('✓ All store settings saved and synchronized to Supabase cloud!');
    } else {
      setSaveSuccessMsg('✓ All store settings updated successfully across storefront and admin!');
    }
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Push to Supabase
  const handlePushToSupabase = async () => {
    setSyncStatus({ loading: true, message: 'Pushing all categories, products, delivery areas, and coupons to Supabase...' });
    const res = await syncAllToSupabase();
    setSyncStatus({
      loading: false,
      success: res.success,
      message: res.message
    });
  };

  // Fetch from Supabase
  const handleFetchFromSupabase = async () => {
    setSyncStatus({ loading: true, message: 'Fetching all live tables from Supabase...' });
    const res = await syncAllFromSupabase();
    setSyncStatus({
      loading: false,
      success: res.success,
      message: res.message
    });
  };

  // Bulk Price Update
  const applyBulkPriceChange = (percent: number) => {
    if (percent === 0) return;
    const factor = 1 + percent / 100;
    const updated = products.map(p => ({
      ...p,
      sellingPrice: Math.max(1, Math.round(p.sellingPrice * factor)),
      originalPrice: Math.max(1, Math.round(p.originalPrice * factor))
    }));
    replaceStoreData({ products: updated });
    setBulkActionMsg(`✓ Successfully adjusted prices of all ${products.length} products by ${percent > 0 ? `+${percent}` : percent}%!`);
    setTimeout(() => setBulkActionMsg(null), 3500);
  };

  // Bulk Stock Update
  const applyBulkStockReplenish = (qty: number) => {
    const updated = products.map(p => ({
      ...p,
      stockQuantity: qty
    }));
    replaceStoreData({ products: updated });
    setBulkActionMsg(`✓ Successfully set stock quantity of all ${products.length} products to ${qty} units!`);
    setTimeout(() => setBulkActionMsg(null), 3500);
  };

  // Presets
  const applyOrganicsPreset = () => {
    const organicProducts: Product[] = products.map(p => ({
      ...p,
      nameEn: `Organic ${p.nameEn.replace('Fresh ', '').replace('Pure ', '').replace('Organic ', '')}`,
      nameBn: `জৈব ${p.nameBn.replace('তাজা ', '').replace('জৈব ', '')}`,
      brand: 'Bengal Organics',
      sellingPrice: Math.round(p.sellingPrice * 1.15),
      originalPrice: Math.round(p.originalPrice * 1.25)
    }));

    const newSettings: StoreSettings = {
      ...storeSettings,
      storeNameEn: 'Bengal Organics',
      storeNameBn: 'বেঙ্গল অর্গানিক্স',
      taglineEn: '100% Certified Chemical-Free Groceries & Farm Produce.',
      taglineBn: '১০০% রাসায়নিকমুক্ত প্রাকৃতিক তাজা মুদি খাদ্যপণ্য।',
      heroHeadlineEn: 'Farm-Fresh 100% Organic Essentials.',
      heroHeadlineBn: 'সরাসরি খামারের ১০০% প্রাকৃতিক জৈব খাদ্যপণ্য।',
      heroSubheadlineEn: 'Hand-picked organic grains, cold-pressed oils, naturally grown vegetables and chemical-free pantry staples.',
      heroSubheadlineBn: 'নির্বাচিত জৈব খাদ্যশস্য, ঘানি-ভাঙা খাঁটি তেল, প্রাকৃতিকভাবে উৎপাদিত সবজি ও রাসায়নিকমুক্ত মুদি পণ্য।',
      announcementTextEn: '🌿 Pure & Organic: Flat 15% OFF on first organic basket with code FRESH100',
      announcementTextBn: '🌿 ১০০% খাঁটি জৈব পণ্য: FRESH100 কোডে প্রথম অর্ডারে পাবেন বিশেষ ছাড়'
    };

    setStoreForm(newSettings);
    replaceStoreData({
      products: organicProducts,
      storeSettings: newSettings
    });

    setSyncStatus({
      loading: false,
      success: true,
      message: '✓ Switched all products and branding to "Bengal Organics" dataset!'
    });
  };

  const applyQuickCommercePreset = () => {
    const expressProducts: Product[] = products.map(p => ({
      ...p,
      packSize: p.unit === 'kg' ? '500 g' : p.packSize,
      sellingPrice: Math.max(10, Math.round(p.sellingPrice * 0.95)),
      originalPrice: p.originalPrice
    }));

    const newSettings: StoreSettings = {
      ...storeSettings,
      storeNameEn: 'Bazar Express',
      storeNameBn: 'বাজার এক্সপ্রেস',
      taglineEn: 'Daily Groceries & Essentials Delivered in Minutes.',
      taglineBn: 'কয়েক মিনিটের মধ্যে নিত্যপ্রয়োজনীয় মুদি বাজার আপনার ঘরে।',
      heroHeadlineEn: 'Groceries Delivered in 15-30 Minutes.',
      heroHeadlineBn: '১৫-৩০ মিনিটে তাজা নিত্যপ্রয়োজনীয় পণ্য আপনার দরজায়।',
      heroSubheadlineEn: 'Lightning-fast delivery from your local dark store. Everything fresh, everyday.',
      heroSubheadlineBn: 'আপনার পাড়ার ডার্ক স্টোর থেকে দ্রুততম ডেলিভারি। প্রতিদিন সব তাজা ও সুলভ।',
      announcementTextEn: '⚡ Superfast 15-min delivery now active in Salt Lake & New Town!',
      announcementTextBn: '⚡ সল্টলেক এবং নিউ টাউনে ১৫ মিনিটের সুপারফাস্ট ডেলিভারি চালু আছে!'
    };

    setStoreForm(newSettings);
    replaceStoreData({
      products: expressProducts,
      storeSettings: newSettings
    });

    setSyncStatus({
      loading: false,
      success: true,
      message: '✓ Switched all products and branding to "Bazar Express" dataset!'
    });
  };

  const applyFreshMarketPreset = () => {
    const freshProducts: Product[] = products.map(p => ({
      ...p,
      sellingPrice: p.sellingPrice,
      isFeatured: true,
      stockQuantity: 75
    }));

    const newSettings: StoreSettings = {
      ...storeSettings,
      storeNameEn: 'Bangalir Bazar Fresh Mart',
      storeNameBn: 'বাঙালির বাজার ফ্রেশ মার্ট',
      taglineEn: 'From Village Mandi to Your Kitchen Daily.',
      taglineBn: 'গ্রামের মান্ডি থেকে প্রতিদিন সরাসরি আপনার রান্নাঘরে।',
      heroHeadlineEn: 'Morning Harvest, Evening On Your Table.',
      heroHeadlineBn: 'সকালের মাঠের ফসল, সন্ধ্যায় আপনার খাবার টেবিলে।',
      heroSubheadlineEn: 'Fresh mustard oil, kolkata aloo, unpolished pulses, aromatic Gobindobhog rice and fresh kitchen staples.',
      heroSubheadlineBn: 'খাঁটি ঘানি সর্ষের তেল, জ্যান্ত আলু, পলিশহীন ডাল, সুগন্ধি গোবিন্দভোগ চাল ও নিত্য রসদ।',
      announcementTextEn: '🌾 Fresh Mandi Lot Arrived! Free delivery on orders above ₹399',
      announcementTextBn: '🌾 নতুন টাটকা লট এসে পৌঁছেছে! ৩৯৯ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি'
    };

    setStoreForm(newSettings);
    replaceStoreData({
      products: freshProducts,
      storeSettings: newSettings
    });

    setSyncStatus({
      loading: false,
      success: true,
      message: '✓ Switched all products and branding to "Bangalir Bazar Fresh Mart" dataset!'
    });
  };

  // Export JSON
  const handleExportJson = () => {
    const fullBackup = {
      storeSettings,
      categories,
      products,
      deliveryAreas,
      deliverySlots,
      coupons
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bangalir_bazar_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Open JSON editor
  const openJsonEditor = () => {
    const fullBackup = {
      storeSettings,
      categories,
      products,
      deliveryAreas,
      deliverySlots,
      coupons
    };
    setJsonInput(JSON.stringify(fullBackup, null, 2));
    setIsJsonEditorOpen(true);
    setJsonMessage(null);
  };

  // Apply JSON Changes
  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      replaceStoreData(parsed);
      if (parsed.storeSettings) {
        setStoreForm(prev => ({ ...prev, ...parsed.storeSettings }));
      }
      setJsonMessage('✓ All store data updated successfully from JSON!');
      setTimeout(() => setJsonMessage(null), 3000);
    } catch (e: any) {
      setJsonMessage(`Error parsing JSON: ${e.message}`);
    }
  };

  // Sample Supabase SQL Query
  const sampleSqlQuery = `-- ========================================================================
-- BANGALIR BAZAR - SUPABASE POSTGRESQL TABLES (Project: ${SUPABASE_PROJECT_ID})
-- Run in Supabase SQL Editor: Dashboard -> SQL Editor -> New Query
-- ========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Store Settings Table
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    store_name_en TEXT NOT NULL DEFAULT '${storeSettings.storeNameEn.replace(/'/g, "''")}',
    store_name_bn TEXT NOT NULL DEFAULT '${storeSettings.storeNameBn.replace(/'/g, "''")}',
    tagline_en TEXT NOT NULL DEFAULT '${storeSettings.taglineEn.replace(/'/g, "''")}',
    tagline_bn TEXT NOT NULL DEFAULT '${storeSettings.taglineBn.replace(/'/g, "''")}',
    contact_email TEXT NOT NULL DEFAULT '${storeSettings.contactEmail}',
    contact_phone TEXT NOT NULL DEFAULT '${storeSettings.contactPhone}',
    whatsapp_number TEXT NOT NULL DEFAULT '${storeSettings.whatsappNumber}',
    address_en TEXT NOT NULL DEFAULT '${storeSettings.addressEn.replace(/'/g, "''")}',
    address_bn TEXT NOT NULL DEFAULT '${storeSettings.addressBn.replace(/'/g, "''")}',
    opening_hours_en TEXT NOT NULL DEFAULT '${storeSettings.openingHoursEn}',
    opening_hours_bn TEXT NOT NULL DEFAULT '${storeSettings.openingHoursBn}',
    default_delivery_fee NUMERIC(10,2) NOT NULL DEFAULT ${storeSettings.defaultDeliveryFee},
    default_free_delivery_threshold NUMERIC(10,2) NOT NULL DEFAULT ${storeSettings.defaultFreeDeliveryThreshold},
    hero_headline_en TEXT NOT NULL DEFAULT '${storeSettings.heroHeadlineEn.replace(/'/g, "''")}',
    hero_headline_bn TEXT NOT NULL DEFAULT '${storeSettings.heroHeadlineBn.replace(/'/g, "''")}',
    hero_subheadline_en TEXT NOT NULL DEFAULT '${storeSettings.heroSubheadlineEn.replace(/'/g, "''")}',
    hero_subheadline_bn TEXT NOT NULL DEFAULT '${storeSettings.heroSubheadlineBn.replace(/'/g, "''")}',
    announcement_text_en TEXT NOT NULL DEFAULT '${storeSettings.announcementTextEn.replace(/'/g, "''")}',
    announcement_text_bn TEXT NOT NULL DEFAULT '${storeSettings.announcementTextBn.replace(/'/g, "''")}',
    announcement_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description_en TEXT,
    description_bn TEXT,
    icon TEXT DEFAULT 'Layers',
    image TEXT NOT NULL,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    sku TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    brand TEXT NOT NULL,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    subcategory_id TEXT,
    description_en TEXT,
    description_bn TEXT,
    pack_size TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT 'kg',
    selling_price NUMERIC(10,2) NOT NULL,
    original_price NUMERIC(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    low_stock_threshold INT NOT NULL DEFAULT 10,
    is_vegetarian BOOLEAN DEFAULT true,
    ingredients_en TEXT,
    ingredients_bn TEXT,
    manufacturer TEXT,
    images TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    sales_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Delivery Areas Table
CREATE TABLE IF NOT EXISTS public.delivery_areas (
    id TEXT PRIMARY KEY,
    pin_code VARCHAR(10) NOT NULL UNIQUE,
    area_name_en TEXT NOT NULL,
    area_name_bn TEXT NOT NULL,
    district TEXT NOT NULL,
    delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 25.00,
    min_order_amount NUMERIC(10,2) NOT NULL DEFAULT 199.00,
    free_delivery_threshold NUMERIC(10,2) NOT NULL DEFAULT 499.00,
    estimated_window_en TEXT NOT NULL,
    estimated_window_bn TEXT NOT NULL,
    is_cod_available BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and public read access
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Delivery Areas" ON public.delivery_areas FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON public.store_settings FOR SELECT USING (true);

-- Allow authenticated/anon write for admin operations
CREATE POLICY "Allow Write Categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Allow Write Products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow Write Delivery Areas" ON public.delivery_areas FOR ALL USING (true);
CREATE POLICY "Allow Write Settings" ON public.store_settings FOR ALL USING (true);
`;

  const copySqlQuery = () => {
    navigator.clipboard.writeText(sampleSqlQuery);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#176B45] text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Administrator Master Data Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">
            Change All Store Data & Master Sync
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Modify store branding, headlines, announcement bar, bulk product prices, stock, or sync with Supabase
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsSqlModalOpen(true)}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Code className="w-3.5 h-3.5 text-gray-600" />
            <span>Supabase SQL</span>
          </button>

          <button
            onClick={resetAllDataToDemo}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Supabase Cloud Connection Ribbon */}
      <div className="bg-gradient-to-r from-[#176B45] via-[#1c784e] to-[#258257] text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/15 rounded-2xl flex items-center justify-center text-[#FFD166] shrink-0 shadow-inner">
              <Database className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-[#FFD166] bg-black/25 px-2 py-0.5 rounded-full shrink-0">
                  SUPABASE CLOUD READY
                </span>
                <span className="text-[10px] sm:text-[11px] text-green-200 truncate">
                  {products.length} Products • {categories.length} Cats • {deliveryAreas.length} PINs
                </span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mt-1 truncate">
                Project ID: <span className="font-mono text-[#FFD166]">{SUPABASE_PROJECT_ID}</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-green-100 font-mono truncate">
                https://{SUPABASE_PROJECT_ID}.supabase.co
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              disabled={syncStatus.loading}
              onClick={handlePushToSupabase}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#FFD166] hover:bg-yellow-300 text-[#252B27] font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 sm:gap-2 disabled:opacity-60 cursor-pointer shrink-0"
            >
              <CloudUpload className="w-4 h-4 shrink-0" />
              <span>Push All to Supabase</span>
            </button>

            <button
              disabled={syncStatus.loading}
              onClick={handleFetchFromSupabase}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 sm:gap-2 disabled:opacity-60 cursor-pointer shrink-0"
            >
              <CloudDownload className="w-4 h-4 shrink-0" />
              <span>Fetch from Supabase</span>
            </button>
          </div>
        </div>


        {/* Sync Feedback Message */}
        {syncStatus.message && (
          <div className={`p-3 rounded-2xl text-xs flex items-center gap-2 font-medium ${
            syncStatus.loading
              ? 'bg-white/20 text-white animate-pulse'
              : syncStatus.success
              ? 'bg-emerald-950/40 text-emerald-100 border border-emerald-400/30'
              : 'bg-rose-950/40 text-rose-100 border border-rose-400/30'
          }`}>
            {syncStatus.success ? (
              <CheckCircle2 className="w-4 h-4 text-[#FFD166] shrink-0" />
            ) : syncStatus.loading ? (
              <Database className="w-4 h-4 text-white shrink-0 animate-spin" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
            )}
            <span>{syncStatus.message}</span>
          </div>
        )}
      </div>

      {/* Tabs navigation - smooth horizontal swipe on mobile, wrapped on larger screens */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap -mx-2 px-2 sm:mx-0 sm:px-0">
        <button
          onClick={() => setActiveTab('core-data')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'core-data'
              ? 'bg-[#176B45] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Store Identity & Headlines</span>
        </button>

        <button
          onClick={() => setActiveTab('bulk-pricing')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'bulk-pricing'
              ? 'bg-[#176B45] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Bulk Price & Stock Changer</span>
        </button>

        <button
          onClick={() => setActiveTab('presets')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'presets'
              ? 'bg-[#176B45] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Catalog Dataset Presets</span>
        </button>

        <button
          onClick={() => setActiveTab('json-editor')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'json-editor'
              ? 'bg-[#176B45] text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Bulk JSON Editor & Backup</span>
        </button>
      </div>

      {/* TAB 1: Core Store Identity & Headlines */}
      {activeTab === 'core-data' && (
        <div className="bg-white rounded-3xl border border-[#E5EAE5] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h2 className="font-extrabold text-base text-gray-900">
                Change All Store Details & Banners
              </h2>
              <p className="text-xs text-gray-500">
                Everything edited here updates the storefront homepage, header, footer, and announcement ribbon live
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSaveCoreData(false)}
                className="px-4 py-2 bg-[#176B45] hover:bg-[#125436] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={() => handleSaveCoreData(true)}
                className="px-4 py-2 bg-[#FFD166] hover:bg-yellow-300 text-[#252B27] rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <CloudUpload className="w-4 h-4" />
                <span>Save & Sync to Supabase</span>
              </button>
            </div>
          </div>

          {saveSuccessMsg && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-900 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          <div className="space-y-6 text-xs">
            {/* Section 1: Brand Name & Taglines */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2 text-[#176B45]">
                <span>1. Store Identity</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Store Name (English) *</label>
                  <input
                    type="text"
                    value={storeForm.storeNameEn}
                    onChange={(e) => setStoreForm({ ...storeForm, storeNameEn: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Store Name (বাংলা) *</label>
                  <input
                    type="text"
                    value={storeForm.storeNameBn}
                    onChange={(e) => setStoreForm({ ...storeForm, storeNameBn: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Tagline (English) *</label>
                  <input
                    type="text"
                    value={storeForm.taglineEn}
                    onChange={(e) => setStoreForm({ ...storeForm, taglineEn: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Tagline (বাংলা) *</label>
                  <input
                    type="text"
                    value={storeForm.taglineBn}
                    onChange={(e) => setStoreForm({ ...storeForm, taglineBn: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Hero Headlines */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2 text-[#176B45]">
                <span>2. Homepage Hero Banner Headlines</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Hero Main Headline (English)</label>
                  <input
                    type="text"
                    value={storeForm.heroHeadlineEn}
                    onChange={(e) => setStoreForm({ ...storeForm, heroHeadlineEn: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Hero Main Headline (বাংলা)</label>
                  <input
                    type="text"
                    value={storeForm.heroHeadlineBn}
                    onChange={(e) => setStoreForm({ ...storeForm, heroHeadlineBn: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Hero Subtitle / Description (English)</label>
                  <textarea
                    rows={2}
                    value={storeForm.heroSubheadlineEn}
                    onChange={(e) => setStoreForm({ ...storeForm, heroSubheadlineEn: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Hero Subtitle / Description (বাংলা)</label>
                  <textarea
                    rows={2}
                    value={storeForm.heroSubheadlineBn}
                    onChange={(e) => setStoreForm({ ...storeForm, heroSubheadlineBn: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Announcement Ribbon */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2 text-[#176B45]">
                  <span>3. Top Announcement Ribbon</span>
                </h3>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={storeForm.announcementActive}
                    onChange={(e) => setStoreForm({ ...storeForm, announcementActive: e.target.checked })}
                    className="rounded text-[#176B45]"
                  />
                  <span>Show Announcement Bar</span>
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Announcement Text (English)</label>
                  <input
                    type="text"
                    value={storeForm.announcementTextEn}
                    onChange={(e) => setStoreForm({ ...storeForm, announcementTextEn: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Announcement Text (বাংলা)</label>
                  <input
                    type="text"
                    value={storeForm.announcementTextBn}
                    onChange={(e) => setStoreForm({ ...storeForm, announcementTextBn: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Contact & Support */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2 text-[#176B45]">
                <span>4. Contact Channels & Logistics</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Customer Support Phone</label>
                  <input
                    type="text"
                    value={storeForm.contactPhone}
                    onChange={(e) => setStoreForm({ ...storeForm, contactPhone: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">WhatsApp Business Number</label>
                  <input
                    type="text"
                    value={storeForm.whatsappNumber}
                    onChange={(e) => setStoreForm({ ...storeForm, whatsappNumber: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Support Email</label>
                  <input
                    type="email"
                    value={storeForm.contactEmail}
                    onChange={(e) => setStoreForm({ ...storeForm, contactEmail: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Default Base Delivery Fee (₹)</label>
                  <input
                    type="number"
                    value={storeForm.defaultDeliveryFee}
                    onChange={(e) => setStoreForm({ ...storeForm, defaultDeliveryFee: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Free Delivery Threshold (₹)</label>
                  <input
                    type="number"
                    value={storeForm.defaultFreeDeliveryThreshold}
                    onChange={(e) => setStoreForm({ ...storeForm, defaultFreeDeliveryThreshold: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl font-bold text-[#176B45]"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Save Action */}
            <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => handleSaveCoreData(false)}
                className="px-5 py-2.5 bg-[#176B45] hover:bg-[#125436] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Save All Changes Locally
              </button>
              <button
                type="button"
                onClick={() => handleSaveCoreData(true)}
                className="px-5 py-2.5 bg-[#FFD166] hover:bg-yellow-300 text-[#252B27] rounded-xl text-xs font-extrabold shadow-xs cursor-pointer flex items-center gap-2"
              >
                <CloudUpload className="w-4 h-4" />
                <span>Save & Push All to Supabase</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Bulk Pricing & Stock Adjuster */}
      {activeTab === 'bulk-pricing' && (
        <div className="bg-white rounded-3xl border border-[#E5EAE5] p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#176B45]" />
              <span>Bulk Pricing & Stock Inventory Operations</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Change prices and stock across all {products.length} catalog items simultaneously
            </p>
          </div>

          {bulkActionMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{bulkActionMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Global Price Adjuster */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-green-100 text-[#176B45] flex items-center justify-center font-bold">
                  %
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900">Global Product Pricing Adjuster</h3>
                  <p className="text-[11px] text-gray-500">Apply uniform % discount or markup across all products</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => applyBulkPriceChange(-10)}
                    className="flex-1 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold rounded-xl"
                  >
                    -10% Discount All
                  </button>
                  <button
                    onClick={() => applyBulkPriceChange(-5)}
                    className="flex-1 py-2 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-bold rounded-xl"
                  >
                    -5% Discount All
                  </button>
                  <button
                    onClick={() => applyBulkPriceChange(10)}
                    className="flex-1 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-bold rounded-xl"
                  >
                    +10% Markup All
                  </button>
                </div>

                <div className="pt-2">
                  <label className="block text-gray-700 font-bold mb-1">Custom Percentage Change (+ / - %)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={priceChangePercent}
                      onChange={(e) => setPriceChangePercent(Number(e.target.value))}
                      placeholder="e.g. -15 or 8"
                      className="flex-1 p-2 border rounded-xl font-bold bg-white"
                    />
                    <button
                      onClick={() => applyBulkPriceChange(priceChangePercent)}
                      className="px-4 py-2 bg-[#176B45] hover:bg-[#125436] text-white font-bold rounded-xl"
                    >
                      Apply %
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Stock Restock */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900">Bulk Stock Inventory Replenisher</h3>
                  <p className="text-[11px] text-gray-500">Quickly ensure all products are in-stock with specified units</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => applyBulkStockReplenish(50)}
                    className="flex-1 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold rounded-xl"
                  >
                    Set All to 50 Units
                  </button>
                  <button
                    onClick={() => applyBulkStockReplenish(100)}
                    className="flex-1 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold rounded-xl"
                  >
                    Set All to 100 Units
                  </button>
                </div>

                <div className="pt-2">
                  <label className="block text-gray-700 font-bold mb-1">Custom Stock Quantity for All Items</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={bulkStockTarget}
                      onChange={(e) => setBulkStockTarget(Number(e.target.value))}
                      min={0}
                      className="flex-1 p-2 border rounded-xl font-bold bg-white"
                    />
                    <button
                      onClick={() => applyBulkStockReplenish(bulkStockTarget)}
                      className="px-4 py-2 bg-[#176B45] hover:bg-[#125436] text-white font-bold rounded-xl"
                    >
                      Set Stock
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Catalog Dataset Presets */}
      {activeTab === 'presets' && (
        <div className="bg-white rounded-3xl border border-[#E5EAE5] p-6 sm:p-8 shadow-xs space-y-4">
          <div>
            <h2 className="font-black text-base text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#176B45]" />
              <span>Switch Entire Store Dataset (1-Click)</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Instantly change all products, branding, pricing, and banner texts across the entire store:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Preset 1 */}
            <div className="p-4 rounded-2xl border-2 border-[#176B45] bg-green-50/30 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] bg-[#176B45] text-white font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Default Store
                </span>
                <h3 className="font-extrabold text-sm text-gray-900 mt-2">Bangalir Bazar</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Authentic Bengali household essentials: Kachi Ghani mustard oil, Basmati rice, Moong dal, Jyoti aloo, onions, Panch Phoron, Tata Tea.
                </p>
              </div>
              <button
                onClick={resetAllDataToDemo}
                className="w-full py-2 bg-[#176B45] text-white text-xs font-bold rounded-xl hover:bg-[#125436] cursor-pointer"
              >
                Reset to Bangalir Bazar Default
              </button>
            </div>

            {/* Preset 2 */}
            <div className="p-4 rounded-2xl border border-gray-200 hover:border-emerald-600 bg-white flex flex-col justify-between space-y-3 transition-colors">
              <div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Organic Produce
                </span>
                <h3 className="font-extrabold text-sm text-gray-900 mt-2">Bengal Organics</h3>
                <p className="text-xs text-gray-600 mt-1">
                  100% Certified Chemical-Free organic produce, farm cold-pressed oils, unpolished lentils, and premium health staples.
                </p>
              </div>
              <button
                onClick={applyOrganicsPreset}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Apply Bengal Organics Dataset
              </button>
            </div>

            {/* Preset 3 */}
            <div className="p-4 rounded-2xl border border-gray-200 hover:border-amber-600 bg-white flex flex-col justify-between space-y-3 transition-colors">
              <div>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Quick Commerce
                </span>
                <h3 className="font-extrabold text-sm text-gray-900 mt-2">Bazar Express</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Fast daily essentials with smaller pack sizes, discounted express pricing, and instant 15-30 minute delivery headlines.
                </p>
              </div>
              <button
                onClick={applyQuickCommercePreset}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Apply Bazar Express Dataset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Bulk JSON Raw Editor & Backup */}
      {activeTab === 'json-editor' && (
        <div className="bg-white rounded-3xl border border-[#E5EAE5] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h2 className="font-black text-base text-gray-900 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-[#176B45]" />
                <span>Bulk JSON Database Editor & Backup</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Export entire catalog or paste JSON to modify all items, categories, and settings simultaneously
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJson}
                className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON Backup</span>
              </button>
              <button
                onClick={openJsonEditor}
                className="px-3.5 py-2 bg-[#176B45] hover:bg-[#125436] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Open JSON Editor</span>
              </button>
            </div>
          </div>

          {isJsonEditorOpen && (
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-700">Raw Store Data JSON</span>
                <button
                  onClick={() => setIsJsonEditorOpen(false)}
                  className="text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  Close Editor
                </button>
              </div>

              <textarea
                rows={16}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full p-3 font-mono text-[11px] bg-gray-900 text-emerald-400 rounded-2xl border border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#176B45]"
              />

              {jsonMessage && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-900 text-xs rounded-xl font-bold">
                  {jsonMessage}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsJsonEditorOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyJson}
                  className="px-5 py-2 bg-[#176B45] text-white text-xs font-bold rounded-xl hover:bg-[#125436] cursor-pointer"
                >
                  Apply All Changes
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SQL Modal */}
      {isSqlModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#176B45]" />
                <h3 className="font-extrabold text-sm text-gray-900">
                  Supabase PostgreSQL Setup Query
                </h3>
              </div>
              <button
                onClick={() => setIsSqlModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 text-xs">
              <p className="text-gray-600">
                Execute this in your Supabase project (<strong>{SUPABASE_PROJECT_ID}</strong>) SQL Editor:
              </p>
              <pre className="p-3 bg-gray-950 text-emerald-400 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-96">
                {sampleSqlQuery}
              </pre>
            </div>

            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-[11px] text-gray-500">
                Ready to paste into Supabase SQL Editor
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsSqlModalOpen(false)}
                  className="px-3.5 py-2 border rounded-xl text-xs font-semibold text-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={copySqlQuery}
                  className="px-4 py-2 bg-[#176B45] hover:bg-[#125436] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  {sqlCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{sqlCopied ? 'Copied to Clipboard!' : 'Copy SQL Query'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
