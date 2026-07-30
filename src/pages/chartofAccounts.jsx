import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { Folder, FileText, PlusCircle, Edit, RefreshCw, ChevronDown, ChevronRight, Trash2, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast'; 
import Swal from 'sweetalert2';

// Sahi Named Import jo upper wali file se match karta hai
import { AccountModal } from '../components/ui/AccountModal';
import { EditAccountModal } from '../components/ui/EditAccountModal';

export const ChartOfAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // Create Modal state
    
    // Nayi States Edit aur Expand/Collapse ke liye
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [accountToEdit, setAccountToEdit] = useState(null);
    const [expandedNodes, setExpandedNodes] = useState({});

    // Backend API URL
    const API_URL = `${API_BASE_URL}/finance/coa`;

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

    // ==========================================
    // 📂 EXPAND / COLLAPSE LOGIC
    // ==========================================
    const toggleNode = (nodeId) => {
        setExpandedNodes(prev => ({
            ...prev,
            [nodeId]: !prev[nodeId]
        }));
    };

    // Saare Group accounts ko recursively dhoond kar expand karne ka function
    const expandAll = () => {
        const tempExpanded = {};
        const extractGroups = (nodes) => {
            nodes.forEach(node => {
                if (node.isGroup) {
                    tempExpanded[node._id] = true;
                }
                if (node.children && node.children.length > 0) {
                    extractGroups(node.children);
                }
            });
        };
        extractGroups(accounts);
        setExpandedNodes(tempExpanded);
    };

    const collapseAll = () => {
        setExpandedNodes({});
    };

    // ==========================================
    // 🛡️ DELETE ACCOUNT LOGIC WITH SWAL
    // ==========================================
    const handleDelete = async (node) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${node.name}"? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5', // Indigo-600
            cancelButtonColor: '#f43f5e',  // Rose-500
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${API_URL}/delete/${node._id}`);
                    if (response.data.success) {
                        toast.success("Account deleted successfully!");
                        fetchAccounts(); // Refresh Tree
                    }
                } catch (err) {
                    // Backend se aane wala Transaction Blocked message yahan toast hoga
                    toast.error(err.response?.data?.message || "Failed to delete account");
                }
            }
        });
    };

    // ==========================================
    // 📝 EDIT ACCOUNTS MODAL TOGGLE
    // ==========================================
    const handleEditClick = (node) => {
        setAccountToEdit(node);
        setIsEditModalOpen(true);
    };

    // Recursive Tree Rendering Logic (Purana dynamic layout)
    const renderAccountNode = (node) => {
        const isExpanded = expandedNodes[node._id];

        return (
            <div key={node._id} className="pl-6 py-1">
                <div 
                    onClick={() => node.isGroup && toggleNode(node._id)}
                    className="flex items-center justify-between group p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition cursor-pointer"
                >
                    <div className="flex items-center gap-3">
                        {/* Expand/Collapse Arrows for Group Nodes */}
                        {node.isGroup ? (
                            isExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />
                        ) : (
                            <span className="w-[14px]" /> // Align files with folder indicators
                        )}

                        {/* Folder indicator changes when open */}
                        {node.isGroup ? (
                            isExpanded ? <FolderOpen size={18} className="text-indigo-500" /> : <Folder size={18} className="text-indigo-500" />
                        ) : (
                            <FileText size={18} className="text-slate-400" />
                        )}
                        
                        <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">{node.code}</span>
                        <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">{node.name}</span>
                    </div>

                    {/* Action Buttons Container (Hover Magic) */}
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleEditClick(node); }}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition"
                            title="Edit Account"
                        >
                            <Edit size={14} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(node); }}
                            className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded transition"
                            title="Delete Account"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                {/* Children render condition checks mapping */}
                {node.isGroup && isExpanded && node.children?.map((child) => renderAccountNode(child))}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-200">
            {/* Header section */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Chart of Accounts</h2>
                    {/* Expand & Collapse Utilities */}
                    {accounts.length > 0 && !loading && (
                        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-100 dark:border-slate-700">
                            <button 
                                onClick={expandAll}
                                className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 px-2.5 py-1.5 rounded-lg transition"
                            >
                                📂 Expand All
                            </button>
                            <button 
                                onClick={collapseAll}
                                className="text-[10px] font-black text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-1.5 rounded-lg transition"
                            >
                                📁 Collapse All
                            </button>
                        </div>
                    )}
                </div>

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
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                    {accounts.map((acc) => renderAccountNode(acc))}
                </div>
            )}

            {/* Account Modal Component (Create Entry) */}
            <AccountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRefresh={fetchAccounts}
            />

            {/* Edit Account Modal Component (Update Entry) */}
            <EditAccountModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                account={accountToEdit}
                onRefresh={fetchAccounts}
            />
        </div>
    );
};