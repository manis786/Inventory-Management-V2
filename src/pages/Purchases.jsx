import React, { useState } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { StatusBadge } from '../components/shared/StatusBadge';
import { formatPKR } from '../data/store';
import { PlusCircle, Trash2, Eye } from 'lucide-react';

export function Purchases() {
  const { purchases = [], suppliers = [], products = [], setProducts, addPurchaseOrder, receivePurchaseOrder, addToast } = useApp();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [poItems, setPoItems] = useState([]);
  const [draftProductId, setDraftProductId] = useState('');
  const [draftQty, setDraftQty] = useState('');
  const [draftCost, setDraftCost] = useState('');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);

  const handleProductSelect = (productId) => {
    setDraftProductId(productId);
    const prod = products.find(p => p.id === productId);
    if (prod) setDraftCost(String(prod.costPrice));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!draftProductId || !draftQty || Number(draftQty) <= 0 || !draftCost || Number(draftCost) <= 0) return;
    const prod = products.find(p => p.id === draftProductId);
    if (prod) {
      setPoItems([...poItems, { productId: prod._id, name: prod.name, quantity: Number(draftQty), costPrice: Number(draftCost), total: Number(draftQty) * Number(draftCost) }]);
    }
    setDraftProductId(''); setDraftQty(''); setDraftCost('');
  };

  const handleApprovePO = async (po) => {
    try {
      await receivePurchaseOrder(po._id);
      for (const item of po.items) {
        const product = products.find(p => p._id === item.product?._id);
        if (product) {
          const newStock = Number(product.stock) + Number(item.quantity);
          await axios.patch(`http://localhost:5000/api/products/${product._id}`, { stock: newStock });
          setProducts(prev => prev.map(p => p._id === product._id ? { ...p, stock: newStock } : p));
        }
      }
      if (addToast) addToast('Order Approved & Stock Updated!', 'success');
    } catch (err) {
      if (addToast) addToast('Failed to update stock', 'error');
    }
  };

  const handleRemoveItem = (idx) => setPoItems(prev => prev.filter((_, i) => i !== idx));

  const handlePoSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSupplierId || poItems.length === 0) return;
    const payload = {
      supplier: selectedSupplierId,
      items: poItems.map(item => ({ product: item.productId, quantity: Number(item.quantity), costPrice: Number(item.costPrice) })),
      totalAmount: poItems.reduce((sum, item) => sum + item.total, 0)
    };
    await addPurchaseOrder(payload);
    setCreateModalOpen(false);
    setPoItems([]);
    setSelectedSupplierId('');
  };

  const handleOpenDetails = (po) => { setSelectedPO(po); setDetailModalOpen(true); };

  const columns = [
    { key: 'poNumber', label: 'PO Code', render: (row) => <span className="bg-indigo-50 text-indigo-600 font-bold px-2 py-1 rounded text-[11px]">{row.poNumber || `PO-${row._id?.slice(-5).toUpperCase()}`}</span> },
    { key: 'date', label: 'Order Date', render: (row) => new Date(row.date).toLocaleDateString('en-GB') },
    { key: 'supplierName', label: 'Supplier', render: (row) => row.supplier?.name || 'N/A' },
    { key: 'totalAmount', label: 'Total Value', render: (row) => formatPKR(row.totalAmount) },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'actions', label: 'Actions', render: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" icon={Eye} onClick={() => handleOpenDetails(row)} />
          {row.status === 'Pending' && <Button variant="success" size="sm" onClick={() => handleApprovePO(row)}>Approve</Button>}
        </div>
    )}
  ];

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-black">Purchase Orders</h1>
        <Button onClick={() => setCreateModalOpen(true)} icon={PlusCircle}>Draft Order</Button>
      </div>
      <Table columns={columns} data={purchases || []} />

      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Draft Purchase Order" size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-4">
          <div className="lg:col-span-5 space-y-4">
            <Select label="Select Supplier" value={selectedSupplierId} onChange={(e) => setSelectedSupplierId(e.target.value)}>
              <option value="">Choose supplier...</option>
              {suppliers.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </Select>
            <form onSubmit={handleAddItem} className="space-y-3">
              <Select label="Choose Product" value={draftProductId} onChange={(e) => handleProductSelect(e.target.value)}>
                <option value="">Choose item...</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
              <div className="grid grid-cols-2 gap-2">
                <Input label="Cost" type="number" value={draftCost} onChange={(e) => setDraftCost(e.target.value)} />
                <Input label="Qty" type="number" value={draftQty} onChange={(e) => setDraftQty(e.target.value)} />
              </div>
              <Button variant="secondary" type="submit" className="w-full">Add Item</Button>
            </form>
          </div>
          <div className="lg:col-span-7">
            <div className="h-[300px] overflow-y-auto divide-y">
              {poItems.map((item, idx) => (
                <div key={`${item.productId}-${idx}`} className="p-3 flex justify-between text-xs">
                  <span>{item.name}</span>
                  <span>{formatPKR(item.total)}</span>
                  <button onClick={() => handleRemoveItem(idx)}><Trash2 className="w-4 h-4 text-rose-500" /></button>
                </div>
              ))}
            </div>
            <Button variant="success" className="w-full mt-4" onClick={handlePoSubmit} disabled={poItems.length === 0}>Submit Order</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Order Details" size="2xl" className="max-w-3xl" >
        {selectedPO && (
          <div className="p-4">
            <div className="flex justify-between mb-4 text-sm text-gray-600">
              <p><strong>PO Number:</strong> {selectedPO.poNumber || `PO-${selectedPO._id?.slice(-5).toUpperCase()}`}</p>
              <p><strong>Date:</strong> {new Date(selectedPO.date).toLocaleDateString('en-GB')}</p>
            </div>
            <div className="grid grid-cols-4 gap-2 bg-gray-100 p-2 rounded text-xs font-bold uppercase text-gray-700">
              <div>Product</div>
              <div className="text-center">Qty</div>
              <div className="text-right">Price</div>
              <div className="text-right">Total</div>
            </div>
            <div className="mt-2 space-y-1">
              {selectedPO.items?.map((item, idx) => (
                <div key={item._id || idx} className="grid grid-cols-4 gap-2 p-2 border-b text-sm items-center">
                  <div>{item.product?.name || 'N/A'}</div>
                  <div className="text-center">{item.quantity}</div>
                  <div className="text-right">{formatPKR(item.costPrice)}</div>
                  <div className="text-right font-semibold">{formatPKR(item.quantity * item.costPrice)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-4 text-right">
              <div className="text-xl font-black text-blue-900">Total Value: {formatPKR(selectedPO.totalAmount)}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
export default Purchases;