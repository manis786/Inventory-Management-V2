import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const ReceivePaymentForm = () => {
  const [formData, setFormData] = useState({
    customerId: '',
    amountPaid: '',
    paymentMethod: 'Cash',
    referenceNo: ''
  });

  const [customers, setCustomers] = useState([]);
  const [unpaidInvoices, setUnpaidInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 1. Component load hotay hi customers ki list fetch karo
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/customers`);
        const actualData = response.data.data || response.data.customers || response.data;
        
        if (Array.isArray(actualData)) {
          setCustomers(actualData);
        } else {
          setCustomers([]);
        }
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };
    fetchCustomers();
  }, []);

  // 2. Jaise hi Customer select ho, uski unpaid invoices fetch karo
  const handleCustomerChange = async (e) => {
    const custId = e.target.value;
    setFormData({ ...formData, customerId: custId });

    if (!custId) {
      setUnpaidInvoices([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/sales/unpaid/${custId}`);
      
      console.log("Unpaid Invoices Response:", response.data); // Debugging ke liye

      // 🔥 FIX: Backend direct array bhej raha hai, is liye response.data use hoga
      const invoicesData = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setUnpaidInvoices(invoicesData);

    } catch (err) {
      console.error("Error fetching unpaid invoices:", err);
      setUnpaidInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.customerId || !formData.amountPaid || !formData.paymentMethod) {
      setMessage({ type: 'error', text: 'Please fill all required fields.' });
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/payments/receive-payment`, formData);
      setMessage({ type: 'success', text: response.data.message || 'Payment received successfully!' });
      
      setFormData({ customerId: '', amountPaid: '', paymentMethod: 'Cash', referenceNo: '' });
      setUnpaidInvoices([]);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Something went wrong!' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-6 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 transition-colors">
      <h2 className="text-xl font-bold mb-5 text-slate-800 dark:text-slate-100">Receive Customer Payment</h2>
      
      {message.text && (
        <div className={`p-3 mb-4 rounded-lg font-medium text-sm ${
          message.type === 'error'
            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Customer Selection */}
        <div>
          <label className="block mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">Select Customer:</label>
          <select 
            name="customerId" 
            value={formData.customerId} 
            onChange={handleCustomerChange}
            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          >
            <option value="">-- Choose Customer --</option>
            {customers.map((cust) => (
              <option key={cust._id} value={cust._id}>{cust.name}</option>
            ))}
          </select>
        </div>

        {/* Amount Paid */}
        <div>
          <label className="block mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">Amount Paid:</label>
          <input 
            type="number" 
            name="amountPaid" 
            value={formData.amountPaid} 
            onChange={handleChange}
            placeholder="Enter total amount received (e.g. 60000)"
            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">Payment Method:</label>
          <select 
            name="paymentMethod" 
            value={formData.paymentMethod} 
            onChange={handleChange}
            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          >
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
            <option value="Card">Credit / Debit Card</option>
          </select>
        </div>

        {/* Reference / Cheque / Transaction No */}
        <div>
          <label className="block mb-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">Reference / Transaction No:</label>
          <input 
            type="text" 
            name="referenceNo" 
            value={formData.referenceNo} 
            onChange={handleChange}
            placeholder="Enter Bank Ref / Cheque No / Card Transaction ID"
            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Pending Invoices List Table */}
        <div className="mt-2">
          <h3 className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Pending Invoices (FIFO Allocation)</h3>
          {loading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading invoices...</p>
          ) : unpaidInvoices.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500 italic">No pending invoices found for this customer.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="p-2.5 font-semibold">Invoice #</th>
                    <th className="p-2.5 font-semibold">Date</th>
                    <th className="p-2.5 font-semibold">Total Amount</th>
                    <th className="p-2.5 font-semibold">Due Amount</th>
                    <th className="p-2.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {unpaidInvoices.map((inv) => {
                    return (
                      <tr key={inv._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-2.5">{inv.invoiceNumber || 'INV'}</td>
                        <td className="p-2.5">{new Date(inv.createdAt).toLocaleDateString()}</td>
                        <td className="p-2.5">{inv.grandTotal}</td>
                        <td className="p-2.5 font-bold text-rose-600 dark:text-rose-400">{inv.remainingAmount}</td>
                        <td className="p-2.5">{inv.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="w-full py-3 mt-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm shadow-md transition-colors cursor-pointer"
        >
          Save & Apply Payment
        </button>

      </form>
    </div>
  );
};

export default ReceivePaymentForm;