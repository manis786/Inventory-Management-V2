import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
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

  // --- Layout & Theme States ---
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // --- Missing / Custom States ---
  const [financeAccounts, setFinanceAccounts] = useState(ACCOUNTS);
  const [journalEntries, setJournalEntries] = useState(JOURNAL_ENTRIES);
  const [expenses, setExpenses] = useState([]);
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
      const res = await axios.get(`${API_BASE_URL}/products`);
      setProducts(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) { console.error("Fetch Products Error:", err); }
  };

  const fetchPurchases = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/purchases`);
      setPurchases(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) { console.error("Fetch Purchases Error:", err); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) { console.error("Fetch Categories Error:", err); }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/suppliers`);
      setSuppliers(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) { console.error("Fetch Suppliers Error:", err); }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/customers`);
      setCustomers(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) { console.error("Fetch Customers Error:", err); }
  };
  const fetchSales = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/sales`);
    setSales(Array.isArray(res.data) ? res.data : (res.data.data || []));
  } catch (err) { console.error("Fetch Sales Error:", err); }
};

const addSale = async (saleData) => {
  try {
    await axios.post(`${API_BASE_URL}/sales`, saleData);
    await fetchSales(); // Data refresh karne ke liye
    addToast('Invoice Posted Successfully!', 'success');
  } catch (err) { 
    addToast(`Error: ${err.message}`, 'error'); 
  }
};


  const addSupplier = async (supplierData) => {
    try {
      await axios.post(`${API_BASE_URL}/suppliers`, supplierData);
      fetchSuppliers();
    } catch (err) { console.error("Add Supplier Error:", err); }
  };

  const addPurchaseOrder = async (poData) => {
    try {
      await axios.post(`${API_BASE_URL}/purchases`, poData);
      fetchPurchases();
      addToast('Purchase Order created!', 'success');
    } catch (err) { addToast(`Error: ${err.message}`, 'error'); }
  };

  const receivePurchaseOrder = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/purchases/${id}/receive`);
      fetchPurchases();
      fetchProducts(); // Stock update hone ke baad products refresh
    } catch (err) { addToast('Failed to receive', 'error'); }
  };

  const updateProductStock = (id, newStock) => {
    setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: newStock } : p));
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isLoggedIn', 'true');
        setIsAuthenticated(true);
        const loggedUser = response.data.user || {
          id: 'USR001',
          name: email.split('@')[0],
          email: email,
          role: 'ADMIN',
          branch: 'Karachi HQ'
        };
        setCurrentUser(loggedUser);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        return true; 
      }
      return false;
    } catch (error) {
      console.error("Login Error:", error.response?.data?.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setCurrentUser(null);
  };
const addMovement = async (movementData) => {
  try {
    // API Call
    const res = await axios.post(`${API_BASE_URL}/transactions`, movementData);
    
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
    await axios.put(`${API_BASE_URL}/sales/${id}`, { status });
    // State refresh karne ke liye fetchSales call karo
    await fetchSales(); 
  } catch (error) {
    console.error("Context Error:", error);
    throw error; // Yeh error handleApprove ko wapis bhejega
  }
};

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/expenses`);
      const list = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setExpenses(list);
    } catch (err) {
      console.error("Fetch Expenses Error:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/auth/getAllusers`);
      const userList = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      if (userList.length > 0) {
        setUsers(userList);
      }
    } catch (err) {
      console.error("Fetch Users Error:", err);
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
    fetchExpenses();
    fetchUsers();

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      setIsAuthenticated(true);
      const saved = localStorage.getItem('user');
      if (saved) {
        try {
          setCurrentUser(JSON.parse(saved));
        } catch (e) {
          setCurrentUser(USERS[0]);
        }
      } else {
        setCurrentUser(USERS[0]);
      }
    }
  }, []);

  // --- Expenses Handlers (Real Backend API) ---
  const addExpense = async (expenseData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/expenses`, expenseData);
      await fetchExpenses();
      addToast('Expense recorded successfully!', 'success');
      return res.data;
    } catch (err) {
      console.error("Add Expense Error:", err);
      addToast(err.response?.data?.message || 'Failed to record expense', 'error');
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/expenses/${id}`);
      await fetchExpenses();
      addToast('Expense deleted successfully!', 'success');
    } catch (err) {
      console.error("Delete Expense Error:", err);
      addToast(err.response?.data?.message || 'Failed to delete expense', 'error');
    }
  };

  const saveStoreSettings = async (settings) => {
    setStoreSettings(settings);
    localStorage.setItem('storeSettings', JSON.stringify(settings));
    addToast('Store settings saved successfully!', 'success');
  };

  const addUser = async (userData) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, userData);
      await fetchUsers();
      addToast('User created successfully!', 'success');
    } catch (err) {
      console.error("Add User Error:", err);
      addToast(err.response?.data?.message || 'Failed to create user', 'error');
    }
  };

  const updateUser = async (userData) => {
    try {
      const id = userData._id || userData.id;
      if (id) {
        await axios.put(`${API_BASE_URL}/auth/users/${id}`, userData);
      }
      await fetchUsers();
      addToast('User updated successfully!', 'success');
    } catch (err) {
      console.error("Update User Error:", err);
      addToast(err.response?.data?.message || 'Failed to update user', 'error');
    }
  };

  const loginAsUser = (userId) => {
    const foundUser = users.find(u => (u._id === userId || u.id === userId));
    if (foundUser) {
      setCurrentUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      addToast(`Switched login session to: ${foundUser.name || foundUser.userName}`, 'success');
    }
  };

  const updateSupplier = async (supplierData) => {
    try {
      if (supplierData._id) {
        await axios.put(`${API_BASE_URL}/suppliers/${supplierData._id}`, supplierData);
        await fetchSuppliers();
      } else {
        setSuppliers(prev => prev.map(s => s._id === supplierData._id ? supplierData : s));
      }
      addToast('Supplier updated successfully!', 'success');
    } catch (err) {
      console.error("Update Supplier Error:", err);
      addToast(err.response?.data?.message || 'Failed to update supplier', 'error');
    }
  };

  const addSupplierPayment = async (supplierId, amount, method) => {
    try {
      await axios.post(`${API_BASE_URL}/payments/pay-supplier`, {
        supplierId,
        amountPaid: Number(amount),
        paymentMethod: method || 'Bank Transfer'
      });
      await fetchSuppliers();
      addToast(`Payment of Rs. ${Number(amount).toLocaleString()} recorded via ${method}!`, 'success');
    } catch (err) {
      console.error("Supplier Payment Error:", err);
      // Fallback local balance update if double-entry COA missing
      setSuppliers(prev => prev.map(s => s._id === supplierId ? { ...s, balance: Math.max(0, s.balance - amount) } : s));
      addToast(err.response?.data?.message || `Payment recorded via ${method}!`, 'info');
    }
  };

  return (
    <AppContext.Provider value={{
      theme, setTheme, toggleTheme,
      sidebarCollapsed, setSidebarCollapsed,
      mobileSidebarOpen, setMobileSidebarOpen,
      notifications, setNotifications,
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
      expenses, setExpenses, addExpense, deleteExpense, fetchExpenses,
      transactions, setTransactions,
      users, setUsers, addUser, updateUser, fetchUsers, loginAsUser, currentUser,
      storeSettings, setStoreSettings, saveStoreSettings,
      updateSupplier, addSupplierPayment
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);