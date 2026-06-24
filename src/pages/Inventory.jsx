import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { Table } from '../components/ui/Table';
import { Package, TrendingUp, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { formatPKR } from '../data/store';

export function Inventory() {
  const { products = [] } = useApp();
  const [activeTab, setActiveTab] = useState('stock');
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        setLoading(true);
        // Backend se saari transactions fetch kar rahe hain
        const response = await axios.get('http://localhost:5000/api/transactions');
        setMovements(response.data);
      } catch (err) {
        console.error("Movements fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovements();
  }, []);

  // Stats calculation
  const totalStockValue = products.reduce((sum, p) => sum + (Number(p.stock) * Number(p.costPrice)), 0);
  const lowStockCount = products.filter(p => Number(p.stock) < 10).length;

  return (
    <div className="space-y-6 p-2 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black text-slate-800">Inventory Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-600 p-5 rounded-2xl text-white shadow-lg">
          <p className="text-indigo-100 text-sm">Total Inventory Value</p>
          <h2 className="text-2xl font-bold">{formatPKR(totalStockValue)}</h2>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-lg"><AlertTriangle className="text-amber-600" /></div>
          <div>
            <p className="text-slate-500 text-xs">Low Stock Items</p>
            <h2 className="text-xl font-bold text-slate-800">{lowStockCount}</h2>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 rounded-lg"><TrendingUp className="text-emerald-600" /></div>
          <div>
            <p className="text-slate-500 text-xs">Total Products</p>
            <h2 className="text-xl font-bold text-slate-800">{products.length}</h2>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200">
        <button onClick={() => setActiveTab('stock')} className={`pb-3 font-bold ${activeTab === 'stock' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>Current Stock</button>
        <button onClick={() => setActiveTab('history')} className={`pb-3 font-bold ${activeTab === 'history' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>Stock Movements</button>
      </div>

      {/* Content Area */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
        {activeTab === 'stock' ? (
          <Table 
            columns={[
              { key: 'name', label: 'Product Name' },
              { key: 'stock', label: 'Current Stock', render: (row) => <span className={`font-black ${row.stock < 10 ? 'text-rose-500' : 'text-slate-700'}`}>{row.stock}</span> },
              { key: 'status', label: 'Status', render: (row) => <span className="bg-slate-100 px-2 py-1 rounded text-xs uppercase">{row.status}</span> }
            ]} 
            data={products} 
          />
        ) : (
          <div className="space-y-4">
            {loading ? <p className="text-center py-10">Loading...</p> : movements.length > 0 ? movements.map((m, i) => (
<div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
    <div className="flex items-center gap-4">
      {/* Icon: Type ke hisaab se color badlega */}
      <div className={`p-2 rounded-lg ${m.type === 'PURCHASE' ? 'bg-green-100' : 'bg-blue-100'}`}>
        <ArrowRightLeft className={`w-4 h-4 ${m.type === 'PURCHASE' ? 'text-green-600' : 'text-blue-600'}`} />
      </div>
      
      <div>
        {/* Product Name */}
        <p className="font-bold text-sm text-slate-800">{m.product?.name || "Unknown Product"}</p>
        
        {/* Audit Details: Yahan Date, Type, aur RefID aayenge */}
        <p className="text-[11px] text-slate-500 font-medium">
           {new Date(m.date).toLocaleString()} | 
           <span className="uppercase ml-1">{m.type}</span>
           {m.refId && ` | Ref: ${m.refId}`}
        </p>
      </div>
    </div>
    
    {/* Quantity */}
    <span className={`font-black text-lg ${m.type === 'PURCHASE' ? 'text-green-600' : 'text-blue-600'}`}>
      {m.type === 'PURCHASE' ? '+' : '-'}{m.quantity}
    </span>
  </div>
            )) : <p className="text-center text-slate-400 py-10">No movements yet!</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;