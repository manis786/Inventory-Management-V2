import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Tabs } from '../components/ui/Tabs';
import { StatusBadge } from '../components/shared/StatusBadge';
import {
  PackageOpen,
  Warehouse,
  History,
  TrendingDown,
  CalendarDays,
  PlusCircle,
  Settings2,
  AlertTriangle
} from 'lucide-react';

export function Inventory() {
  const {
    products,
    inventoryMovements,
    addStockAdjustment,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('history');

  // Manual Adjustment Form states
  const [adjProductId, setAdjProductId] = useState('');
  const [adjQty, setAdjQty] = useState('');
  const [adjType, setAdjType] = useState('deduct'); // add, deduct
  const [adjReason, setAdjReason] = useState('');

  // Table sorting & pagination
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filter low stock products
  const lowStock = products.filter(p => p.stock <= p.minStock && p.status === 'active');

  // Expiring items (expiry date in current year or past)
  const expiring = products.filter((p) => {
    if (!p.expiryDate) return false;
    const expDate = new Date(p.expiryDate);
    const limitDate = new Date('2026-12-31');
    return expDate <= limitDate;
  }).sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  // Process adjustment
  const handleAdjustmentSubmit = (e) => {
    e.preventDefault();
    if (!adjProductId || !adjQty || Number(adjQty) <= 0) {
      addToast('Please choose a product and enter a positive quantity', 'error');
      return;
    }

    addStockAdjustment(adjProductId, Number(adjQty), adjType, adjReason);

    // Reset Form
    setAdjProductId('');
    setAdjQty('');
    setAdjReason('');
  };

  // Sorting movements
  const sortedMovements = [...inventoryMovements].sort((a, b) => {
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];

    if (typeof aVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    } else {
      return sortDirection === 'asc' ? (aVal || 0) - (bVal || 0) : (bVal || 0) - (aVal || 0);
    }
  });

  const totalItems = sortedMovements.length;
  const paginatedMovements = sortedMovements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Movements Columns
  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'date', label: 'Timestamp', sortable: true },
    {
      key: 'productName',
      label: 'Product details',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-805 dark:text-slate-100">{row.productName}</span>
          <span className="text-[10px] text-slate-400">SKU: {row.sku}</span>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Movement Type',
      sortable: true,
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${
          row.type === 'Stock In'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
            : row.type === 'Stock Out'
              ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
              : row.type === 'Transfer'
                ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400'
                : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
        }`}>
          {row.type}
        </span>
      )
    },
    {
      key: 'quantity',
      label: 'Quantity',
      sortable: true,
      className: 'text-right font-black',
      render: (row) => (
        <span className={row.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}>
          {row.quantity > 0 ? `+${row.quantity}` : row.quantity}
        </span>
      )
    },
    {
      key: 'source',
      label: 'From (Source)',
      sortable: true,
      className: 'hidden md:table-cell'
    },
    {
      key: 'destination',
      label: 'To (Dest)',
      sortable: true,
      className: 'hidden md:table-cell'
    },
    {
      key: 'referenceId',
      label: 'Ref Code',
      sortable: true
    },
    {
      key: 'notes',
      label: 'Remarks/Audit notes',
      sortable: false,
      className: 'text-slate-455 text-[10px]'
    }
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-850">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-855 dark:text-white tracking-tight">
            Stock Control & Movements
          </h1>
          <p className="text-xs text-slate-405 dark:text-slate-500">
            Check stock movement logs, perform shrinkage adjustments, and audit product expiries.
          </p>
        </div>
      </div>

      {/* Tabs list */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
        tabs={[
          { value: 'history', label: 'Stock Movement Ledger', icon: <History className="w-3.5 h-3.5" /> },
          { value: 'adjustment', label: 'Manual Stock Correction', icon: <Settings2 className="w-3.5 h-3.5" /> },
          { value: 'lowstock', label: 'Low Stock Alerts', icon: <AlertTriangle className="w-3.5 h-3.5" />, badge: lowStock.length },
          { value: 'expiry', label: 'Expiry Audit Monitor', icon: <CalendarDays className="w-3.5 h-3.5" />, badge: expiring.length }
        ]}
      />

      {/* Tab Contents */}
      {activeTab === 'history' && (
        <Table
          columns={columns}
          data={paginatedMovements}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          emptyMessage="No stock movements registered in the ledger yet."
        />
      )}

      {activeTab === 'adjustment' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Adjustment form (5 cols) */}
          <Card className="lg:col-span-5">
            <CardHeader>
              <CardTitle>Register Stock Adjustment</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdjustmentSubmit} className="space-y-4">
                <Select
                  label="Select Product to Adjust"
                  required
                  value={adjProductId}
                  onChange={(e) => setAdjProductId(e.target.value)}
                >
                  <option value="" disabled>Choose a product...</option>
                  {products.filter(p => p.status === 'active').map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.image} {p.name} (Current: {p.stock} {p.unit}s)
                    </option>
                  ))}
                </Select>

                <Select
                  label="Correction Type"
                  value={adjType}
                  onChange={(e) => setAdjType(e.target.value)}
                >
                  <option value="add">Add Stock (Check-in / Found extra)</option>
                  <option value="deduct">Deduct Stock (Shrinkage / Expiry / Leakage)</option>
                </Select>

                <Input
                  label="Adjustment Quantity"
                  type="number"
                  placeholder="0"
                  required
                  min="1"
                  value={adjQty}
                  onChange={(e) => setAdjQty(e.target.value)}
                />

                <Input
                  label="Audit Notes / Reason"
                  placeholder="e.g. Spilled liquid in aisle 2 or Annual audit check"
                  required
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                />

                <Button variant="primary" type="submit" className="w-full">
                  Post Stock Adjustment
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Context Explainer (7 cols) */}
          <Card className="lg:col-span-7">
            <CardHeader>
              <CardTitle>Double-entry Inventory Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs leading-relaxed text-slate-550 dark:text-slate-400">
              <p>
                Stock adjustments directly override physical warehouse logs. Always write clear reasons matching physical store findings.
              </p>
              <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-lg space-y-2 border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">System adjustments ledger logic:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Add Stock</strong> triggers a "Stock In" record, increasing local shelf counts.</li>
                  <li><strong>Deduct Stock</strong> triggers an "Adjustment" record, decreasing shelf counts and auditing as waste expense.</li>
                  <li>Adjustments dynamically recalculate inventory asset value totals on the dashboard.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'lowstock' && (
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Level Threshold Checklist</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-450 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">SKU Code</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Current Stock</th>
                  <th className="p-4">Min. Required</th>
                  <th className="p-4 text-right">Shortage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {lowStock.map((p) => {
                  const shortage = p.minStock - p.stock;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 text-slate-707 dark:text-slate-205">
                      <td className="p-4 font-bold flex items-center gap-2">
                        <span>{p.image}</span>
                        <span>{p.name}</span>
                      </td>
                      <td className="p-4 font-mono">{p.barcode}</td>
                      <td className="p-4">{p.category}</td>
                      <td className="p-4 font-extrabold text-amber-600 dark:text-amber-400">
                        {p.stock} {p.unit}s
                      </td>
                      <td className="p-4 text-slate-400">{p.minStock} {p.unit}s</td>
                      <td className="p-4 text-right font-black text-rose-600 dark:text-rose-455">
                        -{shortage} {p.unit}s
                      </td>
                    </tr>
                  );
                })}
                {lowStock.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-slate-400">
                      All products have optimal inventory levels!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'expiry' && (
        <Card>
          <CardHeader>
            <CardTitle>Expiring Batch Control Monitor</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-450 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Stock on Hand</th>
                  <th className="p-4">Expiry Date</th>
                  <th className="p-4 text-right">Expiry Warning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {expiring.map((p) => {
                  const today = new Date('2026-06-13');
                  const exp = new Date(p.expiryDate);
                  const isExpired = exp < today;
                  const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 text-slate-707 dark:text-slate-205">
                      <td className="p-4 font-bold flex items-center gap-2">
                        <span>{p.image}</span>
                        <span>{p.name}</span>
                      </td>
                      <td className="p-4 font-mono">{p.barcode}</td>
                      <td className="p-4">{p.category}</td>
                      <td className="p-4 font-extrabold">{p.stock} {p.unit}s</td>
                      <td className={`p-4 font-bold ${isExpired ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}`}>
                        {p.expiryDate}
                      </td>
                      <td className="p-4 text-right font-black">
                        {isExpired ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[9px] font-black uppercase">
                            Expired!
                          </span>
                        ) : (
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            diffDays <= 30
                              ? 'bg-rose-50 border border-rose-200 text-rose-750'
                              : 'bg-amber-50 border border-amber-200 text-amber-700'
                          }`}>
                            {diffDays} days left
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {expiring.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-slate-400">
                      No short-term expiring products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
export default Inventory;
