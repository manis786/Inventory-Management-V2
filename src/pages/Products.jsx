import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { FileUpload } from '../components/shared/FileUpload';
import { StatusBadge } from '../components/shared/StatusBadge';
import { formatPKR } from '../data/store';
import {
  PlusCircle,
  Edit2,
  Trash2,
  Filter,
  FileSpreadsheet,
  Download,
  AlertOctagon,
  Search
} from 'lucide-react';

export function Products() {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    addToast
  } = useApp();

  // Search & Filtering State
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL');

  // Table Sort State
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Add / Edit Product Modals State
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    categoryId: '',
    costPrice: '',
    salePrice: '',
    stock: '',
    minStock: '',
    unit: 'Pack',
    barcode: '',
    image: '📦',
    expiryDate: ''
  });

  // Delete Confirm State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Bulk Import State
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Handle Sort Click
  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  // Status computation for products
  const getStockStatus = (stock, minStock) => {
    if (stock <= 0) return 'outofstock';
    if (stock <= minStock) return 'lowstock';
    return 'instock';
  };

  // Filter products list
  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.brand.toLowerCase().includes(search.toLowerCase()) ||
                          p.barcode === search;
    const matchesCat = catFilter === 'ALL' || p.categoryId === catFilter;

    const status = getStockStatus(p.stock, p.minStock);
    const matchesStock = stockFilter === 'ALL' ||
                         (stockFilter === 'INSTOCK' && status === 'instock') ||
                         (stockFilter === 'LOWSTOCK' && status === 'lowstock') ||
                         (stockFilter === 'OUTOFSTOCK' && status === 'outofstock');

    return matchesSearch && matchesCat && matchesStock;
  });

  // Sort products
  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortColumn];
    let bVal = b[sortColumn];

    if (sortColumn === 'stockStatus') {
      aVal = getStockStatus(a.stock, a.minStock);
      bVal = getStockStatus(b.stock, b.minStock);
    }

    if (typeof aVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    } else {
      return sortDirection === 'asc'
        ? (aVal || 0) - (bVal || 0)
        : (bVal || 0) - (aVal || 0);
    }
  });

  // Paginated products
  const totalItems = sorted.length;
  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: '',
      categoryId: categories[0]?.id || '',
      costPrice: '',
      salePrice: '',
      stock: '',
      minStock: '10',
      unit: 'Pack',
      barcode: `8900${Date.now().toString().slice(-8)}`,
      image: '📦',
      expiryDate: ''
    });
    setFormModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      categoryId: product.categoryId,
      costPrice: String(product.costPrice),
      salePrice: String(product.salePrice),
      stock: String(product.stock),
      minStock: String(product.minStock),
      unit: product.unit,
      barcode: product.barcode,
      image: product.image,
      expiryDate: product.expiryDate || ''
    });
    setFormModalOpen(true);
  };

  // Handle Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.categoryId) {
      addToast('Please fill out product name and category', 'error');
      return;
    }

    const categoryName = categories.find(c => c.id === formData.categoryId)?.name || 'Others';

    const productPayload = {
      name: formData.name,
      brand: formData.brand,
      categoryId: formData.categoryId,
      category: categoryName,
      costPrice: Number(formData.costPrice || 0),
      salePrice: Number(formData.salePrice || 0),
      stock: Number(formData.stock || 0),
      minStock: Number(formData.minStock || 10),
      unit: formData.unit,
      barcode: formData.barcode,
      image: formData.image,
      expiryDate: formData.expiryDate || null
    };

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...productPayload
      });
    } else {
      addProduct(productPayload);
    }
    setFormModalOpen(false);
  };

  // Open Delete dialog
  const handleOpenDelete = (product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  // Table Columns config
  const columns = [
    {
      key: 'image',
      label: '',
      sortable: false,
      className: 'w-[48px]',
      render: (row) => <span className="text-xl select-none">{row.image || '📦'}</span>
    },
    {
      key: 'name',
      label: 'Product Details',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-805 dark:text-slate-100">{row.name}</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-550 mt-0.5">
            SKU: {row.barcode} | Brand: {row.brand}
          </span>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      className: 'hidden md:table-cell'
    },
    {
      key: 'costPrice',
      label: 'Cost',
      sortable: true,
      render: (row) => <span>{formatPKR(row.costPrice)}</span>
    },
    {
      key: 'salePrice',
      label: 'Retail',
      sortable: true,
      render: (row) => <span className="font-black text-indigo-650 dark:text-indigo-400">{formatPKR(row.salePrice)}</span>
    },
    {
      key: 'stock',
      label: 'Stock Levels',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-extrabold">{row.stock} {row.unit}s</span>
          <span className="text-[10px] text-slate-450 dark:text-slate-550 mt-0.5">Threshold: {row.minStock}</span>
        </div>
      )
    },
    {
      key: 'stockStatus',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={getStockStatus(row.stock, row.minStock)} />
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto"
            icon={Edit2}
            onClick={() => handleOpenEdit(row)}
          />
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto text-rose-500 hover:text-rose-700"
            icon={Trash2}
            onClick={() => handleOpenDelete(row)}
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-805">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-855 dark:text-white tracking-tight">
            Inventory & Products (500+)
          </h1>
          <p className="text-xs text-slate-405 dark:text-slate-500">
            Create, edit, delete catalog list. Check threshold levels and barcodes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={FileSpreadsheet}
            onClick={() => setImportModalOpen(true)}
          >
            Import CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={handleOpenAdd}
          >
            Add New Product
          </Button>
        </div>
      </div>

      {/* Filter Options Header Grid */}
      <Card>
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Fuzzy search name/barcode..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="
                block w-full pl-9 pr-3 py-1.5 border border-slate-205 dark:border-slate-800 rounded-lg text-xs
                bg-white dark:bg-slate-900 text-slate-800 placeholder:text-slate-400 focus:outline-none
                focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
              "
            />
          </div>

          <Select
            placeholder="Filter Category..."
            value={catFilter}
            onChange={(e) => {
              setCatFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name} ({c.productCount})
              </option>
            ))}
          </Select>

          <Select
            placeholder="Filter Stock Level..."
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Stock Levels</option>
            <option value="INSTOCK">In Stock Only</option>
            <option value="LOWSTOCK">Low Stock Alerts</option>
            <option value="OUTOFSTOCK">Out of Stock Only</option>
          </Select>

          <div className="flex justify-between items-center text-xs font-bold text-slate-400 px-3 bg-slate-50 dark:bg-slate-950/20 rounded-lg border border-slate-100 dark:border-slate-800 select-none">
            <span>Total Filtered:</span>
            <span className="text-slate-800 dark:text-white font-extrabold text-sm">{totalItems}</span>
          </div>
        </CardContent>
      </Card>

      {/* Main paginated products table */}
      <Table
        columns={columns}
        data={paginated}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        pagination
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        emptyMessage="No retail items matching these criteria were found."
      />

      {/* ADD / EDIT PRODUCT MODAL FORM */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingProduct ? 'Edit Product Item' : 'Register New Product'}
        size="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              placeholder="e.g. Olper's Full Cream Milk 1L"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Input
              label="Brand / Manufacturer"
              placeholder="e.g. Olper's"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />

            <Select
              label="Category Setup"
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </Select>

            <Input
              label="Barcode (EAN/GTIN)"
              placeholder="e.g. 890011223344"
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            />

            <Input
              label="Cost Price (PKR)"
              type="number"
              placeholder="0"
              required
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
            />

            <Input
              label="Retail Sale Price (PKR)"
              type="number"
              placeholder="0"
              required
              value={formData.salePrice}
              onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
            />

            <Input
              label="Initial Stock Quantity"
              type="number"
              placeholder="0"
              disabled={!!editingProduct}
              helperText={editingProduct ? 'Stock cannot be changed directly here. Use Stock In/Out adjustment module.' : 'Initial inventory count'}
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            />

            <Input
              label="Low Stock Threshold Warning"
              type="number"
              placeholder="10"
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
            />

            <Select
              label="Stock Unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            >
              <option value="Pack">Pack / Carton</option>
              <option value="Bottle">Bottle</option>
              <option value="Can">Can</option>
              <option value="Tin">Tin / Jar</option>
              <option value="Box">Box</option>
              <option value="Bag">Bag / Sack</option>
              <option value="Each">Each / Single</option>
            </Select>

            <Input
              label="Expiry Date"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />

            <Input
              label="Emoji Icon Representation"
              placeholder="e.g. 🥛"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setFormModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingProduct ? 'Update Product' : 'Register Product'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE DIALOG */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product Item"
        description={`Are you sure you want to delete "${productToDelete?.name || ''}" from the supermart directory? This will remove all records from search.`}
      />

      {/* CSV IMPORT MODAL */}
      <Modal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Bulk Products Importer"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            Upload a spreadsheet (Excel or CSV format) to bulk register products.
            Columns required: <code className="font-bold bg-slate-100 dark:bg-slate-800 p-0.5 rounded">name, brand, categoryId, costPrice, salePrice, stock, minStock, barcode</code>
          </p>
          <FileUpload
            accept=".csv, .xlsx"
            onUploadSuccess={() => {
              setImportModalOpen(false);
            }}
          />
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => setImportModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default Products;
