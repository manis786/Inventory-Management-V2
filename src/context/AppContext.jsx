import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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

  // --- Cart States (POS) ---
  const [cart, setCart] = useState([]);
  const [cartCustomer, setCartCustomer] = useState(null);
  const [cartPaymentMethod, setCartPaymentMethod] = useState('Cash');
  const [cartDiscount, setCartDiscount] = useState({ type: 'flat', value: 0 });
  const [cartTaxPercent, setCartTaxPercent] = useState(0);

  // --- Helper: Toast Notification ---
  const addToast = (message, type = 'info') => {
    console.log(`[${type.toUpperCase()}]: ${message}`);
    alert(message); 
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

  const addMovement = (movement) => setMovements(prev => [movement, ...prev]);

  // Initial Data Fetch
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
    fetchPurchases();
    fetchCustomers();
  }, []);

  return (
    <AppContext.Provider value={{
      products, setProducts, fetchProducts, updateProductStock,
      categories, setCategories, fetchCategories,
      suppliers, setSuppliers, fetchSuppliers, addSupplier,
      purchases, addPurchaseOrder, receivePurchaseOrder,
      customers, fetchCustomers,
      activeModule, setActiveModule,
      activeReport, setActiveReport,
      movements, setMovements, addMovement,
      cart, addToCart, removeFromCart, updateCartQty, clearCart,
      cartCustomer, setCartCustomer,
      cartPaymentMethod, setCartPaymentMethod,
      cartDiscount, setCartDiscount,
      cartTaxPercent, setCartTaxPercent,
      addToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);