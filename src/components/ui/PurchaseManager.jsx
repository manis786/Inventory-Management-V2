import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { PackageCheck, Clock, FileText, ArrowDownLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export const PurchaseManager = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch all purchases on mount
  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/purchases`);
      if (response.data.success) {
        setPurchases(response.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Purchases load karne mein masla hua");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  // 2. Trigger Double-Entry and Stock In on click
  const handleReceivePurchase = async (purchaseId) => {
    try {
      toast.loading("Processing Stock In & Ledger Posting...");
      
      // Backend par receive API hit hogi jo poora ACID transaction handle karegi
      const response = await axios.patch(`${API_BASE_URL}/purchases/receive/${purchaseId}`);
      
      toast.dismiss();
      if (response.data.success) {
        toast.success("Stock Received! Ledger Automatic Update Hogaya.");
        fetchPurchases(); // Live data update refresh
      }
    } catch (err) {
      toast.dismiss();
      console.error(err);
      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  return (
    <div className="purchase-container" style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1e293b' }}>Purchase Orders Logs</h2>
        <button onClick={fetchPurchases} style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Refresh</button>
      </div>

      {loading ? (
        <p>Loading purchases...</p>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {purchases.map((po) => (
            <div 
              key={po._id} 
              style={{ 
                background: '#fff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '16px', 
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              {/* Left Side: Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <FileText size={16} color="#6366f1" />
                  <span style={{ fontWeight: 'bold', color: '#334155' }}>PO-{po._id.toString().slice(-5).toUpperCase()}</span>
                  <span style={{ 
                    fontSize: '11px', 
                    padding: '2px 8px', 
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    background: po.status === 'Received' ? '#dcfce7' : '#fef9c3',
                    color: po.status === 'Received' ? '#15803d' : '#a16207'
                  }}>
                    {po.status}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                  Supplier: <strong>{po.supplier?.name || 'N/A'}</strong> | Items: {po.items?.length || 0}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                  Date: {new Date(po.date).toLocaleDateString()}
                </p>
              </div>

              {/* Right Side: Price & Action Trigger */}
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div>
                  <span style={{ block: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>TOTAL AMOUNT</span>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Rs. {po.totalAmount}</p>
                </div>

                {po.status === 'Pending' ? (
                  <button
                    onClick={() => handleReceivePurchase(po._id)}
                    style={{
                      background: '#4f46e5',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
                    }}
                  >
                    <PackageCheck size={16} />
                    Receive Stock
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontSize: '13px', fontWeight: 'bold' }}>
                    <ArrowDownLeft size={16} /> Stocked & Posted
                  </div>
                )}
              </div>
            </div>
          ))}
          {purchases.length === 0 && <p style={{ color: '#64748b', textAlign: 'center' }}>There is no PO in Database</p>}
        </div>
      )}
    </div>
  );
};