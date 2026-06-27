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

  const totalStockValue = products.reduce((sum, p) => sum + (Number(p.stock) * Number(p.costPrice)), 0);
  const lowStockCount = products.filter(p => Number(p.stock) < 10).length;

  return (
    <div className="space-y-6 p-2 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black text-slate-800">Inventory Overview</h1>

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

      <div className="flex gap-6 border-b border-slate-200">
        <button onClick={() => setActiveTab('stock')} className={`pb-3 font-bold ${activeTab === 'stock' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>Current Stock</button>
        <button onClick={() => setActiveTab('history')} className={`pb-3 font-bold ${activeTab === 'history' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>Stock Movements</button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
        {activeTab === 'stock' ? (
          <Table 
            columns={[
              { key: 'name', label: 'Product Name' },
              { key: 'stock', label: 'Current Stock', render: (row) => <span className={`font-black ${row.stock < 10 ? 'text-rose-500' : 'text-slate-700'}`}>{row.stock}</span> },
              { key: 'status', label: 'Status', render: (row) => <span className="bg-slate-100 px-2 py-1 rounded text-xs uppercase">{row.status || 'active'}</span> }
            ]} 
            data={products} 
          />
        ) : (
          <div className="overflow-x-auto">
            {loading ? <p className="text-center py-10">Loading...</p> : (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider">
                    <th className="p-4 border-b">Date</th>
                    <th className="p-4 border-b">Product</th>
                    <th className="p-4 border-b text-center">Type</th>
                    <th className="p-4 border-b text-right">Reference</th>
                    <th className="p-4 border-b text-right">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {movements.map((m, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-slate-600">{new Date(m.createdAt).toLocaleString()}</td>
                      <td className="p-4 font-bold text-slate-800">{m.product?.name || "Unknown"}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          m.type === 'PURCHASE' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                        }`}>{m.type}</span>
                      </td>
                      <td className="p-4 text-right text-slate-500 font-mono">{m.refId || '-'}</td>
                      <td className={`p-4 text-right font-black ${m.type === 'PURCHASE' ? 'text-emerald-600' : 'text-blue-600'}`}>
                        {m.type === 'PURCHASE' ? '+' : '-'}{m.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && movements.length === 0 && <p className="text-center text-slate-400 py-10">No movements yet!</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;