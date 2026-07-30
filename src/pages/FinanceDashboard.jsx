import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  ArrowUpCircle, ArrowDownCircle, Landmark, Wallet, 
  RefreshCw, Download, CreditCard, FileText, Plus 
} from 'lucide-react';

// Apne alag se banaye hue components import kar liye
import ReceivePaymentForm from '../components/ui/ReceivePaymentForm'; 
import VoucherForm from '../components/ui/VoucherForm'

const stats = [
  { label: 'Receivables', value: 'Rs 450,000', icon: ArrowUpCircle, color: 'text-emerald-600' },
  { label: 'Payables', value: 'Rs 210,000', icon: ArrowDownCircle, color: 'text-rose-600' },
  { label: 'Cash Balance', value: 'Rs 85,000', icon: Wallet, color: 'text-indigo-600' },
  { label: 'Bank Balance', value: 'Rs 720,000', icon: Landmark, color: 'text-blue-600' },
];

const profitData = [{ name: 'Profit', value: 850000 }, { name: 'Expense', value: 340000 }];

export const FinanceDashboard = () => {
  // States to toggle views on dashboard
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showVoucherForm, setShowVoucherForm] = useState(false);

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Financial Overview</h1>
          <p className="text-slate-500 text-sm">Welcome back, check your real-time ERP status[cite: 1].</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Voucher Entry Toggle Button */}
          <button 
            onClick={() => { setShowVoucherForm(!showVoucherForm); setShowPaymentForm(false); }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition"
          >
            <FileText size={16} /> {showVoucherForm ? 'Close Voucher Form' : 'New Voucher Entry'}
          </button>

          {/* Receive Payment Toggle Button */}
          <button 
            onClick={() => { setShowPaymentForm(!showPaymentForm); setShowVoucherForm(false); }}
            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition"
          >
            <CreditCard size={16} /> {showPaymentForm ? 'Close Payment Form' : 'Receive Payment'}
          </button>

          <button className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-900 transition">
            <Download size={16} /> Export Reports
          </button>
        </div>
      </div>

      {/* Voucher Form Section */}
      {showVoucherForm && (
        <div className="mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <VoucherForm />
        </div>
      )}

      {/* Receive Payment Section */}
      {showPaymentForm && (
        <div className="mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <ReceivePaymentForm />
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map(({ label, value, icon: Icon, color }, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className={`p-4 rounded-2xl bg-slate-100 ${color}`}><Icon size={24} /></div>
            <div>
              <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">{label}</p>
              <p className="text-lg font-black text-slate-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Profit vs Expense */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Profit vs Expenses</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {profitData.map((e, i) => <Cell key={i} fill={i === 0 ? '#10b981' : '#f43f5e'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bank Reconciliation */}
        <div className="col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><RefreshCw size={18}/> Bank Reconciliation</h3>
            <span className="text-[10px] bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold">1 Item Pending</span>
          </div>
          <table className="w-full text-sm">
            <thead className="text-slate-400 text-left border-b">
              <tr><th className="pb-4">Bank Account</th><th className="pb-4">Book Bal</th><th className="pb-4">Bank Bal</th><th className="pb-4 text-center">Status</th></tr>
            </thead>
            <tbody>
              <tr className="border-b last:border-0">
                <td className="py-5 font-bold">HBL Main</td>
                <td className="py-5">Rs 450,000</td>
                <td className="py-5 text-rose-600 font-bold">Rs 442,000</td>
                <td className="py-5 text-center"><span className="text-rose-600 font-bold">Not Reconciled</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};