import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { KPICard } from '../components/ui/KPICard';
import { StatusBadge } from '../components/shared/StatusBadge';
import { formatPKR, formatDate } from '../data/store';
import { Truck, Landmark, PlusCircle, CreditCard, Star, FileText, Settings } from 'lucide-react';

export function Suppliers() {
  const {
    suppliers = [],
    purchases = [],
    addSupplier,
    updateSupplier,
    addSupplierPayment,
    addToast
  } = useApp();

  const totalPayables = suppliers.reduce((sum, s) => sum + s.balance, 0);
  const activeCount = suppliers.filter(s => s.status === 'active').length;

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activeSupplier, setActiveSupplier] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingSup, setEditingSup] = useState(null);
  const [formData, setFormData] = useState({
    name: '', contact: '', phone: '', email: '', city: '', address: '', balance: '', paymentTerms: 'Net 30'
  });
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Bank Transfer');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contact.trim()) {
      addToast('Supplier name and contact details are required', 'error');
      return;
    }
    const payload = {
      name: formData.name, contact: formData.contact, phone: formData.phone, email: formData.email,
      city: formData.city, address: formData.address, balance: Number(formData.balance || 0),
      status: formData.status, paymentTerms: formData.paymentTerms
    };
    if (editingSup) {
      updateSupplier({ ...editingSup, ...payload });
    } else {
      addSupplier(payload);
    }
    setFormModalOpen(false);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!activeSupplier || !payAmount || Number(payAmount) <= 0) {
      addToast('Please input a valid payment amount', 'error');
      return;
    }
    if (Number(payAmount) > activeSupplier.balance) {
      addToast(`Payment exceeds outstanding balance of Rs. ${activeSupplier.balance.toLocaleString()}!`, 'warning');
      return;
    }
    addSupplierPayment(activeSupplier._id, Number(payAmount), payMethod);
    setActiveSupplier(prev => ({ ...prev, balance: Math.max(0, prev.balance - Number(payAmount)) }));
    setPayAmount('');
    setPayModalOpen(false);
  };

  const handleOpenEdit = (sup) => {
    setEditingSup(sup);
    setFormData({
      name: sup.name, contact: sup.contact, phone: sup.phone, email: sup.email, city: sup.city,
      address: sup.address, balance: String(sup.balance), paymentTerms: sup.paymentTerms || 'Net 30'
    });
    setFormModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingSup(null);
    setFormData({ name: '', contact: '', phone: '', email: '', city: '', address: '', balance: '0', paymentTerms: 'Net 30' });
    setFormModalOpen(true);
  };

  const handleOpenProfile = (sup) => {
    setActiveSupplier(sup);
    setProfileModalOpen(true);
  };

  const columns = [
    {
  key: '_id',
  label: 'Supplier Code',
  sortable: true,
  render: (row) => (
    <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-[11px]">
      {`SUP-${row._id.slice(-4).toUpperCase()}`}
    </span>
  )
},
    {
      key: 'name', label: 'Supplier Details', sortable: true, render: (row) => (
        <div className="flex flex-col"><span className="font-bold text-slate-805">{row.name}</span><span className="text-[10px] text-slate-400">Rep: {row.contact} | City: {row.city}</span></div>
      )
    },
    { key: 'phone', label: 'Phone No.' },
    { key: 'paymentTerms', label: 'Payment Terms', className: 'hidden md:table-cell' },
{ 
  key: 'totalOrders', 
  label: 'Orders', 
  sortable: true, 
  className: 'text-center font-bold',
  render: (row) => {
    // Har supplier ke orders yahan calculate honge
    const count = purchases.filter(p => p.supplier?._id === row._id).length;
    return <span>{count}</span>;
  }
},    {
      key: 'balance', label: 'Payable Balance', sortable: true, render: (row) => (
        <span className={`font-black ${row.balance > 0 ? 'text-rose-600' : 'text-slate-500'}`}>{formatPKR(row.balance)}</span>
      )
    },
    { key: 'status', label: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions', label: 'Actions', sortable: false, className: 'text-right', render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button variant="ghost" size="sm" className="p-1 h-auto" icon={FileText} onClick={() => handleOpenProfile(row)} />
          <Button variant="ghost" size="sm" className="p-1 h-auto" icon={Settings} onClick={() => handleOpenEdit(row)} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div><h1 className="text-xl md:text-2xl font-black">Suppliers Dashbaord</h1></div>
        <Button variant="primary" size="sm" icon={PlusCircle} onClick={handleOpenAdd}>Add Supplier Account</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KPICard title="Accounts Payable (Suppliers)" value={formatPKR(totalPayables)} icon={Landmark} color="rose" />
        <KPICard title="Active Wholesalers" value={`${activeCount} Registered`} icon={Truck} color="indigo" />
      </div>

      <Table columns={columns} data={suppliers} sortColumn="id" sortDirection="asc" pagination totalItems={suppliers.length} itemsPerPage={12} currentPage={1} onPageChange={() => { }} />

            <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingSup ? 'Modify Supplier Account' : 'Register Wholesale Supplier'}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Supplier Company Name"
            placeholder="e.g. Nestlé Pakistan Ltd"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Contact Representative Name"
              placeholder="e.g. Ali Raza Khan"
              required
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
            <Input
              label="Phone Number"
              placeholder="e.g. 021-34567890"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email Address"
              type="email"
              placeholder="company@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="City"
              placeholder="e.g. Karachi"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          <Input
            label="Office / Warehouse Address"
            placeholder="SITE Industrial Area, Karachi"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Initial Outstanding Balance Payable (PKR)"
              type="number"
              placeholder="0"
              disabled={!!editingSup}
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
            />
            <Select
              label="Standard Payment Terms"
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
            >
              <option value="COD">Cash on Delivery (COD)</option>
              <option value="Net 15">Net 15 Days</option>
              <option value="Net 30">Net 30 Days</option>
              <option value="Net 45">Net 45 Days</option>
            </Select>
            <Select
              label="Supplier Status"
              value={formData.status || 'active'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setFormModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingSup ? 'Save Profile' : 'Register Supplier'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} title={activeSupplier ? `Supplier Statement: ${activeSupplier.name}` : ''} size="lg">
        {activeSupplier && (() => {
          const filteredOrders = purchases.filter(p => p.supplier?._id === activeSupplier._id);
          return (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-lg border">
                <div><span className="text-slate-400">Total Balance:</span><p className="font-black text-rose-600">{formatPKR(activeSupplier.balance)}</p></div>
                <div><span className="text-slate-400">Terms:</span><p className="font-semibold">{activeSupplier.paymentTerms}</p></div>
                <div><span className="text-slate-400">Orders:</span><p className="font-semibold text-indigo-600">{filteredOrders.length} contracts</p></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase text-slate-450">Recent Purchase Orders</h3>
                <div className="border rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
  <thead className="bg-slate-50 border-b">
    <tr>
      <th className="p-3">PO Code</th>
      <th className="p-3">Date</th>
      <th className="p-3">Total</th>
      <th className="p-3">Status</th>
    </tr>
  </thead>
  <tbody className="divide-y">
    {/* Yahan hum filteredOrders ko loop kar rahe hain */}
    {filteredOrders.map((po) => (
      <tr key={po._id}>
        <td className="p-3 font-bold">{po._id.slice(-5).toUpperCase()}</td>
        <td className="p-3">{new Date(po.date).toLocaleDateString()}</td>
        <td className="p-3 font-extrabold">{formatPKR(po.totalAmount)}</td>
        <td className="p-3"><StatusBadge status={po.status} /></td>
      </tr>
    ))}
    
    {/* Agar koi order na ho toh message dikhayein */}
    {filteredOrders.length === 0 && (
      <tr>
        <td colSpan="4" className="p-6 text-center text-slate-400">
          No order history for this wholesaler.
        </td>
      </tr>
    )}
  </tbody>
</table>
                </div>
              </div>
              <div className="flex justify-end pt-2 border-t"><Button variant="outline" onClick={() => setProfileModalOpen(false)}>Close</Button></div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
export default Suppliers;