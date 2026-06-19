import React, { useState } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Categories() {
  // AppContext se 'categories' aur 'fetchCategories' le rahe hain
  const { categories, fetchCategories } = useApp();
  const [name, setName] = useState('');

  // Nayi category add karne ka logic
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await axios.post('http://localhost:5000/api/categories', { 
        name, 
        id: name.toLowerCase().replace(/\s+/g, '-') // Auto-slug generation
      });
      setName(''); // Input clear karo
      fetchCategories(); // List refresh karo taake nayi category foran dikhe
    } catch (err) {
      console.error("Error adding category:", err);
      alert("Category add karne mein error aaya.");
    }
  };

  // Category delete karne ka logic
  const handleDelete = async (id) => {
    if (window.confirm("Kya aap waqai is category ko delete karna chahte hain?")) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/${id}`);
        fetchCategories(); // List refresh karo
      } catch (err) {
        console.error("Error deleting category:", err);
        alert("Delete karne mein error aaya.");
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Categories</h1>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="bg-white p-4 rounded-lg shadow-sm border flex gap-4">
        <Input 
          placeholder="New Category Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <Button type="submit">Add Category</Button>
      </form>

      {/* Categories Table */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Yahan 'categories' ka array map hoga */}
            {categories && categories.length > 0 ? (
              categories.map(cat => (
                <tr key={cat._id} className="border-b">
                  <td className="p-4">{cat.name}</td>
                  <td className="p-4">
                    <Button 
                      onClick={() => handleDelete(cat._id)} 
                      className="bg-red-500 text-white px-3 py-1 text-xs"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-4 text-center text-slate-500">
                  Koi category nahi mili.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Categories;