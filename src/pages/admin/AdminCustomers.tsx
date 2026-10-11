import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { Users, Search, Mail, Phone, ShoppingBag, MapPin } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { currentUser, orders } = useStore();
  const [search, setSearch] = useState('');

  // Extract unique customers from user & order records
  const registeredUsers = currentUser ? [currentUser] : [];

  const customerList = registeredUsers.map(u => {
    const userOrders = orders.filter(o => o.userId === u.id || o.customerSnapshot.email === u.email);
    const totalSpent = userOrders.filter(o => o.orderStatus !== 'Cancelled').reduce((s, o) => s + o.total, 0);

    return {
      ...u,
      orderCount: userOrders.length,
      totalSpent
    };
  });

  const filtered = customerList.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.mobile.includes(q);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Customer Accounts</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          View registered customer profiles, delivery addresses, and lifetime purchase totals
        </p>
      </div>

      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E5EAE5] flex items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or mobile..."
            className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white rounded-3xl border border-[#E5EAE5] p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-green-100 text-[#176B45] flex items-center justify-center font-black text-lg">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">{c.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-green-50 text-[#176B45] rounded-full uppercase">
                    {c.role}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-400 block font-semibold">Total Spent</span>
                <span className="font-mono font-black text-[#176B45] text-base">₹{c.totalSpent}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600 bg-[#F7F9F5] p-3.5 rounded-2xl border border-[#E5EAE5]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>{c.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-mono">{c.mobile}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                <span>{c.orderCount} Lifetime Orders</span>
              </div>
            </div>

            {c.addresses.length > 0 && (
              <div className="text-xs space-y-1">
                <span className="font-bold text-[10px] uppercase text-gray-400 block">Saved Primary Address:</span>
                <p className="text-gray-700 truncate">{c.addresses[0].addressLine}, {c.addresses[0].locality}</p>
                <p className="text-gray-500 font-mono text-[11px]">PIN: {c.addresses[0].pinCode}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
