// Finance Accounts, Journal Entries, P&L, and Balance Sheet Data
export const ACCOUNTS = [
  { id: 'ACC01', name: 'Cash in Hand', type: 'Asset', subType: 'Cash', balance: 345000, accountNo: 'N/A', bank: 'Main Vault', status: 'active' },
  { id: 'ACC02', name: 'HBL Current Account', type: 'Asset', subType: 'Bank', balance: 2450000, accountNo: 'HBL-0098772635-01', bank: 'Habib Bank Limited', status: 'active' },
  { id: 'ACC03', name: 'Meezan Business Account', type: 'Asset', subType: 'Bank', balance: 1850000, accountNo: 'MEZ-2309876251-02', bank: 'Meezan Bank Ltd', status: 'active' },
  { id: 'ACC04', name: 'Petty Cash - Karachi', type: 'Asset', subType: 'Cash', balance: 25000, accountNo: 'N/A', bank: 'HQ Petty Cash Drawer', status: 'active' },
  { id: 'ACC05', name: 'Petty Cash - Lahore', type: 'Asset', subType: 'Cash', balance: 15000, accountNo: 'N/A', bank: 'Lahore Petty Cash Drawer', status: 'active' },
  { id: 'ACC06', name: 'Accounts Receivable (Customers)', type: 'Asset', subType: 'Receivables', balance: 584500, accountNo: 'N/A', bank: 'Customer Ledger', status: 'active' },
  { id: 'ACC07', name: 'Accounts Payable (Suppliers)', type: 'Liability', subType: 'Payables', balance: 642000, accountNo: 'N/A', bank: 'Supplier Ledger', status: 'active' },
];

export const JOURNAL_ENTRIES = [
  { id: 'JE001', date: '2026-06-01', description: 'Monthly rent paid for Karachi & Lahore premises', debitAcc: 'Rent Expense Account', creditAcc: 'HBL Current Account', amount: 250000, reference: 'EXP001, EXP002', recordedBy: 'Zainab Fatima' },
  { id: 'JE002', date: '2026-06-02', description: 'May 2026 Staff Salaries disbursement', debitAcc: 'Salaries & Wages Account', creditAcc: 'HBL Current Account', amount: 480000, reference: 'EXP006, EXP007', recordedBy: 'Zainab Fatima' },
  { id: 'JE003', date: '2026-06-03', description: 'Received payment from Customer Haji Amjad Ali', debitAcc: 'HBL Current Account', creditAcc: 'Accounts Receivable (Customers)', amount: 15000, reference: 'CR-023', recordedBy: 'Zainab Fatima' },
  { id: 'JE004', date: '2026-06-04', description: 'Paid K-Electric utility invoice', debitAcc: 'Utilities Expense Account', creditAcc: 'HBL Current Account', amount: 84500, reference: 'EXP003', recordedBy: 'Zainab Fatima' },
  { id: 'JE005', date: '2026-06-05', description: 'Cash deposit from POS daily sales to HBL account', debitAcc: 'HBL Current Account', creditAcc: 'Cash in Hand', amount: 150000, reference: 'DEP-098', recordedBy: 'Zainab Fatima' },
  { id: 'JE006', date: '2026-06-06', description: 'Supplier payment to Nestlé Pakistan Ltd', debitAcc: 'Accounts Payable (Suppliers)', creditAcc: 'Meezan Business Account', amount: 85000, reference: 'PO-001 Pay', recordedBy: 'Zainab Fatima' },
  { id: 'JE007', date: '2026-06-07', description: 'Purchase of custom shopping bags', debitAcc: 'Packaging Expense Account', creditAcc: 'Meezan Business Account', amount: 45000, reference: 'EXP009', recordedBy: 'Zainab Fatima' },
  { id: 'JE008', date: '2026-06-08', description: 'Payment of LESCO utility bill Lahore store', debitAcc: 'Utilities Expense Account', creditAcc: 'Meezan Business Account', amount: 62300, reference: 'EXP004', recordedBy: 'Hamza Mughal' },
  { id: 'JE009', date: '2026-06-09', description: 'Received payment from Walk-in Credit customer', debitAcc: 'Cash in Hand', creditAcc: 'Accounts Receivable (Customers)', amount: 8500, reference: 'CR-024', recordedBy: 'Zainab Fatima' },
  { id: 'JE010', date: '2026-06-10', description: 'Paid marketing agency for FB promotions', debitAcc: 'Marketing Expense Account', creditAcc: 'HBL Current Account', amount: 20000, reference: 'EXP010', recordedBy: 'Zainab Fatima' },
  { id: 'JE011', date: '2026-06-11', description: 'Replenished Petty Cash Lahore branch', debitAcc: 'Petty Cash - Lahore', creditAcc: 'Cash in Hand', amount: 10000, reference: 'PC-REPL-01', recordedBy: 'Hamza Mughal' },
  { id: 'JE012', date: '2026-06-12', description: 'Settled outstanding payable to National Foods & Farms', debitAcc: 'Accounts Payable (Suppliers)', creditAcc: 'Meezan Business Account', amount: 120000, reference: 'PO-005 Pay', recordedBy: 'Zainab Fatima' },
  { id: 'JE013', date: '2026-06-13', description: 'Recorded cash sales for POS counters (June 1-13)', debitAcc: 'Cash in Hand', creditAcc: 'POS Sales Revenue Account', amount: 1845000, reference: 'POS-TXNS-JUN', recordedBy: 'Zainab Fatima' },
  { id: 'JE014', date: '2026-06-13', description: 'Recorded Cost of Goods Sold (COGS) for June 1-13 sales', debitAcc: 'Cost of Goods Sold (COGS) Account', creditAcc: 'Inventory Value Account', amount: 1383750, reference: 'COGS-TXNS-JUN', recordedBy: 'Zainab Fatima' },
  { id: 'JE015', date: '2026-06-13', description: 'Paid generator maintenance charges from petty cash', debitAcc: 'Maintenance Expense Account', creditAcc: 'Petty Cash - Karachi', amount: 12000, reference: 'EXP012', recordedBy: 'Mohammad Ali' },
];

export const PROFIT_AND_LOSS = {
  currentPeriod: 'June 1 - June 13, 2026',
  revenue: {
    sales: 1845000,
    services: 12000,
    other: 8500,
    total: 1865500
  },
  cogs: {
    beginningInventory: 3450000,
    purchases: 850000,
    endingInventory: 2916250,
    total: 1383750 // beginning + purchases - ending
  },
  expenses: {
    salaries: 480000,
    rent: 250000,
    utilities: 168000,
    logistics: 92000,
    packaging: 75000,
    marketing: 45000,
    maintenance: 38500,
    taxes: 58000,
    miscellaneous: 22000,
    total: 1228500
  },
  netProfit: 253250 // revenue - cogs - expenses
};

export const BALANCE_SHEET = {
  asOf: 'June 13, 2026',
  assets: {
    current: [
      { name: 'Cash & Cash Equivalents', amount: 4685000 },
      { name: 'Accounts Receivable', amount: 584500 },
      { name: 'Inventory Asset Value', amount: 2916250 },
      { name: 'Prepaid Expenses', amount: 120000 },
      { name: 'Total Current Assets', amount: 8305750 }
    ],
    nonCurrent: [
      { name: 'Store Fixtures & Shelves', amount: 850000 },
      { name: 'Refrigerators & Freezers', amount: 1200000 },
      { name: 'Delivery Vehicles', amount: 1500000 },
      { name: 'POS Hardware & Computers', amount: 450000 },
      { name: 'Accumulated Depreciation', amount: -650000 },
      { name: 'Total Non-Current Assets', amount: 3350000 }
    ],
    total: 11655750 // Current + Non-Current
  },
  liabilities: {
    current: [
      { name: 'Accounts Payable (Suppliers)', amount: 642000 },
      { name: 'Accrued Expenses & Salaries', amount: 45000 },
      { name: 'Sales Tax Payable (FBR)', amount: 125800 },
      { name: 'Total Current Liabilities', amount: 812800 }
    ],
    nonCurrent: [
      { name: 'Long-term Bank Loan (Meezan)', amount: 2000000 },
      { name: 'Total Non-Current Liabilities', amount: 2000000 }
    ],
    total: 2812800 // Current + Non-Current
  },
  equity: {
    shareCapital: 6000000,
    retainedEarnings: 2589700,
    currentEarnings: 253250,
    total: 8842950 // shareCapital + retainedEarnings + currentEarnings
  }
};

export const CASH_FLOW = {
  period: 'June 1 - June 13, 2026',
  operating: {
    cashFromSales: 1845000,
    cashPaidToSuppliers: -385000,
    cashPaidForExpenses: -1228500,
    netOperatingCash: 231500
  },
  investing: {
    purchaseOfDeliveryVan: 0,
    purchaseOfEquipment: -85000,
    netInvestingCash: -85000
  },
  financing: {
    loanRepayments: -50000,
    equityWithdrawals: 0,
    netFinancingCash: -50000
  },
  netChange: 96500 // operating + investing + financing
};

export const getAccountBalances = () => ACCOUNTS.map(a => ({ name: a.name, balance: a.balance }));
export const getJournalEntriesRange = (start, end) => JOURNAL_ENTRIES.filter(j => j.date >= start && j.date <= end);
export const getCashAccountsTotal = () => ACCOUNTS.filter(a => a.subType === 'Cash').reduce((sum, a) => sum + a.balance, 0);
export const getBankAccountsTotal = () => ACCOUNTS.filter(a => a.subType === 'Bank').reduce((sum, a) => sum + a.balance, 0);
