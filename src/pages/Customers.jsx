import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { KPICard } from '../components/ui/KPICard';
import { StatusBadge } from '../components/shared/StatusBadge';
import { formatPKR } from '../data/store';
import { Users, PlusCircle, FileText, Settings, BookOpen } from 'lucide-react';

export function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingCust, setEditingCust] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    balance: '0',
    status: 'active' // Ye add kar dein
});

  // Fetch Customers from Database
  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers');
      setCustomers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const totalReceivables = customers.reduce((sum, c) => sum + (c.balance || 0), 0);

  // Submit Form (Create or Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCust) {
        await axios.put(`http://localhost:5000/api/customers/${editingCust._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/customers', formData);
      }
      setFormModalOpen(false);
      fetchCustomers(); // List refresh karein
    } catch (err) {
      alert("Error saving customer");
    }
  };

  const handleOpenEdit = (cust) => {
    setEditingCust(cust);
    setFormData({
      name: cust.name,
      phone: cust.phone || '',
      email: cust.email || '',
      address: cust.address || '',
      balance: String(cust.balance)
    });
    setFormModalOpen(true);
  };

  const columns = [
    { key: '_id', label: 'ID' },
    { key: 'name', label: 'Customer Name', render: (row) => <span className="font-bold">{row.name}</span> },
    { key: 'phone', label: 'Phone' },
    {
      key: 'balance',
      label: 'Balance',
      render: (row) => <span className="font-bold text-rose-600">{formatPKR(row.balance)}</span>
    },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Button variant="ghost" size="sm" icon={Settings} onClick={() => handleOpenEdit(row)} />
      )
    }
  ];

  return (
    <div className="space-y-5 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800">Customer Registry</h1>
        <Button variant="primary" icon={PlusCircle} onClick={() => { setEditingCust(null); setFormModalOpen(true); }}>
          Register Customer
        </Button>
      </div>

      <KPICard title="Total Receivables" value={formatPKR(totalReceivables)} icon={BookOpen} color="rose" />

      {loading ? <p>Loading...</p> : <Table columns={columns} data={customers} />}
     <Modal
  isOpen={formModalOpen}
  onClose={() => setFormModalOpen(false)}
  title={editingCust ? 'Modify Customer Profile' : 'Register New Customer'}
  size="lg"
>
  <form onSubmit={handleFormSubmit} className="space-y-6">
    
    {/* Section 1: Personal Details */}
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-1">
        Personal Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Customer Name"
          placeholder="e.g. Muhammad Ahmed"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Input
          label="Phone Number"
          placeholder="0300-1234567"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <Input
        label="Email Address"
        type="email"
        placeholder="customer@example.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
    </div>

    {/* Section 2: Account & Financials */}
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-1">
        Account & Ledger Info
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Billing Address"
          placeholder="Street, City, Area"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
        <Input
          label="Opening Credit Balance (PKR)"
          type="number"
          placeholder="0.00"
          disabled={!!editingCust}
          value={formData.balance}
          onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
          className="font-bold text-indigo-600"
        />
      </div>
      
      {/* Status Toggle */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-600">Account Status</label>
        <select
          className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
          value={formData.status || 'active'}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="active">Active (Can make Sales)</option>
          <option value="inactive">Inactive (Suspended)</option>
        </select>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
      <Button variant="outline" type="button" onClick={() => setFormModalOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" className="px-8">
        {editingCust ? 'Update Profile' : 'Confirm Registration'}
      </Button>
    </div>
  </form>
</Modal>

    </div>
  );
}

export default Customers