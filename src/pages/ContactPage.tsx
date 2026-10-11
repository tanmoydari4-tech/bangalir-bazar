import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { CustomerEnquiry } from '../types';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  CheckCircle2,
  Send,
  HelpCircle
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { storeSettings, submitEnquiry, currentUser } = useStore();
  const { t, language } = useLanguage();

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    mobile: currentUser?.mobile || '',
    orderNumber: '',
    category: 'Product Enquiry' as CustomerEnquiry['category'],
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    submitEnquiry(form);
    setSubmitted(true);
    setForm({
      name: '',
      email: '',
      mobile: '',
      orderNumber: '',
      category: 'Product Enquiry',
      message: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black text-[#252B27]">
          {t('contactUs')}
        </h1>
        <p className="text-xs sm:text-sm text-[#6B746D]">
          {t('contactSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Information & WhatsApp Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E5EAE5] p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="font-extrabold text-base text-gray-900 pb-3 border-b border-gray-100">
              Customer Support Desk
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-green-50 text-[#176B45] rounded-xl shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t('storeAddress')}</h4>
                  <p className="text-gray-600 mt-0.5 leading-relaxed">
                    {language === 'bn' ? storeSettings.addressBn : storeSettings.addressEn}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-green-50 text-[#176B45] rounded-xl shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{t('customerCarePhone')}</h4>
                  <a href={`tel:${storeSettings.contactPhone}`} className="text-gray-700 hover:text-[#176B45] font-semibold mt-0.5 block">
                    {storeSettings.contactPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-green-50 text-[#176B45] rounded-xl shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Email Address</h4>
                  <a href={`mailto:${storeSettings.contactEmail}`} className="text-gray-700 hover:text-[#176B45] font-semibold mt-0.5 block">
                    {storeSettings.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-green-50 text-[#176B45] rounded-xl shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Support Hours</h4>
                  <p className="text-gray-600 mt-0.5">
                    {language === 'bn' ? storeSettings.openingHoursBn : storeSettings.openingHoursEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="p-5 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-[#128C7E] font-bold text-xs">
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Live Chat</span>
              </div>
              <p className="text-xs text-gray-600">
                Need instant updates on delivery status or item substitution? Chat directly with our fulfillment manager.
              </p>
              <a
                href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#1fae54] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp Chat</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Form: Submit Enquiry */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E5EAE5] p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="font-extrabold text-base text-gray-900 pb-3 border-b border-gray-100">
            Submit an Enquiry / Ticket
          </h2>

          {submitted ? (
            <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900">{t('enquirySentSuccess')}</h3>
              <p className="text-xs text-emerald-700">
                Our support team will respond to your registered email address within 2 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 bg-[#176B45] text-white rounded-xl text-xs font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Tanmoy Dari"
                    className="w-full p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176B45]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="tanmoy@example.com"
                    className="w-full p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176B45]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Mobile Number (Optional)</label>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    placeholder="9830123456"
                    className="w-full p-2.5 border rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#176B45]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Order Number (Optional)</label>
                  <input
                    type="text"
                    value={form.orderNumber}
                    onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                    placeholder="e.g. BB-2026-8819"
                    className="w-full p-2.5 border rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#176B45]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">{t('enquiryCategory')} *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                  className="w-full p-2.5 border rounded-xl font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-[#176B45]"
                >
                  <option value="Product Enquiry">Product Enquiry</option>
                  <option value="Order Status">Order Status & Tracking</option>
                  <option value="Delivery Issue">Delivery Delay or PIN Code</option>
                  <option value="Payment Issue">Payment & Refund</option>
                  <option value="Return or Refund">Doorstep Return or Quality Issue</option>
                  <option value="General Support">General Feedback & Suggestions</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">{t('message')} *</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we assist you today? Please share details..."
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176B45]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#176B45] hover:bg-[#125436] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{t('sendMessage')}</span>
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
};
