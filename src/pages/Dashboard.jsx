import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Package, TrendingUp, TrendingDown, CreditCard, Users, Clock } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function Dashboard() {
  const { transactions = [], products = [] } = useApp();

  // Dynamic calculations (DESIGN AISE LAGEGA LEKIN DATA SIRF YE HAI)
  const stats = useMemo(() => {
    const sales = transactions.filter(t => t.type === 'SALE');
    const purchases = transactions.filter(t => t.type === 'PURCHASE');
    
    const totalSales = sales.reduce((sum, t) => sum + (t.totalAmount || 0), 0);
    const totalPurchases = purchases.reduce((sum, t) => sum + (t.totalAmount || 0), 0);
    
    return {
      totalSales,
      totalPurchases,
      totalStock: products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0),
      receivable: 0, // static
      payable: 0     // static
    };
  }, [transactions, products]);

  // Movement Trend for Chart
  const movementTrend = useMemo(() => {
    return transactions.slice(-15).map(t => ({
      ...t,
      date: new Date(t.createdAt).toLocaleDateString()
    }));
  }, [transactions]);

  const cardsData = [
    { title: "Total Sales", value: `PKR ${stats.totalSales.toLocaleString()}`, change: "+12.5%", icon: TrendingUp, color: "blue" },
    { title: "Total Purchases", value: `PKR ${stats.totalPurchases.toLocaleString()}`, change: "+8.2%", icon: TrendingDown, color: "emerald" },
    { title: "Stock Items", value: stats.totalStock, change: "-3%", icon: Package, color: "slate" },
    { title: "Receivables", value: `PKR ${stats.receivable}`, change: "+0%", icon: CreditCard, color: "amber" },
    { title: "Payables", value: `PKR ${stats.payable}`, change: "+0%", icon: Users, color: "rose" },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Dashboard</h1>
        <div className="flex gap-3">
          <input type="date" className="p-2 border rounded-lg bg-white shadow-sm" />
          <button className="p-2 bg-blue-600 text-white rounded-lg shadow font-medium">Export Data</button>
        </div>
      </div>
      
      {/* 1. New Professional Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {cardsData.map((item, index) => (
          <div key={index} className="p-6 bg-white shadow rounded-2xl border border-slate-100">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${item.color}-50 text-${item.color}-600 mb-4`}>
              <item.icon size={24} />
            </div>
            <p className="text-slate-500 text-sm font-medium">{item.title}</p>
            <h2 className={`text-2xl font-bold text-${item.color}-700 mt-1`}>{item.value}</h2>
            <p className="text-slate-400 text-xs mt-1"><span className={`font-semibold text-${item.color}-600`}>{item.change}</span> from last month</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* 2. Stock Movement Trend (Main Chart like design) */}
        <div className="lg:col-span-2 p-6 bg-white shadow rounded-2xl border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-6">Inventory Volume Trend (Dynamic Data)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={movementTrend}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip cursor={{ stroke: '#6366f1', strokeWidth: 1 }} />
              <Line type="monotone" dataKey="quantity" stroke="#3b82f6" strokeWidth={4} dot={{ stroke: '#3b82f6', strokeWidth: 3, r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Static Recent Activity Design */}
        <div className="p-6 bg-white shadow rounded-2xl border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-6">Recent Activity (Static Design)</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Clock size={18} /></div>
              <div><p className="text-sm font-semibold">"Nestle Milk" Sold</p><p className="text-xs text-slate-400">Transaction log #582 | 2 mins ago</p></div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><Package size={18} /></div>
              <div><p className="text-sm font-semibold">PO Received: PO-2026-004</p><p className="text-xs text-slate-400">Supplier: "Pakistan Dist" | 1 hr ago</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;