import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TrialBalance() {
  const [tableRows, setTableRows] = useState([]);
  const [grandTotals, setGrandTotals] = useState({ totalDebit: 0, totalCredit: 0 });
  const [loading, setLoading] = useState(true);
  const [hideZero, setHideZero] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/reports/trial-balance');
      
      if (res.data && res.data.success) {
        let rawRows = res.data.data.rows || [];
        
        if (hideZero) {
          rawRows = rawRows.filter(r => {
            const d = Number(r.debit || 0);
            const c = Number(r.credit || 0);
            return d !== 0 || c !== 0 || r.rowType === 'HEADER';
          });
        }

        const processed = processMultiLevelTrialBalance(rawRows);
        setTableRows(processed.rows);
        setGrandTotals(res.data.data.grandTotals || { totalDebit: 0, totalCredit: 0 });
      }
    } catch (err) {
      console.error("Error loading trial balance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [hideZero]);

  const processMultiLevelTrialBalance = (rawRows) => {
    const formattedRows = [];

    const mainCategories = [
      { prefix: '1', name: 'Assets' },
      { prefix: '2', name: 'Liabilities' },
      { prefix: '3', name: 'Equity' },
      { prefix: '4', name: 'Revenue' },
      { prefix: '5', name: 'Expenses' },
    ];

    mainCategories.forEach(cat => {
      const catRows = rawRows.filter(r => r.code && r.code.startsWith(cat.prefix));
      if (catRows.length === 0) return;

      let catDebit = 0;
      let catCredit = 0;
      const groupRows = [];

      const level2Headers = catRows.filter(r => r.code.endsWith('00') && r.code !== `${cat.prefix}000`);

      // Add Level 1 Header
      formattedRows.push({
        _id: `l1-${cat.prefix}`,
        code: `${cat.prefix}000`,
        name: cat.name,
        debit: null,
        credit: null,
        depth: 0,
        rowType: 'HEADER'
      });

      level2Headers.forEach(l2 => {
        let l2Debit = 0;
        let l2Credit = 0;
        const l2Children = [];
        const l2Prefix = l2.code.substring(0, 2);

        catRows.forEach(r => {
          const isChild = r.code.startsWith(l2Prefix) && r.code !== l2.code && !r.code.endsWith('00');
          
          if (isChild) {
            const d = Number(r.debit || 0);
            const c = Number(r.credit || 0);
            l2Debit += d;
            l2Credit += c;

            l2Children.push({
              ...r,
              depth: 2,
              rowType: 'ACCOUNT'
            });
          }
        });

        l2Debit += Number(l2.debit || 0);
        l2Credit += Number(l2.credit || 0);

        catDebit += l2Debit;
        catCredit += l2Credit;

        if (!hideZero || l2Children.length > 0 || l2Debit !== 0 || l2Credit !== 0) {
          groupRows.push({
            ...l2,
            debit: null,
            credit: null,
            depth: 1,
            rowType: 'HEADER'
          });

          groupRows.push(...l2Children);

          if (l2Children.length > 0) {
            groupRows.push({
              _id: `sub-l2-${l2.code}`,
              code: '',
              name: `Total ${l2.name}`,
              debit: l2Debit,
              credit: l2Credit,
              depth: 1,
              rowType: 'SUBTOTAL'
            });
          }
        }
      });

      formattedRows.push(...groupRows);

      // Add Level 1 Grand Subtotal
      formattedRows.push({
        _id: `sub-l1-${cat.prefix}`,
        code: '',
        name: `Total ${cat.name}`,
        debit: catDebit,
        credit: catCredit,
        depth: 0,
        rowType: 'SUBTOTAL'
      });
    });

    return { rows: formattedRows };
  };

  const formatMoney = (val, isHeader = false) => {
    if (isHeader || val === null || val === undefined) return '';
    const num = Number(val);
    if (num === 0) return '-'; 
    return num.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  // Calculate Difference between Total Debit and Total Credit
  const totalDebitNum = Number(grandTotals.totalDebit || 0);
  const totalCreditNum = Number(grandTotals.totalCredit || 0);
  const difference = totalDebitNum - totalCreditNum;

  return (
    <div style={{ padding: "24px", fontFamily: "Segoe UI, sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", backgroundColor: "#fff", padding: "24px", borderRadius: "8px", border: "1px solid #cbd5e1", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
        
        {/* Header & Controls Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ color: "#0f172a", fontSize: "20px", fontWeight: "bold", margin: 0 }}>Trial Balance Report</h2>
          
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <label style={{ fontSize: "13px", color: "#334155", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "500" }}>
              <input 
                type="checkbox" 
                checked={hideZero} 
                onChange={(e) => setHideZero(e.target.checked)}
                style={{ cursor: "pointer", width: "16px", height: "16px" }}
              />
              Hide Zero Balances
            </label>

            <button 
              onClick={fetchReport}
              style={{
                backgroundColor: "#0f172a",
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                borderRadius: "6px",
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading report...</div>
        ) : (
          <>
            <table style={{ width: "100%", borderCollapse: "collapse", border: "2px solid #0f172a" }}>
              <thead>
                <tr style={{ backgroundColor: "#0f172a", color: "#fff", fontSize: "13px" }}>
                  <th style={{ padding: "12px", textAlign: "left", width: "140px", borderRight: "1px solid #334155" }}>Account Code</th>
                  <th style={{ padding: "12px", textAlign: "left", borderRight: "1px solid #334155" }}>Account Description</th>
                  <th style={{ padding: "12px", textAlign: "right", width: "170px", borderRight: "1px solid #334155" }}>Debit (PKR)</th>
                  <th style={{ padding: "12px", textAlign: "right", width: "170px" }}>Credit (PKR)</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => {
                  const isHeader = row.rowType === 'HEADER';
                  const isSubtotal = row.rowType === 'SUBTOTAL';

                  return (
                    <tr 
                      key={row._id} 
                      style={{ 
                        backgroundColor: isSubtotal ? "#e2e8f0" : isHeader ? "#f8fafc" : "#fff",
                        fontWeight: isHeader || isSubtotal ? "700" : "400",
                        color: isSubtotal ? "#0f172a" : "#1e293b",
                        borderBottom: isSubtotal ? "2px solid #0f172a" : "1px solid #cbd5e1",
                        fontSize: "13px"
                      }}
                    >
                      <td style={{ padding: "9px 12px", fontFamily: "monospace", borderRight: "1px solid #cbd5e1", color: isSubtotal ? "#0f172a" : "#475569" }}>
                        {row.code}
                      </td>
                      <td style={{ padding: "9px 12px", paddingLeft: `${(row.depth || 0) * 24 + 12}px`, borderRight: "1px solid #cbd5e1" }}>
                        {row.name}
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #cbd5e1", color: Number(row.debit) > 0 ? "#15803d" : "#64748b", fontWeight: isSubtotal ? "800" : "600" }}>
                        {formatMoney(row.debit, isHeader)}
                      </td>
                      <td style={{ padding: "9px 12px", textAlign: "right", fontFamily: "monospace", color: Number(row.credit) > 0 ? "#b91c1c" : "#64748b", fontWeight: isSubtotal ? "800" : "600" }}>
                        {formatMoney(row.credit, isHeader)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                {/* Grand Total Row */}
                <tr style={{ backgroundColor: "#0f172a", color: "#fff", fontWeight: "800", fontSize: "14px" }}>
                  <td colSpan="2" style={{ padding: "14px 12px", textAlign: "right", borderRight: "1px solid #334155", letterSpacing: "0.5px" }}>
                    GRAND TOTAL:
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "right", fontFamily: "monospace", borderRight: "1px solid #334155", color: "#4ade80" }}>
                    {formatMoney(grandTotals.totalDebit, false)}
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "right", fontFamily: "monospace", color: "#f87171" }}>
                    {formatMoney(grandTotals.totalCredit, false)}
                  </td>
                </tr>

                {/* Difference Row */}
                <tr style={{ backgroundColor: difference === 0 ? "#f0fdf4" : "#fef2f2", color: difference === 0 ? "#166534" : "#991b1b", fontWeight: "700", fontSize: "13px", borderTop: "2px solid #0f172a" }}>
                  <td colSpan="2" style={{ padding: "10px 12px", textAlign: "right", borderRight: "1px solid #cbd5e1" }}>
                    DIFFERENCE (Debit - Credit):
                  </td>
                  <td colSpan="2" style={{ padding: "10px 12px", textAlign: "center", fontFamily: "monospace" }}>
                    {difference === 0 ? "Balanced (0.00)" : difference.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Developer Copyright Notice */}
            <div style={{ marginTop: "20px", textAlign: "center", fontSize: "12px", color: "#64748b", borderTop: "1px dashed #cbd5e1", paddingTop: "12px" }}>
              Developed with precision by <strong>Muhammad Anis</strong> &copy; {new Date().getFullYear()} All Rights Reserved.
            </div>
          </>
        )}

      </div>
    </div>
  );
}