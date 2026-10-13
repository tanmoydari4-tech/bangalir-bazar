export type Language = 'en' | 'bn';

export interface Category {
  id: string;
  nameEn: string;
  nameBn: string;
  slug: string;
  descriptionEn?: string;
  descriptionBn?: string;
  icon: string;
  image: string;
  order: number;
  isActive: boolean;
  subcategories: {
    id: string;
    nameEn: string;
    nameBn: string;
    slug: string;
  }[];
}

export interface Product {
  id: string;
  sku: string;
  nameEn: string;
  nameBn: string;
  slug: string;
  brand: string;
  categoryId: string;
  subcategoryId?: string;
  descriptionEn: string;
  descriptionBn: string;
  packSize: string;      // e.g. "1 kg", "500 g", "1 Litre"
  unit: string;          // "kg", "g", "L", "ml", "pcs", "pack"
  sellingPrice: number;  // In INR
  originalPrice: number; // MRP
  stockQuantity: number;
  lowStockThreshold: number;
  isVegetarian: boolean;
  ingredientsEn?: string;
  ingredientsBn?: string;
  manufacturer?: string;
  expiryNoticeEn?: string;
  expiryNoticeBn?: string;
  storageInstructionsEn?: string;
  storageInstructionsBn?: string;
  images: string[];
  isPublished: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  salesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface DeliveryArea {
  id: string;
  pinCode: string;
  areaNameEn: string;
  areaNameBn: string;
  district: string;
  deliveryFee: number;
  minOrderAmount: number;
  freeDeliveryThreshold: number;
  estimatedWindowEn: string;
  estimatedWindowBn: string;
  isCodAvailable: boolean;
  isActive: boolean;
}

export interface DeliverySlot {
  id: string;
  timeRangeEn: string;
  timeRangeBn: string;
  cutoffHour: number; // 24-hr format
  capacity: number;
  bookedCount: number;
  isActive: boolean;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  alternateMobile?: string;
  addressLine: string;
  locality: string;
  landmark?: string;
  pinCode: string;
  type: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  password?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  createdAt: string;
}

export type OrderStatus =
  | 'Pending Payment'
  | 'Order Placed'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export type PaymentMethod = 'Razorpay' | 'UPI' | 'Card' | 'Cash on Delivery';
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded';

export interface OrderItemSnapshot {
  productId: string;
  productNameEn: string;
  productNameBn: string;
  brand: string;
  packSize: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerSnapshot: {
    name: string;
    email: string;
    mobile: string;
  };
  deliveryAddress: Address;
  items: OrderItemSnapshot[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryDate: string;
  deliverySlot: string;
  deliveryPerson?: {
    name: string;
    phone: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  firstOrderOnly: boolean;
  isActive: boolean;
  descriptionEn: string;
  descriptionBn: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  change: number; // +10, -2
  resultingStock: number;
  reason: 'Restock' | 'Sale' | 'Damaged' | 'Return' | 'Correction';
  notes?: string;
  timestamp: string;
  performedBy: string;
}

export interface CustomerEnquiry {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  orderNumber?: string;
  category: 'Product Enquiry' | 'Order Status' | 'Delivery Issue' | 'Payment Issue' | 'Return or Refund' | 'General Support';
  message: string;
  status: 'New' | 'In Progress' | 'Resolved';
  createdAt: string;
}

export interface StoreSettings {
  storeNameEn: string;
  storeNameBn: string;
  taglineEn: string;
  taglineBn: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  addressEn: string;
  addressBn: string;
  openingHoursEn: string;
  openingHoursBn: string;
  currencySymbol: string;
  defaultDeliveryFee: number;
  defaultFreeDeliveryThreshold: number;
  heroHeadlineEn: string;
  heroHeadlineBn: string;
  heroSubheadlineEn: string;
  heroSubheadlineBn: string;
  announcementTextEn: string;
  announcementTextBn: string;
  announcementActive: boolean;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}
