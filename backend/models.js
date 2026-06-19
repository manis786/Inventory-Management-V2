const mongoose = require('mongoose');

// ==========================================
// 1. USER SCHEMA
// ==========================================
const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // admin123, password123, etc.
  role: { type: String, required: true, enum: ['ADMIN', 'MANAGER', 'CASHIER', 'AUDITOR'] },
  status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
  branch: { type: String, default: 'Karachi HQ' },
  phone: { type: String },
  lastLogin: { type: String, default: '' },
  avatar: { type: String, default: '👤' }
}, { timestamps: true });

// ==========================================
// 2. CATEGORY SCHEMA
// ==========================================
const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, default: '📁' },
  color: { type: String, default: '#6366f1' }
}, { timestamps: true });

// ==========================================
// 3. PRODUCT SCHEMA
// ==========================================
const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String },
  categoryId: { type: String },
  costPrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  minStock: { type: Number, default: 10 },
  unit: { type: String, default: 'Pack' },
  barcode: { type: String },
  expiryDate: { type: String },
  supplier: { type: String }, // Supplier code like 'SUP001'
  image: { type: String, default: '📦' }, // emoji
  brand: { type: String },
  description: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

// ==========================================
// 4. TRANSACTION (SALES) SCHEMA
// ==========================================
const TransactionItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  costPrice: { type: Number, required: true }
}, { _id: false });

const TransactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  customer: { type: String, default: 'Walk-In Customer' },
  customerId: { type: String, default: 'C005' },
  items: [TransactionItemSchema],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentType: { type: String, required: true, enum: ['Cash', 'Card', 'UPI/JazzCash', 'EasyPaisa', 'Udhaar', 'Credit', 'Mobile'] },
  status: { type: String, required: true, enum: ['Paid', 'Unpaid'], default: 'Paid' },
  cashier: { type: String, default: 'Admin' },
  branch: { type: String, default: 'Karachi HQ' }
}, { timestamps: true });

// ==========================================
// 5. EXPENSE SCHEMA
// ==========================================
const ExpenseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true, enum: ['Paid', 'Pending', 'Voided'], default: 'Paid' },
  paymentMethod: { type: String, default: 'Cash' },
  branch: { type: String, default: 'Karachi HQ' },
  description: { type: String },
  recordedBy: { type: String, default: 'Admin' }
}, { timestamps: true });

// ==========================================
// 6. SUPPLIER SCHEMA
// ==========================================
const SupplierSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  city: { type: String },
  address: { type: String },
  balance: { type: Number, default: 0 }, // Payable balance
  totalOrders: { type: Number, default: 0 },
  lastOrder: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  rating: { type: Number, default: 5.0 },
  paymentTerms: { type: String, default: 'Net 30' }
}, { timestamps: true });

// ==========================================
// 7. CUSTOMER SCHEMA
// ==========================================
const CustomerLedgerSchema = new mongoose.Schema({
  date: { type: String, required: true },
  type: { type: String, required: true },
  ref: { type: String },
  debit: { type: Number, default: 0 },
  credit: { type: Number, default: 0 },
  balance: { type: Number, default: 0 }
}, { _id: false });

const CustomerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  balance: { type: Number, default: 0 }, // Credit balance (Khata)
  totalTransactions: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  joinDate: { type: String },
  isKhata: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  avatar: { type: String, default: '👤' },
  ledger: [CustomerLedgerSchema]
}, { timestamps: true });

// ==========================================
// 8. PURCHASE ORDER SCHEMA
// ==========================================
const PurchaseItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true }
}, { _id: false });

const PurchaseOrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  supplier: { type: String, required: true },
  supplierId: { type: String, required: true },
  items: [PurchaseItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['Received', 'Pending', 'Partial', 'Cancelled'], default: 'Pending' },
  receivedDate: { type: String },
  paymentStatus: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
  notes: { type: String, default: '' },
  branch: { type: String, default: 'BR001' }
}, { timestamps: true });

// ==========================================
// 9. FINANCE ACCOUNT SCHEMA
// ==========================================
const FinanceAccountSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'] },
  subType: { type: String }, // Cash, Bank, Receivables, Payables, etc.
  balance: { type: Number, default: 0 },
  accountNo: { type: String, default: 'N/A' },
  bank: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

// ==========================================
// 10. JOURNAL ENTRY SCHEMA
// ==========================================
const JournalEntrySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  debitAcc: { type: String, required: true },
  creditAcc: { type: String, required: true },
  amount: { type: Number, required: true },
  reference: { type: String },
  recordedBy: { type: String, default: 'Admin' }
}, { timestamps: true });

// ==========================================
// 11. STORE SETTINGS SCHEMA
// ==========================================
const BranchSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String },
  isActive: { type: Boolean, default: true }
}, { _id: false });

const StoreSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'general' }, // always 'general' for singleton settings
  name: { type: String, required: true, default: 'MartPro' },
  tagline: { type: String, default: 'Smart Retail, Simplified' },
  fullName: { type: String, default: 'MartPro Supermart' },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  ntn: { type: String },
  owner: { type: String },
  currency: { type: String, default: 'PKR' },
  currencySymbol: { type: String, default: 'Rs' },
  branches: [BranchSchema],
  cartTaxPercent: { type: Number, default: 17 } // propagatable tax percentage
}, { timestamps: true });

// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  User: mongoose.model('User', UserSchema),
  Category: mongoose.model('Category', CategorySchema),
  Product: mongoose.model('Product', ProductSchema),
  Transaction: mongoose.model('Transaction', TransactionSchema),
  Expense: mongoose.model('Expense', ExpenseSchema),
  Supplier: mongoose.model('Supplier', SupplierSchema),
  Customer: mongoose.model('Customer', CustomerSchema),
  PurchaseOrder: mongoose.model('PurchaseOrder', PurchaseOrderSchema),
  FinanceAccount: mongoose.model('FinanceAccount', FinanceAccountSchema),
  JournalEntry: mongoose.model('JournalEntry', JournalEntrySchema),
  StoreSettings: mongoose.model('StoreSettings', StoreSettingsSchema)
};
