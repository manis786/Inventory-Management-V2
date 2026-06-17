import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { formatPKR } from '../data/store';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2,
  ChevronDown,
  Search,
  X,
  MoreVertical,
  Eye,
  Edit3,
  Undo2,
  Scale
} from 'lucide-react';

// --- SEARCHABLE COMBOBOX COMPONENT FOR MATRIX ROWS ---
function AccountSearchSelect({ financeAccounts, selectedId, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  const currentAccount = financeAccounts.find(a => a.id === selectedId);

  const filteredAccounts = financeAccounts.filter(acc =>
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between p-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs cursor-pointer focus-within:border-indigo-500"
      >
        <span className={`truncate font-medium ${!currentAccount ? 'text-slate-400 dark:text-slate-500' : ''}`}>
          {currentAccount ? `${currentAccount.name} (${currentAccount.type})` : 'Select Ledger Head...'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 z-50 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 max-h-52 overflow-y-auto rounded-lg shadow-xl">
          <div className="p-2 border-b border-slate-100 dark:border-slate-850 sticky top-0 bg-white dark:bg-slate-950 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input 
              type="text"
              autoFocus
              placeholder="Type account name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            />
            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm('')}>
                <X className="w-3 h-3 text-slate-400 hover:text-slate-650" />
              </button>
            )}
          </div>

          <div className="p-1 divide-y divide-slate-50 dark:divide-slate-900">
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((acc) => (
                <div
                  key={acc.id}
                  onClick={() => {
                    onSelect(acc.id);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`p-2 text-left rounded-md cursor-pointer transition-colors text-[11px] flex justify-between items-center ${
                    selectedId === acc.id 
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 font-bold' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div>
                    <span className="block font-medium">{acc.name}</span>
                    <span className="text-[9px] text-slate-400 block tracking-wider uppercase font-sans">{acc.bank}</span>
                  </div>
                  <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                    {formatPKR(acc.balance)}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-slate-400 text-[11px]">No matching accounts found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- ACTION DROPDOWN FOR GL ENTRIES ---
function RowActionMenu({ row, onAction }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative flex justify-center">
      <button 
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer"
      >
        <MoreVertical className="w-3.5 h-3.5" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-5 w-32 z-40 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-1 text-[11px]">
          <button 
            type="button"
            onClick={() => { onAction('view', row); setMenuOpen(false); }}
            className="w-full flex items-center gap-2 p-1.5 text-left rounded hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-blue-500" /> View Source
          </button>
          <button 
            type="button"
            onClick={() => { onAction('edit', row); setMenuOpen(false); }}
            className="w-full flex items-center gap-2 p-1.5 text-left rounded hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-500" /> Edit Entry
          </button>
          <button 
            type="button"
            onClick={() => { onAction('unpost', row); setMenuOpen(false); }}
            className="w-full flex items-center gap-2 p-1.5 text-left rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" /> Unpost / Void
          </button>
        </div>
      )}
    </div>
  );
}

// --- MAIN FINANCE COMPONENT ---
export function Finance() {
  const {
    financeAccounts,
    journalEntries,
    addToast
  } = useApp();

  // Voucher Modal Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voucherType, setVoucherType] = useState('JV'); 
  const [postingDate, setPostingDate] = useState(new Date().toISOString().split('T')[0]);
  const [mainNarration, setMainNarration] = useState('');
  const [refDoc, setRefDoc] = useState('');
  
  const [lines, setLines] = useState([
    { accountId: '', narration: '', debit: '', credit: '' },
    { accountId: '', narration: '', debit: '', credit: '' }
  ]);

  const totalDebit = lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = totalDebit > 0 && totalCredit > 0 && difference === 0;

  const handleLineChange = (index, field, value) => {
    const updatedLines = [...lines];
    if (field === 'debit' && value !== '') {
      updatedLines[index]['credit'] = '';
    } else if (field === 'credit' && value !== '') {
      updatedLines[index]['debit'] = '';
    }
    updatedLines[index][field] = value;
    setLines(updatedLines);
  };

  const addLedgerLine = () => {
    setLines([...lines, { accountId: '', narration: '', debit: '', credit: '' }]);
  };

  const removeLedgerLine = (index) => {
    if (lines.length <= 2) {
      addToast('A standard accounting voucher requires at least 2 entries.', 'warning');
      return;
    }
    setLines(lines.filter((_, i) => i !== index));
  };

  const handleVoucherSubmit = (e) => {
    e.preventDefault();
    if (!isBalanced) {
      addToast('Cannot post unbalanced voucher.', 'error');
      return;
    }
    addToast(`Voucher [${voucherType}] successfully authorized and posted to General Ledger!`, 'success');
    setLines([
      { accountId: '', narration: '', debit: '', credit: '' },
      { accountId: '', narration: '', debit: '', credit: '' }
    ]);
    setMainNarration('');
    setRefDoc('');
    setIsModalOpen(false);
  };

  // GL Action Execution Mapping
  const handleGLAction = (actionType, record) => {
    if (actionType === 'view') {
      addToast(`Loading audit layout view for ${record.id}...`, 'success');
    } else if (actionType === 'edit') {
      addToast(`Fetching data state for ${record.id}. Opening modifier mode...`, 'warning');
    } else if (actionType === 'unpost') {
      addToast(`Transaction ${record.id} unposted. Funds rolled back to draft ledger state.`, 'error');
    }
  };

  // Sorting and Pagination mechanics
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const sortedJE = [...journalEntries].sort((a, b) => {
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    if (typeof aVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    } else {
      return sortDirection === 'asc' ? (aVal || 0) - (bVal || 0) : (bVal || 0) - (aVal || 0);
    }
  });

  const totalJE = sortedJE.length;
  const paginatedJE = sortedJE.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const jeColumns = [
    { key: 'id', label: 'JE Ref', sortable: true },
    { key: 'date', label: 'Posting Date', sortable: true },
    { key: 'description', label: 'Transaction Narration', className: 'w-[32%]' },
    { key: 'debitAcc', label: 'Debit (Dr) Account', sortable: true },
    { key: 'creditAcc', label: 'Credit (Cr) Account', sortable: true },
    {
      key: 'amount',
      label: 'Value (PKR)',
      sortable: true,
      className: 'text-right font-black text-indigo-600 dark:text-indigo-400',
      render: (row) => <span>{formatPKR(row.amount)}</span>
    },
    { key: 'reference', label: 'Doc Source' },
    {
      key: 'actions',
      label: 'Action',
      className: 'text-center w-[60px]',
      render: (row) => <RowActionMenu row={row} onAction={handleGLAction} />
    }
  ];

  return (
    <div className="space-y-5 animate-fade-in relative">
      {/* Upper Context Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-850">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" /> General Ledger Journal
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Audit double-entry book-keeping logs, track financial reference documents, and modify posted entries.
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer bg-gradient-to-r from-indigo-600 to-violet-600 font-bold shadow-md hover:from-indigo-700 hover:to-violet-700 transition-all text-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" /> New Accounting Voucher
        </Button>
      </div>

      {/* DOUBLE-ENTRY JOURNAL (GL ENTRIES GRID ONLY) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl p-4 shadow-sm">
        <Table
          columns={jeColumns}
          data={paginatedJE}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          pagination
          totalItems={totalJE}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          emptyMessage="No double-entry journal entries registered in financial history."
        />
      </div>

      {/* ======================================================== */}
      {/* ENTERPRISE DOUBLE-ENTRY VOUCHER MODAL LAYER               */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            
            <div className="px-6 py-4 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/20">
              <div>
                <h2 className="text-base font-black text-slate-855 dark:text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-indigo-600" /> Create Double-Entry Accounting Voucher
                </h2>
                <p className="text-[11px] text-slate-400">Add systematic journal debits and credits. System requires mathematical ledger equilibrium.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVoucherSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50/50 dark:bg-slate-850/10 p-4 rounded-lg border border-slate-100 dark:border-slate-850">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Voucher System Type</label>
                  <select 
                    value={voucherType}
                    onChange={(e) => setVoucherType(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:border-indigo-500 text-xs"
                  >
                    <option value="JV">Journal Voucher (JV)</option>
                    <option value="BP">Bank Payment (BP)</option>
                    <option value="BR">Bank Receipt (BR)</option>
                    <option value="CP">Cash Payment (CP)</option>
                    <option value="CR">Cash Receipt (CR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Posting Date</label>
                  <input 
                    type="date"
                    required
                    value={postingDate}
                    onChange={(e) => setPostingDate(e.target.value)}
                    className="w-full p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Source Reference / Doc Track #</label>
                  <input 
                    type="text"
                    placeholder="e.g. INV-9082, CHQ-2045, K-EL-MAY26"
                    value={refDoc}
                    onChange={(e) => setRefDoc(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">Main Transaction Narration (Universal Note)</label>
                <input 
                  type="text"
                  required
                  placeholder="Provide explicit operational logic for this global bookkeeping adjustment..."
                  value={mainNarration}
                  onChange={(e) => setMainNarration(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400">Account Entry Matrix</h3>
                  <button
                    type="button"
                    onClick={addLedgerLine}
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Split Line
                  </button>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-visible">
                  <div className="grid grid-cols-12 gap-2 bg-slate-50 dark:bg-slate-950/40 p-2.5 font-bold text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <div className="col-span-4">Account Head</div>
                    <div className="col-span-4">Line Remarks / Narration</div>
                    <div className="col-span-2 text-right">Debit (Dr)</div>
                    <div className="col-span-1 text-right">Credit (Cr)</div>
                    <div className="col-span-1 text-center">Action</div>
                  </div>

                  <div className="divide-y divide-slate-150 dark:divide-slate-800/60 max-h-72 overflow-y-visible">
                    {lines.map((line, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 p-2 items-center bg-white dark:bg-slate-900 overflow-visible">
                        
                        <div className="col-span-4">
                          <AccountSearchSelect 
                            financeAccounts={financeAccounts}
                            selectedId={line.accountId}
                            onSelect={(val) => handleLineChange(index, 'accountId', val)}
                          />
                        </div>

                        <div className="col-span-4">
                          <input 
                            type="text"
                            placeholder="Optional line remarks..."
                            value={line.narration}
                            onChange={(e) => handleLineChange(index, 'narration', e.target.value)}
                            className="w-full p-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="col-span-2">
                          <input 
                            type="number"
                            min="0"
                            placeholder="0.00"
                            disabled={line.credit !== ''}
                            value={line.debit}
                            onChange={(e) => handleLineChange(index, 'debit', e.target.value)}
                            className="w-full p-1.5 text-right rounded-md border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-40 font-mono font-bold"
                          />
                        </div>

                        <div className="col-span-1 min-w-[75px]">
                          <input 
                            type="number"
                            min="0"
                            placeholder="0.00"
                            disabled={line.debit !== ''}
                            value={line.credit}
                            onChange={(e) => handleLineChange(index, 'credit', e.target.value)}
                            className="w-full p-1.5 text-right rounded-md border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-40 font-mono font-bold"
                          />
                        </div>

                        <div className="col-span-1 text-center">
                          <button
                            type="button"
                            onClick={() => removeLedgerLine(index)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-12 gap-2 bg-slate-50 dark:bg-slate-950/60 p-3 font-mono font-black text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800">
                    <div className="col-span-8 text-right text-xs uppercase tracking-wider text-slate-400 font-sans">Voucher Totals:</div>
                    <div className="col-span-2 text-right text-indigo-600 dark:text-indigo-400">{formatPKR(totalDebit)}</div>
                    <div className="col-span-1 text-right text-indigo-600 dark:text-indigo-400 min-w-[75px]">{formatPKR(totalCredit)}</div>
                    <div className="col-span-1"></div>
                  </div>
                </div>
              </div>

              <div className={`p-3.5 rounded-lg flex items-start gap-2.5 border transition-all ${
                isBalanced 
                  ? 'bg-emerald-50/40 border-emerald-200 text-emerald-800 dark:bg-emerald-950/10 dark:border-emerald-900/60 dark:text-emerald-400' 
                  : 'bg-amber-50/40 border-amber-200 text-amber-800 dark:bg-amber-950/10 dark:border-amber-900/60 dark:text-amber-400'
              }`}>
                {isBalanced ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-[11px] leading-tight">
                    {isBalanced ? 'Voucher Equilibrium Reached' : 'System Trial Equilibrium Warning'}
                  </h4>
                  <p className="text-[10px] opacity-90 mt-0.5">
                    {isBalanced 
                      ? 'Debits and Credits are perfectly optimized at net zero. Document is legally authorized for general ledger entry.' 
                      : `Voucher is unbalanced. Debits must perfectly equal credits. Current variance mismatch: ${formatPKR(difference)}.`}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-150 dark:border-slate-800 flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={!isBalanced}
                  className={`font-bold transition-all ${
                    isBalanced 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-md' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }`}
                >
                  Authorize & Post Voucher
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Finance;