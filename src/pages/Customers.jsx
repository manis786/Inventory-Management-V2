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
import { formatPKR } from '../data/store';
import { BookOpen, Users, PlusCircle, Landmark, Coins, FileText, Settings, ShieldAlert } from 'lucide-react';

export function Customers() {
  const {
    customers,
    transactions,
    addCustomer,
    updateCustomer,
    addCustomerPayment,
    addToast
  } = useApp();

  // Outstanding receivables
  const totalReceivables = customers.reduce((sum, c) => sum + c.balance, 0);
  const activeCount = customers.filter(c => c.status === 'active').length;

  // Modals state
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState(null);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingCust, setEditingCust] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    balance: ''
  });

  // Payment popup state
  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [collectAmount, setCollectAmount] = useState('');
  const [collectMethod, setCollectMethod] = useState('Cash');

  // Submit profile forms
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Customer name is required', 'error');
      return;
    }

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      balance: Number(formData.balance || 0)
    };

    if (editingCust) {
      updateCustomer({
        ...editingCust,
        ...payload
      });
    } else {
      addCustomer(payload);
    }
    setFormModalOpen(false);
  };

  // Record payment handler
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!activeCustomer || !collectAmount || Number(collectAmount) <= 0) {
      addToast('Please input a valid payment amount', 'error');
      return;
    }

    if (Number(collectAmount) > activeCustomer.balance) {
      addToast(`Payment exceeds outstanding ledger balance of Rs. ${activeCustomer.balance.toLocaleString()}!`, 'warning');
      return;
    }

    addCustomerPayment(activeCustomer.id, Number(collectAmount), collectMethod);

    // Update activeCustomer modal state balance
    setActiveCustomer(prev => {
      const newBal = prev.balance - Number(collectAmount);
      const newLedger = [
        { date: new Date().toISOString().split('T')[0], type: 'Payment', ref: `PAY-${Date.now().toString().slice(-4)}`, debit: 0, credit: Number(collectAmount), balance: newBal },
        ...(prev.ledger || [])
      ];
      return {
        ...prev,
        balance: newBal,
        ledger: newLedger
      };
    });

    // Sync listing data
    setCollectAmount('');
    setCollectModalOpen(false);
  };

  // Open edit modal
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

  // Open add modal
  const handleOpenAdd = () => {
    setEditingCust(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      balance: '0'
    });
    setFormModalOpen(true);
  };

  // Open ledger statement
  const handleOpenProfile = (cust) => {
    // Inject transactions to ledger if empty
    let currentLedger = cust.ledger || [];
    if (currentLedger.length === 0 && cust.balance > 0) {
      // Create initial balance ledger row
      currentLedger = [
        { date: '2026-06-01', type: 'Opening Balance', ref: 'SYS-OP', debit: cust.balance, credit: 0, balance: cust.balance }
      ];
    }
    setActiveCustomer({
      ...cust,
      ledger: currentLedger
    });
    setProfileModalOpen(true);
  };

  // Columns config
  const columns = [
    { key: 'id', label: 'Code', sortable: true },
    {
      key: 'name',
      label: 'Customer Name',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-805 dark:text-slate-100">{row.name}</span>
          <span className="text-[10px] text-slate-400">Phone: {row.phone || '—'} | Email: {row.email || '—'}</span>
        </div>
      )
    },
    {
      key: 'totalSpent',
      label: 'Total Purchased',
      sortable: true,
      render: (row) => <span>{formatPKR(row.totalSpent)}</span>
    },
    {
      key: 'totalTransactions',
      label: 'Visits',
      sortable: true,
      className: 'text-center font-semibold'
    },
    {
      key: 'balance',
      label: 'Outstanding Udhaar',
      sortable: true,
      render: (row) => (
        <span className={`font-black ${row.balance > 0 ? 'text-rose-600 dark:text-rose-455 font-bold' : 'text-slate-500'}`}>
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
            Customer Registry & Khata
          </h1>
          <p className="text-xs text-slate-405 dark:text-slate-500">
            Track customer balances, review purchasing activity, and record credit collections.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={handleOpenAdd}
        >
          Register Customer
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KPICard
          title="Outstanding Receivables (Udhaar)"
          value={formatPKR(totalReceivables)}
          icon={BookOpen}
          color="rose"
        />
        <KPICard
          title="Registered shoppers"
          value={`${activeCount} Accounts`}
          icon={Users}
          color="indigo"
        />
      </div>

      {/* Main customers list */}
      <Table
        columns={columns}
        data={customers}
        sortColumn="id"
        sortDirection="asc"
        pagination
        totalItems={customers.length}
        itemsPerPage={12}
        currentPage={1}
        onPageChange={() => {}}
        emptyMessage="No customers registered in the database."
      />

      {/* ADD / EDIT CUSTOMER MODAL */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingCust ? 'Modify Customer Profile' : 'Register Customer Profile'}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Full Customer Name"
            placeholder="e.g. Haji Amjad Ali"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              placeholder="e.g. 0300-1234567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="customer@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <Input
            label="Billing / Home Address"
            placeholder="House 12, Block C, Gulshan-e-Iqbal, Karachi"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <Input
            label="Opening Udhaar/Credit Balance (PKR)"
            type="number"
            placeholder="0"
            disabled={!!editingCust}
            value={formData.balance}
            onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
          />

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setFormModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingCust ? 'Save Profile' : 'Register Customer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* CUSTOMER LEDGER STATEMENT */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title={activeCustomer ? `Customer statement: ${activeCustomer.name}` : ''}
        size="lg"
      >
        {activeCustomer && (
          <div className="space-y-5">
            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-950/40 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-slate-400">Total Udhaar Due:</span>
                <p className="text-sm font-black text-rose-600 dark:text-rose-400">
                  {formatPKR(activeCustomer.balance)}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">Total Spent history:</span>
                <p className="font-semibold text-slate-855 dark:text-slate-205">{formatPKR(activeCustomer.totalSpent)}</p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400">POS Purchases count:</span>
                <p className="font-semibold text-indigo-650 dark:text-indigo-400">
                  {activeCustomer.totalTransactions} visits
                </p>
              </div>
            </div>

            {/* Quick Collect Payment Action */}
            {activeCustomer.balance > 0 && (
              <Card className="border-emerald-150 dark:border-emerald-950/20 bg-emerald-50/5 p-4 rounded-lg">
                <h3 className="text-xs font-bold text-emerald-805 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                  <Coins className="w-4.5 h-4.5 shrink-0" />
                  Collect Payment (Clearing credit ledger)
                </h3>
                <form onSubmit={handlePaymentSubmit} className="flex flex-col sm:flex-row items-end gap-3">
                  <Input
                    label="Amount Collected (PKR)"
                    type="number"
                    placeholder="Enter PKR amount..."
                    required
                    max={activeCustomer.balance}
                    value={collectAmount}
                    onChange={(e) => setCollectAmount(e.target.value)}
                  />
                  <Select
                    label="Deposit Into Account"
                    value={collectMethod}
                    onChange={(e) => setCollectMethod(e.target.value)}
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

            {/* Khata Ledger table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450">Khata Ledger Statement</h3>
              <div className="border border-slate-205 dark:border-slate-800 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900 font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Reference</th>
                      <th className="p-3 text-right">Debit (Due)</th>
                      <th className="p-3 text-right">Credit (Paid)</th>
                      <th className="p-3 text-right">Running Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {/* Filter local transactions relating to this customer */}
                    {activeCustomer.ledger?.map((row, idx) => (
                      <tr key={idx} className="text-slate-707 dark:text-slate-205">
                        <td className="p-3">{row.date}</td>
                        <td className="p-3 font-semibold">{row.type}</td>
                        <td className="p-3 text-slate-455 font-mono">{row.ref}</td>
                        <td className="p-3 text-right font-semibold text-rose-600 dark:text-rose-455">
                          {row.debit > 0 ? formatPKR(row.debit) : '—'}
                        </td>
                        <td className="p-3 text-right font-semibold text-emerald-600 dark:text-emerald-455">
                          {row.credit > 0 ? formatPKR(row.credit) : '—'}
                        </td>
                        <td className="p-3 text-right font-black">{formatPKR(row.balance)}</td>
                      </tr>
                    ))}
                    {transactions.filter(t => t.customerId === activeCustomer.id).map((tx) => (
                      <tr key={tx.id} className="text-slate-707 dark:text-slate-205">
                        <td className="p-3">{tx.date}</td>
                        <td className="p-3 font-semibold">POS Checkout ({tx.paymentMethod})</td>
                        <td className="p-3 text-slate-455 font-mono">{tx.id}</td>
                        <td className="p-3 text-right font-semibold text-slate-808">
                          {formatPKR(tx.total)}
                        </td>
                        <td className="p-3 text-right font-semibold text-emerald-600">
                          {tx.paymentMethod !== 'Udhaar' ? formatPKR(tx.total) : '—'}
                        </td>
                        <td className="p-3 text-right font-black">
                          {tx.paymentMethod === 'Udhaar' ? 'Accumulated' : 'Cleared'}
                        </td>
                      </tr>
                    ))}
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
export default Customers;
