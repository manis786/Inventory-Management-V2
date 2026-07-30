import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

export default function Categories() {
  const { categories, fetchCategories, products } = useApp();
  const [name, setName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  // Har category mein kitne products hain unka count
  const getProductCount = (categoryId) => {
    return products.filter(p => p.category === categoryId).length;
  };

  // Add aur Edit dono ke liye ek hi function
  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingCat) {
        // Edit/Update
        await axios.put(`${API_BASE_URL}/categories/${editingCat._id}`, { name });
      } else {
        // Add
        await axios.post(`${API_BASE_URL}/categories`, { name });
      }
      setName('');
      setEditingCat(null);
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert("Error saving category!");
    }
  };

  // Delete function
  const handleDelete = async (id) => {
    if (getProductCount(id) > 0) {
      alert("Is category mein products hain, pehle unhe hatayein!");
      return;
    }
    if (window.confirm("Delete karna chahte hain?")) {
      try {
        await axios.delete(`${API_BASE_URL}/categories/${id}`);
        fetchCategories();
      } catch (err) {
        alert("Delete error.");
      }
    }
  };

  // Edit button click logic
  const openEditModal = (cat) => {
    setEditingCat(cat);
    setName(cat.name);
    setModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Manage Categories</h1>
        <Button onClick={() => { setEditingCat(null); setName(''); setModalOpen(true); }}>
          + Add Category
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4 text-sm font-bold text-slate-600 dark:text-slate-400">Category Name</th>
              <th className="p-4 text-sm font-bold text-slate-600 dark:text-slate-400">Products Count</th>
              <th className="p-4 text-sm font-bold text-slate-600 dark:text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-4 text-sm font-medium text-slate-800 dark:text-slate-200">{cat.name}</td>
                <td className="p-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {getProductCount(cat._id)} Products
                </td>
                <td className="p-4 flex gap-2">
                  <Button onClick={() => openEditModal(cat)} variant="secondary" size="sm">Edit</Button>
                  <Button onClick={() => handleDelete(cat._id)} variant="danger" size="sm">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={modalOpen} 
        onClose={() => { setModalOpen(false); setEditingCat(null); }} 
        title={editingCat ? "Edit Category" : "Add New Category"}
      >
        <form onSubmit={handleSave} className="space-y-4 mt-4">
          <Input 
            label="Category Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <Button type="submit" className="w-full">{editingCat ? "Update" : "Save"}</Button>
        </form>
      </Modal>
    </div>
  );
}