import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // <--- Nayi State
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

  // Naya Function: Categories fetch karne ke liye
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

  // App start hotay hi dono ko fetch karo
  useEffect(() => {
    fetchProducts();
    fetchCategories();
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
      setActiveReport 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);