import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

export default function Products() {
  const { products = [], fetchProducts, categories = [] } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form structure jo aapke MongoDB schema se match karta hai
  const defaultForm = {
    id: '', name: '', brand: '', category: '',
    costPrice: '', salePrice: '', stock: 0, minStock: 10, barcode: ''
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (typeof fetchProducts === 'function') fetchProducts();
  }, []);

  // CRUD: Save (Add/Update) Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update
        console.log("Payload bheja ja raha hai:", formData);
        await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, formData);
      } else {
        // Add
        await axios.post('http://localhost:5000/api/products', formData);
      }

      await fetchProducts();
      setModalOpen(false);
      setEditingProduct(null);
      setFormData(defaultForm);
    } catch (err) {
      console.error("Save Error:", err);
      alert("Error saving product. Check console.");
    }
  };

  // CRUD: Delete Logic
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        await fetchProducts();
      } catch (err) {
        console.error("Delete Error:", err);
        alert("Error deleting product!");
      }
    }
  };

const openModal = (product = null) => {
  if (product) {
    setEditingProduct(product);
    setFormData({
      id: product.id || '',
      name: product.name || '',
      brand: product.brand || '',
      // Yeh line sab se zaroori hai
      category: product.category?._id || product.category || '',
      costPrice: product.costPrice || '',
      salePrice: product.salePrice || '',
      stock: product.stock || 0,
      minStock: product.minStock || 10,
      barcode: product.barcode || ''
    });
  } else {
    setEditingProduct(null);
    setFormData(defaultForm);
  }
  setModalOpen(true);
};

  // Search Logic
  const filteredProducts = Array.isArray(products) ? products.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.barcode?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800">Manage Products</h1>
        <Button onClick={() => openModal()}>+ Add New Product</Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <input
          type="text"
          placeholder="Search by Name, ID, or Barcode..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-bold text-slate-600">SKU</th>
              <th className="p-4 text-sm font-bold text-slate-600">Name</th>
              <th className="p-4 text-sm font-bold text-slate-600">Brand</th>
              <th className="p-4 text-sm font-bold text-slate-600">Category</th>
              <th className="p-4 text-sm font-bold text-slate-600">Price</th>
              <th className="p-4 text-sm font-bold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 text-sm">{p.id}</td>
                <td className="p-4 text-sm font-medium">{p.name}</td>
                <td className="p-4 text-sm">{p.brand || '-'}</td>
                <td className="p-4 text-sm italic">
                  {/* Category Name Mapping */}
                  {categories.find(c => c._id === p.category)?.name || 
                    <span className="text-gray-400">Uncategorized</span>}
                </td>
                <td className="p-4 text-sm">{p.salePrice}</td>
                <td className="p-4 text-sm space-x-2">
                  <Button onClick={() => openModal(p)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 text-sm">Edit</Button>
                  <Button onClick={() => handleDelete(p._id)} className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 text-sm">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingProduct ? "Edit Product" : "Add New Product"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Product ID" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} required disabled={!!editingProduct} />
            <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
            
            {/* Category Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Cost Price" type="number" value={formData.costPrice} onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })} required />
            <Input label="Sale Price" type="number" value={formData.salePrice} onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} />
            <Input label="Min Stock" type="number" value={formData.minStock} onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })} />
          </div>

          <Input label="Barcode" value={formData.barcode} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" onClick={() => setModalOpen(false)} className="bg-slate-200 text-slate-800 hover:bg-slate-300">Cancel</Button>
            <Button type="submit">Save Product</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}