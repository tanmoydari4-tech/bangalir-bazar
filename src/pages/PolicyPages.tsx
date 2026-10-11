import React from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Truck, RotateCcw, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

interface PolicyPageProps {
  pageType: 'about' | 'faq' | 'shipping-policy' | 'return-policy' | 'cancellation-policy' | 'privacy-policy' | 'terms-conditions';
  onNavigate: (page: string) => void;
}

export const PolicyPages: React.FC<PolicyPageProps> = ({ pageType, onNavigate }) => {
  const { storeSettings } = useStore();
  const { language } = useLanguage();

  const renderContent = () => {
    switch (pageType) {
      case 'about':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              About Bangalir Bazar
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              <strong>Bangalir Bazar</strong> is dedicated to delivering fresh, authentic groceries, pantry essentials, farm produce, and household necessities directly to Bengali households with speed, transparency, and uncompromised quality.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 bg-green-50 rounded-2xl border border-green-200 space-y-1">
                <h4 className="font-bold text-xs text-[#176B45]">Direct Farm Sourcing</h4>
                <p className="text-xs text-gray-600">Fresh Jyoti potatoes, onions, tomatoes, and greens sourced from local West Bengal agricultural belts.</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                <h4 className="font-bold text-xs text-amber-800">Authentic Flavors</h4>
                <p className="text-xs text-gray-600">Pure cold-pressed mustard oil, panch phoron spices, aromatic basmati, and unpolished lentils.</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <h4 className="font-bold text-xs text-emerald-800">Customer First</h4>
                <p className="text-xs text-gray-600">Doorstep return guarantee, exact weight assurance, and courteous delivery personnel.</p>
              </div>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Frequently Asked Questions (FAQ)
            </h1>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1 text-xs">
                <h4 className="font-bold text-gray-900 text-sm">How do I check if you deliver to my address?</h4>
                <p className="text-gray-600">You can enter your 6-digit PIN code in our delivery location checker located on the top header or the homepage. We currently service Salt Lake, New Town, Gariahat, Jadavpur, and Central Kolkata.</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1 text-xs">
                <h4 className="font-bold text-gray-900 text-sm">What is the minimum order value for Free Delivery?</h4>
                <p className="text-gray-600">Orders above ₹499 qualify for 100% Free Delivery. For smaller orders, a standard nominal delivery charge of ₹25 - ₹29 applies depending on your zone.</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1 text-xs">
                <h4 className="font-bold text-gray-900 text-sm">What payment methods are supported?</h4>
                <p className="text-gray-600">We accept Razorpay online payments, UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, Net Banking, and Cash on Delivery (COD).</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-1 text-xs">
                <h4 className="font-bold text-gray-900 text-sm">What if a vegetable or item is damaged or not fresh?</h4>
                <p className="text-gray-600">We offer a no-questions-asked doorstep return policy. You can reject the item with our delivery executive or report it via our Contact form for an instant refund.</p>
              </div>
            </div>
          </div>
        );

      case 'shipping-policy':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Shipping & Delivery Policy
            </h1>
            <div className="prose text-xs sm:text-sm text-gray-600 space-y-3 leading-relaxed">
              <p>At Bangalir Bazar, our fulfillment centers operate 7 days a week from 06:30 AM to 10:30 PM.</p>
              <h3 className="font-bold text-gray-900 text-sm">1. Delivery Time Slots</h3>
              <p>Customers can choose between multiple scheduled slots:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Early Morning: 07:00 AM – 10:00 AM</li>
                <li>Late Morning: 10:00 AM – 01:00 PM</li>
                <li>Evening: 04:00 PM – 07:00 PM</li>
                <li>Night: 07:00 PM – 10:00 PM</li>
              </ul>
              <h3 className="font-bold text-gray-900 text-sm">2. Quality Packing</h3>
              <p>Perishables like milk, eggs, and fresh greens are packed in temperature-compliant, food-safe insulated crates.</p>
            </div>
          </div>
        );

      case 'return-policy':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Return & Refund Policy
            </h1>
            <div className="prose text-xs sm:text-sm text-gray-600 space-y-3 leading-relaxed">
              <p>We take pride in delivering the highest grade groceries. If you are not completely satisfied, our return process is fast and seamless.</p>
              <h3 className="font-bold text-gray-900 text-sm">1. Doorstep Inspection</h3>
              <p>Inspect fresh produce and dairy at the time of delivery. You can return any item directly to the delivery partner.</p>
              <h3 className="font-bold text-gray-900 text-sm">2. Refund Timeline</h3>
              <p>Refunds for online orders (UPI, Card, NetBanking) are credited back within 2-4 business hours. Cash on delivery orders are refunded via instant UPI transfer or store wallet credit.</p>
            </div>
          </div>
        );

      case 'cancellation-policy':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Cancellation Policy
            </h1>
            <div className="prose text-xs sm:text-sm text-gray-600 space-y-3 leading-relaxed">
              <p>Orders can be cancelled free of charge anytime before they transition to the "Packed" or "Out for Delivery" state.</p>
              <p>To cancel an order, navigate to <strong>My Orders → Track Order → Cancel Order</strong> or contact our fulfillment desk via WhatsApp.</p>
            </div>
          </div>
        );

      case 'privacy-policy':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Privacy Policy
            </h1>
            <div className="prose text-xs sm:text-sm text-gray-600 space-y-3 leading-relaxed">
              <p>Your privacy is important to us. Bangalir Bazar collects customer name, phone number, and delivery address solely for fulfilling orders and communicating order status updates.</p>
              <p>We do not sell, rent, or trade your personal data. Payment details (CVV, passwords, PINs) are processed strictly through RBI-authorized payment aggregators and are never stored on our servers.</p>
            </div>
          </div>
        );

      case 'terms-conditions':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Terms and Conditions
            </h1>
            <div className="prose text-xs sm:text-sm text-gray-600 space-y-3 leading-relaxed">
              <p>By placing an order on Bangalir Bazar, you agree to comply with our store terms. Product prices declared are inclusive of all applicable statutory taxes.</p>
              <p>Weights declared on packaged items correspond to manufacturers' net contents. For produce with natural moisture variation, weights are measured accurately during morning packing.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="bg-white rounded-3xl border border-[#E5EAE5] p-6 sm:p-10 shadow-sm">
        {renderContent()}
      </div>
    </div>
  );
};
