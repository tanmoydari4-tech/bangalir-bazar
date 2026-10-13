import { createClient } from '@supabase/supabase-js';
import { Category, Product, DeliveryArea, DeliverySlot, Coupon, StoreSettings } from '../types';

export const SUPABASE_PROJECT_ID = 'rzxjoxedqydbivwcrxrs';
export const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY = 'sb_publishable_zjXi9UKEc_GZvm6yWPI_fg_IruhXZoG';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Push all store data to Supabase tables
export async function pushAllDataToSupabase(data: {
  categories: Category[];
  products: Product[];
  deliveryAreas: DeliveryArea[];
  deliverySlots: DeliverySlot[];
  coupons: Coupon[];
  storeSettings: StoreSettings;
}): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    // 1. Categories
    const categoryRows = data.categories.map((c, idx) => ({
      id: c.id,
      name_en: c.nameEn,
      name_bn: c.nameBn,
      slug: c.slug,
      icon: c.icon,
      image: c.image,
      display_order: idx + 1,
      is_active: c.isActive
    }));

    const { error: catErr } = await supabase.from('categories').upsert(categoryRows, { onConflict: 'id' });
    if (catErr) throw new Error(`Categories error: ${catErr.message}`);

    // 2. Subcategories
    const subcatRows = data.categories.flatMap(c =>
      (c.subcategories || []).map(s => ({
        id: s.id,
        category_id: c.id,
        name_en: s.nameEn,
        name_bn: s.nameBn,
        slug: s.slug
      }))
    );
    if (subcatRows.length > 0) {
      const { error: subErr } = await supabase.from('subcategories').upsert(subcatRows, { onConflict: 'id' });
      if (subErr) console.warn('Subcategories sync notice:', subErr.message);
    }

    // 3. Products
    const productRows = data.products.map(p => ({
      id: p.id,
      sku: p.sku,
      name_en: p.nameEn,
      name_bn: p.nameBn,
      slug: p.slug,
      brand: p.brand,
      category_id: p.categoryId,
      subcategory_id: p.subcategoryId || null,
      description_en: p.descriptionEn,
      description_bn: p.descriptionBn,
      pack_size: p.packSize,
      unit: p.unit,
      selling_price: p.sellingPrice,
      original_price: p.originalPrice,
      stock_quantity: p.stockQuantity,
      low_stock_threshold: p.lowStockThreshold,
      is_vegetarian: p.isVegetarian,
      ingredients_en: p.ingredientsEn,
      ingredients_bn: p.ingredientsBn,
      manufacturer: p.manufacturer,
      images: p.images,
      is_published: p.isPublished,
      is_featured: p.isFeatured,
      is_best_seller: p.isBestSeller,
      sales_count: p.salesCount || 0
    }));

    const { error: prodErr } = await supabase.from('products').upsert(productRows, { onConflict: 'id' });
    if (prodErr) throw new Error(`Products error: ${prodErr.message}`);

    // 4. Delivery Areas
    const areaRows = data.deliveryAreas.map(a => ({
      id: a.id,
      pin_code: a.pinCode,
      area_name_en: a.areaNameEn,
      area_name_bn: a.areaNameBn,
      district: a.district,
      delivery_fee: a.deliveryFee,
      min_order_amount: a.minOrderAmount,
      free_delivery_threshold: a.freeDeliveryThreshold,
      estimated_window_en: a.estimatedWindowEn,
      estimated_window_bn: a.estimatedWindowBn,
      is_cod_available: a.isCodAvailable,
      is_active: a.isActive
    }));

    const { error: areaErr } = await supabase.from('delivery_areas').upsert(areaRows, { onConflict: 'id' });
    if (areaErr) throw new Error(`Delivery areas error: ${areaErr.message}`);

    // 5. Delivery Slots
    const slotRows = data.deliverySlots.map(s => ({
      id: s.id,
      time_range_en: s.timeRangeEn,
      time_range_bn: s.timeRangeBn,
      cutoff_hour: s.cutoffHour,
      capacity: s.capacity,
      booked_count: s.bookedCount,
      is_active: s.isActive
    }));

    const { error: slotErr } = await supabase.from('delivery_slots').upsert(slotRows, { onConflict: 'id' });
    if (slotErr) throw new Error(`Slots error: ${slotErr.message}`);

    // 6. Coupons
    const couponRows = data.coupons.map(cp => ({
      id: cp.id,
      code: cp.code,
      discount_type: cp.discountType,
      discount_value: cp.discountValue,
      min_order_value: cp.minOrderValue,
      max_discount: cp.maxDiscount || null,
      expiry_date: cp.expiryDate,
      usage_limit: cp.usageLimit,
      used_count: cp.usedCount,
      first_order_only: cp.firstOrderOnly,
      is_active: cp.isActive,
      description_en: cp.descriptionEn,
      description_bn: cp.descriptionBn
    }));

    const { error: cpnErr } = await supabase.from('coupons').upsert(couponRows, { onConflict: 'id' });
    if (cpnErr) throw new Error(`Coupons error: ${cpnErr.message}`);

    // 7. Store Settings
    const { error: setErr } = await supabase.from('store_settings').upsert({
      id: 'primary',
      store_name_en: data.storeSettings.storeNameEn,
      store_name_bn: data.storeSettings.storeNameBn,
      tagline_en: data.storeSettings.taglineEn,
      tagline_bn: data.storeSettings.taglineBn,
      contact_email: data.storeSettings.contactEmail,
      contact_phone: data.storeSettings.contactPhone,
      whatsapp_number: data.storeSettings.whatsappNumber,
      address_en: data.storeSettings.addressEn,
      address_bn: data.storeSettings.addressBn,
      opening_hours_en: data.storeSettings.openingHoursEn,
      opening_hours_bn: data.storeSettings.openingHoursBn,
      default_delivery_fee: data.storeSettings.defaultDeliveryFee,
      default_free_delivery_threshold: data.storeSettings.defaultFreeDeliveryThreshold,
      hero_headline_en: data.storeSettings.heroHeadlineEn,
      hero_headline_bn: data.storeSettings.heroHeadlineBn,
      hero_subheadline_en: data.storeSettings.heroSubheadlineEn,
      hero_subheadline_bn: data.storeSettings.heroSubheadlineBn,
      announcement_text_en: data.storeSettings.announcementTextEn,
      announcement_text_bn: data.storeSettings.announcementTextBn,
      announcement_active: data.storeSettings.announcementActive,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
    if (setErr) throw new Error(`Store settings error: ${setErr.message}`);

    return {
      success: true,
      message: `Successfully synchronized ${data.products.length} products, ${data.categories.length} categories, ${data.deliveryAreas.length} PIN codes, and store settings with Supabase (${SUPABASE_PROJECT_ID})!`
    };
  } catch (err: any) {
    console.error('Supabase Sync Error:', err);
    return {
      success: false,
      message: err.message || 'Failed to synchronize with Supabase. Ensure tables are created in Supabase SQL editor.'
    };
  }
}

// Fetch all store data from Supabase tables
export async function fetchAllDataFromSupabase(): Promise<{
  success: boolean;
  data?: {
    categories?: Category[];
    products?: Product[];
    deliveryAreas?: DeliveryArea[];
    deliverySlots?: DeliverySlot[];
    coupons?: Coupon[];
    storeSettings?: Partial<StoreSettings>;
  };
  message: string;
}> {
  try {
    const [catRes, subcatRes, prodRes, areaRes, slotRes, cpnRes, setRes] = await Promise.all([
      supabase.from('categories').select('*').order('display_order'),
      supabase.from('subcategories').select('*'),
      supabase.from('products').select('*'),
      supabase.from('delivery_areas').select('*'),
      supabase.from('delivery_slots').select('*'),
      supabase.from('coupons').select('*'),
      supabase.from('store_settings').select('*').limit(1).single()
    ]);

    if (catRes.error) throw new Error(`Categories fetch error: ${catRes.error.message}`);
    if (prodRes.error) throw new Error(`Products fetch error: ${prodRes.error.message}`);

    // Map subcategories to categories
    const subcats = subcatRes.data || [];
    const categories: Category[] = (catRes.data || []).map((c: any) => ({
      id: c.id,
      nameEn: c.name_en,
      nameBn: c.name_bn,
      slug: c.slug,
      descriptionEn: c.description_en,
      descriptionBn: c.description_bn,
      icon: c.icon || 'Layers',
      image: c.image,
      order: c.display_order || 1,
      isActive: c.is_active ?? true,
      subcategories: subcats
        .filter((s: any) => s.category_id === c.id)
        .map((s: any) => ({
          id: s.id,
          nameEn: s.name_en,
          nameBn: s.name_bn,
          slug: s.slug
        }))
    }));

    // Map products
    const products: Product[] = (prodRes.data || []).map((p: any) => ({
      id: p.id,
      sku: p.sku,
      nameEn: p.name_en,
      nameBn: p.name_bn,
      slug: p.slug,
      brand: p.brand,
      categoryId: p.category_id,
      subcategoryId: p.subcategory_id,
      descriptionEn: p.description_en || '',
      descriptionBn: p.description_bn || '',
      packSize: p.pack_size,
      unit: p.unit || 'kg',
      sellingPrice: Number(p.selling_price),
      originalPrice: Number(p.original_price),
      stockQuantity: Number(p.stock_quantity),
      lowStockThreshold: Number(p.low_stock_threshold || 10),
      isVegetarian: p.is_vegetarian ?? true,
      ingredientsEn: p.ingredients_en,
      ingredientsBn: p.ingredients_bn,
      manufacturer: p.manufacturer,
      expiryNoticeEn: p.expiry_notice_en,
      expiryNoticeBn: p.expiry_notice_bn,
      storageInstructionsEn: p.storage_instructions_en,
      storageInstructionsBn: p.storage_instructions_bn,
      images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'],
      isPublished: p.is_published ?? true,
      isFeatured: p.is_featured ?? false,
      isBestSeller: p.is_best_seller ?? false,
      salesCount: Number(p.sales_count || 0),
      createdAt: p.created_at || new Date().toISOString(),
      updatedAt: p.updated_at || new Date().toISOString()
    }));

    // Map delivery areas
    const deliveryAreas: DeliveryArea[] = (areaRes.data || []).map((a: any) => ({
      id: a.id,
      pinCode: a.pin_code,
      areaNameEn: a.area_name_en,
      areaNameBn: a.area_name_bn,
      district: a.district,
      deliveryFee: Number(a.delivery_fee),
      minOrderAmount: Number(a.min_order_amount),
      freeDeliveryThreshold: Number(a.free_delivery_threshold),
      estimatedWindowEn: a.estimated_window_en,
      estimatedWindowBn: a.estimated_window_bn,
      isCodAvailable: a.is_cod_available ?? true,
      isActive: a.is_active ?? true
    }));

    // Map delivery slots
    const deliverySlots: DeliverySlot[] = (slotRes.data || []).map((s: any) => ({
      id: s.id,
      timeRangeEn: s.time_range_en,
      timeRangeBn: s.time_range_bn,
      cutoffHour: Number(s.cutoff_hour),
      capacity: Number(s.capacity),
      bookedCount: Number(s.booked_count || 0),
      isActive: s.is_active ?? true
    }));

    // Map coupons
    const coupons: Coupon[] = (cpnRes.data || []).map((cp: any) => ({
      id: cp.id,
      code: cp.code,
      discountType: cp.discount_type,
      discountValue: Number(cp.discount_value),
      minOrderValue: Number(cp.min_order_value),
      maxDiscount: cp.max_discount ? Number(cp.max_discount) : undefined,
      expiryDate: cp.expiry_date,
      usageLimit: Number(cp.usage_limit || 1000),
      usedCount: Number(cp.used_count || 0),
      firstOrderOnly: cp.first_order_only ?? false,
      isActive: cp.is_active ?? true,
      descriptionEn: cp.description_en || '',
      descriptionBn: cp.description_bn || ''
    }));

    // Map store settings
    let storeSettings: Partial<StoreSettings> | undefined;
    if (setRes.data) {
      const s = setRes.data;
      storeSettings = {
        storeNameEn: s.store_name_en,
        storeNameBn: s.store_name_bn,
        taglineEn: s.tagline_en,
        taglineBn: s.tagline_bn,
        contactEmail: s.contact_email,
        contactPhone: s.contact_phone,
        whatsappNumber: s.whatsapp_number,
        addressEn: s.address_en,
        addressBn: s.address_bn,
        openingHoursEn: s.opening_hours_en,
        openingHoursBn: s.opening_hours_bn,
        defaultDeliveryFee: Number(s.default_delivery_fee),
        defaultFreeDeliveryThreshold: Number(s.default_free_delivery_threshold),
        heroHeadlineEn: s.hero_headline_en,
        heroHeadlineBn: s.hero_headline_bn,
        heroSubheadlineEn: s.hero_subheadline_en,
        heroSubheadlineBn: s.hero_subheadline_bn,
        announcementTextEn: s.announcement_text_en,
        announcementTextBn: s.announcement_text_bn,
        announcementActive: s.announcement_active ?? true
      };
    }

    return {
      success: true,
      message: `Fetched ${products.length} products and ${categories.length} categories from Supabase!`,
      data: {
        categories: categories.length > 0 ? categories : undefined,
        products: products.length > 0 ? products : undefined,
        deliveryAreas: deliveryAreas.length > 0 ? deliveryAreas : undefined,
        deliverySlots: deliverySlots.length > 0 ? deliverySlots : undefined,
        coupons: coupons.length > 0 ? coupons : undefined,
        storeSettings
      }
    };
  } catch (err: any) {
    console.error('Supabase Fetch Error:', err);
    return {
      success: false,
      message: err.message || 'Failed to fetch data from Supabase.'
    };
  }
}

// Granular real-time sync mutations for multi-device live consistency
export async function supabaseUpsertProduct(product: Product): Promise<{ success: boolean; error?: string }> {
  try {
    const row = {
      id: product.id,
      sku: product.sku,
      name_en: product.nameEn,
      name_bn: product.nameBn,
      slug: product.slug,
      brand: product.brand,
      category_id: product.categoryId,
      subcategory_id: product.subcategoryId || null,
      description_en: product.descriptionEn || '',
      description_bn: product.descriptionBn || '',
      pack_size: product.packSize,
      unit: product.unit || 'kg',
      selling_price: product.sellingPrice,
      original_price: product.originalPrice,
      stock_quantity: product.stockQuantity,
      low_stock_threshold: product.lowStockThreshold || 10,
      is_vegetarian: product.isVegetarian ?? true,
      ingredients_en: product.ingredientsEn || null,
      ingredients_bn: product.ingredientsBn || null,
      manufacturer: product.manufacturer || null,
      expiry_notice_en: product.expiryNoticeEn || null,
      expiry_notice_bn: product.expiryNoticeBn || null,
      storage_instructions_en: product.storageInstructionsEn || null,
      storage_instructions_bn: product.storageInstructionsBn || null,
      images: product.images,
      is_published: product.isPublished ?? true,
      is_featured: product.isFeatured ?? false,
      is_best_seller: product.isBestSeller ?? false,
      sales_count: product.salesCount || 0,
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from('products').upsert(row, { onConflict: 'id' });
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Supabase upsert product error:', err);
    return { success: false, error: err.message };
  }
}

export async function supabaseDeleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Supabase delete product error:', err);
    return { success: false, error: err.message };
  }
}

export async function supabaseUpsertCategory(category: Category, displayOrder = 1): Promise<{ success: boolean; error?: string }> {
  try {
    const catRow = {
      id: category.id,
      name_en: category.nameEn,
      name_bn: category.nameBn,
      slug: category.slug,
      description_en: category.descriptionEn || null,
      description_bn: category.descriptionBn || null,
      icon: category.icon || 'Layers',
      image: category.image,
      display_order: displayOrder,
      is_active: category.isActive ?? true,
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from('categories').upsert(catRow, { onConflict: 'id' });
    if (error) throw error;

    // Subcategories if any
    if (category.subcategories && category.subcategories.length > 0) {
      const subcatRows = category.subcategories.map(s => ({
        id: s.id,
        category_id: category.id,
        name_en: s.nameEn,
        name_bn: s.nameBn,
        slug: s.slug
      }));
      await supabase.from('subcategories').upsert(subcatRows, { onConflict: 'id' });
    }
    return { success: true };
  } catch (err: any) {
    console.error('Supabase upsert category error:', err);
    return { success: false, error: err.message };
  }
}

export async function supabaseDeleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Supabase delete category error:', err);
    return { success: false, error: err.message };
  }
}

export async function supabaseUpsertDeliveryArea(area: DeliveryArea): Promise<{ success: boolean; error?: string }> {
  try {
    const row = {
      id: area.id,
      pin_code: area.pinCode,
      area_name_en: area.areaNameEn,
      area_name_bn: area.areaNameBn,
      district: area.district,
      delivery_fee: area.deliveryFee,
      min_order_amount: area.minOrderAmount,
      free_delivery_threshold: area.freeDeliveryThreshold,
      estimated_window_en: area.estimatedWindowEn,
      estimated_window_bn: area.estimatedWindowBn,
      is_cod_available: area.isCodAvailable ?? true,
      is_active: area.isActive ?? true
    };
    const { error } = await supabase.from('delivery_areas').upsert(row, { onConflict: 'id' });
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Supabase upsert delivery area error:', err);
    return { success: false, error: err.message };
  }
}

export async function supabaseDeleteDeliveryArea(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('delivery_areas').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Supabase delete delivery area error:', err);
    return { success: false, error: err.message };
  }
}

export async function supabaseUpsertDeliverySlot(slot: DeliverySlot): Promise<{ success: boolean; error?: string }> {
  try {
    const row = {
      id: slot.id,
      time_range_en: slot.timeRangeEn,
      time_range_bn: slot.timeRangeBn,
      cutoff_hour: slot.cutoffHour,
      capacity: slot.capacity,
      booked_count: slot.bookedCount || 0,
      is_active: slot.isActive ?? true
    };
    const { error } = await supabase.from('delivery_slots').upsert(row, { onConflict: 'id' });
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Supabase upsert delivery slot error:', err);
    return { success: false, error: err.message };
  }
}

export async function supabaseUpsertCoupon(coupon: Coupon): Promise<{ success: boolean; error?: string }> {
  try {
    const row = {
      id: coupon.id,
      code: coupon.code,
      discount_type: coupon.discountType,
      discount_value: coupon.discountValue,
      min_order_value: coupon.minOrderValue,
      max_discount: coupon.maxDiscount || null,
      expiry_date: coupon.expiryDate,
      usage_limit: coupon.usageLimit || 1000,
      used_count: coupon.usedCount || 0,
      first_order_only: coupon.firstOrderOnly ?? false,
      is_active: coupon.isActive ?? true,
      description_en: coupon.descriptionEn || '',
      description_bn: coupon.descriptionBn || ''
    };
    const { error } = await supabase.from('coupons').upsert(row, { onConflict: 'id' });
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Supabase upsert coupon error:', err);
    return { success: false, error: err.message };
  }
}

export async function supabaseDeleteCoupon(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Supabase delete coupon error:', err);
    return { success: false, error: err.message };
  }
}

export async function supabaseUpdateStoreSettings(settings: StoreSettings): Promise<{ success: boolean; error?: string }> {
  try {
    const row = {
      id: 'primary',
      store_name_en: settings.storeNameEn,
      store_name_bn: settings.storeNameBn,
      tagline_en: settings.taglineEn,
      tagline_bn: settings.taglineBn,
      contact_email: settings.contactEmail,
      contact_phone: settings.contactPhone,
      whatsapp_number: settings.whatsappNumber,
      address_en: settings.addressEn,
      address_bn: settings.addressBn,
      opening_hours_en: settings.openingHoursEn,
      opening_hours_bn: settings.openingHoursBn,
      default_delivery_fee: settings.defaultDeliveryFee,
      default_free_delivery_threshold: settings.defaultFreeDeliveryThreshold,
      hero_headline_en: settings.heroHeadlineEn,
      hero_headline_bn: settings.heroHeadlineBn,
      hero_subheadline_en: settings.heroSubheadlineEn,
      hero_subheadline_bn: settings.heroSubheadlineBn,
      announcement_text_en: settings.announcementTextEn,
      announcement_text_bn: settings.announcementTextBn,
      announcement_active: settings.announcementActive ?? true,
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from('store_settings').upsert(row, { onConflict: 'id' });
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Supabase update store settings error:', err);
    return { success: false, error: err.message };
  }
}

export async function supabaseSaveOrder(order: any): Promise<{ success: boolean; error?: string }> {
  try {
    const row = {
      id: order.id,
      order_number: order.orderNumber,
      user_id: order.userId || 'guest',
      customer_name: order.customerSnapshot?.name || order.deliveryAddress?.name || 'Customer',
      customer_email: order.customerSnapshot?.email || 'customer@bangalirbazar.com',
      customer_mobile: order.customerSnapshot?.mobile || order.deliveryAddress?.mobile || '',
      address_line: order.deliveryAddress?.addressLine || '',
      locality: order.deliveryAddress?.locality || '',
      landmark: order.deliveryAddress?.landmark || null,
      pin_code: order.deliveryAddress?.pinCode || '',
      subtotal: order.subtotal,
      discount: order.discount || 0,
      coupon_code: order.couponCode || null,
      delivery_fee: order.deliveryFee || 0,
      tax: order.tax || 0,
      total: order.total,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus || 'Pending',
      order_status: order.orderStatus || 'Order Placed',
      delivery_date: order.deliveryDate,
      delivery_slot: order.deliverySlot,
      delivery_person_name: order.deliveryPerson?.name || null,
      delivery_person_phone: order.deliveryPerson?.phone || null,
      notes: order.notes || null,
      created_at: order.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from('orders').upsert(row, { onConflict: 'id' });
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Supabase save order error:', err);
    return { success: false, error: err.message };
  }
}

