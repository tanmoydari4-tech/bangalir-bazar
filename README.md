# Bangalir Bazar - Premium Grocery E-Commerce Platform

A complete, responsive, production-ready grocery e-commerce web application inspired by leading online grocery retail platforms, featuring an original Bengali & Indian brand identity, bilingual interface, comprehensive admin fulfillment dashboard, local PIN-code logistics, and Indian payment integration.

---

## 🌟 Key Features

### 1. Customer Storefront
- **Bilingual Interface**: Seamless instant toggle between **English** and **বাংলা (Bengali)** across all navigation, categories, product names, order tracking, and forms.
- **PIN Code Delivery Area Checker**: Enter 6-digit PIN code to verify serviceability, delivery fees, minimum order amounts, and estimated delivery windows (e.g. Salt Lake, New Town, Gariahat, Jadavpur, BBD Bagh).
- **Rich Grocery Catalogue**: Farm-fresh Jyoti potatoes, crisp red onions, tomatoes, pure Kachi Ghani mustard oil, India Gate Rozzana basmati rice, Aashirvaad chakki fresh atta, Tata Sampann yellow moong dal, authentic Bengali Panch Phoron, Tata Tea Gold, Amul pasteurized butter and milk, farm-fresh brown eggs, Vim liquid, and Dettol soap.
- **Smart Product Cards**: Dual-language title, pack size (kg, g, L, ml, pcs), MRP with genuine savings discount percentage, veg/non-veg emblem, live stock indicator, and inline quantity increment/decrement controls.
- **Advanced Filtering & Search**: Real-time autocomplete suggestions dropdown, filter by Category, Subcategory, Brand, Price Range slider, In-stock toggle, Dietary preferences, and sorting (Recommended, Price Low-High, Price High-Low, Best Sellers, New Arrivals).
- **Product Details Page**: High-resolution image gallery, pack size selector, PIN availability check, declared ingredients, manufacturer information, storage instructions, expiry notices, and related items.
- **Smart Shopping Basket**: Slide-over Mini Cart Drawer + dedicated `/cart` page with dynamic **Free Delivery progress bar** (e.g., "Add ₹120 more for FREE Delivery"), coupon code validation with active offers (`WELCOME10`, `FRESH50`, `BAZAR100`).
- **Flexible Scheduled Delivery Checkout**: Multi-step checkout with saved customer addresses, custom address entry with instant PIN code serviceability validation, and selection of delivery time slots (e.g. 07:00-10:00 AM, 10:00 AM-01:00 PM, 04:00-07:00 PM, 07:00-10:00 PM).
- **Indian Payment Methods**: Online Payment (Razorpay simulation with Cards/NetBanking/UPI), Direct UPI QR Code scanning, and Cash on Delivery (COD).
- **Order Tracking & Retail Invoice**: Interactive 5-stage fulfillment stepper (`Order Placed` ➔ `Confirmed` ➔ `Packed` ➔ `Out for Delivery` ➔ `Delivered`), assigned delivery partner details, and printable GST-compliant retail grocery invoice slip.
- **Customer Account & Wishlist**: Order history timeline, saved address book, quick reorder, profile management, and saved wishlist.
- **Customer Care & Floating WhatsApp Button**: Direct WhatsApp chat integration with store fulfillment desk, contact enquiry submission categorized by product, order, delivery, payment, or return issues.

---

### 2. Administrator Operations Portal (Route `/admin`)
- **Operations Dashboard**: Real-time net sales (excluding cancellations), pending orders counter, active products, low-stock alerts, out-of-stock items, recent order stream, and top-selling grocery items.
- **Product Management**: Full CRUD (Add, Edit, Delete), image URL management, SKU code, brand, pack size, unit, MRP, selling price, stock quantity, low-stock threshold, declared ingredients, vegetarian toggle, featured on homepage toggle, and publish/hide switch.
- **Category Management**: Configure storefront category tiles, nested subcategories, upload category imagery, and reorder.
- **Inventory & Stock Ledger**: View current stock, quick restock/adjust modal with audited reasons (`Restock`, `Correction`, `Damaged`, `Return`, `Sale`), notes, and complete movement audit history.
- **Order Management & Fulfillment**: Search orders by ID or customer, filter by status, transition order stages (`Order Placed`, `Confirmed`, `Packed`, `Out for Delivery`, `Delivered`, `Cancelled`), assign rider name & phone, and print customer invoices.
- **Customer Accounts**: View customer list, orders count, lifetime spend, email, phone, and primary delivery addresses.
- **Coupon & Promotions Engine**: Create percentage or fixed discount promo codes with minimum order values, maximum discount caps, and expiry dates.
- **Delivery Areas & PIN Codes**: Configure supported 6-digit PIN codes, locality names (EN & BN), delivery charges, free delivery thresholds, and time slots capacity.
- **Store Settings & Homepage CMS**: Live editable brand name, tagline, logo, phone, WhatsApp number, support email, warehouse address, top announcement bar, and homepage hero texts.
- **Customer Support Tickets**: Review customer enquiries submitted from the contact form with status updates (`New`, `In Progress`, `Resolved`).
- **Sales Analytics Reports**: Visual breakdowns of realized revenue, order pipeline distribution, payment channels adoption, and top velocity grocery items.

---

## 🚀 Demo Accounts & Quick Credentials

For testing and demonstration, pre-configured accounts are readily available:

- **Customer Demo**:
  - Name: Tanmoy Dari
  - Email: `tanmoydari4@gmail.com`
  - Mobile: `9830123456`
  - Address: Flat 4B, Sunflower Enclave, Street 14, Sector V, Salt Lake, Kolkata 700091

- **Store Administrator Demo**:
  - Email: `admin@bangalirbazar.com`
  - Instant toggle button on the login screen and header.

- **Available Promo Codes**:
  - `WELCOME10`: 10% OFF on first grocery basket above ₹299
  - `FRESH50`: Flat ₹50 OFF on fresh groceries above ₹499
  - `BAZAR100`: Flat ₹100 OFF on pantry bulk orders above ₹999

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide Icons, Plus Jakarta Sans & Noto Sans Bengali typography
- **Animations**: Canvas Confetti for celebratory checkouts
- **Persistence & State**: Reactive local storage state synchronization with transaction-safe inventory adjustments
- **Security**: Strict `firestore.rules` and `storage.rules` included for production Firebase deployment
