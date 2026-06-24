import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Table } from '../components/ui/Table';
import { Package, TrendingUp, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { formatPKR } from '../data/store';

export function Inventory() {
  const { products, movements } = useApp(); // movements yahan se mil rahe hain[cite: 4]
  const [activeTab, setActiveTab] = useState('stock');

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
              { key: 'status', label: 'Status', render: (row) => <span className="bg-slate-100 px-2 py-1 rounded text-xs uppercase">{row.status}</span> }
            ]} 
            data={products} 
          />
        ) : (
          <div className="space-y-4">
            {movements && movements.length > 0 ? movements.map((m, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${m.type === 'PURCHASE' ? 'bg-green-100' : 'bg-blue-100'}`}>
                    <ArrowRightLeft className={`w-4 h-4 ${m.type === 'PURCHASE' ? 'text-green-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{m.productName}</p>
                    <p className="text-[10px] text-slate-400">{new Date(m.date).toLocaleString()}</p>
                  </div>
                </div>
                <span className={`font-black ${m.type === 'PURCHASE' ? 'text-green-600' : 'text-blue-600'}`}>
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