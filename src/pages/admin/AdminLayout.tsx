import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingBag,
  Users,
  Tag,
  MapPin,
  Settings,
  HelpCircle,
  BarChart3,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  RotateCcw,
  Database,
  Sparkles,
  CloudUpload,
  CloudDownload
} from 'lucide-react';
import { SUPABASE_PROJECT_ID } from '../../services/supabase';

export type AdminTab =
  | 'overview'
  | 'data-sync'
  | 'products'
  | 'categories'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'coupons'
  | 'delivery'
  | 'enquiries'
  | 'reports'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onNavigateStore: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onNavigateStore,
  children
}) => {
  const {
    currentUser,
    logout,
    storeSettings,
    resetAllDataToDemo,
    syncAllToSupabase,
    syncAllFromSupabase
  } = useStore();
  const { language } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [syncToast, setSyncToast] = useState<{ message: string; type: 'success' | 'loading' | 'error' } | null>(null);

  const handleQuickPush = async () => {
    setSyncToast({ message: 'Pushing all current store data to Supabase...', type: 'loading' });
    const res = await syncAllToSupabase();
    setSyncToast({
      message: res.success ? '✓ All store data pushed to Supabase tables!' : res.message,
      type: res.success ? 'success' : 'error'
    });
    setTimeout(() => setSyncToast(null), 4000);
  };

  const handleQuickFetch = async () => {
    setSyncToast({ message: 'Fetching latest data from Supabase...', type: 'loading' });
    const res = await syncAllFromSupabase();
    setSyncToast({
      message: res.success ? '✓ All data loaded from Supabase!' : res.message,
      type: res.success ? 'success' : 'error'
    });
    setTimeout(() => setSyncToast(null), 4000);
  };

  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; highlight?: boolean }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'data-sync', label: '⚡ Change All Data & Sync', icon: Database, highlight: true },
    { id: 'products', label: 'Products & Pricing', icon: Package },
    { id: 'categories', label: 'Categories & Subcategories', icon: Layers },
    { id: 'inventory', label: 'Inventory & Stock Restock', icon: Boxes },
    { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingBag },
    { id: 'delivery', label: 'Delivery Areas & PINs', icon: MapPin },
    { id: 'coupons', label: 'Coupons & Discount Offers', icon: Tag },
    { id: 'settings', label: 'Store Settings & Brand', icon: Settings },
    { id: 'customers', label: 'Customers & Addresses', icon: Users },
    { id: 'enquiries', label: 'Support Enquiries', icon: HelpCircle },
    { id: 'reports', label: 'Sales & Inventory Reports', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F4] flex flex-col">
      
      {/* Top Admin Header */}
      <header className="bg-[#176B45] text-white px-4 sm:px-6 py-3 border-b border-[#125436] flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('overview')}>
            <div className="w-8 h-8 rounded-lg bg-[#FFD166] text-[#252B27] flex items-center justify-center font-black text-sm shadow-xs">
              BB
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base leading-tight">
                {language === 'bn' ? storeSettings.storeNameBn : storeSettings.storeNameEn}
              </span>
              <span className="block text-[10px] text-green-200">
                Store Operations Admin Panel
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onTabChange('data-sync')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              currentTab === 'data-sync'
                ? 'bg-white text-[#176B45]'
                : 'bg-[#FFD166] text-[#252B27] hover:bg-yellow-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Change All Store Data</span>
            <span className="sm:hidden">Change Data</span>
          </button>

          <button
            onClick={onNavigateStore}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            <span className="hidden sm:inline">View Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-green-700/60 text-xs">
            <span className="hidden md:inline font-bold text-white truncate max-w-[120px]">
              {currentUser?.name || 'Administrator'}
            </span>
            <button
              onClick={() => {
                logout();
                onNavigateStore();
              }}
              title="Sign Out"
              className="p-1.5 text-green-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Admin Broadcast / Control Ribbon */}
      <div className="bg-[#125436] text-green-100 px-4 sm:px-6 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-[#0e432a]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-white">Administrator Mode Active:</span>
          <span className="hidden sm:inline text-green-200">
            You can modify all store branding, pricing, products, categories, delivery zones, and settings in real time.
          </span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleQuickPush}
            title="Push all tables to Supabase"
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
          >
            <CloudUpload className="w-3 h-3 text-[#FFD166]" />
            <span className="hidden md:inline">Push to Supabase</span>
            <span className="md:hidden">Push</span>
          </button>

          <button
            onClick={handleQuickFetch}
            title="Fetch live tables from Supabase"
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
          >
            <CloudDownload className="w-3 h-3 text-emerald-300" />
            <span className="hidden md:inline">Fetch from Supabase</span>
            <span className="md:hidden">Fetch</span>
          </button>

          <button
            onClick={resetAllDataToDemo}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-green-200 hover:text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
            title="Reset store catalog to original demo dataset"
          >
            <RotateCcw className="w-3 h-3 text-amber-300" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Sync Toast Feedback */}
      {syncToast && (
        <div className={`px-4 py-2.5 text-xs text-center font-bold transition-all ${
          syncToast.type === 'loading'
            ? 'bg-amber-500 text-gray-950 animate-pulse'
            : syncToast.type === 'success'
            ? 'bg-emerald-600 text-white'
            : 'bg-rose-600 text-white'
        }`}>
          {syncToast.message}
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 gap-6">
        
        {/* Mobile Backdrop Overlay */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs animate-in fade-in"
          />
        )}

        {/* Sidebar Nav */}
        <aside
          className={`fixed lg:static top-0 bottom-0 left-0 z-50 lg:z-20 w-72 lg:w-64 bg-white lg:bg-transparent rounded-r-3xl lg:rounded-none p-4 lg:p-0 shadow-2xl lg:shadow-none border-r lg:border-none border-gray-200 flex flex-col justify-between overflow-y-auto transition-transform duration-200 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-1 bg-white p-3 rounded-3xl border border-[#E5EAE5] shadow-xs">
            <div className="flex items-center justify-between p-2">
              <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                Admin Controls
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-2xl text-left text-xs font-bold flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'bg-[#176B45] text-white shadow-xs'
                      : item.highlight
                      ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : item.highlight ? 'text-amber-600' : 'text-[#176B45]'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Supabase Status Box */}
          <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
            <div className="font-extrabold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-700" />
                <span>Supabase Cloud</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-emerald-800 font-mono truncate">
              ID: {SUPABASE_PROJECT_ID}
            </p>
            <p className="text-[10px] text-emerald-700 leading-tight">
              All tables connected. Click "Change All Data & Sync" to manage or push updates.
            </p>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 min-w-0 space-y-6">
          {children}
        </main>
      </div>

    </div>
  );
};
