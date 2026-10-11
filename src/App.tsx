import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
import { LanguageProvider } from './context/LanguageContext';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MiniCartDrawer } from './components/common/MiniCartDrawer';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { OffersPage } from './pages/OffersPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { CustomerLoginPage } from './pages/CustomerLoginPage';
import { WishlistPage } from './pages/WishlistPage';
import { ContactPage } from './pages/ContactPage';
import { PolicyPages } from './pages/PolicyPages';

// Admin Pages
import { AdminLayout, AdminTab } from './pages/admin/AdminLayout';
import { AdminDashboardOverview } from './pages/admin/AdminDashboardOverview';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminDelivery } from './pages/admin/AdminDelivery';
import { AdminStoreSettings } from './pages/admin/AdminStoreSettings';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';
import { AdminReports } from './pages/admin/AdminReports';
import { useStore } from './context/StoreContext';
import { AdminDataSync } from './pages/admin/AdminDataSync';
import { AdminLoginGate } from './pages/admin/AdminLoginGate';
import { MobileBottomNav } from './components/common/MobileBottomNav';

export function AppContent() {
  const { currentUser } = useStore();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<Record<string, string>>({});
  const [adminTab, setAdminTab] = useState<AdminTab>('data-sync');

  const navigate = (page: string, params: Record<string, string> = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If viewing admin portal
  if (currentPage === 'admin') {
    if (currentUser?.role !== 'admin') {
      return (
        <AdminLoginGate
          onSuccess={() => {
            setAdminTab('data-sync');
          }}
          onNavigateStore={() => navigate('home')}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onTabChange={(tab) => setAdminTab(tab)}
        onNavigateStore={() => navigate('home')}
      >
        {adminTab === 'overview' && (
          <AdminDashboardOverview
            onTabChange={(tab) => setAdminTab(tab)}
            onViewOrder={(id) => setAdminTab('orders')}
          />
        )}
        {adminTab === 'products' && <AdminProducts />}
        {adminTab === 'categories' && <AdminCategories />}
        {adminTab === 'inventory' && <AdminInventory />}
        {adminTab === 'orders' && <AdminOrders />}
        {adminTab === 'customers' && <AdminCustomers />}
        {adminTab === 'coupons' && <AdminCoupons />}
        {adminTab === 'delivery' && <AdminDelivery />}
        {adminTab === 'settings' && <AdminStoreSettings />}
        {adminTab === 'enquiries' && <AdminEnquiries />}
        {adminTab === 'reports' && <AdminReports />}
        {adminTab === 'data-sync' && <AdminDataSync />}
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F5]">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Sticky Main Navigation */}
      <Header currentPage={currentPage} onNavigate={navigate} />

      {/* Main Page Body */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={navigate} />}

        {currentPage === 'shop' && (
          <ShopPage
            initialSearchQuery={pageParams.q || ''}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'category' && (
          <CategoryPage
            categorySlug={pageParams.slug || ''}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'product' && (
          <ProductDetailPage
            productId={pageParams.id || ''}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'offers' && <OffersPage onNavigate={navigate} />}

        {currentPage === 'cart' && <CartPage onNavigate={navigate} />}

        {currentPage === 'checkout' && <CheckoutPage onNavigate={navigate} />}

        {currentPage === 'order-confirmation' && (
          <OrderConfirmationPage
            orderId={pageParams.id || ''}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'track-order' && (
          <OrderTrackingPage
            orderId={pageParams.id || ''}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'orders' && (
          <CustomerDashboardPage initialTab="orders" onNavigate={navigate} />
        )}

        {currentPage === 'account' && (
          <CustomerDashboardPage initialTab="profile" onNavigate={navigate} />
        )}

        {currentPage === 'addresses' && (
          <CustomerDashboardPage initialTab="addresses" onNavigate={navigate} />
        )}

        {currentPage === 'login' && <CustomerLoginPage onNavigate={navigate} />}

        {currentPage === 'wishlist' && <WishlistPage onNavigate={navigate} />}

        {currentPage === 'contact' && <ContactPage />}

        {(currentPage === 'about' ||
          currentPage === 'faq' ||
          currentPage === 'shipping-policy' ||
          currentPage === 'return-policy' ||
          currentPage === 'cancellation-policy' ||
          currentPage === 'privacy-policy' ||
          currentPage === 'terms-conditions') && (
          <PolicyPages pageType={currentPage as any} onNavigate={navigate} />
        )}
      </main>

      {/* Slide-over Mini Cart Basket */}
      <MiniCartDrawer onNavigate={navigate} />

      {/* Storefront Footer */}
      <div className="pb-16 md:pb-0">
        <Footer onNavigate={navigate} />
      </div>

      {/* Mobile App Bottom Navigation Bar (auto-adjusts to device safe-area) */}
      <MobileBottomNav currentPage={currentPage} onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </StoreProvider>
  );
}
