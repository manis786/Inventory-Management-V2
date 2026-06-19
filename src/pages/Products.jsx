import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal'; // Apna path check karlena, agr ui folder mein hai tou components/ui/Modal likhna

export default function Products() {
  // context se products extract kar rahe hain, default khali array set kiya taake undefined na aaye
  const { products = [], fetchProducts } = useApp(); 
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Tumhare Mongoose Model ke hisaab se puri fields
  const defaultForm = {
    id: '', name: '', brand: '', categoryId: '', 
    costPrice: '', salePrice: '', stock: 0, minStock: 10, barcode: ''
  };
  
  const [formData, setFormData] = useState(defaultForm);

  // Component load hotay hi data fetch karega
  useEffect(() => {
    if (typeof fetchProducts === 'function') {
      fetchProducts();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/products/${formData.id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/products', formData);
      }
      
      if (typeof fetchProducts === 'function') await fetchProducts(); 
      setModalOpen(false);
      setEditingProduct(null);
      setFormData(defaultForm);
    } catch (err) {
      console.error("Save Error:", err.response?.data || err);
      alert(err.response?.data?.message || "Error saving product. Check console.");
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData(defaultForm);
    }
    setModalOpen(true);
  };

  // Safe check taake ".map is not a function" ka error na aaye
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800">Manage Products</h1>
        <Button onClick={() => openModal()}>+ Add New Product</Button>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-bold text-slate-600">ID</th>
              <th className="p-4 text-sm font-bold text-slate-600">Name</th>
              <th className="p-4 text-sm font-bold text-slate-600">Stock</th>
              <th className="p-4 text-sm font-bold text-slate-600">Price (Sale)</th>
              <th className="p-4 text-sm font-bold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {safeProducts.length > 0 ? (
              safeProducts.map((p) => (
                <tr key={p.id || p._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 text-sm">{p.id}</td>
                  <td className="p-4 text-sm font-medium">{p.name}</td>
                  <td className="p-4 text-sm">{p.stock}</td>
                  <td className="p-4 text-sm">{p.salePrice}</td>
                  <td className="p-4 text-sm">
                    <Button onClick={() => openModal(p)}>Edit</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">
                  No products found. Add a new product to see it here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal & Form Section */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editingProduct ? "Edit Product" : "Add New Product"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Product ID" value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})} required disabled={!!editingProduct} />
            <Input label="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Brand" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} />
            <Input label="Category ID" value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Cost Price" type="number" value={formData.costPrice} onChange={(e) => setFormData({...formData, costPrice: Number(e.target.value)})} required />
            <Input label="Sale Price" type="number" value={formData.salePrice} onChange={(e) => setFormData({...formData, salePrice: Number(e.target.value)})} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Stock" type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} />
            <Input label="Min Stock" type="number" value={formData.minStock} onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})} />
          </div>

          <Input label="Barcode" value={formData.barcode} onChange={(e) => setFormData({...formData, barcode: e.target.value})} />
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" onClick={() => setModalOpen(false)} className="bg-slate-200 text-slate-800 hover:bg-slate-300">Cancel</Button>
            <Button type="submit">Save Product</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}