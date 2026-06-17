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
    suppliers,
    purchases,
    addSupplier,
    updateSupplier,
    addSupplierPayment,
    addToast
  } = useApp();

  // Outstanding payables
  const totalPayables = suppliers.reduce((sum, s) => sum + s.balance, 0);
  const activeCount = suppliers.filter(s => s.status === 'active').length;

  // Modals state
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activeSupplier, setActiveSupplier] = useState(null);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingSup, setEditingSup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    balance: '',
    paymentTerms: 'Net 30'
  });

  // Payment popup state
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Bank Transfer');

  // Supplier forms submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contact.trim()) {
      addToast('Supplier name and contact details are required', 'error');
      return;
    }

    const payload = {
      name: formData.name,
      contact: formData.contact,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      address: formData.address,
      balance: Number(formData.balance || 0),
      paymentTerms: formData.paymentTerms
    };

    if (editingSup) {
      updateSupplier({
        ...editingSup,
        ...payload
      });
    } else {
      addSupplier(payload);
    }
    setFormModalOpen(false);
  };

  // Record payment handler
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

    addSupplierPayment(activeSupplier.id, Number(payAmount), payMethod);

    // Update local modal state balance
    setActiveSupplier(prev => ({
      ...prev,
      balance: Math.max(0, prev.balance - Number(payAmount))
    }));

    setPayAmount('');
    setPayModalOpen(false);
  };

  // Open Edit profile
  const handleOpenEdit = (sup) => {
    setEditingSup(sup);
    setFormData({
      name: sup.name,
      contact: sup.contact,
      phone: sup.phone,
      email: sup.email,
      city: sup.city,
      address: sup.address,
      balance: String(sup.balance),
      paymentTerms: sup.paymentTerms || 'Net 30'
    });
    setFormModalOpen(true);
  };

  // Open add profile
  const handleOpenAdd = () => {
    setEditingSup(null);
    setFormData({
      name: '',
      contact: '',
      phone: '',
      email: '',
      city: '',
      address: '',
      balance: '0',
      paymentTerms: 'Net 30'
    });
    setFormModalOpen(true);
  };

  const handleOpenProfile = (sup) => {
    setActiveSupplier(sup);
    setProfileModalOpen(true);
  };

  // Table Columns
  const columns = [
    { key: 'id', label: 'Code', sortable: true },
    {
      key: 'name',
      label: 'Supplier Details',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-805 dark:text-slate-100">{row.name}</span>
          <span className="text-[10px] text-slate-400">Rep: {row.contact} | City: {row.city}</span>
        </div>
      )
    },
    { key: 'phone', label: 'Phone No.' },
    { key: 'paymentTerms', label: 'Payment Terms', className: 'hidden md:table-cell' },
    {
      key: 'totalOrders',
      label: 'Orders',
      sortable: true,
      className: 'text-center font-bold'
    },
    {
      key: 'balance',
      label: 'Payable Balance',
      sortable: true,
      render: (row) => (
        <span className={`font-black ${row.balance > 0 ? 'text-rose-600 dark:text-rose-455' : 'text-slate-500'}`}>
          {formatPKR(row.balance)}
        </span>
      )
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
            icon={FileText}
            onClick={() => handleOpenProfile(row)}
          />
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto"
            icon={Settings}
            onClick={() => handleOpenEdit(row)}
          />
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
            Wholesale Suppliers (20+)
          </h1>
          <p className="text-xs text-slate-405 dark:text-slate-500">
            Monitor supplier balances, view PO order statistics, and record check disbursements.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={handleOpenAdd}
        >
          Add Supplier Account
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KPICard
          title="Accounts Payable (Suppliers)"
          value={formatPKR(totalPayables)}
          icon={Landmark}
          color="rose"
        />
        <KPICard
          title="Active Wholesalers"
          value={`${activeCount} Registered`}
          icon={Truck}
          color="indigo"
        />
      </div>

      {/* Main suppliers list */}
      <Table
        columns={columns}
        data={suppliers}
        sortColumn="id"
        sortDirection="asc"
        pagination
        totalItems={suppliers.length}
        itemsPerPage={12}
        currentPage={1}
        onPageChange={() => {}}
        emptyMessage="No wholesale suppliers registered in the database."
      />

      {/* ADD / EDIT SUPPLIER MODAL */}
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

      {/* SUPPLIER LEDGER & PROFILE DETAIL */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title={activeSupplier ? `Supplier Statement: ${activeSupplier.name}` : ''}
        size="lg"
      >
        {activeSupplier && (
          <div className="space-y-5">
            {/* Top overview stats */}
            <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-950/40 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-slate-400">Total Balance Due:</span>
                <p className="text-sm font-black text-rose-600 dark:text-rose-400">
                  {formatPKR(activeSupplier.balance)}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Contract Terms:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-205">{activeSupplier.paymentTerms}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Order Logs count:</span>
                <p className="font-semibold text-indigo-650 dark:text-indigo-400">
                  {activeSupplier.totalOrders} purchase contracts
                </p>
              </div>
            </div>

            {/* Quick Record Payment Action */}
            {activeSupplier.balance > 0 && (
              <Card className="border-emerald-100 dark:border-emerald-950/20 bg-emerald-50/5 p-4 rounded-lg">
                <h3 className="text-xs font-bold text-emerald-805 dark:text-emerald-400 mb-3.5 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 shrink-0" />
                  Record Payment (Clearing accounts payable)
                </h3>
                <form onSubmit={handlePaymentSubmit} className="flex flex-col sm:flex-row items-end gap-3.5">
                  <Input
                    label="Payment Amount (PKR)"
                    type="number"
                    placeholder="Enter PKR amount..."
                    required
                    max={activeSupplier.balance}
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                  />
                  <Select
                    label="Deduct From Account"
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                  >
                    <option value="Cash">Cash in Hand (ACC01)</option>
                    <option value="Card">HBL Current Account (ACC02)</option>
                    <option value="EasyPaisa">Meezan Business Account (ACC03)</option>
                  </Select>
                  <Button variant="success" type="submit" className="whitespace-nowrap py-2">
                    Submit Ledger Entry
                  </Button>
                </form>
              </Card>
            )}

            {/* PO history relating to supplier */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450">Recent Purchase Orders</h3>
              <div className="border border-slate-200 dark:border-slate-805 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900 font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850">
                    <tr>
                      <th className="p-3">PO Code</th>
                      <th className="p-3">Order Date</th>
                      <th className="p-3">Total Cost</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {purchases.filter(p => p.supplierId === activeSupplier.id).map((po) => (
                      <tr key={po.id} className="text-slate-707 dark:text-slate-205">
                        <td className="p-3 font-bold">{po.id}</td>
                        <td className="p-3">{po.date}</td>
                        <td className="p-3 font-extrabold">{formatPKR(po.totalAmount)}</td>
                        <td className="p-3"><StatusBadge status={po.status} /></td>
                      </tr>
                    ))}
                    {purchases.filter(p => p.supplierId === activeSupplier.id).length === 0 && (
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

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-805">
              <Button variant="outline" onClick={() => setProfileModalOpen(false)}>
                Close Statement
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
export default Suppliers;
