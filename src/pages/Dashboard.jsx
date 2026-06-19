import React from 'react';
import { useApp } from '../context/AppContext';

export function Dashboard() {
  const { transactions = [], products = [], expenses = [], setActiveModule } = useApp();

  const totalRevenue = (transactions || []).reduce((sum, t) => sum + (t.total || 0), 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-4 p-4 bg-white shadow rounded">Total Revenue: PKR {totalRevenue}</div>
    </div>
  );
}
export default Dashboard;