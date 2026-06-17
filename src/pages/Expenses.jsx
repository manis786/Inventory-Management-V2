import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { StatusBadge } from '../components/shared/StatusBadge';
import { formatPKR } from '../data/store';
import { PlusCircle, Trash2, X } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../data/expenses';

export function Expenses() {
  const {
    expenses,
    addExpense,
    deleteExpense,
    addToast
  } = useApp();

  // Dialog States
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Salaries & Wages',
    amount: '',
    date: '',
    paymentMethod: 'Cash',
    status: 'Paid',
    branch: 'Karachi HQ',
    description: ''
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [expToDelete, setExpToDelete] = useState(null);

  // Sorting / Pagination
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Aggregate totals
  const totalSpentPaid = expenses
    .filter(e => e.status === 'Paid')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalPending = expenses
    .filter(e => e.status === 'Pending')
    .reduce((sum, e) => sum + e.amount, 0);

  // Dynamic spent per category from expenses state
  const getCategoryStats = () => {
    return EXPENSE_CATEGORIES.map((cat) => {
      const spentVal = expenses
        .filter(e => e.category === cat.name && e.status === 'Paid')
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        ...cat,
        spent: spentVal
      };
    });
  };

  const categoryStats = getCategoryStats();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.amount || Number(formData.amount) <= 0) {
      addToast('Please fill out expense title and amount', 'error');
      return;
    }

    addExpense({
      title: formData.title,
      category: formData.category,
      amount: Number(formData.amount),
      date: formData.date || new Date().toISOString().split('T')[0],
      paymentMethod: formData.paymentMethod,
      status: formData.status,
      branch: formData.branch,
      description: formData.description
    });

    setModalOpen(false);
  };

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      category: 'Salaries & Wages',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash',
      status: 'Paid',
      branch: 'Karachi HQ',
      description: ''
    });
    setModalOpen(true);
  };

  const handleOpenDelete = (exp) => {
    setExpToDelete(exp);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (expToDelete) {
      deleteExpense(expToDelete.id);
      setDeleteConfirmOpen(false);
      setExpToDelete(null);
    }
  };

  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  // Sorting
  const sorted = [...expenses].sort((a, b) => {
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    if (typeof aVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    } else {
      return sortDirection === 'asc' ? (aVal || 0) - (bVal || 0) : (bVal || 0) - (aVal || 0);
    }
  });

  const totalItems = sorted.length;
  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Columns
  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'date', label: 'Billing Date', sortable: true },
    {
      key: 'title',
      label: 'Expense Item',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 dark:text-slate-100">{row.title}</span>
          <span className="text-[10px] text-slate-400">{row.description || 'No remarks'}</span>
        </div>
      )
    },
    { key: 'category', label: 'Category Group', sortable: true },
    {
      key: 'amount',
      label: 'Amount Paid',
      sortable: true,
      render: (row) => <span className="font-black text-rose-600 dark:text-rose-450">{formatPKR(row.amount)}</span>
    },
    {
      key: 'paymentMethod',
      label: 'Receipt method',
      render: (row) => <span className="text-slate-500 font-semibold">{row.paymentMethod}</span>
    },
    { key: 'branch', label: 'Cost Branch', className: 'hidden md:table-cell' },
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
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-auto text-rose-500 hover:text-rose-700"
          icon={Trash2}
          onClick={() => handleOpenDelete(row)}
        />
      )
    }
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-850">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-855 dark:text-white tracking-tight">
            Operating Expenses (OPEX)
          </h1>
          <p className="text-xs text-slate-405 dark:text-slate-500">
            Record branch utility bills, custom shopping bags, delivery fuels, and employee payrolls.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={handleOpenAdd}
        >
          Record Expense voucher
        </Button>
      </div>

      {/* Budget Bars Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450">Category Budgets Allocation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryStats.map((cat) => {
            const pct = Math.min(100, Math.round((cat.spent / cat.budget) * 100));
            const color = pct >= 90 ? 'bg-rose-500' : pct >= 75 ? 'bg-amber-500' : 'bg-indigo-600';

            return (
              <Card key={cat.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{cat.name}</span>
                    <span className="font-black text-indigo-650 dark:text-indigo-400">{pct}% used</span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                    <span>Spent: {formatPKR(cat.spent)}</span>
                    <span>Budget limit: {formatPKR(cat.budget)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Main Table */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450">Expenses Ledger</h3>
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
          emptyMessage="No expense transactions posted to ledger."
        />
      </div>

      {/* MINIMAL ENTERPRISE EXPENSE MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        size="lg"
      >
        <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800">
          
          {/* Minimal Clean Header */}
          <div className="px-6 py-4 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Record Expense Voucher
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Add a single operational or general accounting entry.</p>
            </div>
            <button 
              type="button" 
              onClick={() => setModalOpen(false)} 
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Clean Form Context */}
          <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
            
            {/* Full Width Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Expense Title
              </label>
              <Input
                placeholder="e.g. LESCO Electricity Bill May"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full h-10 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-lg text-sm transition-colors"
              />
            </div>

            {/* Grid Layouts with Sharp Borders & Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Expense Category
                </label>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-lg text-sm bg-white dark:bg-slate-900 transition-colors"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Amount (PKR)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full h-10 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-lg text-sm font-medium transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Billing Date
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full h-10 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-lg text-sm transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Payment Status
                </label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full h-10 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-lg text-sm bg-white dark:bg-slate-900 transition-colors"
                >
                  <option value="Paid">Paid Immediately</option>
                  <option value="Pending">Pending / Accrued liability</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Method (If Paid)
                </label>
                <Select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full h-10 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-lg text-sm bg-white dark:bg-slate-900 transition-colors"
                >
                  <option value="Cash">Cash in Hand (ACC01)</option>
                  <option value="Card">HBL Current Account (ACC02)</option>
                  <option value="EasyPaisa">Meezan Business Account (ACC03)</option>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Charge to Branch
                </label>
                <Select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full h-10 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-lg text-sm bg-white dark:bg-slate-900 transition-colors"
                >
                  <option value="Karachi HQ">Karachi HQ Showroom</option>
                  <option value="Lahore Branch">Lahore Branch Outlet</option>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Remarks / Description
              </label>
              <Input
                placeholder="Commercial meter bill receipt code, generator fuel liters etc."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full h-10 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-lg text-sm transition-colors"
              />
            </div>

            {/* Standard Fixed Footer */}
            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setModalOpen(false)}
                className="rounded-lg text-xs h-9 text-slate-600 hover:bg-slate-50 border-slate-200"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                className="rounded-lg text-xs h-9 bg-indigo-600 hover:bg-indigo-700"
              >
                Post Expense voucher
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* CONFIRM DELETE */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Expense Voucher"
        description="Are you sure you want to delete this expense? This action will restore balance calculations."
      />
    </div>
  );
}
export default Expenses;