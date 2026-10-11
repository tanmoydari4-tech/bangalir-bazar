import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { Phone, MessageCircle, Clock } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { storeSettings } = useStore();
  const { language } = useLanguage();

  if (!storeSettings.announcementActive) return null;

  const announcement = language === 'bn' ? storeSettings.announcementTextBn : storeSettings.announcementTextEn;

  return (
    <div className="bg-[#176B45] text-white text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-[#145a3a] select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Offer Tag + Announcement Text (Auto-adjusts, never overlaps or breaks) */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="shrink-0 bg-[#FFD166] text-[#252B27] text-[10px] uppercase font-black px-2 py-0.5 rounded-full shadow-xs tracking-wide">
            OFFER
          </span>
          <span className="truncate text-[11px] sm:text-xs font-medium text-emerald-50 leading-tight">
            {announcement}
          </span>
        </div>

        {/* Right: Contact, WhatsApp & Hours */}
        <div className="flex items-center gap-1.5 sm:gap-4 text-[11px] text-green-100 shrink-0">
          {/* Store Timings (hidden on small screens to prevent crowding) */}
          <div className="hidden lg:flex items-center gap-1.5 text-emerald-100">
            <Clock className="w-3.5 h-3.5 text-[#FFD166] shrink-0" />
            <span className="truncate max-w-[200px]">
              {language === 'bn' ? storeSettings.openingHoursBn : storeSettings.openingHoursEn}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Phone Call Link */}
            <a
              href={`tel:${storeSettings.contactPhone}`}
              className="flex items-center gap-1 hover:text-white transition-colors bg-white/10 sm:bg-transparent px-2 py-1 sm:p-0 rounded-lg text-[10px] sm:text-[11px]"
              title={`Call: ${storeSettings.contactPhone}`}
              aria-label="Call store"
            >
              <Phone className="w-3 h-3 text-[#FFD166] shrink-0" />
              <span className="hidden sm:inline font-medium">{storeSettings.contactPhone}</span>
            </a>

            <span className="text-green-300/40 hidden sm:inline">|</span>

            {/* WhatsApp Link */}
            <a
              href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-200 hover:text-white transition-colors bg-white/10 sm:bg-transparent px-2 py-1 sm:p-0 rounded-lg text-[10px] sm:text-[11px] font-semibold"
              title="Chat on WhatsApp"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-3 h-3 text-[#25D366] shrink-0" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
