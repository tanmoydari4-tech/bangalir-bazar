import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface PinCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PinCodeModal: React.FC<PinCodeModalProps> = ({ isOpen, onClose }) => {
  const {
    activePinCode,
    setActivePinCode,
    deliveryAreas,
    checkPinAvailability,
    selectedDeliveryArea
  } = useStore();
  const { t, language } = useLanguage();

  const [inputPin, setInputPin] = useState(activePinCode);
  const [feedback, setFeedback] = useState<{
    checked: boolean;
    isAvailable: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleCheckAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = inputPin.trim();

    if (!/^\d{6}$/.test(pin)) {
      setFeedback({
        checked: true,
        isAvailable: false,
        message: language === 'bn' ? 'দয়া করে একটি সঠিক ৬ সংখ্যার পিন কোড দিন।' : 'Please enter a valid 6-digit PIN code.'
      });
      return;
    }

    const res = checkPinAvailability(pin);
    if (res.isAvailable && res.area) {
      setActivePinCode(pin);
      setFeedback({
        checked: true,
        isAvailable: true,
        message: language === 'bn'
          ? `অভিনন্দন! ${res.area.areaNameBn} এলাকায় ডেলিভারি উপলব্ধ।`
          : `Great! Delivery is available in ${res.area.areaNameEn}.`
      });
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setFeedback({
        checked: true,
        isAvailable: false,
        message: t('pinUnavailable')
      });
    }
  };

  const handleSelectPredefined = (pin: string) => {
    setActivePinCode(pin);
    setInputPin(pin);
    setFeedback({
      checked: true,
      isAvailable: true,
      message: language === 'bn' ? 'এলাকা সফলভাবে পরিবর্তিত হয়েছে।' : 'Delivery location updated successfully.'
    });
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#176B45] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/15 rounded-lg">
              <MapPin className="w-5 h-5 text-[#FFD166]" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">{t('selectPinCode')}</h3>
              <p className="text-xs text-green-100 mt-0.5">
                {language === 'bn' ? 'হোম ডেলিভারির জন্য পিন কোড যাচাই করুন' : 'Verify delivery slots & fees in your locality'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <form onSubmit={handleCheckAndSave} className="space-y-3">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {language === 'bn' ? 'পিন কোড লিখুন' : 'Enter 6-Digit PIN Code'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={inputPin}
                onChange={(e) => {
                  setInputPin(e.target.value.replace(/[^0-9]/g, ''));
                  setFeedback(null);
                }}
                placeholder="700091"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176B45] focus:border-transparent font-mono text-base font-semibold tracking-wider text-gray-800"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#176B45] text-white font-semibold rounded-xl hover:bg-[#125436] transition-colors shadow-sm"
              >
                {t('checkBtn')}
              </button>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2.5 ${
                  feedback.isAvailable
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                }`}
              >
                {feedback.isAvailable ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}
          </form>

          {/* Currently Active Area Info */}
          {selectedDeliveryArea && (
            <div className="bg-[#F7F9F5] p-3.5 rounded-xl border border-[#E5EAE5] text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold text-[#176B45]">
                <span>
                  {language === 'bn' ? selectedDeliveryArea.areaNameBn : selectedDeliveryArea.areaNameEn} ({selectedDeliveryArea.pinCode})
                </span>
                <span className="text-[11px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  {selectedDeliveryArea.district}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 text-[11px] pt-1 border-t border-gray-200/60">
                <span>{language === 'bn' ? 'ডেলিভারি চার্জ:' : 'Delivery:'} ₹{selectedDeliveryArea.deliveryFee}</span>
                <span>{language === 'bn' ? 'ফ্রি ডেলিভারি:' : 'Free over:'} ₹{selectedDeliveryArea.freeDeliveryThreshold}</span>
              </div>
            </div>
          )}

          {/* Common Serviced Localities */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#4FA86B]" />
              <span>{language === 'bn' ? 'জনপ্রিয় ডেলিভারি জোন' : 'Popular Serviced Zones'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {deliveryAreas.filter(a => a.isActive).map((area) => (
                <button
                  key={area.id}
                  onClick={() => handleSelectPredefined(area.pinCode)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                    area.pinCode === activePinCode
                      ? 'border-[#176B45] bg-green-50/70 text-[#176B45] font-semibold'
                      : 'border-gray-200 hover:border-[#4FA86B] hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="font-medium truncate">
                    {language === 'bn' ? area.areaNameBn : area.areaNameEn}
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                    PIN: {area.pinCode}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
