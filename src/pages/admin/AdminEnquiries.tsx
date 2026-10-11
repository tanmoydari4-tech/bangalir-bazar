import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { HelpCircle, Mail, Phone, Calendar, CheckCircle2, Clock } from 'lucide-react';

export const AdminEnquiries: React.FC = () => {
  const { customerEnquiries, updateEnquiryStatus } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Customer Support Enquiries</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Tickets submitted via the Contact Us form (product queries, returns, delivery delays)
        </p>
      </div>

      <div className="space-y-4">
        {customerEnquiries.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E5EAE5] text-xs text-gray-500">
            No customer enquiries submitted yet.
          </div>
        ) : (
          customerEnquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-white rounded-3xl border border-[#E5EAE5] p-5 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-gray-900">{enq.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-800 rounded-full">
                      {enq.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {enq.email} {enq.mobile && `• ${enq.mobile}`} {enq.orderNumber && `• Order: #${enq.orderNumber}`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    enq.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : enq.status === 'In Progress'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {enq.status}
                  </span>

                  <select
                    value={enq.status}
                    onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as any)}
                    className="p-1 border rounded-lg text-xs bg-white text-gray-700 font-semibold"
                  >
                    <option value="New">Mark New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed bg-[#F7F9F5] p-3 rounded-2xl border border-[#E5EAE5]">
                "{enq.message}"
              </p>

              <div className="text-[10px] text-gray-400">
                Submitted on {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
