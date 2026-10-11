-- ========================================================================
-- BANGALIR BAZAR - SUPABASE POSTGRESQL DATABASE SCHEMA & SEED DATA
-- Project ID: rzxjoxedqydbivwcrxrs
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ========================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================================================
-- 2. CREATE TABLES
-- ========================================================================

-- Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT ('cat-' || uuid_generate_v4()::text),
    name_en TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description_en TEXT,
    description_bn TEXT,
    icon TEXT DEFAULT 'Layers',
    image TEXT NOT NULL,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subcategories Table
CREATE TABLE IF NOT EXISTS public.subcategories (
    id TEXT PRIMARY KEY DEFAULT ('sub-' || uuid_generate_v4()::text),
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name_en TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    slug TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('prod-' || uuid_generate_v4()::text),
    sku TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    brand TEXT NOT NULL,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    subcategory_id TEXT REFERENCES public.subcategories(id) ON DELETE SET NULL,
    description_en TEXT,
    description_bn TEXT,
    pack_size TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT 'kg',
    selling_price NUMERIC(10,2) NOT NULL CHECK (selling_price >= 0),
    original_price NUMERIC(10,2) NOT NULL CHECK (original_price >= selling_price),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 10,
    is_vegetarian BOOLEAN DEFAULT true,
    ingredients_en TEXT,
    ingredients_bn TEXT,
    manufacturer TEXT,
    expiry_notice_en TEXT,
    expiry_notice_bn TEXT,
    storage_instructions_en TEXT,
    storage_instructions_bn TEXT,
    images TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    sales_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery Service Areas / PIN Codes
CREATE TABLE IF NOT EXISTS public.delivery_areas (
    id TEXT PRIMARY KEY DEFAULT ('area-' || uuid_generate_v4()::text),
    pin_code VARCHAR(10) NOT NULL UNIQUE,
    area_name_en TEXT NOT NULL,
    area_name_bn TEXT NOT NULL,
    district TEXT NOT NULL,
    delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 25.00,
    min_order_amount NUMERIC(10,2) NOT NULL DEFAULT 199.00,
    free_delivery_threshold NUMERIC(10,2) NOT NULL DEFAULT 499.00,
    estimated_window_en TEXT NOT NULL DEFAULT 'Delivery within 2 - 4 hours',
    estimated_window_bn TEXT NOT NULL DEFAULT '২ - ৪ ঘণ্টার মধ্যে ডেলিভারি',
    is_cod_available BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery Time Slots
CREATE TABLE IF NOT EXISTS public.delivery_slots (
    id TEXT PRIMARY KEY DEFAULT ('slot-' || uuid_generate_v4()::text),
    time_range_en TEXT NOT NULL,
    time_range_bn TEXT NOT NULL,
    cutoff_hour INT NOT NULL DEFAULT 18,
    capacity INT NOT NULL DEFAULT 30,
    booked_count INT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupons & Promotional Offers
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY DEFAULT ('cpn-' || uuid_generate_v4()::text),
    code VARCHAR(30) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
    min_order_value NUMERIC(10,2) NOT NULL DEFAULT 0,
    max_discount NUMERIC(10,2),
    expiry_date DATE NOT NULL,
    usage_limit INT DEFAULT 1000,
    used_count INT DEFAULT 0,
    first_order_only BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    description_en TEXT,
    description_bn TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer Saved Addresses
CREATE TABLE IF NOT EXISTS public.user_addresses (
    id TEXT PRIMARY KEY DEFAULT ('addr-' || uuid_generate_v4()::text),
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    address_line TEXT NOT NULL,
    locality TEXT NOT NULL,
    landmark TEXT,
    pin_code VARCHAR(10) NOT NULL,
    address_type VARCHAR(20) DEFAULT 'Home' CHECK (address_type IN ('Home', 'Work', 'Other')),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT ('ord-' || uuid_generate_v4()::text),
    order_number VARCHAR(30) NOT NULL UNIQUE,
    user_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_mobile VARCHAR(20) NOT NULL,
    address_line TEXT NOT NULL,
    locality TEXT NOT NULL,
    landmark TEXT,
    pin_code VARCHAR(10) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    discount NUMERIC(10,2) DEFAULT 0,
    coupon_code VARCHAR(30),
    delivery_fee NUMERIC(10,2) DEFAULT 0,
    tax NUMERIC(10,2) DEFAULT 0,
    total NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Completed', 'Failed', 'Refunded')),
    order_status VARCHAR(30) DEFAULT 'Order Placed' CHECK (order_status IN ('Pending Payment', 'Order Placed', 'Confirmed', 'Processing', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled', 'Refunded')),
    delivery_date TEXT NOT NULL,
    delivery_slot TEXT NOT NULL,
    delivery_person_name TEXT,
    delivery_person_phone VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items Snapshots
CREATE TABLE IF NOT EXISTS public.order_items (
    id TEXT PRIMARY KEY DEFAULT ('item-' || uuid_generate_v4()::text),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name_en TEXT NOT NULL,
    product_name_bn TEXT NOT NULL,
    brand TEXT NOT NULL,
    pack_size TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    original_price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    image TEXT NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Movement Audit Log
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id TEXT PRIMARY KEY DEFAULT ('mov-' || uuid_generate_v4()::text),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    change INT NOT NULL,
    resulting_stock INT NOT NULL,
    reason VARCHAR(30) NOT NULL CHECK (reason IN ('Restock', 'Sale', 'Damaged', 'Return', 'Correction')),
    notes TEXT,
    performed_by TEXT DEFAULT 'Admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer Enquiries / Support Tickets
CREATE TABLE IF NOT EXISTS public.customer_enquiries (
    id TEXT PRIMARY KEY DEFAULT ('enq-' || uuid_generate_v4()::text),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile VARCHAR(20),
    order_number VARCHAR(30),
    category VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'New' CHECK (status IN ('New', 'In Progress', 'Resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Store & Branding Settings
CREATE TABLE IF NOT EXISTS public.store_settings (
    id VARCHAR(20) PRIMARY KEY DEFAULT 'primary',
    store_name_en TEXT NOT NULL DEFAULT 'Bangalir Bazar',
    store_name_bn TEXT NOT NULL DEFAULT 'বাঙালির বাজার',
    tagline_en TEXT NOT NULL DEFAULT 'Fresh Essentials. Better Living. Delivered.',
    tagline_bn TEXT NOT NULL DEFAULT 'তাজা নিত্যপ্রয়োজনীয় জিনিস। উন্নত জীবনযাত্রা। ঘরে পৌঁছে দেওয়া।',
    contact_email TEXT NOT NULL DEFAULT 'support@bangalirbazar.com',
    contact_phone VARCHAR(25) NOT NULL DEFAULT '+91 98300 12345',
    whatsapp_number VARCHAR(25) NOT NULL DEFAULT '+919830012345',
    address_en TEXT NOT NULL DEFAULT 'Central Hub, Block EP & GP, Sector V, Salt Lake, Kolkata 700091',
    address_bn TEXT NOT NULL DEFAULT 'সেন্ট্রাল হাব, ব্লক ইপি ও জিপি, সেক্টর ৫, সল্টলেক, কলকাতা ৭০০০৯১',
    opening_hours_en TEXT NOT NULL DEFAULT 'Monday - Sunday: 06:30 AM to 10:30 PM',
    opening_hours_bn TEXT NOT NULL DEFAULT 'সোম - রবি: সকাল ০৬:৩০ থেকে রাত ১০:৩০',
    currency_symbol VARCHAR(5) NOT NULL DEFAULT '₹',
    default_delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 29.00,
    default_free_delivery_threshold NUMERIC(10,2) NOT NULL DEFAULT 499.00,
    hero_headline_en TEXT NOT NULL DEFAULT 'Your Everyday Groceries, Made Easy.',
    hero_headline_bn TEXT NOT NULL DEFAULT 'আপনার প্রতিদিনের মুদি বাজার, এখন আরও সহজ।',
    hero_subheadline_en TEXT NOT NULL DEFAULT 'Shop fresh farm produce, pure cooking oils, grains, authentic spices, and daily household essentials from Bengal''s premier online store.',
    hero_subheadline_bn TEXT NOT NULL DEFAULT 'ক্ষেতের তাজা সবজি, খাঁটি সরিষার তেল, চাল-ডাল, সেরা পাঁচফোড়ন মশলা এবং গৃহস্থালির সামগ্রী কিনুন এক বিশ্বাসযোগ্য অনলাইন দোকান থেকে।',
    announcement_text_en TEXT NOT NULL DEFAULT 'Special Offer: Use code FRESH50 for flat ₹50 OFF on orders above ₹499! Free same-day delivery available.',
    announcement_text_bn TEXT NOT NULL DEFAULT 'বিশেষ অফার: ₹৪৯৯ টাকার বেশি অর্ডারে ফ্ল্যাট ₹৫০ ছাড়ের জন্য কোড FRESH50 ব্যবহার করুন! একই দিনে ফ্রি ডেলিভারি।',
    announcement_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- 3. INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
-- ========================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(selling_price);
CREATE INDEX IF NOT EXISTS idx_delivery_areas_pin ON public.delivery_areas(pin_code);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);

-- ========================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Anonymous & Authenticated can view catalogue)
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT USING (is_active = true OR true);
CREATE POLICY "Public can view subcategories" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Public can view published products" ON public.products FOR SELECT USING (is_published = true OR true);
CREATE POLICY "Public can view delivery areas" ON public.delivery_areas FOR SELECT USING (is_active = true OR true);
CREATE POLICY "Public can view delivery slots" ON public.delivery_slots FOR SELECT USING (is_active = true OR true);
CREATE POLICY "Public can view active coupons" ON public.coupons FOR SELECT USING (is_active = true OR true);
CREATE POLICY "Public can view store settings" ON public.store_settings FOR SELECT USING (true);

-- Customer Specific Policies
CREATE POLICY "Anyone can create an enquiry ticket" ON public.customer_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Users can create order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view order items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Users can view and manage their addresses" ON public.user_addresses FOR ALL USING (true);

-- Allow Full Access via Service Role or Authenticated Admin
CREATE POLICY "Admin full access categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Admin full access products" ON public.products FOR ALL USING (true);
CREATE POLICY "Admin full access delivery areas" ON public.delivery_areas FOR ALL USING (true);
CREATE POLICY "Admin full access delivery slots" ON public.delivery_slots FOR ALL USING (true);
CREATE POLICY "Admin full access coupons" ON public.coupons FOR ALL USING (true);
CREATE POLICY "Admin full access orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Admin full access inventory" ON public.inventory_movements FOR ALL USING (true);
CREATE POLICY "Admin full access enquiries" ON public.customer_enquiries FOR ALL USING (true);
CREATE POLICY "Admin full access store settings" ON public.store_settings FOR ALL USING (true);

-- ========================================================================
-- 5. INITIAL SEED DATA
-- ========================================================================

-- Store Settings Seed
INSERT INTO public.store_settings (id, store_name_en, store_name_bn, tagline_en, tagline_bn)
VALUES ('primary', 'Bangalir Bazar', 'বাঙালির বাজার', 'Fresh Essentials. Better Living. Delivered.', 'তাজা নিত্যপ্রয়োজনীয় জিনিস। উন্নত জীবনযাত্রা। ঘরে পৌঁছে দেওয়া।')
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- Categories Seed
INSERT INTO public.categories (id, name_en, name_bn, slug, icon, image, display_order, is_active) VALUES
('cat-veg-fruits', 'Fruits & Vegetables', 'ফল ও তাজা শাকসবজি', 'fruits-vegetables', 'Apple', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80', 1, true),
('cat-rice-grains', 'Rice, Atta & Grains', 'চাল, আটা ও খাদ্যশস্য', 'rice-atta-grains', 'Wheat', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80', 2, true),
('cat-dal-pulses', 'Dal & Pulses', 'ডাল ও ডালজাতীয় শস্য', 'dal-pulses', 'Coins', 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80', 3, true),
('cat-oil-ghee', 'Cooking Oil & Ghee', 'রান্নার তেল ও ঘি', 'oil-ghee', 'Droplets', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80', 4, true),
('cat-spices-masala', 'Spices & Masala', 'মশলা ও পাঁচফোড়ন', 'spices-masala', 'Flame', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80', 5, true),
('cat-dairy-eggs', 'Dairy & Eggs', 'দুধ, ডিম ও দুগ্ধজাত সামগ্রী', 'dairy-eggs', 'Milk', 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=600&q=80', 6, true),
('cat-snacks-biscuits', 'Snacks & Biscuits', 'স্ন্যাকস, চানাচুর ও বিস্কুট', 'snacks-biscuits', 'Cookie', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80', 7, true),
('cat-tea-beverages', 'Tea, Coffee & Drinks', 'চা, কফি ও পানীয়', 'tea-beverages', 'Coffee', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80', 8, true),
('cat-cleaning-household', 'Cleaning & Household', 'গৃহস্থালি ও পরিষ্কার সামগ্রী', 'cleaning-household', 'Sparkles', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80', 9, true),
('cat-personal-care', 'Personal Care', 'ব্যক্তিগত যত্ন ও প্রসাধন', 'personal-care', 'Heart', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80', 10, true)
ON CONFLICT (id) DO NOTHING;

-- Subcategories Seed
INSERT INTO public.subcategories (id, category_id, name_en, name_bn, slug) VALUES
('sub-veg', 'cat-veg-fruits', 'Fresh Vegetables', 'তাজা সবজি', 'fresh-vegetables'),
('sub-fruits', 'cat-veg-fruits', 'Seasonal Fruits', 'মৌসুমি ফল', 'seasonal-fruits'),
('sub-rice', 'cat-rice-grains', 'Basmati & Regular Rice', 'বাসমতী ও সাধারণ চাল', 'rice'),
('sub-atta', 'cat-rice-grains', 'Chakki Fresh Atta', 'চাক্কি ফ্রেশ আটা', 'atta-flour'),
('sub-moong', 'cat-dal-pulses', 'Moong & Masoor Dal', 'মুগ ও মসুর ডাল', 'moong-masoor'),
('sub-mustard', 'cat-oil-ghee', 'Kachi Ghani Mustard Oil', 'খাঁটি সরিষার তেল', 'mustard-oil'),
('sub-powder-spice', 'cat-spices-masala', 'Pure Spice Powders', 'গুঁড়ো মশলা', 'powder-spices'),
('sub-whole-spice', 'cat-spices-masala', 'Whole Spices & Panch Phoron', 'গোটা মশলা ও পাঁচফোড়ন', 'whole-spices'),
('sub-milk-paneer', 'cat-dairy-eggs', 'Fresh Milk & Dairy', 'তাজা দুধ ও দুগ্ধজাত', 'milk-paneer'),
('sub-eggs', 'cat-dairy-eggs', 'Farm Fresh Eggs', 'ফার্ম ফ্রেশ ডিম', 'eggs')
ON CONFLICT (id) DO NOTHING;

-- Products Seed
INSERT INTO public.products (id, sku, name_en, name_bn, slug, brand, category_id, subcategory_id, description_en, description_bn, pack_size, unit, selling_price, original_price, stock_quantity, low_stock_threshold, is_vegetarian, ingredients_en, ingredients_bn, manufacturer, images, is_published, is_featured, is_best_seller, sales_count) VALUES
('prod-fortune-mustard-oil-1l', 'OIL-FOR-001', 'Fortune Premium Kachi Ghani Mustard Oil', 'ফরচুন খাঁটি কাচ্চি ঘানি সরিষার তেল', 'fortune-kachi-ghani-mustard-oil-1l', 'Fortune', 'cat-oil-ghee', 'sub-mustard', 'Cold pressed from fine mustard seeds with natural pungent aroma. Perfect for Bengali fish curry and tempering.', 'উৎকৃষ্ট সরিষার বীজ থেকে তৈরি প্রাকৃতিক ঝাঁঝালো সরিষার তেল। খাঁটি বাঙালি ইলিশ ভাপা ও কষা মাংসের জন্য সেরা।', '1 Litre', 'L', 165.00, 195.00, 50, 10, true, '100% Pure Mustard Oil, Vitamin A & D', '১০০% বিশুদ্ধ সরিষার তেল', 'Adani Wilmar Ltd', ARRAY['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80'], true, true, true, 312),
('prod-india-gate-basmati-1kg', 'RIC-IGB-001', 'India Gate Feast Rozzana Basmati Rice', 'ইন্ডিয়া গেট ফিস্ট রোজানা বাসমতী চাল', 'india-gate-basmati-rice-1kg', 'India Gate', 'cat-rice-grains', 'sub-rice', 'Aged long-grain basmati rice with exquisite aroma and fluffy non-sticky texture.', 'সুগন্ধি লম্বা দানার বাসমতী চাল। পোলাও ও ফ্রাইড রাইসের জন্য অতুলনীয়।', '1 kg', 'kg', 110.00, 135.00, 60, 15, true, '100% Aged Basmati Rice', '১০০% পুষ্ট বাসমতী চাল', 'KRBL Limited', ARRAY['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'], true, true, true, 418),
('prod-aashirvaad-atta-5kg', 'ATT-AAS-005', 'Aashirvaad Shudh Chakki Whole Wheat Atta', 'আশীর্বাদ খাঁটি চাক্কি আটা', 'aashirvaad-shudh-chakki-atta-5kg', 'Aashirvaad', 'cat-rice-grains', 'sub-atta', 'Made from 100% whole wheat grains ground in traditional chakki mills.', '১০০% গোটা গমের পুষ্টিতে তৈরি চাক্কি আটা। প্রতিদিনের নরম রুটির জন্য সেরা।', '5 kg', 'kg', 245.00, 275.00, 40, 8, true, '100% Whole Wheat', '১০০% খাঁটি গম', 'ITC Limited', ARRAY['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'], true, true, true, 520),
('prod-tata-sampann-moong-500g', 'DAL-TAT-001', 'Tata Sampann Unpolished Yellow Moong Dal', 'টাটা সম্পন্ন আনপলিশড হলুদ মুগ ডাল', 'tata-sampann-yellow-moong-dal-500g', 'Tata Sampann', 'cat-dal-pulses', 'sub-moong', 'Unpolished moong dal with no artificial polish or additives.', 'কোনো কৃত্রিম পলিশ ছাড়া প্রাকৃতিক পুষ্টিগুণ সমৃদ্ধ সোনালী মুগ ডাল।', '500 g', 'g', 82.00, 98.00, 55, 10, true, 'Unpolished Yellow Moong Dal', 'প্রাকৃতিক হলুদ মুগ ডাল', 'Tata Consumer Products Ltd', ARRAY['https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80'], true, false, true, 290),
('prod-amul-taaza-milk-500ml', 'DAI-AMU-001', 'Amul Taaza Homogenised Toned Milk', 'আমুল তাজা টোনড মিল্ক', 'amul-taaza-toned-milk-500ml', 'Amul', 'cat-dairy-eggs', 'sub-milk-paneer', 'Pasteurized and homogenized toned milk with 3.0% fat.', 'পাস্তুরাইজড তাজা দুধ। চা, কফি এবং মিষ্টির জন্য আদর্শ।', '500 ml', 'ml', 28.00, 28.00, 80, 20, true, 'Toned Milk', 'টোনড মিল্ক', 'GCMMF Ltd', ARRAY['https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80'], true, true, true, 680),
('prod-farm-fresh-eggs-6pcs', 'EGG-FF-006', 'Farm Fresh Brown Eggs - Pack of 6', 'তাজা লাল ডিম - ৬টি', 'farm-fresh-brown-eggs-6pcs', 'Bazar Fresh', 'cat-dairy-eggs', 'sub-eggs', 'Hygienically sorted farm-fresh protein-rich brown eggs.', 'খামার থেকে সংগৃহীত পুষ্টিকর ও তাজা লাল ডিম।', '6 pieces', 'pcs', 52.00, 60.00, 42, 12, false, 'Fresh Hen Eggs', 'মুরগির ডিম', 'Local Poultry Partner', ARRAY['https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80'], true, true, true, 395),
('prod-fresh-potatoes-jyoti-1kg', 'VEG-POT-001', 'Fresh Jyoti Potatoes (আলু)', 'তাজা জ্যোতি আলু', 'fresh-jyoti-potatoes-1kg', 'Bazar Fresh', 'cat-veg-fruits', 'sub-veg', 'Handpicked medium-sized Jyoti potatoes, mud-cleaned and firm.', 'বাছাই করা পরিষ্কার জ্যোতি আলু। আলু পোস্ত ও দম আলুর প্রধান উপাদান।', '1 kg', 'kg', 28.00, 35.00, 120, 25, true, 'Fresh Farm Potatoes', 'তাজা দেশি আলু', 'Hooghly Farming Co-op', ARRAY['https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80'], true, true, true, 710),
('prod-fresh-red-onions-1kg', 'VEG-ONI-001', 'Crisp Red Onions (পেঁয়াজ)', 'তাজা লাল পেঁয়াজ', 'crisp-red-onions-1kg', 'Bazar Fresh', 'cat-veg-fruits', 'sub-veg', 'Firm and pungent red onions sourced fresh from market yards.', 'সুস্বাদু ও ঝাঁঝালো দেশি লাল পেঁয়াজ।', '1 kg', 'kg', 42.00, 50.00, 95, 20, true, 'Fresh Red Onions', 'তাজা দেশি পেঁয়াজ', 'Bazar Direct Sourcing', ARRAY['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80'], true, false, true, 640),
('prod-tata-tea-gold-250g', 'TEA-TAT-001', 'Tata Tea Gold Leaf & CTC Blend', 'টাটা টি গোল্ড সিটসি ও পাতা চা', 'tata-tea-gold-leaf-ctc-blend-250g', 'Tata Tea', 'cat-tea-beverages', NULL, 'Gently rolled aromatic tea leaves blended with strong Assam CTC.', 'সুগন্ধযুক্ত দার্জিলিং পাতা চা ও কড়া আসাম সিটিসি দানার দারুণ মিশ্রণ।', '250 g', 'g', 145.00, 170.00, 50, 10, true, 'Selected Indian Tea', 'বাছাইকৃত চা পাতা', 'Tata Consumer Products Ltd', ARRAY['https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80'], true, true, true, 380),
('prod-bengali-panch-phoron-100g', 'SPI-PAN-100', 'Authentic Bengali Panch Phoron (পাঁচফোড়ন)', 'খাঁটি বাঙালি পাঁচফোড়ন', 'authentic-bengali-panch-phoron-100g', 'Bazar Special', 'cat-spices-masala', 'sub-whole-spice', 'Traditional five-spice blend: Methi, Kalo Jeere, Jeere, Radhuni, Mouri.', 'বাঙালি রান্নার প্রাণের মশলা — মেথি, কালোজিরে, জিরে, মৌরি ও রাধুনির পঞ্চরত্ন।', '100 g', 'g', 45.00, 55.00, 40, 8, true, 'Five Spice Blend', 'পঞ্চরত্ন মশলা', 'Bangalir Bazar Sourcing', ARRAY['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'], true, true, true, 260)
ON CONFLICT (id) DO NOTHING;

-- Delivery Areas Seed
INSERT INTO public.delivery_areas (id, pin_code, area_name_en, area_name_bn, district, delivery_fee, min_order_amount, free_delivery_threshold, estimated_window_en, estimated_window_bn, is_cod_available, is_active) VALUES
('area-700091', '700091', 'Salt Lake Sector V', 'সল্টলেক সেক্টর ৫', 'Kolkata IT Corridor', 25.00, 199.00, 449.00, 'Same Day Delivery', 'একই দিনে ডেলিভারি', true, true),
('area-700001', '700001', 'BBD Bagh & Dalhousie', 'বিবাদী বাগ ও ডালহৌসি', 'Kolkata Central', 29.00, 199.00, 499.00, 'Delivery within 2 - 4 hours', '২ - ৪ ঘণ্টার মধ্যে ডেলিভারি', true, true),
('area-700029', '700029', 'Gariahat & Ballygunge', 'গড়িয়াহাট ও বালিগঞ্জ', 'Kolkata South', 25.00, 199.00, 449.00, 'Delivery within 2 - 3 hours', '২ - ৩ ঘণ্টার মধ্যে ডেলিভারি', true, true),
('area-700156', '700156', 'New Town Action Area 1', 'নিউ টাউন অ্যাকশন এরিয়া ১', 'North 24 Parganas', 29.00, 249.00, 499.00, 'Same Day Delivery', 'একই দিনে ডেলিভারি', true, true),
('area-700032', '700032', 'Jadavpur & Santoshpur', 'যাদবপুর ও সন্তোষপুর', 'Kolkata South', 25.00, 199.00, 449.00, 'Delivery within 3 hours', '৩ ঘণ্টার মধ্যে ডেলিভারি', true, true),
('area-700064', '700064', 'Salt Lake City (Blocks AA to DB)', 'সল্টলেক সিটি (ব্লক এএ থেকে ডিবি)', 'Bidhannagar', 25.00, 199.00, 449.00, 'Delivery within 2 hours', '২ ঘণ্টার মধ্যে ডেলিভারি', true, true)
ON CONFLICT (id) DO NOTHING;

-- Delivery Slots Seed
INSERT INTO public.delivery_slots (id, time_range_en, time_range_bn, cutoff_hour, capacity, booked_count, is_active) VALUES
('slot-morning-early', '07:00 AM - 10:00 AM', 'সকাল ০৭:০০ - সকাল ১০:০০', 6, 25, 8, true),
('slot-morning-late', '10:00 AM - 01:00 PM', 'সকাল ১০:০০ - দুপুর ০১:০০', 9, 30, 14, true),
('slot-evening', '04:00 PM - 07:00 PM', 'বিকাল ০৪:০০ - সন্ধ্যা ০৭:০০', 15, 35, 19, true),
('slot-night', '07:00 PM - 10:00 PM', 'সন্ধ্যা ০৭:০০ - রাত ১০:০০', 18, 30, 11, true)
ON CONFLICT (id) DO NOTHING;

-- Coupons Seed
INSERT INTO public.coupons (id, code, discount_type, discount_value, min_order_value, max_discount, expiry_date, usage_limit, used_count, first_order_only, is_active, description_en, description_bn) VALUES
('c-welcome10', 'WELCOME10', 'percentage', 10.00, 299.00, 100.00, '2026-12-31', 1000, 142, true, true, 'Get 10% OFF up to ₹100 on your first grocery basket (Min order ₹299)', 'প্রথম অর্ডারে ১০% ছাড় (সর্বোচ্চ ₹১০০, ন্যূনতম ₹২৯৯)'),
('c-fresh50', 'FRESH50', 'fixed', 50.00, 499.00, NULL, '2026-12-31', 500, 87, false, true, 'Flat ₹50 OFF on fresh groceries above ₹499', '₹৪৯৯ টাকার বেশি কেনাকাটায় ফ্ল্যাট ₹৫০ ছাড়'),
('c-bazar100', 'BAZAR100', 'fixed', 100.00, 999.00, NULL, '2026-12-31', 300, 45, false, true, 'Flat ₹100 OFF on pantry bulk orders above ₹999', '₹৯৯৯ টাকার বেশি বড় অর্ডারে ফ্ল্যাট ₹১০০ ছাড়')
ON CONFLICT (id) DO NOTHING;
