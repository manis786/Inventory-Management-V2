require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const models = require('./models');
const { seedDatabase } = require('./seedData');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inventory-management';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully!');
    // Seed database if empty
    try {
      await seedDatabase();
    } catch (err) {
      console.error('Error seeding database:', err);
    }
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });

// ==========================================
// ID GENERATION HELPER
// ==========================================
async function getNextId(Model, prefix, idField = 'id', digits = 3, delimiter = '') {
  const items = await Model.find({}, { [idField]: 1 });
  let maxNum = 0;
  items.forEach(item => {
    const idVal = item[idField];
    if (idVal && idVal.startsWith(prefix)) {
      const numPart = idVal.slice(prefix.length);
      const parsed = parseInt(numPart, 10);
      if (!isNaN(parsed) && parsed > maxNum) {
        maxNum = parsed;
      }
    }
  });
  const nextNum = maxNum + 1;
  return `${prefix}${delimiter}${String(nextNum).padStart(digits, '0')}`;
}

// ==========================================
// 1. AUTHENTICATION ROUTE
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Try finding user by email or username
    const user = await models.User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: email }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account is deactivated. Contact administrator.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials. Wrong password.' });
    }

    // Update lastLogin
    const currentStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    user.lastLogin = currentStr;
    await user.save();

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ message: 'Login successful', user: userObj });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during authentication' });
  }
});

// ==========================================
// 2. USER MANAGEMENT ROUTES
// ==========================================
app.get('/api/users', async (req, res) => {
  try {
    const users = await models.User.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const nextId = await getNextId(models.User, 'USR');
    const newUser = new models.User({
      ...req.body,
      id: nextId,
      password: req.body.password || 'password123',
      avatar: req.body.avatar || (req.body.role === 'ADMIN' ? '👩‍💼' : req.body.role === 'MANAGER' ? '👨‍💼' : '👨‍💻')
    });
    const saved = await newUser.save();
    const obj = saved.toObject();
    delete obj.password;
    res.status(201).json(obj);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await models.User.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    const obj = user.toObject();
    delete obj.password;
    res.json(obj);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const deleted = await models.User.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 3. PRODUCT ROUTES
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    const products = await models.Product.find({}).sort({ id: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const nextId = await getNextId(models.Product, 'P');
    const newProduct = new models.Product({
      ...req.body,
      id: nextId
    });
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await models.Product.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const deleted = await models.Product.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 4. CATEGORY ROUTES
// ==========================================
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await models.Category.find({}).sort({ id: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const nextId = await getNextId(models.Category, 'CAT', 'id', 2);
    const newCategory = new models.Category({
      ...req.body,
      id: nextId
    });
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const category = await models.Category.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const deleted = await models.Category.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 5. TRANSACTION (SALES) ROUTES
// ==========================================
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await models.Transaction.find({}).sort({ date: -1, time: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const nextId = await getNextId(models.Transaction, 'TXN', 'id', 3, '-');
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5);

    const txData = {
      ...req.body,
      id: nextId,
      date: req.body.date || todayStr,
      time: req.body.time || timeStr
    };

    const newTx = new models.Transaction(txData);
    const saved = await newTx.save({ session });

    // Deduct stock for products and log journal entries
    for (const item of txData.items) {
      const prod = await models.Product.findOne({ id: item.productId }).session(session);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.qty);
        await prod.save({ session });
      }
    }

    // Double entry finance updates for Sales
    // Credit Revenue, Debit Asset Cash/Bank
    const totalAmount = txData.total;
    const cogsAmount = txData.items.reduce((sum, item) => sum + (item.costPrice * item.qty), 0);

    // 1. Debit Cash/Bank or Receivables
    let debitAccName = 'Cash in Hand';
    if (txData.paymentType === 'Card') {
      debitAccName = 'HBL Current Account';
    } else if (txData.paymentType === 'Mobile' || txData.paymentType === 'UPI/JazzCash' || txData.paymentType === 'EasyPaisa') {
      debitAccName = 'Meezan Business Account';
    } else if (txData.paymentType === 'Udhaar' || txData.paymentType === 'Credit') {
      debitAccName = 'Accounts Receivable (Customers)';

      // If Udhaar, add to Customer Khata balance
      if (txData.customerId) {
        const cust = await models.Customer.findOne({ id: txData.customerId }).session(session);
        if (cust) {
          cust.balance += totalAmount;
          cust.totalSpent += totalAmount;
          cust.totalTransactions += 1;
          await cust.save({ session });
        }
      }
    } else {
      // Normal sales update customer spent if customer exists
      if (txData.customerId) {
        const cust = await models.Customer.findOne({ id: txData.customerId }).session(session);
        if (cust) {
          cust.totalSpent += totalAmount;
          cust.totalTransactions += 1;
          await cust.save({ session });
        }
      }
    }

    // Update Accounts: Debit Asset Cash/Bank (increases balance)
    const assetAccount = await models.FinanceAccount.findOne({ name: debitAccName }).session(session);
    if (assetAccount) {
      assetAccount.balance += totalAmount;
      await assetAccount.save({ session });
    }

    // Record Journal Entry for sale
    const jeId = await getNextId(models.JournalEntry, 'JE');
    const saleJE = new models.JournalEntry({
      id: jeId,
      date: txData.date,
      description: `POS Checkout sales transaction ${nextId}`,
      debitAcc: debitAccName,
      creditAcc: 'POS Sales Revenue Account',
      amount: totalAmount,
      reference: nextId,
      recordedBy: txData.cashier || 'Admin'
    });
    await saleJE.save({ session });

    // Also deduct COGS from Inventory account and debit COGS
    const inventoryAccount = await models.FinanceAccount.findOne({ name: 'Inventory Asset Value' }).session(session);
    if (inventoryAccount) {
      inventoryAccount.balance = Math.max(0, inventoryAccount.balance - cogsAmount);
      await inventoryAccount.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(saved);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
});

// ==========================================
// 6. EXPENSE ROUTES
// ==========================================
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await models.Expense.find({}).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/expenses', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const nextId = await getNextId(models.Expense, 'EXP');
    const newExpense = new models.Expense({
      ...req.body,
      id: nextId
    });
    const saved = await newExpense.save({ session });

    // Update financial accounts if Paid
    if (req.body.status === 'Paid') {
      const amount = Number(req.body.amount);
      let creditAccName = 'Cash in Hand';
      if (req.body.paymentMethod === 'Card') {
        creditAccName = 'HBL Current Account';
      } else if (req.body.paymentMethod === 'EasyPaisa' || req.body.paymentMethod === 'Bank Transfer') {
        creditAccName = 'Meezan Business Account';
      }

      // Credit cash/bank (deduct)
      const assetAcc = await models.FinanceAccount.findOne({ name: creditAccName }).session(session);
      if (assetAcc) {
        assetAcc.balance = Math.max(0, assetAcc.balance - amount);
        await assetAcc.save({ session });
      }

      // Record Journal Entry
      const jeId = await getNextId(models.JournalEntry, 'JE');
      const expenseJE = new models.JournalEntry({
        id: jeId,
        date: req.body.date || new Date().toISOString().split('T')[0],
        description: `Paid expense voucher: ${req.body.title}`,
        debitAcc: `${req.body.category} Expense Account`,
        creditAcc: creditAccName,
        amount: amount,
        reference: nextId,
        recordedBy: req.body.recordedBy || 'Admin'
      });
      await expenseJE.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).json(saved);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const deleted = await models.Expense.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 7. SUPPLIER ROUTES
// ==========================================
app.get('/api/suppliers', async (req, res) => {
  try {
    const suppliers = await models.Supplier.find({}).sort({ id: 1 });
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/suppliers', async (req, res) => {
  try {
    const nextId = await getNextId(models.Supplier, 'SUP');
    const newSupplier = new models.Supplier({
      ...req.body,
      id: nextId
    });
    const saved = await newSupplier.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/suppliers/:id', async (req, res) => {
  try {
    const supplier = await models.Supplier.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Record supplier payment disbursement
app.post('/api/suppliers/:id/payments', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { amount, paymentMethod } = req.body;
    const supId = req.params.id;

    const supplier = await models.Supplier.findOne({ id: supId }).session(session);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const payVal = Number(amount);
    if (payVal > supplier.balance) {
      return res.status(400).json({ message: 'Payment exceeds payable balance' });
    }

    // 1. Deduct outstanding supplier balance
    supplier.balance = Math.max(0, supplier.balance - payVal);
    await supplier.save({ session });

    // 2. Double Entry Account Updates
    // Debit Accounts Payable (decreases liability)
    // Credit Cash/Bank (decreases asset)
    let creditAccName = 'Cash in Hand';
    if (paymentMethod === 'Card') {
      creditAccName = 'HBL Current Account';
    } else if (paymentMethod === 'EasyPaisa' || paymentMethod === 'Bank Transfer') {
      creditAccName = 'Meezan Business Account';
    }

    const cashAcc = await models.FinanceAccount.findOne({ name: creditAccName }).session(session);
    if (cashAcc) {
      cashAcc.balance = Math.max(0, cashAcc.balance - payVal);
      await cashAcc.save({ session });
    }

    const payableAcc = await models.FinanceAccount.findOne({ name: 'Accounts Payable (Suppliers)' }).session(session);
    if (payableAcc) {
      payableAcc.balance = Math.max(0, payableAcc.balance - payVal);
      await payableAcc.save({ session });
    }

    // 3. Create Journal Entry
    const jeId = await getNextId(models.JournalEntry, 'JE');
    const payJE = new models.JournalEntry({
      id: jeId,
      date: new Date().toISOString().split('T')[0],
      description: `Disbursed payment of Rs. ${payVal.toLocaleString()} to supplier ${supplier.name}`,
      debitAcc: 'Accounts Payable (Suppliers)',
      creditAcc: creditAccName,
      amount: payVal,
      reference: `${supId} Pay`,
      recordedBy: 'Admin'
    });
    await payJE.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Payment recorded successfully', supplier });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
});

// ==========================================
// 8. CUSTOMER ROUTES
// ==========================================
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await models.Customer.find({}).sort({ id: 1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const nextId = await getNextId(models.Customer, 'C');
    const newCustomer = new models.Customer({
      ...req.body,
      id: nextId,
      joinDate: req.body.joinDate || new Date().toISOString().split('T')[0]
    });
    const saved = await newCustomer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const customer = await models.Customer.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const deleted = await models.Customer.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Record customer Udhaar collection payment
app.post('/api/customers/:id/payments', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { amount, paymentMethod } = req.body;
    const custId = req.params.id;

    const customer = await models.Customer.findOne({ id: custId }).session(session);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const payVal = Number(amount);
    if (payVal > customer.balance) {
      return res.status(400).json({ message: 'Payment exceeds outstanding credit balance' });
    }

    // 1. Deduct customer balance
    customer.balance = Math.max(0, customer.balance - payVal);
    
    // 2. Add entry to Customer Ledger
    const todayStr = new Date().toISOString().split('T')[0];
    const payRef = `PAY-${Date.now().toString().slice(-4)}`;
    customer.ledger.unshift({
      date: todayStr,
      type: 'Payment',
      ref: payRef,
      debit: 0,
      credit: payVal,
      balance: customer.balance
    });
    await customer.save({ session });

    // 3. Double Entry Account Updates
    // Debit Cash/Bank (increases asset)
    // Credit Accounts Receivable (decreases asset)
    let debitAccName = 'Cash in Hand';
    if (paymentMethod === 'Card') {
      debitAccName = 'HBL Current Account';
    } else if (paymentMethod === 'EasyPaisa' || paymentMethod === 'Mobile' || paymentMethod === 'Bank Transfer') {
      debitAccName = 'Meezan Business Account';
    }

    const cashAcc = await models.FinanceAccount.findOne({ name: debitAccName }).session(session);
    if (cashAcc) {
      cashAcc.balance += payVal;
      await cashAcc.save({ session });
    }

    const receivableAcc = await models.FinanceAccount.findOne({ name: 'Accounts Receivable (Customers)' }).session(session);
    if (receivableAcc) {
      receivableAcc.balance = Math.max(0, receivableAcc.balance - payVal);
      await receivableAcc.save({ session });
    }

    // 4. Create Journal Entry
    const jeId = await getNextId(models.JournalEntry, 'JE');
    const payJE = new models.JournalEntry({
      id: jeId,
      date: todayStr,
      description: `Collected Udhaar payment of Rs. ${payVal.toLocaleString()} from customer ${customer.name}`,
      debitAcc: debitAccName,
      creditAcc: 'Accounts Receivable (Customers)',
      amount: payVal,
      reference: payRef,
      recordedBy: 'Admin'
    });
    await payJE.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Payment collected successfully', customer });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
});

// ==========================================
// 9. PURCHASE ORDER ROUTES
// ==========================================
app.get('/api/purchases', async (req, res) => {
  try {
    const purchases = await models.PurchaseOrder.find({}).sort({ date: -1 });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/purchases', async (req, res) => {
  try {
    const nextId = await getNextId(models.PurchaseOrder, 'PO', 'id', 3, '-');
    const newPurchase = new models.PurchaseOrder({
      ...req.body,
      id: nextId
    });
    const saved = await newPurchase.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/purchases/:id', async (req, res) => {
  try {
    const purchase = await models.PurchaseOrder.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!purchase) return res.status(404).json({ message: 'Purchase order not found' });
    res.json(purchase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/purchases/:id', async (req, res) => {
  try {
    const deleted = await models.PurchaseOrder.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Purchase order not found' });
    res.json({ message: 'Purchase order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 10. FINANCE ROUTES
// ==========================================
app.get('/api/finance/accounts', async (req, res) => {
  try {
    const accounts = await models.FinanceAccount.find({}).sort({ id: 1 });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/finance/journal', async (req, res) => {
  try {
    const journal = await models.JournalEntry.find({}).sort({ date: -1 });
    res.json(journal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/finance/journal', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const nextId = await getNextId(models.JournalEntry, 'JE');
    const newJE = new models.JournalEntry({
      ...req.body,
      id: nextId
    });
    const saved = await newJE.save({ session });

    // Deduct credit account balance, Add debit account balance
    // Simple double-entry impact:
    // Assets: Debit (+), Credit (-)
    // Liabilities: Debit (-), Credit (+)
    const amount = Number(req.body.amount);

    const debitAcc = await models.FinanceAccount.findOne({ name: req.body.debitAcc }).session(session);
    if (debitAcc) {
      if (debitAcc.type === 'Asset' || debitAcc.type === 'Expense') {
        debitAcc.balance += amount;
      } else {
        debitAcc.balance = Math.max(0, debitAcc.balance - amount);
      }
      await debitAcc.save({ session });
    }

    const creditAcc = await models.FinanceAccount.findOne({ name: req.body.creditAcc }).session(session);
    if (creditAcc) {
      if (creditAcc.type === 'Asset' || creditAcc.type === 'Expense') {
        creditAcc.balance = Math.max(0, creditAcc.balance - amount);
      } else {
        creditAcc.balance += amount;
      }
      await creditAcc.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(saved);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
});

// ==========================================
// 11. GENERAL STORE SETTINGS ROUTES
// ==========================================
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await models.StoreSettings.findOne({ key: 'general' });
    if (!settings) {
      // Create default settings if not exists
      settings = new models.StoreSettings({ key: 'general' });
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const settings = await models.StoreSettings.findOneAndUpdate(
      { key: 'general' },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
