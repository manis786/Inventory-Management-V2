import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [activeModule, setActiveModule] = useState('Dashboard');
  const [activeReport, setActiveReport] = useState(null);
const [movements, setMovements] = useState([]);



  // --- Toast Notification Handler ---
  const addToast = (message, type = 'info') => {
    console.log(`[${type.toUpperCase()}]: ${message}`);
    alert(message); 
  };

  // --- Helper to update local state (Global Sync) ---
  const updateProductStock = (id, newStock) => {
    setProducts(prevProducts => 
      prevProducts.map(p => p._id === id ? { ...p, stock: newStock } : p)
    );
  };

  // --- Purchases CRUD ---
  const fetchPurchases = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/purchases');
      setPurchases(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Fetch Purchases Error:", err);
      setPurchases([]);
    }
  };

  const addPurchaseOrder = async (poData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/purchases', poData);
      if(res.data) {
         await fetchPurchases(); 
         addToast('Purchase Order created successfully!', 'success');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      addToast(`Error: ${errorMsg}`, 'error');
    }
  };

  const receivePurchaseOrder = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/purchases/${id}/receive`);
      fetchPurchases(); 
    } catch (err) {
      console.error("Approval Error:", err);
      addToast('Failed to mark as received', 'error');
    }
  };

  // --- Products CRUD ---
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) {
      console.error("Fetch Products Error:", err);
      setProducts([]);
    }
  };

  // --- Categories CRUD ---
  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) {
      console.error("Fetch Categories Error:", err);
      setCategories([]);
    }
  };

  // --- Suppliers CRUD ---
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) {
      console.error("Fetch Suppliers Error:", err);
      setSuppliers([]);
    }
  };

  const addSupplier = async (supplierData) => {
    try {
      await axios.post('http://localhost:5000/api/suppliers', supplierData);
      fetchSuppliers();
    } catch (err) {
      console.error("Add Supplier Error:", err);
    }
  };

  const addMovement = (movement) => {
  setMovements(prev => [movement, ...prev]);
};

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
    fetchPurchases();
  }, []);

  return (
    <AppContext.Provider value={{
      products, setProducts, fetchProducts, updateProductStock,
      categories, setCategories, fetchCategories,
      suppliers, setSuppliers, fetchSuppliers, addSupplier,
      purchases, addPurchaseOrder, receivePurchaseOrder,
      activeModule, setActiveModule,
      activeReport, setActiveReport,
      movements, setMovements, addMovement,
      addToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);