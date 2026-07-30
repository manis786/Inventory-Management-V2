import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { X, Trash2, Plus, CheckCircle } from 'lucide-react';

// 1. Searchable Select Component
const SearchableSelect = ({ options, placeholder, onSelect, selectedId, showQty }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const filtered = options?.filter(o => o.name?.toLowerCase().includes(query.toLowerCase()));
  

  const handleKeyDown = (e) => {
    if (!isOpen) { setIsOpen(true); return; }
    if (e.key === 'ArrowDown') {
      setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter' && filtered[activeIndex]) {
      onSelect(filtered[activeIndex]._id);
      setIsOpen(false);
      setQuery('');
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full" onKeyDown={handleKeyDown}>
      <input
        className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded text-sm outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        placeholder={placeholder}
        value={isOpen ? query : (options?.find(o => o._id === selectedId)?.name || '')}
        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); setActiveIndex(0); }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <div className="absolute z-50 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 max-h-40 overflow-y-auto shadow-2xl rounded">
          {filtered?.map((o, i) => (
            <div
              key={o._id}
              className={`p-2 cursor-pointer text-sm flex justify-between ${i === activeIndex ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'}`}
              onMouseDown={() => { onSelect(o._id); setIsOpen(false); }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span>{o.name}</span>
              {showQty && <span className={`text-[10px] px-2 py-1 rounded ${i === activeIndex ? 'text-white bg-indigo-500' : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700'}`}>Stock: {o.stock || 0}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 2. Modal Component
function CreditSaleModal({ onClose }) {
  const { customers, products, addSale, sales, fetchCustomers } = useApp();

  useEffect(() => {
    if (fetchCustomers) fetchCustomers();
  }, []);

  const [formData, setFormData] = useState({
    invoiceNo: `INV-${String((sales?.filter(s => s.type === 'credit').length || 0) + 1).padStart(3, '0')}`,
    customerId: '', 
    date: new Date().toISOString().split('T')[0],
    address: '', 
    remarks: '', 
    discountPct: 0,
    gstPct: 0, 
    delivery: 0,
    items: [{ productId: '', qty: 1, price: 0, stock: 0 }],
  });

  const handleProductSelect = (idx, productId) => {
    const product = products?.find(p => p._id === productId);
    const newItems = [...formData.items];
    const price = Number(product?.price || product?.salePrice || 0);
    newItems[idx] = { ...newItems[idx], productId, price, stock: Number(product?.stock || 0) };
    setFormData({ ...formData, items: newItems });
  };

  const handleQtyChange = (idx, val) => {
    const n = [...formData.items];
    n[idx].qty = Number(val);
    setFormData({ ...formData, items: n });
  };

  const removeItem = (idx) => {
    setFormData({ ...formData, items: formData.items.filter((_, i) => i !== idx) });
  };

  const subTotal = formData.items.reduce((acc, i) => acc + (Number(i.price) * Number(i.qty || 0)), 0);
  const discountAmt = (subTotal * Number(formData.discountPct)) / 100;
  const gstAmt = ((subTotal - discountAmt) * Number(formData.gstPct)) / 100;
  const grandTotal = subTotal - discountAmt + gstAmt + Number(formData.delivery);

  const handlePostInvoice = () => {
    const customer = customers?.find(c => c._id === formData.customerId);
    if (!customer) return alert("Please select a valid customer!");
    if (customer.isCreditEnabled === false) return alert(`Error: Credit sales are disabled for ${customer.name}.`);
    const currentBalance = Number(customer.balance || 0);
    const totalExposure = currentBalance + grandTotal;
    if (totalExposure > Number(customer.creditLimit || 0)) {
      return alert(`⚠️ Warning: Credit limit exceeded!\nMax Limit: ${customer.creditLimit}\nCurrent Total: ${totalExposure}`);
    }
    const processedItems = formData.items.map(i => ({
      productId: i.productId, quantity: Number(i.qty), price: Number(i.price), total: Number(i.qty) * Number(i.price)
    }));
    addSale({
      ...formData, items: processedItems, subTotal, discount: discountAmt, tax: gstAmt,
      grandTotal, paymentMethod: 'Credit', type: 'credit', status: 'pending',
      dueDate: new Date(new Date().setDate(new Date().getDate() + Number(customer.creditDays || 30)))
    });
    onClose();
  };

  const inputCls = "w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900 text-white flex justify-between items-center rounded-t-xl">
          <h2 className="font-black uppercase tracking-wider text-sm">SALES INVOICE: {formData.invoiceNo}</h2>
          <button onClick={onClose} className="hover:text-slate-300 transition-colors cursor-pointer"><X size={20} /></button>
        </div>

        {/* Form Fields */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Date</label>
              <input type="date" className={inputCls} value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Customer</label>
              <SearchableSelect options={customers} placeholder="Select Customer..." selectedId={formData.customerId} onSelect={(id) => setFormData({ ...formData, customerId: id })} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Delivery Address</label>
              <input className={inputCls} placeholder="Enter Delivery Address" onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Remarks</label>
              <input className={inputCls} placeholder="Any remarks?" onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-6 flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800 uppercase text-[10px] font-bold text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-3 text-center">ITEM NAME</th>
                <th className="p-3 text-center">STOCK</th>
                <th className="p-3 text-center">QTY</th>
                <th className="p-3 text-center">PRICE</th>
                <th className="p-3 text-center">AMOUNT</th>
                <th className="p-3 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {formData.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-2 w-1/3"><SearchableSelect options={products} placeholder="Select Product" selectedId={item.productId} showQty={true} onSelect={(id) => handleProductSelect(idx, id)} /></td>
                  <td className="p-2 text-center font-bold text-slate-500 dark:text-slate-400">{item.stock}</td>
                  <td className="p-2 text-center">
                    <input type="number" className="w-16 p-1 border border-slate-200 dark:border-slate-700 rounded text-center bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500" value={item.qty} onChange={(e) => handleQtyChange(idx, e.target.value)} />
                  </td>
                  <td className="p-2 text-center font-mono text-slate-700 dark:text-slate-300">Rs. {item.price}</td>
                  <td className="p-2 text-center font-bold text-slate-800 dark:text-slate-100">Rs. {item.price * item.qty}</td>
                  <td className="p-2 text-center"><button onClick={() => removeItem(idx)} className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setFormData({ ...formData, items: [...formData.items, { productId: '', qty: 1, price: 0, stock: 0 }] })}>
            <Plus size={14} /> Add Item Line
          </Button>
        </div>

        {/* Footer / Totals */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-start rounded-b-xl">
          <div className="w-1/2 text-xs text-slate-400 dark:text-slate-500">Ensure all details are correct before posting.</div>
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Subtotal:</span><span>Rs. {subTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
              <span>Discount (%):</span>
              <input type="number" className="w-20 p-1 border border-slate-200 dark:border-slate-700 rounded text-right bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500" onChange={(e) => setFormData({ ...formData, discountPct: e.target.value })} />
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
              <span>GST (%):</span>
              <input type="number" className="w-20 p-1 border border-slate-200 dark:border-slate-700 rounded text-right bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500" onChange={(e) => setFormData({ ...formData, gstPct: e.target.value })} />
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
              <span>Delivery:</span>
              <input type="number" className="w-20 p-1 border border-slate-200 dark:border-slate-700 rounded text-right bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500" onChange={(e) => setFormData({ ...formData, delivery: e.target.value })} />
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-black text-lg text-slate-800 dark:text-slate-100">
              <span>Total:</span><span>Rs. {grandTotal.toLocaleString()}</span>
            </div>
            <Button className="w-full" variant="primary" onClick={handlePostInvoice}>Post Invoice</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Main Page
export default function CreditSales() {
  const { sales, updateSaleStatus, customers, fetchSales } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const handleStatusChange = async (saleId, newStatus) => {
    if (!window.confirm(`Kya aap yaqeenan status "${newStatus}" par change karna chahte hain?`)) return;
    setIsApproving(true);
    try {
      await updateSaleStatus(saleId, newStatus); 
      await fetchSales();
      alert(`Status successfully updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Status update failed!");
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100">Credit Sales Ledger</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage and track all credit invoices</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} variant="primary">New Invoice</Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left text-sm" style={{ tableLayout: 'fixed' }}>
          <thead className="bg-slate-900 dark:bg-slate-950 text-white uppercase text-[10px] tracking-widest font-bold">
            <tr>
              <th className="p-4" style={{ width: '15%' }}>Invoice #</th>
              <th className="p-4" style={{ width: '25%' }}>Customer</th>
              <th className="p-4" style={{ width: '15%' }}>Date</th>
              <th className="p-4" style={{ width: '15%' }}>Amount</th>
              <th className="p-4" style={{ width: '15%' }}>Status</th>
              <th className="p-4" style={{ width: '15%' }}>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sales?.filter(s => s.type === 'credit').map((s) => {
              const customerObj = customers?.find(c => c._id === s.customerId || c._id === s.customer);
              return (
                <tr key={s._id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 transition-colors duration-150">
                  <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400 truncate">{s.invoiceNumber || s.invoiceNo}</td>
                  <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{customerObj?.name || 'Walk-in'}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 font-medium">
                    {s.date ? new Date(s.date).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No Date'}
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-slate-100">Rs. {s.grandTotal?.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      s.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' :
                      s.status === 'rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' :
                      s.status === 'void' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                      s.status === 'hold' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' :
                      'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                    }`}>
                      {s.status || 'pending'}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={s.status || 'pending'}
                      onChange={(e) => handleStatusChange(s._id, e.target.value)}
                      disabled={isApproving}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border cursor-pointer outline-none transition-all
                        bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700
                        focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                        ${isApproving ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
                      <option value="hold">Hold</option>
                      <option value="void">Void</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty state */}
        {!sales?.filter(s => s.type === 'credit').length && (
          <div className="py-16 text-center text-slate-400 dark:text-slate-500">
            <p className="font-medium">No credit invoices found.</p>
            <p className="text-xs mt-1">Click "New Invoice" to create one.</p>
          </div>
        )}
      </div>

      {isModalOpen && <CreditSaleModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}