import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { SUPPLIERS } from '../data/suppliers';
import { CUSTOMERS } from '../data/customers';
import { TRANSACTIONS } from '../data/transactions';
import { PURCHASE_ORDERS } from '../data/purchases';
import { EXPENSES } from '../data/expenses';
import { INVENTORY_MOVEMENTS } from '../data/inventory';
import { ACCOUNTS, JOURNAL_ENTRIES } from '../data/finance';
import { USERS } from '../data/users';
import { STORE_INFO } from '../data/store';
import { useTheme } from '../hooks/useTheme';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation & Theme
  const { theme, toggleTheme, isDark } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('Dashboard');
  const [breadcrumbs, setBreadcrumbs] = useState([{ label: 'Dashboard', path: '/' }]);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', message: 'Low Stock Alert: Olper\'s Full Cream Milk 1L is below minimum (12 items left)', time: '10 mins ago', read: false },
    { id: 2, type: 'info', message: 'New Purchase Order PO-052 has been drafted and pending approval', time: '1 hour ago', read: false },
    { id: 3, type: 'success', message: 'Payment of Rs. 85,000 received from Haji Amjad Ali', time: '4 hours ago', read: true },
    { id: 4, type: 'error', message: 'FBR POS Invoice Sync failed for Cashier Terminal 2', time: '1 day ago', read: true }
  ]);

  // Toast System
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Data States
  const [products, setProducts] = useState(PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [suppliers, setSuppliers] = useState(SUPPLIERS);
  const [customers, setCustomers] = useState(CUSTOMERS);
  const [transactions, setTransactions] = useState(TRANSACTIONS);
  const [purchases, setPurchases] = useState(PURCHASE_ORDERS);
  const [expenses, setExpenses] = useState(EXPENSES);
  const [inventoryMovements, setInventoryMovements] = useState(INVENTORY_MOVEMENTS);
  const [financeAccounts, setFinanceAccounts] = useState(ACCOUNTS);
  const [journalEntries, setJournalEntries] = useState(JOURNAL_ENTRIES);
  const [users, setUsers] = useState(USERS);
  const [currentUser, setCurrentUser] = useState(USERS[0]); // Default Zainab Fatima (ADMIN)
  const [storeSettings, setStoreSettings] = useState(STORE_INFO);

  // POS State
  const [cart, setCart] = useState([]);
  const [cartCustomer, setCartCustomer] = useState(null);
  const [cartDiscount, setCartDiscount] = useState({ type: 'flat', value: 0 }); // flat or percentage
  const [cartTaxPercent, setCartTaxPercent] = useState(18); // Default FBR retail tax
  const [cartPaymentMethod, setCartPaymentMethod] = useState('Cash');

  // Breadcrumbs sync
  useEffect(() => {
    const items = [{ label: 'MartPro ERP', path: '/' }];
    if (activeModule === 'Dashboard') {
      items.push({ label: 'Dashboard', path: '/' });
    } else {
      items.push({ label: activeModule, path: `/${activeModule.toLowerCase().replace(/\s+/g, '')}` });
    }
    setBreadcrumbs(items);
  }, [activeModule]);

  // Product CRUD
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: `P${String(products.length + 1).padStart(3, '0')}`,
      stock: Number(product.stock || 0),
      costPrice: Number(product.costPrice || 0),
      salePrice: Number(product.salePrice || 0),
      minStock: Number(product.minStock || 10),
      status: 'active'
    };
    setProducts((prev) => [newProduct, ...prev]);
    // Log Stock In Movement if initial stock is > 0
    if (newProduct.stock > 0) {
      logStockMovement({
        productId: newProduct.id,
        productName: newProduct.name,
        sku: newProduct.barcode || 'N/A',
        type: 'Stock In',
        quantity: newProduct.stock,
        source: 'Initial Stock Setup',
        destination: 'Karachi HQ Warehouse',
        notes: 'Initial quantity set during product registration',
        referenceId: 'REG-NEW'
      });
    }
    addToast(`Product "${newProduct.name}" added successfully!`, 'success');
  };

  const updateProduct = (updatedProduct) => {
    setProducts((prev) => prev.map((p) => p.id === updatedProduct.id ? updatedProduct : p));
    addToast(`Product "${updatedProduct.name}" updated successfully!`, 'success');
  };

  const deleteProduct = (id) => {
    const name = products.find(p => p.id === id)?.name || 'Product';
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast(`Product "${name}" deleted!`, 'warning');
  };

  // Category CRUD
  const addCategory = (category) => {
    const newCat = {
      ...category,
      id: `CAT${String(categories.length + 1).padStart(2, '0')}`,
      productCount: 0
    };
    setCategories((prev) => [...prev, newCat]);
    addToast(`Category "${newCat.name}" created!`, 'success');
  };

  const updateCategory = (updatedCat) => {
    setCategories((prev) => prev.map((c) => c.id === updatedCat.id ? updatedCat : c));
    addToast(`Category "${updatedCat.name}" updated!`, 'success');
  };

  const deleteCategory = (id) => {
    const name = categories.find(c => c.id === id)?.name || 'Category';
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addToast(`Category "${name}" removed!`, 'warning');
  };

  // Customer CRUD
  const addCustomer = (customer) => {
    const newCust = {
      ...customer,
      id: `C${String(customers.length + 1).padStart(3, '0')}`,
      balance: Number(customer.balance || 0),
      totalTransactions: 0,
      totalSpent: 0,
      status: 'active',
      ledger: []
    };
    setCustomers((prev) => [newCust, ...prev]);
    addToast(`Customer "${newCust.name}" registered!`, 'success');
  };

  const updateCustomer = (updatedCust) => {
    setCustomers((prev) => prev.map((c) => c.id === updatedCust.id ? updatedCust : c));
    addToast(`Customer "${updatedCust.name}" profile updated!`, 'success');
  };

  const addCustomerPayment = (customerId, amount, paymentMethod) => {
    const amt = Number(amount);
    setCustomers((prev) => prev.map((c) => {
      if (c.id === customerId) {
        const newBalance = c.balance - amt;
        const newLedger = [
          { date: new Date().toISOString().split('T')[0], type: 'Payment', ref: `PAY-${Date.now().toString().slice(-4)}`, debit: 0, credit: amt, balance: newBalance },
          ...(c.ledger || [])
        ];
        return {
          ...c,
          balance: newBalance,
          ledger: newLedger
        };
      }
      return c;
    }));

    // Increment Finance account
    adjustFinanceAccount(
      paymentMethod === 'Cash' ? 'ACC01' : paymentMethod === 'Card' ? 'ACC02' : 'ACC03',
      amt
    );

    // Record Journal Entry
    const customerName = customers.find(c => c.id === customerId)?.name || 'Customer';
    const cashBankAcc = paymentMethod === 'Cash' ? 'Cash in Hand' : paymentMethod === 'Card' ? 'HBL Current Account' : 'Meezan Business Account';
    recordJournalEntry({
      description: `Payment received from customer: ${customerName}`,
      debitAcc: cashBankAcc,
      creditAcc: 'Accounts Receivable (Customers)',
      amount: amt,
      reference: `PAY-REC-${customerId}`
    });

    addToast(`Recorded payment of Rs. ${amt.toLocaleString()} from ${customerName}`, 'success');
  };

  // Supplier CRUD
  const addSupplier = (supplier) => {
    const newSup = {
      ...supplier,
      id: `SUP${String(suppliers.length + 1).padStart(3, '0')}`,
      balance: Number(supplier.balance || 0),
      totalOrders: 0,
      status: 'active'
    };
    setSuppliers((prev) => [newSup, ...prev]);
    addToast(`Supplier "${newSup.name}" registered!`, 'success');
  };

  const updateSupplier = (updatedSup) => {
    setSuppliers((prev) => prev.map((s) => s.id === updatedSup.id ? updatedSup : s));
    addToast(`Supplier "${updatedSup.name}" details updated!`, 'success');
  };

  const addSupplierPayment = (supplierId, amount, paymentMethod) => {
    const amt = Number(amount);
    setSuppliers((prev) => prev.map((s) => {
      if (s.id === supplierId) {
        return {
          ...s,
          balance: Math.max(0, s.balance - amt)
        };
      }
      return s;
    }));

    // Deduct from Finance Account
    adjustFinanceAccount(
      paymentMethod === 'Cash' ? 'ACC01' : paymentMethod === 'Card' ? 'ACC02' : 'ACC03',
      -amt
    );

    // Record Journal Entry
    const supplierName = suppliers.find(s => s.id === supplierId)?.name || 'Supplier';
    const cashBankAcc = paymentMethod === 'Cash' ? 'Cash in Hand' : paymentMethod === 'Card' ? 'HBL Current Account' : 'Meezan Business Account';
    recordJournalEntry({
      description: `Payment to supplier: ${supplierName}`,
      debitAcc: 'Accounts Payable (Suppliers)',
      creditAcc: cashBankAcc,
      amount: amt,
      reference: `SUP-PAY-${supplierId}`
    });

    addToast(`Paid Rs. ${amt.toLocaleString()} to ${supplierName}`, 'success');
  };

  // Expenses CRUD
  const addExpense = (expense) => {
    const newExp = {
      ...expense,
      id: `EXP${String(expenses.length + 1).padStart(3, '0')}`,
      amount: Number(expense.amount),
      date: expense.date || new Date().toISOString().split('T')[0],
      status: expense.status || 'Paid',
      recordedBy: currentUser.name
    };
    setExpenses((prev) => [newExp, ...prev]);

    if (newExp.status === 'Paid') {
      // Deduct from Account
      adjustFinanceAccount(
        newExp.paymentMethod === 'Cash' ? 'ACC01' : newExp.paymentMethod === 'Card' ? 'ACC02' : 'ACC03',
        -newExp.amount
      );
      // Journal Entry
      const cashBankAcc = newExp.paymentMethod === 'Cash' ? 'Cash in Hand' : newExp.paymentMethod === 'Card' ? 'HBL Current Account' : 'Meezan Business Account';
      recordJournalEntry({
        description: `Expense Paid: ${newExp.title}`,
        debitAcc: newExp.category,
        creditAcc: cashBankAcc,
        amount: newExp.amount,
        reference: newExp.id
      });
    }

    addToast(`Expense "${newExp.title}" recorded!`, 'success');
  };

  const updateExpense = (updatedExp) => {
    setExpenses((prev) => prev.map((e) => e.id === updatedExp.id ? updatedExp : e));
    addToast(`Expense details updated!`, 'success');
  };

  const deleteExpense = (id) => {
    const title = expenses.find(e => e.id === id)?.title || 'Expense';
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    addToast(`Expense "${title}" removed!`, 'warning');
  };

  // Inventory Stock Movements Log
  const logStockMovement = (movement) => {
    const newMove = {
      ...movement,
      id: `MV${String(inventoryMovements.length + 1).padStart(3, '0')}`,
      date: movement.date || new Date().toISOString().replace('T', ' ').slice(0, 16),
      recordedBy: movement.recordedBy || currentUser.name
    };
    setInventoryMovements((prev) => [newMove, ...prev]);
  };

  const addStockAdjustment = (prodId, qty, type, reason) => {
    const targetProd = products.find(p => p.id === prodId);
    if (!targetProd) return;

    const change = Number(qty);
    const updatedStock = type === 'add' ? targetProd.stock + change : Math.max(0, targetProd.stock - change);

    setProducts((prev) => prev.map((p) => {
      if (p.id === prodId) {
        return { ...p, stock: updatedStock };
      }
      return p;
    }));

    logStockMovement({
      productId: prodId,
      productName: targetProd.name,
      sku: targetProd.barcode || 'N/A',
      type: type === 'add' ? 'Stock In' : 'Adjustment',
      quantity: type === 'add' ? change : -change,
      source: type === 'add' ? 'Manual Check-in' : 'Store Floor Shelf',
      destination: type === 'add' ? 'Karachi HQ Shelf' : 'Damaged/Expired',
      notes: reason || 'Manual adjustment',
      referenceId: `ADJ-${Date.now().toString().slice(-4)}`
    });

    addToast(`Stock for "${targetProd.name}" adjusted by ${type === 'add' ? '+' : '-'}${change}`, 'success');
  };

  // Purchase Order Operations
  const addPurchaseOrder = (po) => {
    const newPO = {
      ...po,
      id: `PO-${String(purchases.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      items: po.items.map(item => ({
        ...item,
        costPrice: Number(item.costPrice),
        quantity: Number(item.quantity)
      })),
      totalAmount: po.items.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0)
    };
    setPurchases((prev) => [newPO, ...prev]);

    // Update Accounts Payable & Supplier Balance
    setSuppliers((prev) => prev.map((s) => {
      if (s.id === po.supplierId) {
        return {
          ...s,
          balance: s.balance + newPO.totalAmount,
          totalOrders: s.totalOrders + 1,
          lastOrder: newPO.date
        };
      }
      return s;
    }));

    adjustFinanceAccount('ACC07', newPO.totalAmount); // Liability AP increases

    // Journal Entry
    recordJournalEntry({
      description: `Purchase order placed with supplier: ${po.supplierName}`,
      debitAcc: 'Inventory Value Account',
      creditAcc: 'Accounts Payable (Suppliers)',
      amount: newPO.totalAmount,
      reference: newPO.id
    });

    addToast(`Purchase Order ${newPO.id} generated!`, 'success');
  };

  const receivePurchaseOrder = (poId) => {
    const po = purchases.find(p => p.id === poId);
    if (!po || po.status === 'Received') return;

    // Mark as Received
    setPurchases((prev) => prev.map((p) => p.id === poId ? { ...p, status: 'Received', receivedDate: new Date().toISOString().split('T')[0] } : p));

    // Update Product Stock Levels & Log movements
    po.items.forEach((item) => {
      setProducts((prev) => prev.map((p) => {
        if (p.id === item.productId) {
          return {
            ...p,
            stock: p.stock + item.quantity
          };
        }
        return p;
      }));

      logStockMovement({
        productId: item.productId,
        productName: item.name,
        sku: item.sku || 'N/A',
        type: 'Stock In',
        quantity: item.quantity,
        source: `${po.supplierName} (Supplier)`,
        destination: 'Karachi HQ Warehouse',
        notes: `Received items from PO ${po.id}`,
        referenceId: po.id
      });
    });

    addToast(`Goods from Purchase Order ${poId} checked-in! Stock updated.`, 'success');
  };

  // POS Cart Management
  const addToCart = (product) => {
    if (product.stock <= 0) {
      addToast(`Cannot add "${product.name}". Item is out of stock!`, 'error');
      return;
    }

    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id);
      if (idx > -1) {
        const currentQty = prev[idx].quantity;
        if (currentQty >= product.stock) {
          addToast(`Only ${product.stock} items of "${product.name}" in stock!`, 'warning');
          return prev;
        }
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: currentQty + 1,
          total: (currentQty + 1) * product.salePrice
        };
        return updated;
      }
      return [...prev, { product, quantity: 1, discount: 0, total: product.salePrice }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQty = (productId, qty) => {
    const quantity = Math.max(1, Number(qty));
    setCart((prev) => prev.map((item) => {
      if (item.product.id === productId) {
        if (quantity > item.product.stock) {
          addToast(`Only ${item.product.stock} items of "${item.product.name}" in stock!`, 'warning');
          return {
            ...item,
            quantity: item.product.stock,
            total: item.product.stock * item.product.salePrice
          };
        }
        return {
          ...item,
          quantity,
          total: quantity * item.product.salePrice
        };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setCartCustomer(null);
    setCartDiscount({ type: 'flat', value: 0 });
    setCartPaymentMethod('Cash');
  };

  const checkoutCart = () => {
    if (cart.length === 0) {
      addToast('Cannot checkout an empty cart!', 'error');
      return null;
    }

    // Calculations
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    let discountAmount = 0;
    if (cartDiscount.type === 'flat') {
      discountAmount = Number(cartDiscount.value);
    } else {
      discountAmount = (subtotal * Number(cartDiscount.value)) / 100;
    }
    const taxedAmount = ((subtotal - discountAmount) * cartTaxPercent) / 100;
    const finalBill = subtotal - discountAmount + taxedAmount;

    // Create Invoice ID
    const invoiceId = `TXN-${Date.now().toString().slice(-6)}`;

    // Build Transaction object
    const newTransaction = {
      id: invoiceId,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: false }),
      customerName: cartCustomer ? cartCustomer.name : 'Walk-in Customer',
      customerId: cartCustomer ? cartCustomer.id : 'C000',
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.salePrice,
        cost: item.product.costPrice,
        total: item.total
      })),
      subtotal,
      discount: discountAmount,
      tax: taxedAmount,
      total: finalBill,
      paymentMethod: cartPaymentMethod,
      cashReceived: cartPaymentMethod === 'Cash' ? finalBill : 0, // Mock
      changeGiven: 0,
      branch: currentUser.branch,
      cashier: currentUser.name
    };

    // 1. Decrement Stock Levels & Log Stock Out movements
    cart.forEach((item) => {
      setProducts((prev) => prev.map((p) => {
        if (p.id === item.product.id) {
          return {
            ...p,
            stock: Math.max(0, p.stock - item.quantity)
          };
        }
        return p;
      }));

      logStockMovement({
        productId: item.product.id,
        productName: item.product.name,
        sku: item.product.barcode || 'N/A',
        type: 'Stock Out',
        quantity: item.quantity,
        source: `${currentUser.branch} Sales Shelf`,
        destination: 'Customer Sale',
        notes: `POS Sale Receipt ${invoiceId}`,
        referenceId: invoiceId
      });
    });

    // 2. Adjust Financial Accounts & Ledgers
    if (cartPaymentMethod === 'Udhaar' && cartCustomer) {
      // Increase Customer Balance (Credit sale)
      setCustomers((prev) => prev.map((c) => {
        if (c.id === cartCustomer.id) {
          const newBalance = c.balance + finalBill;
          const newLedger = [
            { date: newTransaction.date, type: 'POS Invoice', ref: invoiceId, debit: finalBill, credit: 0, balance: newBalance },
            ...(c.ledger || [])
          ];
          return {
            ...c,
            balance: newBalance,
            totalTransactions: c.totalTransactions + 1,
            totalSpent: c.totalSpent + finalBill,
            ledger: newLedger
          };
        }
        return c;
      }));
      adjustFinanceAccount('ACC06', finalBill); // Receivables increase

      // Journal Entry
      recordJournalEntry({
        description: `Credit Sales POS checkout - Invoice ${invoiceId}`,
        debitAcc: 'Accounts Receivable (Customers)',
        creditAcc: 'POS Sales Revenue Account',
        amount: finalBill,
        reference: invoiceId
      });
    } else {
      // Cash/Bank payments
      let accountId = 'ACC01'; // Default Cash
      let cashBankName = 'Cash in Hand';
      if (cartPaymentMethod === 'Card') {
        accountId = 'ACC02'; // HBL Bank
        cashBankName = 'HBL Current Account';
      } else if (cartPaymentMethod === 'EasyPaisa') {
        accountId = 'ACC03'; // Meezan Bank
        cashBankName = 'Meezan Business Account';
      }

      adjustFinanceAccount(accountId, finalBill);

      // Record Customer Spent Stats if customer selected
      if (cartCustomer) {
        setCustomers((prev) => prev.map((c) => {
          if (c.id === cartCustomer.id) {
            return {
              ...c,
              totalTransactions: c.totalTransactions + 1,
              totalSpent: c.totalSpent + finalBill
            };
          }
          return c;
        }));
      }

      // Journal Entry
      recordJournalEntry({
        description: `POS Checkout sales - Cash/Bank - Invoice ${invoiceId}`,
        debitAcc: cashBankName,
        creditAcc: 'POS Sales Revenue Account',
        amount: finalBill,
        reference: invoiceId
      });
    }

    // Add COGS Journal entry
    const totalCOGS = cart.reduce((sum, item) => sum + (item.product.costPrice * item.quantity), 0);
    recordJournalEntry({
      description: `Cost of Goods Sold (COGS) for POS sale ${invoiceId}`,
      debitAcc: 'Cost of Goods Sold (COGS) Account',
      creditAcc: 'Inventory Value Account',
      amount: totalCOGS,
      reference: invoiceId
    });

    // Add Transaction
    setTransactions((prev) => [newTransaction, ...prev]);

    // Clear cart and state
    clearCart();

    addToast(`Sale checkout successful! Receipt #${invoiceId}`, 'success');
    return newTransaction;
  };

  // Finance Actions
  const adjustFinanceAccount = (accId, amt) => {
    setFinanceAccounts((prev) => prev.map((a) => {
      if (a.id === accId) {
        return {
          ...a,
          balance: a.balance + Number(amt)
        };
      }
      return a;
    }));
  };

  const recordJournalEntry = (entry) => {
    const newJE = {
      id: `JE${String(journalEntries.length + 1).padStart(3, '0')}`,
      date: entry.date || new Date().toISOString().split('T')[0],
      description: entry.description,
      debitAcc: entry.debitAcc,
      creditAcc: entry.creditAcc,
      amount: Number(entry.amount),
      reference: entry.reference || 'N/A',
      recordedBy: entry.recordedBy || currentUser.name
    };
    setJournalEntries((prev) => [newJE, ...prev]);
  };

  const transferFunds = (sourceAccId, destAccId, amount) => {
    const amt = Number(amount);
    const srcAccount = financeAccounts.find(a => a.id === sourceAccId);
    const destAccount = financeAccounts.find(a => a.id === destAccId);

    if (!srcAccount || !destAccount) {
      addToast('Invalid accounts chosen for fund transfer!', 'error');
      return;
    }

    if (srcAccount.balance < amt) {
      addToast(`Insufficient funds in ${srcAccount.name}! (Balance: Rs. ${srcAccount.balance.toLocaleString()})`, 'error');
      return;
    }

    adjustFinanceAccount(sourceAccId, -amt);
    adjustFinanceAccount(destAccId, amt);

    recordJournalEntry({
      description: `Internal Fund Transfer: From ${srcAccount.name} to ${destAccount.name}`,
      debitAcc: destAccount.name,
      creditAcc: srcAccount.name,
      amount: amt,
      reference: 'FTR-INTERNAL'
    });

    addToast(`Transferred Rs. ${amt.toLocaleString()} from ${srcAccount.name} to ${destAccount.name}`, 'success');
  };

  // Users Management
  const addUser = (newUser) => {
    const user = {
      ...newUser,
      id: `USR${String(users.length + 1).padStart(3, '0')}`,
      status: 'active',
      lastLogin: 'Never',
      avatar: newUser.role === 'ADMIN' ? '👩‍💼' : newUser.role === 'MANAGER' ? '👨‍💼' : '👨‍💻'
    };
    setUsers((prev) => [...prev, user]);
    addToast(`User account created for ${user.name}!`, 'success');
  };

  const updateUser = (updatedUser) => {
    setUsers((prev) => prev.map((u) => u.id === updatedUser.id ? updatedUser : u));
    if (updatedUser.id === currentUser.id) {
      setCurrentUser(updatedUser);
    }
    addToast(`User profile for ${updatedUser.name} updated!`, 'success');
  };

  const loginAsUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      addToast(`Switched active session to: ${user.name} (${user.role})`, 'info');
    }
  };

  return (
    <AppContext.Provider
      value={{
        // System Settings & Themes
        theme,
        toggleTheme,
        isDark,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        activeModule,
        setActiveModule,
        breadcrumbs,
        notifications,
        setNotifications,
        toasts,
        addToast,
        removeToast,

        // Data Lists
        products,
        categories,
        suppliers,
        customers,
        transactions,
        purchases,
        expenses,
        inventoryMovements,
        financeAccounts,
        journalEntries,
        users,
        currentUser,
        storeSettings,

        // POS Operations
        cart,
        cartCustomer,
        cartDiscount,
        cartTaxPercent,
        cartPaymentMethod,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        checkoutCart,
        setCartCustomer,
        setCartDiscount,
        setCartTaxPercent,
        setCartPaymentMethod,

        // Data Mutators
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addCustomer,
        updateCustomer,
        addCustomerPayment,
        addSupplier,
        updateSupplier,
        addSupplierPayment,
        addExpense,
        updateExpense,
        deleteExpense,
        addStockAdjustment,
        addPurchaseOrder,
        receivePurchaseOrder,
        transferFunds,
        addUser,
        updateUser,
        loginAsUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
