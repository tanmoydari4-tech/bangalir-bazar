import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { Product } from '../../types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Package,
  Sparkles
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const { language } = useLanguage();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const initialForm = {
    sku: '',
    nameEn: '',
    nameBn: '',
    slug: '',
    brand: '',
    categoryId: categories[0]?.id || '',
    packSize: '1 kg',
    unit: 'kg',
    sellingPrice: 100,
    originalPrice: 120,
    stockQuantity: 50,
    lowStockThreshold: 10,
    isVegetarian: true,
    descriptionEn: '',
    descriptionBn: '',
    ingredientsEn: '',
    ingredientsBn: '',
    manufacturer: '',
    expiryNoticeEn: '',
    storageInstructionsEn: '',
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'],
    isPublished: true,
    isFeatured: false,
    isBestSeller: false
  };

  const [form, setForm] = useState(initialForm);

  const filtered = products.filter(p => {
    if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.nameEn.toLowerCase().includes(q) ||
        p.nameBn.includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openCreateModal = () => {
    setForm(initialForm);
    setModalMode('create');
    setEditingProductId(null);
  };

  const openEditModal = (p: Product) => {
    setForm({
      sku: p.sku,
      nameEn: p.nameEn,
      nameBn: p.nameBn,
      slug: p.slug,
      brand: p.brand,
      categoryId: p.categoryId,
      packSize: p.packSize,
      unit: p.unit,
      sellingPrice: p.sellingPrice,
      originalPrice: p.originalPrice,
      stockQuantity: p.stockQuantity,
      lowStockThreshold: p.lowStockThreshold,
      isVegetarian: p.isVegetarian,
      descriptionEn: p.descriptionEn,
      descriptionBn: p.descriptionBn,
      ingredientsEn: p.ingredientsEn || '',
      ingredientsBn: p.ingredientsBn || '',
      manufacturer: p.manufacturer || '',
      expiryNoticeEn: p.expiryNoticeEn || '',
      storageInstructionsEn: p.storageInstructionsEn || '',
      images: p.images.length > 0 ? p.images : initialForm.images,
      isPublished: p.isPublished,
      isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller
    });
    setEditingProductId(p.id);
    setModalMode('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nameEn || !form.brand || !form.sellingPrice) return;

    const slug = form.slug || form.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (modalMode === 'create') {
      addProduct({
        ...form,
        slug
      });
    } else if (modalMode === 'edit' && editingProductId) {
      updateProduct(editingProductId, {
        ...form,
        slug
      });
    }

    setModalMode(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Grocery Catalogue Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Add, update pricing, manage stock, and toggle product visibility
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#176B45] hover:bg-[#125436] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EAE5] flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, brand, SKU..."
            className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 border rounded-xl text-xs font-semibold bg-white"
        >
          <option value="all">All Categories ({products.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{language === 'bn' ? c.nameBn : c.nameEn}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#E5EAE5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F5] border-b border-[#E5EAE5] text-gray-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Brand / SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Price</th>
                <th className="p-4 text-center">Stock</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => {
                const cat = categories.find(c => c.id === p.categoryId);
                const isOutOfStock = p.stockQuantity <= 0;
                const isLow = p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold;

                return (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-10 h-10 rounded-xl object-cover bg-gray-50 shrink-0" />
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1">{p.nameEn}</div>
                          <div className="text-[11px] text-gray-500 font-bengali line-clamp-1">{p.nameBn}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{p.packSize}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-gray-600">
                      <div className="font-semibold text-gray-900">{p.brand}</div>
                      <div className="font-mono text-[10px] text-gray-400">{p.sku}</div>
                    </td>

                    <td className="p-4 text-gray-600">
                      {cat ? (language === 'bn' ? cat.nameBn : cat.nameEn) : 'Unassigned'}
                    </td>

                    <td className="p-4 text-right">
                      <div className="font-black font-mono text-[#176B45]">₹{p.sellingPrice}</div>
                      {p.originalPrice > p.sellingPrice && (
                        <div className="text-[10px] text-gray-400 line-through">₹{p.originalPrice}</div>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded-full text-[11px] ${
                          isOutOfStock
                            ? 'bg-rose-100 text-rose-800'
                            : isLow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-green-100 text-[#176B45]'
                        }`}
                      >
                        {p.stockQuantity}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => updateProduct(p.id, { isPublished: !p.isPublished })}
                        className={`p-1.5 rounded-lg text-xs font-bold ${
                          p.isPublished
                            ? 'text-emerald-700 hover:bg-emerald-50'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={p.isPublished ? 'Published' : 'Hidden'}
                      >
                        {p.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </td>

                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-gray-600 hover:text-[#176B45] hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${p.nameEn}" from the store catalog?`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden my-8 animate-in fade-in zoom-in-95">
            <div className="bg-[#176B45] text-white p-5 flex items-center justify-between">
              <h3 className="font-extrabold text-base">
                {modalMode === 'create' ? 'Add New Grocery Product' : 'Edit Product Details'}
              </h3>
              <button onClick={() => setModalMode(null)} className="p-1 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Product Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={form.nameEn}
                    onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Product Name (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={form.nameBn}
                    onChange={(e) => setForm({ ...form, nameBn: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">SKU / Code *</label>
                  <input
                    type="text"
                    required
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Category *</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.nameEn}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Pack Size *</label>
                  <input
                    type="text"
                    required
                    value={form.packSize}
                    onChange={(e) => setForm({ ...form, packSize: e.target.value })}
                    placeholder="1 kg"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.sellingPrice}
                    onChange={(e) => setForm({ ...form, sellingPrice: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Original MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={form.stockQuantity}
                    onChange={(e) => setForm({ ...form, stockQuantity: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Image URL (Unsplash or direct CDN) *</label>
                <input
                  type="url"
                  required
                  value={form.images[0] || ''}
                  onChange={(e) => setForm({ ...form, images: [e.target.value] })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Description (English)</label>
                  <textarea
                    rows={2}
                    value={form.descriptionEn}
                    onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Description (বাংলা)</label>
                  <textarea
                    rows={2}
                    value={form.descriptionBn}
                    onChange={(e) => setForm({ ...form, descriptionBn: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Declared Ingredients</label>
                  <input
                    type="text"
                    value={form.ingredientsEn}
                    onChange={(e) => setForm({ ...form, ingredientsEn: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Manufacturer / Marketer</label>
                  <input
                    type="text"
                    value={form.manufacturer}
                    onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.isVegetarian}
                    onChange={(e) => setForm({ ...form, isVegetarian: e.target.checked })}
                    className="accent-[#176B45]"
                  />
                  <span>100% Vegetarian (Green Dot)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="accent-[#176B45]"
                  />
                  <span>Featured On Homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.isBestSeller}
                    onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
                    className="accent-[#176B45]"
                  />
                  <span>Best Seller Badge</span>
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
