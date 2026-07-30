import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

export default function Products() {
  const { products = [], fetchProducts, categories = [] } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');


  // Pagination 
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(10);
  
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
        // console.log("Payload bheja ja raha hai:", formData);
        await axios.put(`${API_BASE_URL}/products/${editingProduct._id}`, formData);
      } else {
        // Add
        await axios.post(`${API_BASE_URL}/products`, formData);
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
        await axios.delete(`${API_BASE_URL}/products/${id}`);
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
const getCategoryName = (catId) => {
  const category = categories.find(c => c._id === catId);
  return category ? category.name : "Uncategorized";}


  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Manage Products</h1>
        <Button onClick={() => openModal()}>+ Add New Product</Button>
      </div>
      

      

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <input
          type="text"
          placeholder="Search by Name, ID, or Barcode..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4 text-sm font-bold text-slate-600 dark:text-slate-400">SKU</th>
              <th className="p-4 text-sm font-bold text-slate-600 dark:text-slate-400">Name</th>
              <th className="p-4 text-sm font-bold text-slate-600 dark:text-slate-400">Brand</th>
              <th className="p-4 text-sm font-bold text-slate-600 dark:text-slate-400">Category</th>
              <th className="p-4 text-sm font-bold text-slate-600 dark:text-slate-400">Price</th>
              <th className="p-4 text-sm font-bold text-slate-600 dark:text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
  {filteredProducts
  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  .map((p) => {
    // 1. Category ka naam nikalne ka simple tarika
    // Agar p.category object hai toh uska ID lo, warna string ID use karo
const productCatId = typeof p.category === 'object' ? p.category?._id : p.category;    
    // 2. Categories list mein se naam dhoondo
const foundCategory = categories.find(c => String(c._id) === String(productCatId));
  return (
    <tr key={p._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
      <td className="p-4 text-sm font-mono text-slate-600 dark:text-slate-400">{p.id}</td>
      <td className="p-4 text-sm font-medium text-slate-800 dark:text-slate-200">{p.name}</td>
      <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{p.brand || '-'}</td>
      
      {/* Yahan fix apply ho raha hai */}
      <td className="p-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
        {foundCategory ? foundCategory.name : "Uncategorized"}
      </td>

      <td className="p-4 text-sm font-medium text-slate-800 dark:text-slate-200">Rs. {p.salePrice}</td>
      <td className="p-4 text-sm space-x-2">
        <Button onClick={() => openModal(p)} variant="secondary" size="sm">Edit</Button>
        <Button onClick={() => handleDelete(p._id)} variant="danger" size="sm">Delete</Button>
      </td>
    </tr>
  );
  })}
</tbody>
        </table>
      </div>
 <div className="flex justify-center items-center gap-2 mt-8 pb-8">
  {/* Prev Button */}
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(prev => prev - 1)}
    className="w-10 h-10 border border-slate-200 dark:border-slate-700 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
  > &lt; </button>

  {(() => {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const pageNumbers = [];
    
    for (let i = 1; i <= totalPages; i++) {
      // Logic: 1, ..., current-2, current-1, current, current+1, current+2, ..., last
      if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
        pageNumbers.push(i);
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        pageNumbers.push('...');
      }
    }

    return pageNumbers.map((p, idx) => (
      p === '...' ? (
        <span key={idx} className="px-2 text-slate-400">...</span>
      ) : (
        <button
          key={idx}
          onClick={() => setCurrentPage(p)}
          className={`w-10 h-10 border rounded transition-all cursor-pointer ${
            currentPage === p 
              ? 'bg-indigo-600 text-white border-indigo-600' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-500'
          }`}
        >
          {p}
        </button>
      )
    ));
  })()}

  {/* Next Button */}
  <button
    disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
    onClick={() => setCurrentPage(prev => prev + 1)}
    className="w-10 h-10 border border-slate-200 dark:border-slate-700 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
  > &gt; </button>
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
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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