import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const VoucherForm = () => {
    const [voucherType, setVoucherType] = useState('Cash Payment');
    const [voucherNumber, setVoucherNumber] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [narration, setNarration] = useState('');
    const [accounts, setAccounts] = useState([]);
    
    const [items, setItems] = useState([
        { account: '', searchInput: '', isOpen: false, selectedIndex: 0, debit: 0, credit: 0, narration: '' },
        { account: '', searchInput: '', isOpen: false, selectedIndex: 0, debit: 0, credit: 0, narration: '' }
    ]);

    useEffect(() => {
        const fetchNextVoucherNumber = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/vouchers/next-number/${voucherType}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data && res.data.voucherNumber) {
                    setVoucherNumber(res.data.voucherNumber);
                }
            } catch (error) {
                console.error('Error fetching next voucher number:', error);
            }
        };

        fetchNextVoucherNumber();
    }, [voucherType]);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/finance/COA`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const rawData = res.data.data || res.data;
                
                const extractPostingAccounts = (accountsList) => {
                    let postingAccs = [];
                    accountsList.forEach(acc => {
                        if (acc.level === 3 && !acc.isGroup) {
                            postingAccs.push(acc);
                        }
                        if (acc.children && acc.children.length > 0) {
                            postingAccs = postingAccs.concat(extractPostingAccounts(acc.children));
                        }
                    });
                    return postingAccs;
                };

                setAccounts(extractPostingAccounts(rawData));
            } catch (error) {
                console.error('Error fetching accounts:', error);
            }
        };
        fetchAccounts();
    }, []);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const selectAccount = (index, acc) => {
        const newItems = [...items];
        newItems[index].account = acc._id;
        newItems[index].searchInput = `${acc.code} - ${acc.name}`;
        newItems[index].isOpen = false;
        newItems[index].selectedIndex = 0;
        setItems(newItems);
    };

    const addRow = () => {
        setItems([...items, { account: '', searchInput: '', isOpen: false, selectedIndex: 0, debit: 0, credit: 0, narration: '' }]);
    };

    const removeRow = (index) => {
        if (items.length > 2) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const totalDebit = items.reduce((sum, item) => sum + (Number(item.debit) || 0), 0);
    const totalCredit = items.reduce((sum, item) => sum + (Number(item.credit) || 0), 0);
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isBalanced) {
            alert('Debit and Credit must be equal before saving!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const payload = {
                voucherType,
                voucherNumber,
                date,
                narration,
                items: items.map(item => ({
                    account: item.account,
                    debit: item.debit,
                    credit: item.credit,
                    narration: item.narration
                }))
            };

            const res = await axios.post(`${API_BASE_URL}/vouchers/create`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(res.data.message || "Voucher created successfully!");
            
            const nextRes = await axios.get(`${API_BASE_URL}/vouchers/next-number/${voucherType}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (nextRes.data && nextRes.data.voucherNumber) {
                setVoucherNumber(nextRes.data.voucherNumber);
            }

            setItems([
                { account: '', searchInput: '', isOpen: false, selectedIndex: 0, debit: 0, credit: 0, narration: '' },
                { account: '', searchInput: '', isOpen: false, selectedIndex: 0, debit: 0, credit: 0, narration: '' }
            ]);
            setNarration('');

        } catch (error) {
            alert(error.response?.data?.error || error.response?.data?.message || 'Failed to create voucher');
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Double Entry Voucher Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Voucher Type</label>
                        <select 
                            value={voucherType} 
                            onChange={(e) => setVoucherType(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        >
                            <option value="Cash Payment">Cash Payment</option>
                            <option value="Cash Receipt">Cash Receipt</option>
                            <option value="Bank Payment">Bank Payment</option>
                            <option value="Bank Receipt">Bank Receipt</option>
                            <option value="Journal">Journal</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Voucher Number</label>
                        <input 
                            type="text" 
                            value={voucherNumber} 
                            onChange={(e) => setVoucherNumber(e.target.value)}
                            required
                            readOnly
                            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm p-2 border text-gray-600 font-semibold"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">General Narration</label>
                    <input 
                        type="text" 
                        value={narration} 
                        onChange={(e) => setNarration(e.target.value)}
                        placeholder="Overall voucher description..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                </div>

                <div className="mt-4">
                    <table className="min-w-full divide-y divide-gray-200 overflow-visible">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-2/5">Account Search</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Debit</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Credit</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Narration</th>
                                <th className="px-3 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((item, index) => {
                                const filteredAccounts = accounts.filter(acc => 
                                    acc.name.toLowerCase().includes((item.searchInput || '').toLowerCase()) ||
                                    acc.code.includes(item.searchInput || '')
                                );

                                return (
                                    <tr key={index} className="relative">
                                        <td className="px-2 py-2 relative">
                                            <input 
                                                type="text"
                                                value={item.searchInput}
                                                placeholder="Type to search account..."
                                                onFocus={() => {
                                                    const newItems = [...items];
                                                    newItems[index].isOpen = true;
                                                    setItems(newItems);
                                                }}
                                                onChange={(e) => {
                                                    const newItems = [...items];
                                                    newItems[index].searchInput = e.target.value;
                                                    newItems[index].isOpen = true;
                                                    newItems[index].selectedIndex = 0;
                                                    setItems(newItems);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (!item.isOpen || filteredAccounts.length === 0) return;

                                                    if (e.key === 'ArrowDown') {
                                                        e.preventDefault();
                                                        const newItems = [...items];
                                                        newItems[index].selectedIndex = (item.selectedIndex + 1) % filteredAccounts.length;
                                                        setItems(newItems);
                                                    } else if (e.key === 'ArrowUp') {
                                                        e.preventDefault();
                                                        const newItems = [...items];
                                                        newItems[index].selectedIndex = (item.selectedIndex - 1 + filteredAccounts.length) % filteredAccounts.length;
                                                        setItems(newItems);
                                                    } else if (e.key === 'Enter' || e.key === 'Tab') {
                                                        e.preventDefault();
                                                        selectAccount(index, filteredAccounts[item.selectedIndex] || filteredAccounts[0]);
                                                    }
                                                }}
                                                className="w-full border rounded p-1 text-sm bg-white"
                                            />
                                            {item.isOpen && (
                                                <div className="absolute z-50 left-2 right-2 mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
                                                    {filteredAccounts.length > 0 ? (
                                                        filteredAccounts.map((acc, accIdx) => (
                                                            <div 
                                                                key={acc._id}
                                                                onMouseDown={() => selectAccount(index, acc)}
                                                                className={`p-2 text-sm cursor-pointer border-b last:border-0 flex justify-between ${
                                                                    accIdx === item.selectedIndex ? 'bg-indigo-100 font-semibold' : 'hover:bg-indigo-50'
                                                                }`}
                                                            >
                                                                <span className="text-gray-800">{acc.name}</span>
                                                                <span className="text-gray-500 text-xs bg-gray-100 px-1.5 py-0.5 rounded">{acc.code}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-2 text-sm text-gray-400 text-center">No account found</div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-2 py-2">
                                            <input 
                                                type="number" 
                                                value={item.debit} 
                                                onChange={(e) => handleItemChange(index, 'debit', e.target.value)}
                                                className="w-full border rounded p-1 text-sm"
                                                min="0"
                                            />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input 
                                                type="number" 
                                                value={item.credit} 
                                                onChange={(e) => handleItemChange(index, 'credit', e.target.value)}
                                                className="w-full border rounded p-1 text-sm"
                                                min="0"
                                            />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input 
                                                type="text" 
                                                value={item.narration} 
                                                onChange={(e) => handleItemChange(index, 'narration', e.target.value)}
                                                className="w-full border rounded p-1 text-sm"
                                                placeholder="Line memo"
                                            />
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            {items.length > 2 && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeRow(index)}
                                                    className="text-red-600 hover:text-red-900 font-bold"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <button 
                        type="button" 
                        onClick={addRow} 
                        className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                    >
                        + Add Line
                    </button>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-4 rounded mt-4">
                    <div className="text-sm font-semibold">
                        <span className="mr-4">Total Debit: <span className="text-blue-600">{totalDebit}</span></span>
                        <span>Total Credit: <span className="text-blue-600">{totalCredit}</span></span>
                    </div>
                    <div>
                        {!isBalanced && (
                            <span className="text-red-500 text-sm mr-4 font-medium">⚠️ Debits & Credits must match!</span>
                        )}
                        <button 
                            type="submit" 
                            disabled={!isBalanced}
                            className={`px-4 py-2 rounded text-white font-medium ${isBalanced ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            Save & Post Voucher
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default VoucherForm;