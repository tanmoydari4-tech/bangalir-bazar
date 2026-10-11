import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  DeliveryArea,
  DeliverySlot,
  Coupon,
  StoreSettings,
  Order,
  User,
  Address,
  CustomerEnquiry,
  InventoryMovement,
  OrderStatus,
  PaymentMethod
} from '../types';
import {
  initialCategories,
  initialProducts,
  initialDeliveryAreas,
  initialDeliverySlots,
  initialCoupons,
  initialStoreSettings
} from '../data/initialData';
import { pushAllDataToSupabase, fetchAllDataFromSupabase } from '../services/supabase';

interface StoreContextType {
  // Products & Categories
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'salesCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => { success: boolean; message?: string };
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isMiniCartOpen: boolean;
  setIsMiniCartOpen: (open: boolean) => void;
  wishlist: string[]; // Product IDs
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Pricing & Coupon
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  deliveryFee: number;
  cartTotal: number;
  savingsTotal: number;

  // Delivery Areas & Slots
  deliveryAreas: DeliveryArea[];
  deliverySlots: DeliverySlot[];
  activePinCode: string;
  setActivePinCode: (pin: string) => void;
  selectedDeliveryArea: DeliveryArea | null;
  checkPinAvailability: (pin: string) => { isAvailable: boolean; area?: DeliveryArea };
  addDeliveryArea: (area: Omit<DeliveryArea, 'id'>) => void;
  updateDeliveryArea: (id: string, updates: Partial<DeliveryArea>) => void;
  deleteDeliveryArea: (id: string) => void;
  updateDeliverySlot: (id: string, updates: Partial<DeliverySlot>) => void;

  // User & Auth
  currentUser: User | null;
  login: (email: string, role?: 'customer' | 'admin') => boolean;
  logout: () => void;
  registerUser: (name: string, email: string, mobile: string) => User;
  addAddress: (address: Omit<Address, 'id' | 'userId'>) => Address;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    deliveryAddress: Address;
    deliveryDate: string;
    deliverySlot: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => { success: boolean; order?: Order; error?: string };
  updateOrderStatus: (orderId: string, status: OrderStatus, deliveryPerson?: { name: string; phone: string }) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Inventory Movements
  inventoryMovements: InventoryMovement[];
  adjustStock: (productId: string, change: number, reason: InventoryMovement['reason'], notes?: string) => void;

  // Settings & Enquiries
  storeSettings: StoreSettings;
  updateStoreSettings: (updates: Partial<StoreSettings>) => void;
  customerEnquiries: CustomerEnquiry[];
  submitEnquiry: (enquiry: Omit<CustomerEnquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateEnquiryStatus: (id: string, status: CustomerEnquiry['status']) => void;
  resetAllDataToDemo: () => void;
  setAllProducts: (products: Product[]) => void;
  setAllCategories: (categories: Category[]) => void;
  setAllDeliveryAreas: (areas: DeliveryArea[]) => void;
  setAllCoupons: (coupons: Coupon[]) => void;
  replaceStoreData: (data: {
    products?: Product[];
    categories?: Category[];
    deliveryAreas?: DeliveryArea[];
    deliverySlots?: DeliverySlot[];
    coupons?: Coupon[];
    storeSettings?: Partial<StoreSettings>;
  }) => void;
  syncAllToSupabase: () => Promise<{ success: boolean; message: string }>;
  syncAllFromSupabase: () => Promise<{ success: boolean; message: string }>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'bb_products',
  CATEGORIES: 'bb_categories',
  CART: 'bb_cart',
  WISHLIST: 'bb_wishlist',
  DELIVERY_AREAS: 'bb_delivery_areas',
  DELIVERY_SLOTS: 'bb_delivery_slots',
  COUPONS: 'bb_coupons',
  SETTINGS: 'bb_settings',
  ORDERS: 'bb_orders',
  USER: 'bb_user',
  PIN: 'bb_active_pin',
  MOVEMENTS: 'bb_movements',
  ENQUIRIES: 'bb_enquiries'
};

const defaultDemoUser: User | null = null;

function safeParse<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved);
  } catch (err) {
    console.warn(`Failed to parse localStorage key "${key}", using fallback`, err);
    return fallback;
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load states with localStorage fallback safely
  const [products, setProducts] = useState<Product[]>(() => safeParse(STORAGE_KEYS.PRODUCTS, initialProducts));
  const [categories, setCategories] = useState<Category[]>(() => safeParse(STORAGE_KEYS.CATEGORIES, initialCategories));
  const [cart, setCart] = useState<CartItem[]>(() => safeParse(STORAGE_KEYS.CART, []));
  const [wishlist, setWishlist] = useState<string[]>(() => safeParse(STORAGE_KEYS.WISHLIST, ['prod-fortune-mustard-oil-1l', 'prod-amul-butter-100g']));
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>(() => safeParse(STORAGE_KEYS.DELIVERY_AREAS, initialDeliveryAreas));
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>(() => safeParse(STORAGE_KEYS.DELIVERY_SLOTS, initialDeliverySlots));
  const [coupons, setCoupons] = useState<Coupon[]>(() => safeParse(STORAGE_KEYS.COUPONS, initialCoupons));
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => safeParse(STORAGE_KEYS.SETTINGS, initialStoreSettings));

  const [activePinCode, setActivePinCodeState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.PIN) || '700091';
    } catch {
      return '700091';
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(() => safeParse(STORAGE_KEYS.USER, defaultDemoUser));

  const [orders, setOrders] = useState<Order[]>(() => {
    const parsed = safeParse<Order[] | null>(STORAGE_KEYS.ORDERS, null);
    if (parsed && Array.isArray(parsed)) return parsed;
    // Initial sample order for demonstration
    return [
      {
        id: 'ord-1001',
        orderNumber: 'BB-2026-8819',
        userId: 'usr-demo-01',
        customerSnapshot: {
          name: 'Tanmoy Dari',
          email: 'tanmoydari4@gmail.com',
          mobile: '9830123456'
        },
        deliveryAddress: {
          id: 'addr-01',
          userId: 'usr-demo-01',
          name: 'Tanmoy Dari',
          mobile: '9830123456',
          addressLine: 'Flat 4B, Sunflower Enclave, Street 14',
          locality: 'Sector V, Salt Lake',
          landmark: 'Near Webel More',
          pinCode: '700091',
          type: 'Home',
          isDefault: true
        },
        items: [
          {
            productId: 'prod-fortune-mustard-oil-1l',
            productNameEn: 'Fortune Premium Kachi Ghani Mustard Oil',
            productNameBn: 'ফরচুন খাঁটি কাচ্চি ঘানি সরিষার তেল',
            brand: 'Fortune',
            packSize: '1 Litre',
            price: 165,
            originalPrice: 195,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
            subtotal: 330
          },
          {
            productId: 'prod-india-gate-basmati-1kg',
            productNameEn: 'India Gate Feast Rozzana Basmati Rice',
            productNameBn: 'ইন্ডিয়া গেট ফিস্ট রোজানা বাসমতী চাল',
            brand: 'India Gate',
            packSize: '1 kg',
            price: 110,
            originalPrice: 135,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
            subtotal: 110
          }
        ],
        subtotal: 440,
        discount: 44,
        couponCode: 'WELCOME10',
        deliveryFee: 0,
        tax: 0,
        total: 396,
        paymentMethod: 'UPI',
        paymentStatus: 'Completed',
        orderStatus: 'Out for Delivery',
        deliveryDate: 'Today',
        deliverySlot: '04:00 PM - 07:00 PM',
        deliveryPerson: {
          name: 'Debasis Roy',
          phone: '+91 98311 44552'
        },
        notes: 'Please ring bell twice',
        createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  });

  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
    return saved ? JSON.parse(saved) : [
      {
        id: 'mov-001',
        productId: 'prod-fortune-mustard-oil-1l',
        productName: 'Fortune Mustard Oil 1L',
        change: 50,
        resultingStock: 50,
        reason: 'Restock',
        notes: 'Direct refinery shipment receipt',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        performedBy: 'Admin'
      }
    ];
  });

  const [customerEnquiries, setCustomerEnquiries] = useState<CustomerEnquiry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
    return saved ? JSON.parse(saved) : [
      {
        id: 'enq-001',
        name: 'Sourav Ganguly',
        email: 'sourav.g@example.com',
        mobile: '9830099887',
        category: 'Delivery Issue',
        message: 'Could you please confirm if early morning delivery is possible at Salt Lake Block BE?',
        status: 'Resolved',
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
      }
    ];
  });

  // Sync state to LocalStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.DELIVERY_AREAS, JSON.stringify(deliveryAreas)); }, [deliveryAreas]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.DELIVERY_SLOTS, JSON.stringify(deliverySlots)); }, [deliverySlots]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(storeSettings)); }, [storeSettings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(inventoryMovements)); }, [inventoryMovements]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(customerEnquiries)); }, [customerEnquiries]);

  // Set active PIN
  const setActivePinCode = (pin: string) => {
    setActivePinCodeState(pin);
    localStorage.setItem(STORAGE_KEYS.PIN, pin);
  };

  const selectedDeliveryArea = deliveryAreas.find(a => a.pinCode === activePinCode && a.isActive) || null;

  const checkPinAvailability = (pin: string) => {
    const area = deliveryAreas.find(a => a.pinCode === pin.trim() && a.isActive);
    return {
      isAvailable: !!area,
      area
    };
  };

  // Product CRUD
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'salesCount'>) => {
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      salesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts(prev => [newProduct, ...prev]);
    // Log movement
    if (prodData.stockQuantity > 0) {
      logMovement(newProduct.id, newProduct.nameEn, prodData.stockQuantity, prodData.stockQuantity, 'Restock', 'Initial inventory stock');
    }
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        if (updates.stockQuantity !== undefined && updates.stockQuantity !== p.stockQuantity) {
          const diff = updates.stockQuantity - p.stockQuantity;
          logMovement(p.id, p.nameEn, diff, updates.stockQuantity, 'Correction', 'Manual product edit stock update');
        }
        return { ...p, ...updates, updatedAt: new Date().toISOString() };
      }
      return p;
    }));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.productId !== id));
  };

  // Category CRUD
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`
    };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1): { success: boolean; message?: string } => {
    if (product.stockQuantity <= 0) {
      return { success: false, message: 'Item is currently out of stock.' };
    }

    let errorMsg = '';
    let success = true;

    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      const currentQty = existing ? existing.quantity : 0;
      const targetQty = currentQty + quantity;

      if (targetQty > product.stockQuantity) {
        errorMsg = `Only ${product.stockQuantity} units available in stock.`;
        success = false;
        return prev;
      }

      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: targetQty } : item);
      } else {
        return [...prev, { productId: product.id, quantity, product }];
      }
    });

    if (success) {
      setIsMiniCartOpen(true);
    }
    return { success, message: errorMsg };
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    if (quantity > prod.stockQuantity) {
      alert(`Cannot add more than ${prod.stockQuantity} items in stock.`);
      return;
    }

    setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0);
  const cartMRP = cart.reduce((sum, item) => sum + (item.product.originalPrice * item.quantity), 0);
  const savingsTotal = Math.max(0, cartMRP - cartSubtotal);

  // Free delivery logic
  const freeThreshold = selectedDeliveryArea?.freeDeliveryThreshold || storeSettings.defaultFreeDeliveryThreshold;
  const baseFee = selectedDeliveryArea?.deliveryFee ?? storeSettings.defaultDeliveryFee;
  const deliveryFee = cartSubtotal === 0 || cartSubtotal >= freeThreshold ? 0 : baseFee;

  // Coupon discount
  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountType === 'percentage') {
      const disc = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
      cartDiscount = appliedCoupon.maxDiscount ? Math.min(disc, appliedCoupon.maxDiscount) : disc;
    } else {
      cartDiscount = appliedCoupon.discountValue;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryFee);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === clean && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or inactive coupon code.' };
    }

    if (new Date(found.expiryDate) < new Date()) {
      return { success: false, message: 'This coupon code has expired.' };
    }

    if (cartSubtotal < found.minOrderValue) {
      return { success: false, message: `Minimum order value of ₹${found.minOrderValue} required for this coupon.` };
    }

    setAppliedCoupon(found);
    return { success: true, message: `Coupon applied! Saved ₹${found.discountType === 'fixed' ? found.discountValue : `${found.discountValue}%`}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Inventory movement logging helper
  const logMovement = (
    productId: string,
    productName: string,
    change: number,
    resultingStock: number,
    reason: InventoryMovement['reason'],
    notes?: string
  ) => {
    const movement: InventoryMovement = {
      id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId,
      productName,
      change,
      resultingStock,
      reason,
      notes,
      timestamp: new Date().toISOString(),
      performedBy: currentUser?.name || 'System'
    };
    setInventoryMovements(prev => [movement, ...prev]);
  };

  const adjustStock = (productId: string, change: number, reason: InventoryMovement['reason'], notes?: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newStock = Math.max(0, p.stockQuantity + change);
        logMovement(p.id, p.nameEn, change, newStock, reason, notes);
        return { ...p, stockQuantity: newStock, updatedAt: new Date().toISOString() };
      }
      return p;
    }));
  };

  // User management
  const login = (email: string, role: 'customer' | 'admin' = 'customer'): boolean => {
    const isAdmin = role === 'admin' || email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin@bangalirbazar.com';
    if (isAdmin) {
      setCurrentUser({
        id: 'usr-admin-01',
        name: 'Store Administrator',
        email: email || 'admin@bangalirbazar.com',
        mobile: '9830000000',
        role: 'admin',
        createdAt: '2026-01-01T00:00:00Z',
        addresses: []
      });
      return true;
    }

    // Customer login
    setCurrentUser(prev => ({
      id: prev?.id || `usr-${Date.now()}`,
      name: prev?.name || 'Valued Customer',
      email: email,
      mobile: prev?.mobile || '9830123456',
      role: 'customer',
      createdAt: prev?.createdAt || new Date().toISOString(),
      addresses: prev?.addresses || []
    }));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const registerUser = (name: string, email: string, mobile: string): User => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      mobile,
      role: 'customer',
      createdAt: new Date().toISOString(),
      addresses: []
    };
    setCurrentUser(newUser);
    return newUser;
  };

  const addAddress = (addressData: Omit<Address, 'id' | 'userId'>): Address => {
    const newAddress: Address = {
      ...addressData,
      id: `addr-${Date.now()}`,
      userId: currentUser?.id || 'guest'
    };

    if (currentUser) {
      const updatedAddresses = addressData.isDefault
        ? currentUser.addresses.map(a => ({ ...a, isDefault: false })).concat(newAddress)
        : [...currentUser.addresses, newAddress];

      setCurrentUser({ ...currentUser, addresses: updatedAddresses });
    }

    return newAddress;
  };

  const deleteAddress = (id: string) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      addresses: currentUser.addresses.filter(a => a.id !== id)
    });
  };

  const setDefaultAddress = (id: string) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      addresses: currentUser.addresses.map(a => ({
        ...a,
        isDefault: a.id === id
      }))
    });
  };

  // Orders
  const createOrder = (orderData: {
    deliveryAddress: Address;
    deliveryDate: string;
    deliverySlot: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): { success: boolean; order?: Order; error?: string } => {
    if (cart.length === 0) {
      return { success: false, error: 'Your cart is empty.' };
    }

    // Check stock for all items
    for (const item of cart) {
      const product = products.find(p => p.id === item.productId);
      if (!product || product.stockQuantity < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${item.product.nameEn}. Available: ${product ? product.stockQuantity : 0}`
        };
      }
    }

    // Build immutable order item snapshots
    const items: Order['items'] = cart.map(item => ({
      productId: item.productId,
      productNameEn: item.product.nameEn,
      productNameBn: item.product.nameBn,
      brand: item.product.brand,
      packSize: item.product.packSize,
      price: item.product.sellingPrice,
      originalPrice: item.product.originalPrice,
      quantity: item.quantity,
      image: item.product.images[0] || '',
      subtotal: item.product.sellingPrice * item.quantity
    }));

    const orderNumber = `BB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: currentUser?.id || 'guest',
      customerSnapshot: {
        name: currentUser?.name || orderData.deliveryAddress.name,
        email: currentUser?.email || 'customer@bangalirbazar.com',
        mobile: orderData.deliveryAddress.mobile
      },
      deliveryAddress: orderData.deliveryAddress,
      items,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      couponCode: appliedCoupon?.code,
      deliveryFee,
      tax: 0,
      total: cartTotal,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Completed',
      orderStatus: 'Order Placed',
      deliveryDate: orderData.deliveryDate,
      deliverySlot: orderData.deliverySlot,
      deliveryPerson: {
        name: 'Debasis Roy',
        phone: '+91 98311 44552'
      },
      notes: orderData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Deduct stock safely & record sales
    setProducts(prev => prev.map(p => {
      const ordered = cart.find(item => item.productId === p.id);
      if (ordered) {
        const remaining = Math.max(0, p.stockQuantity - ordered.quantity);
        logMovement(p.id, p.nameEn, -ordered.quantity, remaining, 'Sale', `Sold in Order #${orderNumber}`);
        return {
          ...p,
          stockQuantity: remaining,
          salesCount: (p.salesCount || 0) + ordered.quantity
        };
      }
      return p;
    }));

    // Update coupon usage count if used
    if (appliedCoupon) {
      setCoupons(prev => prev.map(c => c.id === appliedCoupon.id ? { ...c, usedCount: c.usedCount + 1 } : c));
    }

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    return { success: true, order: newOrder };
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, deliveryPerson?: { name: string; phone: string }) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          orderStatus: status,
          deliveryPerson: deliveryPerson || o.deliveryPerson,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));
  };

  const getOrderById = (orderId: string) => {
    return orders.find(o => o.id === orderId || o.orderNumber === orderId);
  };

  // Delivery Areas & Slots admin controls
  const addDeliveryArea = (area: Omit<DeliveryArea, 'id'>) => {
    setDeliveryAreas(prev => [...prev, { ...area, id: `area-${Date.now()}` }]);
  };

  const updateDeliveryArea = (id: string, updates: Partial<DeliveryArea>) => {
    setDeliveryAreas(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteDeliveryArea = (id: string) => {
    setDeliveryAreas(prev => prev.filter(a => a.id !== id));
  };

  const updateDeliverySlot = (id: string, updates: Partial<DeliverySlot>) => {
    setDeliverySlots(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // Store Settings
  const updateStoreSettings = (updates: Partial<StoreSettings>) => {
    setStoreSettings(prev => ({ ...prev, ...updates }));
  };

  // Enquiries
  const submitEnquiry = (enquiry: Omit<CustomerEnquiry, 'id' | 'createdAt' | 'status'>) => {
    const newEnq: CustomerEnquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    setCustomerEnquiries(prev => [newEnq, ...prev]);
  };

  const updateEnquiryStatus = (id: string, status: CustomerEnquiry['status']) => {
    setCustomerEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  // Reset to demo data
  const resetAllDataToDemo = () => {
    localStorage.clear();
    setProducts(initialProducts);
    setCategories(initialCategories);
    setDeliveryAreas(initialDeliveryAreas);
    setDeliverySlots(initialDeliverySlots);
    setCoupons(initialCoupons);
    setStoreSettings(initialStoreSettings);
    setCart([]);
    setWishlist(['prod-fortune-mustard-oil-1l', 'prod-amul-butter-100g']);
    setCurrentUser(defaultDemoUser);
    setActivePinCodeState('700091');
    window.location.reload();
  };

  // Bulk data setters
  const setAllProducts = (newProds: Product[]) => setProducts(newProds);
  const setAllCategories = (newCats: Category[]) => setCategories(newCats);
  const setAllDeliveryAreas = (newAreas: DeliveryArea[]) => setDeliveryAreas(newAreas);
  const setAllCoupons = (newCpns: Coupon[]) => setCoupons(newCpns);

  const replaceStoreData = (data: {
    products?: Product[];
    categories?: Category[];
    deliveryAreas?: DeliveryArea[];
    deliverySlots?: DeliverySlot[];
    coupons?: Coupon[];
    storeSettings?: Partial<StoreSettings>;
  }) => {
    if (data.products) setProducts(data.products);
    if (data.categories) setCategories(data.categories);
    if (data.deliveryAreas) setDeliveryAreas(data.deliveryAreas);
    if (data.deliverySlots) setDeliverySlots(data.deliverySlots);
    if (data.coupons) setCoupons(data.coupons);
    if (data.storeSettings) setStoreSettings(prev => ({ ...prev, ...data.storeSettings }));
  };

  const syncAllToSupabase = async () => {
    return await pushAllDataToSupabase({
      categories,
      products,
      deliveryAreas,
      deliverySlots,
      coupons,
      storeSettings
    });
  };

  const syncAllFromSupabase = async () => {
    const res = await fetchAllDataFromSupabase();
    if (res.success && res.data) {
      replaceStoreData(res.data);
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message };
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isMiniCartOpen,
        setIsMiniCartOpen,
        wishlist,
        toggleWishlist,
        isWishlisted,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartDiscount,
        deliveryFee,
        cartTotal,
        savingsTotal,
        deliveryAreas,
        deliverySlots,
        activePinCode,
        setActivePinCode,
        selectedDeliveryArea,
        checkPinAvailability,
        addDeliveryArea,
        updateDeliveryArea,
        deleteDeliveryArea,
        updateDeliverySlot,
        currentUser,
        login,
        logout,
        registerUser,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        inventoryMovements,
        adjustStock,
        storeSettings,
        updateStoreSettings,
        customerEnquiries,
        submitEnquiry,
        updateEnquiryStatus,
        resetAllDataToDemo,
        setAllProducts,
        setAllCategories,
        setAllDeliveryAreas,
        setAllCoupons,
        replaceStoreData,
        syncAllToSupabase,
        syncAllFromSupabase
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
