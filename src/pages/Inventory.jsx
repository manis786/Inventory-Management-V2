import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import { useApp } from '../context/AppContext';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Tabs } from '../components/ui/Tabs';
import { AlertTriangle, History, CalendarDays, Settings2 } from 'lucide-react';

export function Inventory() {
  const { products, setProducts, inventoryMovements, addStockAdjustment, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('history');

  // Page Load par Data Fetching (Blank page ka solution)
  useEffect(() => {
    if (!products || products.length === 0) {
      axios.get('http://localhost:5000/api/products')
        .then(res => setProducts(res.data.data || res.data))
        .catch(err => console.error("Error fetching products:", err));
    }
  }, []);

  // Filter logic (safe checking)
  const safeProducts = Array.isArray(products) ? products : [];
  const lowStock = safeProducts.filter(p => p.stock <= (p.minStock || 0) && p.status === 'active');
  const expiring = safeProducts.filter((p) => {
    if (!p.expiryDate) return false;
    const expDate = new Date(p.expiryDate);
    return expDate <= new Date('2026-12-31');
  }).sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

  // ... (Baaki sab logic wahi rahega)
  
  return (
    <div className="space-y-5 animate-fade-in">
       {/* UI code wahi rahega jo aapne bheja tha */}
       <h1 className="text-2xl font-black">Stock Control & Movements</h1>
       {/* Tabs aur Table code here */}
    </div>
  );
}
export default Inventory;