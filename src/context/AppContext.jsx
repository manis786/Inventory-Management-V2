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

  // --- Toast Notification Handler ---
  const addToast = (message, type = 'info') => {
    // Aap yahan apni toast library (jaise react-toastify) use kar sakte hain
    console.log(`[${type.toUpperCase()}]: ${message}`);
    alert(message); 
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
      console.log("Sending PO Data to Server:", poData);
      const res = await axios.post('http://localhost:5000/api/purchases', poData);
      
      if(res.data) {
         await fetchPurchases(); 
         addToast('Purchase Order created successfully!', 'success');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      console.error("Add PO Error:", errorMsg);
      addToast(`Error: ${errorMsg}`, 'error');
    }
  };

  const receivePurchaseOrder = async (id) => {
  try {
    // API call karein jo status update kare
    await axios.patch(`http://localhost:5000/api/purchases/${id}/receive`);
    fetchPurchases(); // List update ho jayegi
  } catch (err) {
    console.error("Approval Error:", err);
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

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
    fetchPurchases();
  }, []);

  return (
    <AppContext.Provider value={{
      products, setProducts, fetchProducts,
      categories, setCategories, fetchCategories,
      suppliers, setSuppliers, fetchSuppliers, addSupplier,
      purchases, addPurchaseOrder, receivePurchaseOrder,
      activeModule, setActiveModule,
      activeReport, setActiveReport,
      addToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);