import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { StatusBadge } from '../components/shared/StatusBadge';
import { formatPKR } from '../data/store';
import { PlusCircle, ShoppingCart, CheckCircle, Eye, AlertCircle, Trash2 } from 'lucide-react';

export function Purchases() {
  const {
    purchases,
    suppliers,
    products,
    addPurchaseOrder,
    receivePurchaseOrder,
    addToast
  } = useApp();

  // PO creation state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [poItems, setPoItems] = useState([]);

  // Active item draft state
  const [draftProductId, setDraftProductId] = useState('');
  const [draftQty, setDraftQty] = useState('');
  const [draftCost, setDraftCost] = useState('');

  // PO Detail Modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);

  // Supplier details change auto-fill cost
  const handleProductSelect = (productId) => {
    setDraftProductId(productId);
    const prod = products.find(p => p.id === productId);
    if (prod) {
      setDraftCost(String(prod.costPrice));
    }
  };

  // Add line item to draft PO
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!draftProductId || !draftQty || Number(draftQty) <= 0 || !draftCost || Number(draftCost) <= 0) {
      addToast('Please choose product, cost, and enter a valid quantity.', 'error');
      return;
    }

    const prod = products.find(p => p.id === draftProductId);
    if (!prod) return;

    // Check if item already exists in list
    const existingIdx = poItems.findIndex(i => i.productId === draftProductId);
    if (existingIdx > -1) {
      const updated = [...poItems];
      updated[existingIdx].quantity += Number(draftQty);
      updated[existingIdx].total = updated[existingIdx].quantity * updated[existingIdx].costPrice;
      setPoItems(updated);
    } else {
      setPoItems([
        ...poItems,
        {
          productId: draftProductId,
          name: prod.name,
          sku: prod.barcode || 'N/A',
          quantity: Number(draftQty),
          costPrice: Number(draftCost),
          total: Number(draftQty) * Number(draftCost)
        }
      ]);
    }

    // Reset line input
    setDraftProductId('');
    setDraftQty('');
    setDraftCost('');
  };

  // Remove line item
  const handleRemoveItem = (idx) => {
    setPoItems(prev => prev.filter((_, i) => i !== idx));
  };

  // Submit PO
  const handlePoSubmit = (e) => {
    e.preventDefault();
    if (!selectedSupplierId || poItems.length === 0) {
      addToast('Please select a supplier and add at least one item.', 'error');
      return;
    }

    const supplier = suppliers.find(s => s.id === selectedSupplierId);
    if (!supplier) return;

    addPurchaseOrder({
      supplierId: selectedSupplierId,
      supplierName: supplier.name,
      items: poItems
    });

    // Reset Form
    setSelectedSupplierId('');
    setPoItems([]);
    setCreateModalOpen(false);
  };

  // Details Modal handler
  const handleOpenDetails = (po) => {
    setSelectedPO(po);
    setDetailModalOpen(true);
  };

  // Receive items handler
  const handleReceiveGoods = (poId) => {
    receivePurchaseOrder(poId);
    if (selectedPO && selectedPO.id === poId) {
      setSelectedPO(prev => ({ ...prev, status: 'Received', receivedDate: new Date().toISOString().split('T')[0] }));
    }
  };

  // Table Columns config
  const columns = [
    { key: 'id', label: 'PO Number', sortable: true },
    { key: 'date', label: 'Order Date', sortable: true },
    { key: 'supplierName', label: 'Supplier Partner', sortable: true },
    {
      key: 'itemsCount',
      label: 'Unique Items',
      sortable: false,
      render: (row) => <span>{row.items?.length || 0} line items</span>
    },
    {
      key: 'totalAmount',
      label: 'Total Value',
      sortable: true,
      render: (row) => <span className="font-extrabold">{formatPKR(row.totalAmount)}</span>
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />
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
            icon={Eye}
            onClick={() => handleOpenDetails(row)}
          />
          {row.status === 'Pending' && (
            <Button
              variant="outline"
              size="sm"
              className="py-1 px-2 border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 text-emerald-600 font-bold"
              icon={CheckCircle}
              onClick={() => handleReceiveGoods(row.id)}
            >
              Check-in
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-850">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-855 dark:text-white tracking-tight">
            Purchase Orders
          </h1>
          <p className="text-xs text-slate-405 dark:text-slate-500">
            Manage supply orders, draft restock schedules, and confirm goods receiving bills.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={() => {
            setPoItems([]);
            setSelectedSupplierId('');
            setCreateModalOpen(true);
          }}
        >
          Draft Purchase Order
        </Button>
      </div>

      {/* Purchases list */}
      <Table
        columns={columns}
        data={purchases}
        sortColumn="date"
        sortDirection="desc"
        pagination
        totalItems={purchases.length}
        itemsPerPage={12}
        currentPage={1}
        onPageChange={() => {}}
        emptyMessage="No purchase orders registered in the system yet."
      />

      {/* CREATE PURCHASE ORDER MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Draft Purchase Order (Restock)"
        size="xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Supplier & Line inputs (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <Select
                  label="Select Supplier"
                  required
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                >
                  <option value="" disabled>Choose supplier...</option>
                  {suppliers.filter(s => s.status === 'active').map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (City: {s.city})
                    </option>
                  ))}
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-xs uppercase font-black text-slate-500">Add Line Item</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <form onSubmit={handleAddItem} className="space-y-3">
                  <Select
                    label="Choose Product"
                    value={draftProductId}
                    onChange={(e) => handleProductSelect(e.target.value)}
                  >
                    <option value="" disabled>Choose item...</option>
                    {products.filter(p => p.status === 'active').map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.image} {p.name}
                      </option>
                    ))}
                  </Select>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Cost Price (PKR)"
                      type="number"
                      placeholder="0"
                      value={draftCost}
                      onChange={(e) => setDraftCost(e.target.value)}
                    />
                    <Input
                      label="Quantity"
                      type="number"
                      placeholder="0"
                      value={draftQty}
                      onChange={(e) => setDraftQty(e.target.value)}
                    />
                  </div>

                  <Button variant="secondary" type="submit" className="w-full text-xs py-2">
                    Add Item to Order
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right: Draft list and submission (7 cols) */}
          <div className="lg:col-span-7 flex flex-col h-[480px]">
            <Card className="flex-1 flex flex-col overflow-hidden">
              <CardHeader className="py-3 px-4 flex justify-between items-center bg-slate-50 dark:bg-slate-950/20">
                <CardTitle className="text-xs uppercase font-black">Line Items Registry</CardTitle>
                <span className="text-[10px] font-black text-slate-400">
                  {poItems.length} unique items
                </span>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                {poItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs py-16 gap-2">
                    <ShoppingCart className="w-8 h-8 text-slate-300" />
                    <span>Purchase order registry is empty.</span>
                    <span>Use the left panel inputs to add items.</span>
                  </div>
                ) : (
                  poItems.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-slate-800 dark:text-slate-150 truncate block">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Cost: {formatPKR(item.costPrice)} | Qty: {item.quantity}
                        </span>
                      </div>
                      <div className="text-right flex items-center gap-4 shrink-0">
                        <span className="font-extrabold text-slate-800 dark:text-white block">
                          {formatPKR(item.total)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-rose-500 hover:text-rose-700 cursor-pointer p-1"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-150 dark:border-slate-800 space-y-4 shrink-0">
                <div className="flex justify-between text-xs font-black text-slate-800 dark:text-white pt-1">
                  <span>Grand Total PO Cost:</span>
                  <span className="text-base text-indigo-650 dark:text-indigo-400">
                    {formatPKR(poItems.reduce((sum, item) => sum + item.total, 0))}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="success"
                    className="flex-1"
                    onClick={handlePoSubmit}
                    disabled={poItems.length === 0 || !selectedSupplierId}
                  >
                    Draft & Submit Order
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Modal>

      {/* PO DETAIL MODAL */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={selectedPO ? `Purchase Order Details: ${selectedPO.id}` : ''}
        size="md"
      >
        {selectedPO && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3.5 text-xs bg-slate-50 dark:bg-slate-950/40 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-slate-400">Supplier Partner:</span>
                <p className="font-bold text-slate-800 dark:text-white">{selectedPO.supplierName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Order Status:</span>
                <p className="block"><StatusBadge status={selectedPO.status} /></p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Draft Date:</span>
                <p className="font-semibold">{selectedPO.date}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Receiving Check:</span>
                <p className="font-semibold text-emerald-650 dark:text-emerald-400">
                  {selectedPO.receivedDate ? `Received on ${selectedPO.receivedDate}` : 'Pending intake'}
                </p>
              </div>
            </div>

            {/* Line items list */}
            <div className="space-y-2">
              <h3 className="text-xs uppercase font-black text-slate-500">Ordered Goods</h3>
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {selectedPO.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between bg-white dark:bg-slate-900">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-150 block">{item.name}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">SKU: {item.sku || 'N/A'}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold block">{formatPKR(item.costPrice)} x{item.quantity}</span>
                      <span className="text-[10px] font-bold text-slate-500">{formatPKR(item.costPrice * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-805 pt-4 text-xs font-black">
              <span>Grand Total PO Cost:</span>
              <span className="text-sm text-indigo-650 dark:text-indigo-400">{formatPKR(selectedPO.totalAmount)}</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setDetailModalOpen(false)}>
                Close Details
              </Button>
              {selectedPO.status === 'Pending' && (
                <Button
                  variant="success"
                  className="flex-1 font-bold"
                  icon={CheckCircle}
                  onClick={() => handleReceiveGoods(selectedPO.id)}
                >
                  Verify Goods Intake
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
export default Purchases;
