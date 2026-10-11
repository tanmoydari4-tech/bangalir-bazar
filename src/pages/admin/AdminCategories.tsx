import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { Category } from '../../types';
import { Plus, Edit2, Trash2, Layers, Check, X } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore();
  const { language } = useLanguage();

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialForm = {
    nameEn: '',
    nameBn: '',
    slug: '',
    icon: 'Layers',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
    order: categories.length + 1,
    isActive: true,
    subcategories: [
      { id: 'sub-1', nameEn: 'General', nameBn: 'সাধারণ', slug: 'general' }
    ]
  };

  const [form, setForm] = useState(initialForm);

  const openCreateModal = () => {
    setForm(initialForm);
    setEditingId(null);
    setModalMode('create');
  };

  const openEditModal = (c: Category) => {
    setForm({
      nameEn: c.nameEn,
      nameBn: c.nameBn,
      slug: c.slug,
      icon: c.icon,
      image: c.image,
      order: c.order,
      isActive: c.isActive,
      subcategories: c.subcategories || []
    });
    setEditingId(c.id);
    setModalMode('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nameEn || !form.nameBn) return;

    const slug = form.slug || form.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (modalMode === 'create') {
      addCategory({ ...form, slug });
    } else if (modalMode === 'edit' && editingId) {
      updateCategory(editingId, { ...form, slug });
    }

    setModalMode(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Product Categories</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure storefront category tiles, nested subcategories, and display order
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#176B45] hover:bg-[#125436] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => {
          const productCount = products.filter(p => p.categoryId === c.id).length;

          return (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-[#E5EAE5] p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <img
                  src={c.image}
                  alt={c.nameEn}
                  className="w-16 h-16 rounded-2xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-gray-900 truncate">{c.nameEn}</h3>
                  <h4 className="text-xs text-gray-500 font-bengali truncate">{c.nameBn}</h4>
                  <div className="text-[11px] text-[#176B45] font-semibold mt-1">
                    {productCount} items listed
                  </div>
                </div>
              </div>

              {/* Subcategories preview */}
              <div className="bg-[#F7F9F5] p-3 rounded-2xl border border-[#E5EAE5] text-[11px] space-y-1">
                <span className="font-bold text-gray-700 block uppercase text-[10px]">
                  Subcategories ({c.subcategories.length}):
                </span>
                <p className="text-gray-600 line-clamp-1">
                  {c.subcategories.map(s => s.nameEn).join(', ')}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  c.isActive ? 'bg-green-100 text-[#176B45]' : 'bg-gray-100 text-gray-500'
                }`}>
                  {c.isActive ? 'Active' : 'Disabled'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(c)}
                    className="p-1.5 text-gray-600 hover:text-[#176B45] hover:bg-green-50 rounded-lg"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete category "${c.nameEn}"?`)) {
                        deleteCategory(c.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden my-8 animate-in fade-in zoom-in-95">
            <div className="bg-[#176B45] text-white p-5 flex items-center justify-between">
              <h3 className="font-extrabold text-base">
                {modalMode === 'create' ? 'Add New Category' : 'Edit Category'}
              </h3>
              <button onClick={() => setModalMode(null)} className="p-1 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={form.nameEn}
                    onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Name (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={form.nameBn}
                    onChange={(e) => setForm({ ...form, nameBn: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Category Image URL *</label>
                <input
                  type="url"
                  required
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="accent-[#176B45]"
                />
                <label htmlFor="catActive" className="text-gray-700 font-semibold cursor-pointer">
                  Display actively on customer navigation
                </label>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 border rounded-xl font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#176B45] text-white font-bold rounded-xl hover:bg-[#125436]"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
