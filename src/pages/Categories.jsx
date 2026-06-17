import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { formatPKR } from '../data/store';
import { PlusCircle, Edit2, Trash2, FolderPlus, Layers } from 'lucide-react';

export function Categories() {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    addToast
  } = useApp();

  // Category modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '📦',
    color: '#6366f1'
  });

  // Delete confirm dialog states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState(null);

  // Compute category details
  const categoryStats = categories.map((cat) => {
    const catProds = products.filter(p => p.categoryId === cat.id);
    const count = catProds.length;
    const value = catProds.reduce((sum, p) => sum + (p.costPrice * p.stock), 0);
    return {
      ...cat,
      productCount: count,
      stockValue: value
    };
  });

  const handleOpenAdd = () => {
    setEditingCat(null);
    setFormData({
      name: '',
      icon: '📦',
      color: '#6366f1'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name,
      icon: cat.icon || '📦',
      color: cat.color || '#6366f1'
    });
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Category name is required', 'error');
      return;
    }

    if (editingCat) {
      updateCategory({
        ...editingCat,
        name: formData.name,
        icon: formData.icon,
        color: formData.color
      });
    } else {
      addCategory({
        name: formData.name,
        icon: formData.icon,
        color: formData.color
      });
    }
    setModalOpen(false);
  };

  const handleOpenDelete = (cat) => {
    // Check if category has products
    const prodsCount = products.filter(p => p.categoryId === cat.id).length;
    if (prodsCount > 0) {
      addToast(`Cannot delete category with active products! (${prodsCount} products remaining)`, 'error');
      return;
    }
    setCatToDelete(cat);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (catToDelete) {
      deleteCategory(catToDelete.id);
      setDeleteConfirmOpen(false);
      setCatToDelete(null);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-805">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-855 dark:text-white tracking-tight">
            Product Categories ({categories.length})
          </h1>
          <p className="text-xs text-slate-405 dark:text-slate-500">
            Define categories, set code designations, and check category-wise stock value.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={FolderPlus}
          onClick={handleOpenAdd}
        >
          Add New Category
        </Button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {categoryStats.map((cat) => (
          <Card key={cat.id} className="relative group overflow-hidden" hoverEffect>
            {/* Color stripe at top */}
            <div className="h-1.5 w-full" style={{ backgroundColor: cat.color || '#6366f1' }} />
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-xl shadow-2xs border border-slate-150 dark:border-slate-800">
                    {cat.icon || '📦'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-805 dark:text-slate-100">
                      {cat.name}
                    </h3>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      Code: {cat.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto"
                    icon={Edit2}
                    onClick={() => handleOpenEdit(cat)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto text-rose-500 hover:text-rose-700"
                    icon={Trash2}
                    onClick={() => handleOpenDelete(cat)}
                  />
                </div>
              </div>

              {/* Stats counts */}
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 dark:border-slate-800/60 pt-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400">Products</span>
                  <span className="font-black text-slate-800 dark:text-slate-205">{cat.productCount} lines</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-slate-400">Stock Asset</span>
                  <span className="font-black text-indigo-650 dark:text-indigo-400">{formatPKR(cat.stockValue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FORM MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCat ? 'Edit Category' : 'Create New Category'}
        size="sm"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Spices & Masala"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Emoji Icon representation"
            placeholder="e.g. 🌶️"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          />

          <Input
            label="Category Brand Theme Color (HEX)"
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingCat ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE DIALOG */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        description={`Are you sure you want to delete category "${catToDelete?.name || ''}"? This action cannot be reversed.`}
      />
    </div>
  );
}
export default Categories;
