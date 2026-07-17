import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Folder, FileText, PlusCircle, Edit, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast'; 

// Sahi Named Import jo upper wali file se match karta hai
import { AccountModal } from '../components/ui/AccountModal';

export const ChartOfAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state defined!

    // Backend API URL
    const API_URL = 'http://localhost:5000/api/finance/coa';

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(API_URL);
            if (data.success) {
                setAccounts(data.data);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            toast.error("Failed to load accounts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const renderAccountNode = (node) => (
        <div key={node._id} className="pl-6 py-1">
            <div className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-lg transition">
                <div className="flex items-center gap-3">
                    {node.isGroup ? <Folder size={18} className="text-indigo-500" /> : <FileText size={18} className="text-slate-400" />}
                    <span className="font-mono text-xs font-bold text-slate-500">{node.code}</span>
                    <span className="text-sm text-slate-700 font-medium">{node.name}</span>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded">
                    <Edit size={14} className="text-slate-500" />
                </button>
            </div>
            {node.children?.map((child) => renderAccountNode(child))}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            {/* Header section */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800">Chart of Accounts</h2>
                <div className="flex gap-2">
                    <button onClick={fetchAccounts} className="p-2 text-slate-400 hover:text-indigo-600">
                        <RefreshCw size={16} />
                    </button>
                    {/* Fixed button with correct onClick placement */}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700"
                    >
                        <PlusCircle size={14} /> Add Account
                    </button>
                </div>
            </div>

            {/* List or Loader */}
            {loading ? (
                <div className="text-center p-10 text-slate-400">Loading Accounts...</div>
            ) : accounts.length === 0 ? (
                <div className="text-center p-10 text-slate-500 font-medium">
                    <p>No accounts created yet.</p>
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="text-indigo-600 font-bold underline mt-2"
                    >
                        Create First Account
                    </button>
                </div>
            ) : (
                <div className="divide-y divide-slate-50">
                    {accounts.map((acc) => renderAccountNode(acc))}
                </div>
            )}

            {/* Account Modal Component */}
            <AccountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRefresh={fetchAccounts}
            />
        </div>
    );
};