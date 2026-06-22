import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers,setSuppliers]= useState([])
  const [activeModule, setActiveModule] = useState('Dashboard'); 
  const [activeReport, setActiveReport] = useState(null);       

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      if (Array.isArray(res.data)) setProducts(res.data);
      else if (res.data?.data && Array.isArray(res.data.data)) setProducts(res.data.data);
      else if (res.data?.products && Array.isArray(res.data.products)) setProducts(res.data.products);
      else setProducts([]);
    } catch (err) {
      console.error("Fetch Products Error:", err);
      setProducts([]); 
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      // Backend response check karo, agar data object ke andar hai toh res.data.data karo
      setCategories(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) {
      console.error("Fetch Categories Error:", err);
      setCategories([]);
    }
  };
// Suppliers CRUD
const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/suppliers');
      // Backend response handle karne ke liye
      setSuppliers(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) {
      console.error("Fetch Suppliers Error:", err);
      setSuppliers([]);
    }
  };

  const addSupplier = async (supplierData) => {
    try {
      await axios.post('http://localhost:5000/api/suppliers', supplierData);
      fetchSuppliers(); // Naya data load karne ke liye refresh
    } catch (err) {
      console.error("Add Supplier Error:", err);
    }
  };

  const updateSupplier = async (supplier) => {
    try {
      await axios.put(`http://localhost:5000/api/suppliers/${supplier._id}`, supplier);
      fetchSuppliers();
    } catch (err) {
      console.error("Update Supplier Error:", err);
    }
  };

  const addSupplierPayment = async (id, amount, method) => {
    try {
      await axios.post(`http://localhost:5000/api/suppliers/${id}/payment`, { amount, method });
      fetchSuppliers();
    } catch (err) {
      console.error("Payment Error:", err);
    }
  };

  // App start hotay hi dono ko fetch karo
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers()
  }, []);

  return (
    <AppContext.Provider value={{ 
      products, 
      setProducts, 
      fetchProducts,
      categories,           // <--- Export kiya
      setCategories,        // <--- Export kiya
      fetchCategories,      // <--- Export kiya
      activeModule,
      setActiveModule,
      activeReport,
      setActiveReport,
      suppliers,
      setSuppliers,
      fetchSuppliers,
      addSupplier, 
      updateSupplier, 
      addSupplierPayment 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);