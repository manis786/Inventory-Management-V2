import React, { useState } from 'react';
import axios from 'axios';
import { X, Building2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Named export: AccountModal (Isay curly braces {} ke sath import karenge)
export const AccountModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    level: 1,
    type: 'Asset',
    isGroup: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      // Backend URL
      await axios.post('http://localhost:5000/api/finance/coa/add', formData);
      toast.success("Account successfully created!");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create account");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <h3 className="font-black text-slate-800 flex items-center gap-2">
            <Building2 size={18} className="text-indigo-600" />
            Create New Account Ledger
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Level & Type Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hierarchy Level</label>
              <select 
                className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500" 
                value={formData.level}
                onChange={e => setFormData({...formData, level: parseInt(e.target.value)})}
              >
                <option value={1}>Level 1: Main Group</option>
                <option value={2}>Level 2: Control Account</option>
                <option value={3}>Level 3: Subsidiary Ledger</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account Type</label>
              <select 
                className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                {['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account Title</label>
            <input 
              className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="e.g., Cash at Bank" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          {/* Code */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account Code</label>
            <input 
              className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="e.g., 1001" 
              value={formData.code}
              onChange={e => setFormData({...formData, code: e.target.value})} 
            />
          </div>

          {/* Group Toggle */}
          <div 
            className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl cursor-pointer" 
            onClick={() => setFormData({...formData, isGroup: !formData.isGroup})}
          >
            <input 
              type="checkbox" 
              checked={formData.isGroup} 
              className="w-4 h-4 text-indigo-600 rounded" 
              readOnly 
            />
            <span className="text-xs font-bold text-indigo-900">Set as Group Account (Allow sub-accounts)</span>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={16} /> Save New Account
          </button>
        </form>
      </div>
    </div>
  );
};