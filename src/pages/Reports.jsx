import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { formatPKR, formatDate } from '../data/store';
import { 
  FileSpreadsheet, FileText, Printer, Landmark, 
  ArrowUpRight, ArrowDownRight, Calendar, Calculator 
} from 'lucide-react';

export function Reports() {
  const { transactions, expenses, addToast } = useApp();

  // 1. ERP Chart of Accounts Registry
  const accountHeads = [
    { code: "ACC01", title: "Cash in Hand", nature: "Asset", initial: 150000 },
    { code: "ACC02", title: "HBL Current Account", nature: "Asset", initial: 1200000 },
    { code: "ACC03", title: "Meezan Business Account", nature: "Asset", initial: 850000 },
    { code: "ACC04", title: "Accounts Receivable", nature: "Asset", initial: 450000 },
    { code: "ACC05", title: "Accounts Payable", nature: "Liability", initial: 300000 },
    { code: "ACC06", title: "Operating Expenses (OPEX)", nature: "Expense", initial: 0 }
  ];

  // Component States
  const [activeAccountCode, setActiveAccountCode] = useState("ACC01");
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-06-30');
  const [branchFilter, setBranchFilter] = useState('ALL');

  const selectedAccount = accountHeads.find(a => a.code === activeAccountCode);

  const handleExport = (type) => {
    addToast(`Spooling database transaction logs... Exporting ledger for ${selectedAccount.title} as ${type.toUpperCase()}`, 'success');
  };

  // --- BUSINESS LOGIC: CORE GENERAL LEDGER ENGINE ---
  
  const generateLedgerStatement = () => {
    let ledgerEntries = [];

    // Filter source vectors based on global filters
    const txns = transactions.filter(t => branchFilter === 'ALL' || t.branch === branchFilter);
    const exps = (expenses || []).filter(e => branchFilter === 'ALL' || e.branch === branchFilter);

    // Build ledger rows depending on selected account head
    switch (activeAccountCode) {
      case "ACC01": // Cash in Hand
        // POS Sales using Cash method bring Debit
        txns.forEach(t => {
          if (t.paymentMethod === 'Cash') {
            ledgerEntries.push({ id: `TXN-${t.id}`, date: t.date, ref: `POS Invoice #${t.id}`, description: `Counter retail sale at ${t.branch}`, debit: t.total, credit: 0 });
          }
        });
        // Expenses paid via Cash method bring Credit
        exps.forEach(e => {
          if (e.paymentMethod === 'Cash' && e.status === 'Paid') {
            ledgerEntries.push({ id: `EXP-${e.id}`, date: e.date, ref: `Voucher #${e.id}`, description: `${e.title} (${e.category})`, debit: 0, credit: e.amount });
          }
        });
        break;

      case "ACC02": // HBL Current Account
        txns.forEach(t => {
          if (t.paymentMethod === 'Card') {
            ledgerEntries.push({ id: `TXN-${t.id}`, date: t.date, ref: `POS Invoice #${t.id}`, description: `Card payment collection`, debit: t.total, credit: 0 });
          }
        });
        exps.forEach(e => {
          if (e.paymentMethod === 'Card' && e.status === 'Paid') {
            ledgerEntries.push({ id: `EXP-${e.id}`, date: e.date, ref: `Voucher #${e.id}`, description: `${e.title} (${e.category})`, debit: 0, credit: e.amount });
          }
        });
        break;

      case "ACC03": // Meezan Business Account
        txns.forEach(t => {
          if (t.paymentMethod === 'EasyPaisa') { // Mapped as digital/bank transfer channel
            ledgerEntries.push({ id: `TXN-${t.id}`, date: t.date, ref: `POS Invoice #${t.id}`, description: `Bank digital transfer collection`, debit: t.total, credit: 0 });
          }
        });
        exps.forEach(e => {
          if (e.paymentMethod === 'EasyPaisa' && e.status === 'Paid') {
            ledgerEntries.push({ id: `EXP-${e.id}`, date: e.date, ref: `Voucher #${e.id}`, description: `${e.title} (${e.category})`, debit: 0, credit: e.amount });
          }
        });
        break;

      case "ACC04": // Accounts Receivable (Debtors)
        // If an invoice is generated but unpaid (simulated layout), or just standard tracing
        txns.forEach(t => {
          ledgerEntries.push({ id: `AR-${t.id}`, date: t.date, ref: `POS Invoice #${t.id}`, description: `Credit sale log entry`, debit: t.total, credit: 0 });
        });
        break;

      case "ACC05": // Accounts Payable (Creditors)
        // Pending expenses act as unpaid liabilities (Credit)
        exps.forEach(e => {
          if (e.status === 'Pending') {
            ledgerEntries.push({ id: `AP-${e.id}`, date: e.date, ref: `Liability #${e.id}`, description: `Accrued dues: ${e.title}`, debit: 0, credit: e.amount });
          }
        });
        break;

      case "ACC06": // Operating Expenses (OPEX Head)
        // All expenses act as straight Debit entries to the profit/loss cost center
        exps.forEach(e => {
          ledgerEntries.push({ id: `EXP-${e.id}`, date: e.date, ref: `Voucher #${e.id}`, description: `OPEX Debit: ${e.title} [${e.category}]`, debit: e.amount, credit: 0 });
        });
        break;

      default:
        break;
    }

    // Sort entries chronologically
    ledgerEntries.sort((a, b) => a.date.localeCompare(b.date));

    // Calculate dynamic running balances and separate date filtering window
    let currentBalance = selectedAccount.initial; // Base balance before calculations
    let finalRows = [];

    // Phase 1: Calculate Opening Balance for records prior to startDate
    let openingCalculated = selectedAccount.initial;
    
    ledgerEntries.forEach(entry => {
      const isAssetOrExpense = selectedAccount.nature === "Asset" || selectedAccount.nature === "Expense";
      
      if (isAssetOrExpense) {
        currentBalance = currentBalance + entry.debit - entry.credit;
      } else { // Liabilities / Equity / Revenues
        currentBalance = currentBalance + entry.credit - entry.debit;
      }

      if (entry.date < startDate) {
        openingCalculated = currentBalance;
      } else if (entry.date >= startDate && entry.date <= endDate) {
        finalRows.push({
          ...entry,
          runningBalance: currentBalance
        });
      }
    });

    return {
      openingBalance: finalRows.length > 0 ? (finalRows[0].debit || finalRows[0].credit ? currentBalance - finalRows.reduce((acc, r) => acc + (isAssetOrExpense ? r.debit - r.credit : r.credit - r.debit), 0) : openingCalculated) : openingCalculated,
      rows: finalRows
    };
  };

  const isAssetOrExpense = selectedAccount.nature === "Asset" || selectedAccount.nature === "Expense";
  const { openingBalance, rows: statementRows } = generateLedgerStatement();

  // Calculate totals inside the selected window
  const totalDebitInWindow = statementRows.reduce((sum, r) => sum + r.debit, 0);
  const totalCreditInWindow = statementRows.reduce((sum, r) => sum + r.credit, 0);
  const closingBalance = statementRows.length > 0 
    ? statementRows[statementRows.length - 1].runningBalance 
    : openingBalance;

  // Table Structure
  const ledgerColumns = [
    { key: 'date', label: 'Posting Date', render: (row) => <span className="font-medium">{formatDate(row.date)}</span> },
    { key: 'ref', label: 'Ref / Voucher ID', className: 'font-mono text-xs text-slate-500' },
    { key: 'description', label: 'Narration / Transaction Details' },
    { key: 'debit', label: 'Debit (+)', className: 'text-right font-semibold text-emerald-600', render: (row) => row.debit > 0 ? formatPKR(row.debit) : <span className="text-slate-300">-</span> },
    { key: 'credit', label: 'Credit (-)', className: 'text-right font-semibold text-rose-600', render: (row) => row.credit > 0 ? formatPKR(row.credit) : <span className="text-slate-300">-</span> },
    {
      key: 'runningBalance',
      label: 'Balance Vector',
      className: 'text-right font-black text-slate-900 dark:text-slate-100',
      render: (row) => formatPKR(row.runningBalance)
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Action Commands */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800 no-print">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Landmark className="w-6 h-6 text-indigo-600" /> Chart of Accounts Ledger
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Audit separate book ledgers, track automated running double-entry balances, and dump compliance sheets.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200" icon={FileSpreadsheet} onClick={() => handleExport('excel')}>Export Statement (.xlsx)</Button>
          <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200" icon={FileText} onClick={() => handleExport('pdf')}>Export PDF</Button>
          <Button variant="primary" size="sm" className="h-9 text-xs bg-indigo-600" icon={Printer} onClick={() => window.print()}>Print Ledger</Button>
        </div>
      </div>

      {/* Audit Target Scope Selectors */}
      <Card className="no-print border-slate-200/80 shadow-sm bg-white dark:bg-slate-900">
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Account Head</label>
            <Select 
              value={activeAccountCode} 
              onChange={(e) => setActiveAccountCode(e.target.value)} 
              className="h-10 text-sm border-slate-200 font-bold text-indigo-600 bg-white dark:bg-slate-900 focus:ring-0"
            >
              {accountHeads.map(acc => (
                <option key={acc.code} value={acc.code}>
                  {acc.code} - {acc.title} ({acc.nature})
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Calendar className="w-3 h-3"/> From Date</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-10 text-sm border-slate-200" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Calendar className="w-3 h-3"/> To Date</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-10 text-sm border-slate-200" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Calculator className="w-3 h-3"/> Node Branch</label>
            <Select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="h-10 text-sm border-slate-200 bg-white dark:bg-slate-900">
              <option value="ALL">All Cost Centers</option>
              <option value="Karachi HQ">Karachi HQ Showroom</option>
              <option value="Lahore Branch">Lahore Branch Outlet</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* LEDGER WORKSPACE SUMMARY RIBBON */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-t-2 border-t-slate-400 bg-slate-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Opening Balance</p>
              <h4 className="text-base font-black text-slate-700 dark:text-slate-300 mt-0.5">{formatPKR(openingBalance)}</h4>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </CardContent>
        </Card>

        <Card className="border-t-2 border-t-indigo-600 bg-indigo-50/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Net Period Activity (Dr - Cr)</p>
              <h4 className="text-base font-black text-indigo-700 mt-0.5">
                {formatPKR(totalDebitInWindow)} / {formatPKR(totalCreditInWindow)}
              </h4>
            </div>
            <Calculator className="w-4 h-4 text-indigo-400" />
          </CardContent>
        </Card>

        <Card className="border-t-2 border-t-emerald-500 bg-emerald-50/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Closing Statement Balance</p>
              <h4 className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{formatPKR(closingBalance)}</h4>
            </div>
            <ArrowDownRight className="w-4 h-4 text-emerald-500" />
          </CardContent>
        </Card>
      </div>

      {/* DETAILED GENERAL LEDGER RENDER VIEW */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 flex justify-between items-center flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedAccount.code} - {selectedAccount.title} Ledger Statement</h3>
            <p className="text-xs text-slate-400 mt-0.5">Showing compiled running double-entry book ledger items from {formatDate(startDate)} to {formatDate(endDate)}</p>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            Account Nature: {selectedAccount.nature}
          </span>
        </div>

        <Table
          columns={ledgerColumns}
          data={statementRows}
          pagination
          totalItems={statementRows.length}
          itemsPerPage={12}
          currentPage={1}
          onPageChange={() => {}}
          emptyMessage="No debit/credit ledger records posted for this account inside the selected date parameters."
        />
      </div>

    </div>
  );
}
export default Reports;