import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Home,
  Compass,
  ShoppingBag,
  Heart,
  User,
  ShieldCheck
} from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate
}) => {
  const { cart, wishlist, currentUser, setIsMiniCartOpen } = useStore();
  const { t } = useLanguage();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // If in admin mode, the admin layout has its own controls
  if (currentPage === 'admin') {
    return null;
  }

  const navItems = [
    {
      id: 'home',
      label: t('home') || 'Home',
      icon: Home,
      action: () => onNavigate('home'),
      isActive: currentPage === 'home'
    },
    {
      id: 'shop',
      label: t('shopAll') || 'Shop',
      icon: Compass,
      action: () => onNavigate('shop'),
      isActive: currentPage === 'shop' || currentPage === 'category'
    },
    {
      id: 'cart',
      label: t('cart') || 'Cart',
      icon: ShoppingBag,
      action: () => setIsMiniCartOpen(true),
      badge: totalCartCount > 0 ? totalCartCount : undefined,
      badgeColor: 'bg-[#176B45]',
      isActive: currentPage === 'cart'
    },
    {
      id: 'wishlist',
      label: t('wishlist') || 'Wishlist',
      icon: Heart,
      action: () => onNavigate('wishlist'),
      badge: wishlist.length > 0 ? wishlist.length : undefined,
      badgeColor: 'bg-rose-500',
      isActive: currentPage === 'wishlist'
    },
    {
      id: 'account',
      label: currentUser ? (currentUser.role === 'admin' ? 'Admin' : 'Account') : (t('login') || 'Account'),
      icon: currentUser?.role === 'admin' ? ShieldCheck : User,
      action: () => {
        if (currentUser?.role === 'admin') {
          onNavigate('admin');
        } else if (currentUser) {
          onNavigate('account');
        } else {
          onNavigate('login');
        }
      },
      isActive: currentPage === 'account' || currentPage === 'orders' || currentPage === 'login'
    }
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5EAE5] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 pt-1 pb-[calc(env(safe-area-inset-bottom,0px)+0.35rem)]"
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative select-none active:scale-95 touch-manipulation ${
                active
                  ? 'text-[#176B45]'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    active ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {item.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -right-2 min-w-4 h-4 px-1 ${item.badgeColor} text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white shadow-xs animate-in zoom-in-50 duration-150`}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-semibold truncate max-w-[62px] ${
                  active ? 'font-black text-[#176B45]' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
              {active && (
                <span className="w-1.5 h-1.5 bg-[#176B45] rounded-full absolute bottom-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
