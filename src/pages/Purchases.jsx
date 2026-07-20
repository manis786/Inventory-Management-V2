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
  const { 
    purchases = [], suppliers = [], products = [], 
    setProducts, addPurchaseOrder, receivePurchaseOrder, 
    addToast, addMovement, fetchPurchases 
  } = useApp();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [poItems, setPoItems] = useState([]);
  const [draftProductId, setDraftProductId] = useState('');
  const [draftQty, setDraftQty] = useState('');
  const [draftCost, setDraftCost] = useState('');

  // Approval and Transaction Logic
  const handlePurchaseStatusChange = async (poId, newStatus) => {
    const selectedPO = purchases.find(p => p._id === poId);
    if (!selectedPO) return;
console.log("--- Approval Process Started ---");
    if (newStatus === 'Approved' && selectedPO.status === 'Approved') {
      alert("Yeh PO pehle se Approved hai!");
      return;
    }

    if (!window.confirm(`Kya aap status "${newStatus}" karna chahte hain?`)) return;

    try {
      await axios.put(`http://localhost:5000/api/purchases/${poId}`, { status: newStatus });
console.log("Items to process:", selectedPO.items);
      if (newStatus === 'Approved') {
        await receivePurchaseOrder(poId);
        for (const item of selectedPO.items) {
          const movementData = {
    product: item.product?._id || item.productId, // Backend 'product' mang raha hai
    type: 'PURCHASE',                             // Backend 'PURCHASE' enum expect kar raha hai
    quantity: Number(item.quantity),
    price: Number(item.costPrice),
    totalAmount: Number(item.quantity) * Number(item.costPrice),
    refId: String(selectedPO.poNumber || poId),
    purchaseId: poId,
    supplier: selectedPO.supplier?._id
  };
        console.log("Sending to API:", movementData); // Console mein check karen
  await addMovement(movementData);  
         console.log("Successfully posted movement for:", item.product?.name);
        }
        console.error("FAILED to post movement for:", item.product?.name, err);
      }
      console.log("--- Approval Process Finished ---");
      await fetchPurchases();
      addToast('Status updated successfully!', 'success');
    } catch (err) {
      addToast('Error updating status', 'error');
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const prod = products.find(p => p.id === draftProductId);
    if (prod && draftQty > 0) {
      setPoItems([...poItems, { productId: prod._id, name: prod.name, quantity: Number(draftQty), costPrice: Number(draftCost), total: Number(draftQty) * Number(draftCost) }]);
    }
    setDraftProductId(''); setDraftQty(''); setDraftCost('');
  };

  const handlePoSubmit = async (e) => {
    e.preventDefault();
    await addPurchaseOrder({ supplier: selectedSupplierId, items: poItems.map(i => ({ product: i.productId, quantity: i.quantity, costPrice: i.costPrice })), totalAmount: poItems.reduce((s, i) => s + i.total, 0) });
    setCreateModalOpen(false); setPoItems([]); setSelectedSupplierId('');
  };

  const columns = [
    { key: 'poNumber', label: 'PO Code', render: (row) => <span className="text-xs font-bold">{row.poNumber || `PO-${row._id?.slice(-5).toUpperCase()}`}</span> },
    { key: 'date', label: 'Date', render: (row) => <span className="text-xs">{new Date(row.date).toLocaleDateString()}</span> },
    { key: 'supplierName', label: 'Supplier', render: (row) => <span>{row.supplier?.name}</span> },
    { key: 'totalAmount', label: 'Total', render: (row) => <span>{formatPKR(row.totalAmount)}</span> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    // { key: 'action', label: 'Action', render: (row) => (
    //   <select disabled={row.status === 'Approved'} value={row.status} onChange={(e) => handlePurchaseStatusChange(row._id, e.target.value)} className="border p-1 text-xs">
    //     <option value="Pending">Pending</option>
    //     <option value="Approved">Approved</option>
    //     <option value="Hold">Hold</option>
    //     <option value="Rejected">Rejected</option>
    //   </select>
    // )},
    { key: 'details', label: '', render: (row) => <Button icon={Eye} size="sm" onClick={() => { setSelectedPO(row); setDetailModalOpen(true); }} /> }
  ];

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-black">Purchase Orders</h1>
        <Button onClick={() => setCreateModalOpen(true)} icon={PlusCircle}>Draft Order</Button>
      </div>

      <Table columns={columns} data={purchases} />

      {/* CREATE MODAL */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Draft Purchase Order" size="xl">
        <div className="grid grid-cols-12 gap-5 p-4">
          <div className="col-span-5 space-y-4">
            <Select label="Select Supplier" value={selectedSupplierId} onChange={(e) => setSelectedSupplierId(e.target.value)}>
              <option value="">Choose supplier...</option>
              {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </Select>
            <form onSubmit={handleAddItem} className="p-4 border bg-gray-50 rounded">
              <Select label="Product" value={draftProductId} onChange={(e) => { const p = products.find(i => i.id === e.target.value); setDraftProductId(e.target.value); if(p) setDraftCost(p.costPrice); }}>
                <option value="">Select...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
              <Input label="Cost" type="number" value={draftCost} onChange={(e) => setDraftCost(e.target.value)} />
              <Input label="Qty" type="number" value={draftQty} onChange={(e) => setDraftQty(e.target.value)} />
              <Button type="submit" className="w-full mt-2">Add Item</Button>
            </form>
          </div>
          <div className="col-span-7">
            <div className="h-[250px] overflow-y-auto border p-2">
              {poItems.map((item, i) => <div key={i} className="flex justify-between text-xs p-2 border-b"><span>{item.name}</span><span>{formatPKR(item.total)}</span></div>)}
            </div>
            <Button className="w-full mt-4" onClick={handlePoSubmit}>Submit Order</Button>
          </div>
        </div>
      </Modal>

      {/* DETAIL MODAL */}
      <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title="Order Details">
        {selectedPO && (
          <div className="p-4">
            <p><strong>PO:</strong> {selectedPO.poNumber}</p>
            {selectedPO.items?.map((item, i) => <div key={i} className="flex justify-between py-2 border-b"><span>{item.product?.name}</span><span>x{item.quantity}</span></div>)}
          </div>
        )}
      </Modal>
    </div>
  );
}
export default Purchases