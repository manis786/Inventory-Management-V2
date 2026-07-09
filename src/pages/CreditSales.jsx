import React, { useState,useEffect} from 'react';
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
        className="w-full p-2 border rounded text-sm outline-none bg-white"
        placeholder={placeholder}
        value={isOpen ? query : (options?.find(o => o._id === selectedId)?.name || '')}
        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); setActiveIndex(0); }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <div className="absolute z-50 w-full bg-white border mt-1 max-h-40 overflow-y-auto shadow-2xl rounded">
          {filtered?.map((o, i) => (
            <div
              key={o._id}
              className={`p-2 cursor-pointer text-sm flex justify-between ${i === activeIndex ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-100'}`}
              onMouseDown={() => { onSelect(o._id); setIsOpen(false); }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span>{o.name}</span>
              {showQty && <span className={`text-[10px] px-2 py-1 rounded ${i === activeIndex ? 'text-white bg-indigo-500' : 'text-slate-500 bg-slate-100'}`}>Stock: {o.stock || 0}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 2. Modal Component
function CreditSaleModal({ onClose }) {
  const { customers, products, addSale, sales,fetchCustomers } = useApp();

  useEffect(() => {
  if (fetchCustomers) fetchCustomers(); // Modal khulte hi list refresh hogi
}, []);
  const [formData, setFormData] = useState({
  invoiceNo: `INV-${String((sales?.filter(s => s.type === 'credit').length || 0) + 1).padStart(3, '0')}`,
  customerId: '', 
  date: new Date().toISOString().split('T')[0],
  address: '', 
  remarks: '', 
  discountPct: 0, // '0' se init karo
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
    // 1. Customer ko find karo
    const customer = customers?.find(c => c._id === formData.customerId);

    // 2. Validation Checks
    if (!customer) {
      return alert("Please select a valid customer!");
    }

    if (customer.isCreditEnabled === false) {
      return alert(`Error: Credit sales are disabled for ${customer.name}.`);
    }

    // Current Balance + New Invoice Total
    // Note: Agar customer object mein 'balance' field hai toh use karo
    const currentBalance = Number(customer.balance || 0);
    const totalExposure = currentBalance + grandTotal;

    if (totalExposure > Number(customer.creditLimit || 0)) {
      return alert(`⚠️ Warning: Credit limit exceeded!\nMax Limit: ${customer.creditLimit}\nCurrent Total: ${totalExposure}`);
    }

    // 3. Sab sahi hai toh proceed karo
    const processedItems = formData.items.map(i => ({
      productId: i.productId,
      quantity: Number(i.qty),
      price: Number(i.price),
      total: Number(i.qty) * Number(i.price)
    }));

    addSale({
      ...formData,
      items: processedItems,
      subTotal: subTotal,
      discount: discountAmt,
      tax: gstAmt,
      grandTotal: grandTotal,
      paymentMethod: 'Credit',
      type: 'credit',
      status: 'pending',
      dueDate: new Date(new Date().setDate(new Date().getDate() + Number(customer.creditDays || 30))) // Due date calculation
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-2xl flex flex-col max-h-[95vh]">
        <div className="p-4 border-b bg-slate-900 text-white flex justify-between items-center rounded-t-lg">
          <h2 className="font-black uppercase tracking-wider text-sm">SALES INVOICE: {formData.invoiceNo}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="p-6 border-b">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Date</label>
              <input type="date" className="w-full p-2 border rounded text-sm" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} /></div>
            <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Customer</label>
              <SearchableSelect options={customers} placeholder="Select Customer..." selectedId={formData.customerId} onSelect={(id) => setFormData({ ...formData, customerId: id })} /></div>
            <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Delivery Address</label>
              <input className="w-full p-2 border rounded text-sm" placeholder="Enter Delivery Address" onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></div>
            <div><label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Remarks</label>
              <input className="w-full p-2 border rounded text-sm" placeholder="Any remarks?" onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} /></div>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 uppercase text-[10px] font-bold text-slate-500">
              <tr><th className="p-3 text-center">ITEM NAME</th><th className="p-3 text-center">STOCK</th><th className="p-3 text-center">QTY</th><th className="p-3 text-center">PRICE</th><th className="p-3 text-center">AMOUNT</th><th className="p-3 text-center"></th></tr>
            </thead>
            <tbody>
              {formData.items.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2 w-1/3"><SearchableSelect options={products} placeholder="Select Product" selectedId={item.productId} showQty={true} onSelect={(id) => handleProductSelect(idx, id)} /></td>
                  <td className="p-2 text-center font-bold text-slate-500">{item.stock}</td>
                  <td className="p-2 text-center"><input type="number" className="w-16 p-1 border rounded text-center" value={item.qty} onChange={(e) => handleQtyChange(idx, e.target.value)} /></td>
                  <td className="p-2 text-center font-mono">Rs. {item.price}</td>
                  <td className="p-2 text-center font-bold">Rs. {item.price * item.qty}</td>
                  <td className="p-2 text-center"><button onClick={() => removeItem(idx)} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setFormData({ ...formData, items: [...formData.items, { productId: '', qty: 1, price: 0, stock: 0 }] })}><Plus size={14} /> Add Item Line</Button>
        </div>

        <div className="p-6 border-t bg-slate-50 flex justify-between items-start rounded-b-lg">
          <div className="w-1/2 text-xs text-slate-400">Ensure all details are correct before posting.</div>
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-xs font-bold"><span>Subtotal:</span><span>Rs. {subTotal.toLocaleString()}</span></div>
            <div className="flex justify-between items-center text-xs"><span>Discount (%):</span><input type="number" className="w-20 p-1 border rounded text-right" onChange={(e) => setFormData({ ...formData, discountPct: e.target.value })} /></div>
            <div className="flex justify-between items-center text-xs"><span>GST (%):</span><input type="number" className="w-20 p-1 border rounded text-right" onChange={(e) => setFormData({ ...formData, gstPct: e.target.value })} /></div>
            <div className="flex justify-between items-center text-xs"><span>Delivery:</span><input type="number" className="w-20 p-1 border rounded text-right" onChange={(e) => setFormData({ ...formData, delivery: e.target.value })} /></div>
            <div className="border-t pt-2 flex justify-between font-black text-lg"><span>Total:</span><span>Rs. {grandTotal.toLocaleString()}</span></div>
            <Button className="w-full bg-slate-900" onClick={handlePostInvoice}>Post Invoice</Button>
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
    // Backend API ko naya status bhej rahe hain
    await updateSaleStatus(saleId, newStatus); 
    await fetchSales(); // UI refresh karne ke liye
    alert(`Status successfully updated to ${newStatus}`);
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Status update failed!");
  } finally {
    setIsApproving(false);
  }
};

  const handleApprove = async (saleId) => {
    if (!window.confirm("Kya aap yaqeenan is invoice ko approve aur paid mark karna chahte hain?")) return;
    setIsApproving(true);
    try {
      await updateSaleStatus(saleId, 'paid');
      await fetchSales();
      alert("Invoice successfully approved!");
    } catch (error) {
      alert("Approval failed!");
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      alert("Approval failed: " + errorMessage);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-black">Credit Sales Ledger</h1>
        <Button onClick={() => setIsModalOpen(true)}>New Invoice</Button>
      </div>
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm" style={{ tableLayout: 'fixed' }}>
          <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-widest font-bold">
            <tr>
              <th className="p-4" style={{ width: '15%' }}>Invoice #</th>
              <th className="p-4" style={{ width: '25%' }}>Customer</th>
              <th className="p-4" style={{ width: '15%' }}>Date</th>
              <th className="p-4" style={{ width: '15%' }}>Amount</th>
              <th className="p-4" style={{ width: '15%' }}>Status</th>
              <th className="p-4" style={{ width: '15%' }}>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sales?.filter(s => s.type === 'credit').map((s) => {
              const customerObj = customers?.find(c => c._id === s.customerId || c._id === s.customer);
              return (
                <tr key={s._id} className="hover:bg-indigo-50/50 transition-colors duration-200">
                  <td className="p-4 font-mono font-bold text-indigo-600 truncate">{s.invoiceNumber || s.invoiceNo}</td>
                  <td className="p-4 font-medium text-slate-800">{customerObj?.name || 'Walk-in'}</td>
                  <td className="p-4 text-slate-500 font-medium">
                    {s.date ? new Date(s.date).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No Date'}
                  </td>
                  <td className="p-4 font-bold text-slate-900">Rs. {s.grandTotal?.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${s.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {s.status || 'pending'}
                    </span>
                  </td>
<td className="p-4">
  <select
    value={s.status || 'pending'}
    onChange={(e) => handleStatusChange(s._id, e.target.value)}
    disabled={isApproving}
    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border cursor-pointer outline-none transition-all ${
      isApproving ? 'opacity-50 cursor-not-allowed' : ''
    } ${
      s.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
      s.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
      s.status === 'hold' ? 'bg-amber-100 text-amber-700 border-amber-200' :
      s.status === 'void' ? 'bg-slate-200 text-slate-600 border-slate-300' :
      'bg-indigo-50 text-indigo-700 border-indigo-200'
    }`}
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
      </div>
      {isModalOpen && <CreditSaleModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}