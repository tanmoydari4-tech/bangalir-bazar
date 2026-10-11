import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { Phone, MessageCircle, Clock, ShieldCheck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { storeSettings } = useStore();
  const { language } = useLanguage();

  if (!storeSettings.announcementActive) return null;

  const announcement = language === 'bn' ? storeSettings.announcementTextBn : storeSettings.announcementTextEn;

  return (
    <div className="bg-[#176B45] text-white text-xs py-2 px-4 border-b border-[#145a3a]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left font-medium">
          <span className="bg-[#FFD166] text-[#252B27] text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
            OFFER
          </span>
          <span className="line-clamp-1">{announcement}</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-green-100 shrink-0">
          <div className="hidden md:flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#FFD166]" />
            <span>{language === 'bn' ? storeSettings.openingHoursBn : storeSettings.openingHoursEn}</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${storeSettings.contactPhone}`}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#FFD166]" />
              <span>{storeSettings.contactPhone}</span>
            </a>
            <span className="text-green-300/40">|</span>
            <a
              href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-200 hover:text-white transition-colors"
            >
              <MessageCircle className="w-3 h-3 text-[#25D366]" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
