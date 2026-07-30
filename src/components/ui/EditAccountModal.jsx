import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { X, Edit2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const EditAccountModal = ({ isOpen, onClose, account, onRefresh }) => {
  const [editName, setEditName] = useState('');

  // Jab bhi naya account select ho kar modal khule, state update ho jaye
  useEffect(() => {
    if (account) {
      setEditName(account.name);
    }
  }, [account]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Account title cannot be empty");
      return;
    }
    try {
      const response = await axios.put(`${API_BASE_URL}/finance/coa/update/${account._id}`, {
        name: editName
      });
      if (response.data.success) {
        toast.success("Account title updated!");
        onRefresh();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update account");
    }
  };

  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <h3 className="font-black text-slate-800 flex items-center gap-2 text-sm">
            <Edit2 size={16} className="text-indigo-600" />
            Edit Account Title
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition">
            <X size={16} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account Code (Read Only)</label>
            <input 
              className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm font-mono text-slate-500 outline-none cursor-not-allowed" 
              value={account.code} 
              disabled 
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account Title</label>
            <input 
              className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800" 
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter new account name"
              autoFocus
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl font-bold text-sm transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={14} /> Update
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};