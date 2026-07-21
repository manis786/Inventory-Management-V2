import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        const response = await axios.get('/api/customers');
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
      const response = await axios.get(`/api/sales/unpaid/${custId}`);
      
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
      const response = await axios.post('/api/payments/receive-payment', formData);
      setMessage({ type: 'success', text: response.data.message || 'Payment received successfully!' });
      
      setFormData({ customerId: '', amountPaid: '', paymentMethod: 'Cash', referenceNo: '' });
      setUnpaidInvoices([]);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Something went wrong!' });
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '30px auto', padding: '25px', background: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Receive Customer Payment</h2>
      
      {message.text && (
        <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', background: message.type === 'error' ? '#f8d7da' : '#d4edda', color: message.type === 'error' ? '#721c24' : '#155724' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Customer Selection */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Customer:</label>
          <select 
            name="customerId" 
            value={formData.customerId} 
            onChange={handleCustomerChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">-- Choose Customer --</option>
            {customers.map((cust) => (
              <option key={cust._id} value={cust._id}>{cust.name}</option>
            ))}
          </select>
        </div>

        {/* Amount Paid */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Amount Paid:</label>
          <input 
            type="number" 
            name="amountPaid" 
            value={formData.amountPaid} 
            onChange={handleChange}
            placeholder="Enter total amount received (e.g. 60000)"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Payment Method */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Payment Method:</label>
          <select 
            name="paymentMethod" 
            value={formData.paymentMethod} 
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
            <option value="Card">Credit / Debit Card</option>
          </select>
        </div>

        {/* Reference / Cheque / Transaction No */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Reference / Transaction No:</label>
          <input 
            type="text" 
            name="referenceNo" 
            value={formData.referenceNo} 
            onChange={handleChange}
            placeholder="Enter Bank Ref / Cheque No / Card Transaction ID"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Pending Invoices List Table */}
        <div style={{ marginTop: '10px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#555' }}>Pending Invoices (FIFO Allocation)</h3>
          {loading ? (
            <p>Loading invoices...</p>
          ) : unpaidInvoices.length === 0 ? (
            <p style={{ color: '#888', fontStyle: 'italic' }}>No pending invoices found for this customer.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '5px' }}>
                <thead>
                  <tr style={{ background: '#f1f1f1', textAlign: 'left', fontSize: '14px' }}>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Invoice #</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Date</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Total Amount</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Due Amount</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '14px' }}>
                  {unpaidInvoices.map((inv) => {
                    return (
                      <tr key={inv._id}>
                        {/* 🔥 FIX: Schema ki exact field names mapping */}
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{inv.invoiceNumber || 'INV'}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{new Date(inv.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{inv.grandTotal}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold', color: '#d9534f' }}>{inv.remainingAmount}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{inv.status}</td>
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
          style={{ padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}
        >
          Save & Apply Payment
        </button>

      </form>
    </div>
  );
};

export default ReceivePaymentForm;