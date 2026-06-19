import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [activeModule, setActiveModule] = useState('Dashboard'); 
  const [activeReport, setActiveReport] = useState(null);       

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      
      // 1. Check karte hain backend kya bhej raha hai
      console.log("Backend Response:", res.data); 

      // 2. Smart Validation: Jo bhi format ho, products nikal lo
      if (Array.isArray(res.data)) {
        setProducts(res.data); // Agar direct array hai: [...]
      } else if (res.data && Array.isArray(res.data.data)) {
        setProducts(res.data.data); // Agar object mein data hai: { data: [...] }
      } else if (res.data && Array.isArray(res.data.products)) {
        setProducts(res.data.products); // Agar object mein products hai: { products: [...] }
      } else {
        console.warn("Products ka array nahi mila API response mein!");
        setProducts([]); 
      }

    } catch (err) {
      console.error("Fetch Error:", err);
      setProducts([]); 
    }
  };


  // Sirf EK hi return statement hona chahiye jo sab kuch export kare
  return (
    <AppContext.Provider value={{ 
      products, 
      setProducts, 
      fetchProducts, 
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