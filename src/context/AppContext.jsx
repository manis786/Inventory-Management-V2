import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ACCOUNTS, JOURNAL_ENTRIES } from '../data/finance';
import { EXPENSES } from '../data/expenses';
import { TRANSACTIONS } from '../data/transactions';
import { USERS } from '../data/users';
import { STORE_INFO } from '../data/store';

const AppContext = createContext();

export function AppProvider({ children }) {
  // --- Global States ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [activeModule, setActiveModule] = useState('Dashboard');
  const [activeReport, setActiveReport] = useState(null);
  const [movements, setMovements] = useState([]);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [sales, setSales] = useState([]);

  // --- Missing / Custom States ---
  const [financeAccounts, setFinanceAccounts] = useState(ACCOUNTS);
  const [journalEntries, setJournalEntries] = useState(JOURNAL_ENTRIES);
  const [expenses, setExpenses] = useState(EXPENSES);
  const [transactions, setTransactions] = useState(TRANSACTIONS);
  const [users, setUsers] = useState(USERS);
  const [currentUser, setCurrentUser] = useState(USERS[0]);
  const [storeSettings, setStoreSettings] = useState(STORE_INFO);


  // --- Cart States (POS) ---
  const [cart, setCart] = useState([]);
  const [cartCustomer, setCartCustomer] = useState(null);
  const [cartPaymentMethod, setCartPaymentMethod] = useState('Cash');
  const [cartDiscount, setCartDiscount] = useState({ type: 'flat', value: 0 });
  const [cartTaxPercent, setCartTaxPercent] = useState(0);

  // --- Helper: Toast Notification ---
  const addToast = (message, type = 'info') => {
  if (type === 'error') {
    toast.error(message);
  } else if (type === 'success') {
    toast.success(message);
  } else {
    toast(message);
  }
};

  // --- Cart Management ---
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product._id === product._id);
      if (existing) {
        return prev.map(item => item.product._id === product._id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.product.salePrice }
          : item);
      }
      return [...prev, { product, quantity: 1, total: product.salePrice }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.product._id !== id));

  const updateCartQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(prev => prev.map(item => item.product._id === id
      ? { ...item, quantity: qty, total: qty * item.product.salePrice }
      : item));
  };

  const clearCart = () => {
    setCart([]);
    setCartCustomer(null);
    setCartPaymentMethod('Cash');
    setCartDiscount({ type: 'flat', value: 0 });
    setCartTaxPercent(0);
  };

  // --- CRUD Operations ---
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) { console.error("Fetch Products Error:", err); }
  };

  const fetchPurchases = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/purchases');
      setPurchases(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) { console.error("Fetch Purchases Error:", err); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) { console.error("Fetch Categories Error:", err); }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) { console.error("Fetch Suppliers Error:", err); }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers');
      setCustomers(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) { console.error("Fetch Customers Error:", err); }
  };
  const fetchSales = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/sales');
    setSales(Array.isArray(res.data) ? res.data : (res.data.data || []));
  } catch (err) { console.error("Fetch Sales Error:", err); }
};

const addSale = async (saleData) => {
  try {
    await axios.post('http://localhost:5000/api/sales', saleData);
    await fetchSales(); // Data refresh karne ke liye
    addToast('Invoice Posted Successfully!', 'success');
  } catch (err) { 
    addToast(`Error: ${err.message}`, 'error'); 
  }
};


  const addSupplier = async (supplierData) => {
    try {
      await axios.post('http://localhost:5000/api/suppliers', supplierData);
      fetchSuppliers();
    } catch (err) { console.error("Add Supplier Error:", err); }
  };

  const addPurchaseOrder = async (poData) => {
    try {
      await axios.post('http://localhost:5000/api/purchases', poData);
      fetchPurchases();
      addToast('Purchase Order created!', 'success');
    } catch (err) { addToast(`Error: ${err.message}`, 'error'); }
  };

  const receivePurchaseOrder = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/purchases/${id}/receive`);
      fetchPurchases();
      fetchProducts(); // Stock update hone ke baad products refresh
    } catch (err) { addToast('Failed to receive', 'error'); }
  };

  const updateProductStock = (id, newStock) => {
    setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: newStock } : p));
  };

const login = async (email, password) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/login`, {
        email,
        password
      });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isLoggedIn', 'true');
        setIsAuthenticated(true);
        const found = USERS.find(u => u.email === email);
        if (found) {
          setCurrentUser(found);
        } else {
          setCurrentUser({
            id: 'USR001',
            name: 'Muhammad Anis',
            email: email,
            role: 'ADMIN',
            branch: 'Karachi HQ'
          });
        }
        return true; 
      }
      return false;
    } catch (error) {
      console.error("Login Error:", error.response?.data?.message);
      
      return false;
    }
  }

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('isLoggedIn');
  setIsAuthenticated(false);
  setUser(null);
  setCurrentUser(null);
};
const addMovement = async (movementData) => {
  try {
    // API Call
    const res = await axios.post('http://localhost:5000/api/transactions', movementData);
    
    // State Update
    setMovements(prev => [res.data.data, ...prev]);
    addToast('Transaction recorded successfully!', 'success');
  } catch (err) {
    // Console mein error details dekhen
    console.error("Backend Validation Error:", err.response?.data);
    addToast('Error saving transaction: ' + (err.response?.data?.message || 'Missing fields'), 'error');
    throw err;
  }
};
 

  const updateSaleStatus = async (id, status) => {
  try {
    await axios.put(`http://localhost:5000/api/sales/${id}`, { status });
    // State refresh karne ke liye fetchSales call karo
    await fetchSales(); 
  } catch (error) {
    console.error("Context Error:", error);
    throw error; // Yeh error handleApprove ko wapis bhejega
  }
};

  // Initial Data Fetch
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
    fetchPurchases();
    fetchCustomers();
    fetchSales();

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      setIsAuthenticated(true);
      setCurrentUser(USERS[0]);
    }
  }, []);

  // --- Missing / Custom Handlers ---
  const addExpense = (expenseData) => {
    const newExp = { id: `EXP${String(expenses.length + 1).padStart(3, '0')}`, ...expenseData, amount: Number(expenseData.amount) };
    setExpenses(prev => [newExp, ...prev]);
    addToast('Expense recorded successfully!', 'success');
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    addToast('Expense deleted successfully!', 'success');
  };

  const saveStoreSettings = async (settings) => {
    setStoreSettings(settings);
    addToast('Store settings saved successfully!', 'success');
  };

  const addUser = (userData) => {
    const newUser = { id: `USR${String(users.length + 1).padStart(3, '0')}`, ...userData };
    setUsers(prev => [...prev, newUser]);
    addToast('User added successfully!', 'success');
  };

  const updateUser = (userData) => {
    setUsers(prev => prev.map(u => u.id === userData.id ? userData : u));
    addToast('User updated successfully!', 'success');
  };

  const loginAsUser = (userId) => {
    const foundUser = users.find(u => u.id === userId);
    if (foundUser) {
      setCurrentUser(foundUser);
      addToast(`Switched login session to: ${foundUser.name}`, 'success');
    }
  };

  const updateSupplier = (supplierData) => {
    setSuppliers(prev => prev.map(s => s._id === supplierData._id ? supplierData : s));
    addToast('Supplier updated successfully!', 'success');
  };

  const addSupplierPayment = (supplierId, amount, method) => {
    setSuppliers(prev => prev.map(s => s._id === supplierId ? { ...s, balance: Math.max(0, s.balance - amount) } : s));
    addToast(`Payment of Rs. ${amount.toLocaleString()} recorded via ${method}!`, 'success');
  };

  return (
    <AppContext.Provider value={{
      products, setProducts, fetchProducts, updateProductStock,
      categories, setCategories, fetchCategories,
      suppliers, setSuppliers, fetchSuppliers, addSupplier,
      purchases, addPurchaseOrder, receivePurchaseOrder,
      customers, fetchCustomers,
      activeModule, setActiveModule,
      activeReport, setActiveReport,
      updateSaleStatus,
      movements, setMovements, addMovement,
      cart, addToCart, removeFromCart, updateCartQty, clearCart,
      cartCustomer, setCartCustomer,
      cartPaymentMethod, setCartPaymentMethod,
      cartDiscount, setCartDiscount,
      cartTaxPercent, setCartTaxPercent,
      addToast,
      login,
      sales, setSales, addSale, fetchSales,
      logout,
      financeAccounts, setFinanceAccounts,
      journalEntries, setJournalEntries,
      expenses, setExpenses, addExpense, deleteExpense,
      transactions, setTransactions,
      users, setUsers, addUser, updateUser, loginAsUser, currentUser,
      storeSettings, setStoreSettings, saveStoreSettings,
      updateSupplier, addSupplierPayment
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);