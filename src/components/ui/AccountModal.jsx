import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Building2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const AccountModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    level: 1,
    type: 'Asset',
    isGroup: false,
    parent: '' 
  });

  const [parentOptions, setParentOptions] = useState([]); // Level 1 ya Level 2 parents store karne ke liye

  // 🔥 EFFECT: Jab bhi modal open ho ya user Hierarchy Level badle, dynamic data fetch ho
  useEffect(() => {
    if (isOpen) {
      const fetchParents = async () => {
        try {
          let targetLevel = 1;
          
          if (formData.level === 3) targetLevel = 2; // Level 3 ke liye Level 2 parents chahiye
          if (formData.level === 2) targetLevel = 1; // Level 2 ke liye Level 1 parents chahiye

          // Agar Level 1 khud ban raha hai to uska koi parent nahi hoga
          if (formData.level === 1) {
            setParentOptions([]);
            return;
          }

          // Dynamic network hit with query parameter
          const response = await axios.get(`http://localhost:5000/api/finance/coa/parent-groups?level=${targetLevel}`);
          if (response.data.success) {
            setParentOptions(response.data.data);
          }
        } catch (err) {
          console.error("Failed to fetch parent groups", err);
          toast.error("Failed to load parent hierarchy options");
        }
      };
      fetchParents();
    }
  }, [isOpen, formData.level]);

  const handleLevelChange = (newLevel) => {
    setFormData({
      ...formData,
      level: newLevel,
      parent: '', // Dropdown purana reset karne ke liye
      code: newLevel === 3 ? 'AUTO-GENERATED' : '' 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, code, level, type, isGroup, parent } = formData;
    
    if (!name || (level !== 3 && !code)) {
      toast.error("Please fill all required fields");
      return;
    }
    // Dono hierarchy cases (Level 2 & 3) par validation mandatory check bitha di
    if (level > 1 && !parent) {
      toast.error(`Please select a parent group for Level ${level} Account`);
      return;
    }

    try {
      const payload = { 
        name,
        code,
        isGroup,
        level,
        type,
        parent: parent ? parent : "" 
      };
      if (payload.level === 3) delete payload.code;

      const response = await axios.post('http://localhost:5000/api/finance/coa/add', payload);
      if (response.data.success) {
        toast.success("Account successfully created!");
        setFormData({ name: '', code: '', level: 1, type: 'Asset', isGroup: false, parent: '' });
        onRefresh();
        onClose();
      }
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hierarchy Level</label>
              <select 
                className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500" 
                value={formData.level}
                onChange={e => handleLevelChange(parseInt(e.target.value))}
              >
                <option value={1}>Level 1: Main Group</option>
                <option value={2}>Level 2: Control Account</option>
                <option value={3}>Level 3: Subsidiary Ledger</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account Type</label>
              <select 
                className={`w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 ${formData.level > 1 ? 'opacity-60 cursor-not-allowed' : ''}`}
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                disabled={formData.level > 1} // Dono level type automatic baap se inherit karenge
              >
                {['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 🔥 DYNAMIC DROPDOWN LAYER: Level 2 aur Level 3 dono dynamic handle honge */}
          {formData.level > 1 && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {formData.level === 2 ? "Sub Account Of (Level 1 Main Head)" : "Sub Account Of (Level 2 Control Account)"}
              </label>
              <select 
                className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-900 font-bold"
                value={formData.parent}
                onChange={e => {
                  const selectedParent = parentOptions.find(p => p._id === e.target.value);
                  setFormData({
                    ...formData, 
                    parent: e.target.value,
                    type: selectedParent ? selectedParent.type : formData.type // Inherit Head Type
                  });
                }}
              >
                <option value="">Select Parent Head...</option>
                {parentOptions.map(parent => (
                  <option key={parent._id} value={parent._id}>
                    {parent.code} - {parent.name} ({parent.type})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account Title</label>
            <input 
              className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder={formData.level === 2 ? "e.g., Cash Accounts" : "e.g., Cash at Bank"} 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          {/* Code */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account Code</label>
            <input 
              className={`w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500 ${formData.level === 3 ? 'bg-slate-100 text-slate-400 font-bold' : ''}`}
              placeholder={formData.level === 3 ? "System Defined Code" : "e.g., 1100"} 
              value={formData.level === 3 ? "AUTO-GENERATED BY SYSTEM" : formData.code}
              onChange={e => setFormData({...formData, code: e.target.value})} 
              disabled={formData.level === 3}
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