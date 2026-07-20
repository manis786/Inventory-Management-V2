import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, Calculator, ShoppingBag, Layers, Warehouse, ClipboardCheck,
  Truck, Users, Wallet, BarChart3, ChevronLeft, ChevronRight, Store, 
  ChevronDown, Scale, FileText, TrendingUp, PackageCheck, History, BookOpen, 
  RefreshCw, Coins, PieChart, Clock, FileX, PackageSearch, BarChart4, 
  TrendingDown, Award, AlertTriangle, Landmark, BadgePercent, ArrowRightLeft, 
  Briefcase, FileSpreadsheet, Contact2, UserCheck, ShoppingCartIcon
} from 'lucide-react';

export function Sidebar() {
  const {
    activeModule, setActiveModule, setActiveReport,
    sidebarCollapsed, setSidebarCollapsed
  } = useApp();

  const [expandedSubmenus, setExpandedSubmenus] = useState({
    'operations_reports': false,
    'supply_chain_reports': false,
    'finance_reports': false
  });

  const toggleSubmenu = (menuKey, e) => { 
    e.stopPropagation(); 
    setExpandedSubmenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] })); 
  };

  const menuGroups = [
    {
      title: 'Operations',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'POS Sales', icon: Calculator },
        { name: 'Credit Sales', icon: FileSpreadsheet },
        { name: 'Products', icon: ShoppingBag },
        { name: 'Categories', icon: Layers }, 
        { name: 'Inventory', icon: Warehouse },
        {
          name: 'Operations Reports', icon: BarChart3, hasSubmenu: true, submenuKey: 'operations_reports',
          subItems: [
            { id: 'daily_register_report', name: 'Daily Cash Register', icon: Coins },
            { id: 'product_margin_report', name: 'Sales & Margins', icon: PieChart },
            { id: 'inventory_report', name: 'Inventory Valuation', icon: PackageCheck },
            { id: 'item_ledger', name: 'Item Cardex Ledger', icon: History },
            { id: 'peak_hours_report', name: 'Peak-Hour Analytics', icon: Clock },
            { id: 'void_returns_report', name: 'Returns & Voids Log', icon: FileX }
          ]
        }
      ]
    },
    {
      title: 'Supply Chain',
      items: [
        { name: 'Purchases', icon: ClipboardCheck },
        { name: 'Suppliers', icon: Truck },
        { name: 'Customers', icon: Users },
        { name: 'Purchase Manager', icon: ShoppingCartIcon },
        {
          name: 'Supply Chain Reports', icon: BarChart3, hasSubmenu: true, submenuKey: 'supply_chain_reports',
          subItems: [
            { id: 'po_tracking', name: 'PO Tracking', icon: ClipboardCheck },
            { id: 'purchase_trends', name: 'Purchase Trends', icon: BarChart4 },
            { id: 'stock_aging', name: 'Stock Aging', icon: PackageSearch },
            { id: 'fulfillment_ratio', name: 'Fulfillment Ratio', icon: TrendingDown },
            { id: 'vendor_performance', name: 'Vendor Performance', icon: Award },
            { id: 'returns_claims', name: 'Returns & Claims', icon: AlertTriangle },
            { id: 'customer_statement', name: 'Customer Statement', icon: UserCheck },
            { id: 'vendor_statement', name: 'Vendor Ledger', icon: Contact2 }
          ]
        }
      ]
    },
    {
      title: 'Finance & Governance',
      items: [
        { name: 'Finance Dashboard', icon: PieChart },
        { name: 'Chart of Accounts', icon: BookOpen },
        { name: 'Finance', icon: Wallet },
        {
          name: 'Finance Reports', icon: BarChart3, hasSubmenu: true, submenuKey: 'finance_reports',
          subItems: [
            { id: 'pl_statement', name: 'Profit & Loss', icon: TrendingUp },
            { id: 'balance_sheet', name: 'Balance Sheet', icon: FileText },
            { id: 'general_ledger', name: 'General Ledger', icon: BookOpen },
            { id: 'trial_balance', name: 'Trial Balance', icon: Scale },
            { id: 'bank_rec', name: 'Bank Reconciliation', icon: RefreshCw },
            { id: 'cash_flow', name: 'Cash Flow Analysis', icon: Landmark },
            { id: 'tax_report', name: 'Tax & VAT Summary', icon: BadgePercent },
            { id: 'assets_dep', name: 'Assets Depreciation', icon: FileSpreadsheet },
            { id: 'cost_center', name: 'Cost Center', icon: Briefcase },
            { id: 'inter_branch', name: 'Inter-Branch Transfer', icon: ArrowRightLeft }
          ]
        }
      ]
    }
  ];

  return (
    <aside style={{
      position: 'sticky', top: 0, bottom: 0, left: 0, zIndex: 40, height: '100vh',
      display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a',
      color: '#cbd5e1', borderRight: '1px solid #1e293b', width: sidebarCollapsed ? '72px' : '260px',
      transition: 'width 0.2s ease-in-out'
    }}>
      <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '12px', backgroundColor: '#4f46e5', color: '#fff', display: 'flex', alignItems: 'center' }}><Store className="w-5 h-5" /></div>
          {!sidebarCollapsed && <span style={{ fontWeight: '900', color: '#fff', fontSize: '15px' }}>Exclusive Mart</span>}
        </div>
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {!sidebarCollapsed && <div style={{ padding: '0 12px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#475569', trackingWider: '0.1em', marginBottom: '8px' }}>{group.title}</div>}
            {group.items.map((item) => {
              const isSelected = activeModule === item.name;
              return (
                <div key={item.name} style={{ position: 'relative' }}>
                  <button
                    onClick={(e) => {
                      if (item.hasSubmenu) {
                        toggleSubmenu(item.submenuKey, e);
                      } else {
                        setActiveModule(item.name);
                        if (setActiveReport) setActiveReport(null);
                      }
                    }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500',
                      border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                      backgroundColor: isSelected ? '#4f46e5' : 'transparent',
                      color: isSelected ? '#fff' : '#94a3b8'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><item.icon size={16} /> {!sidebarCollapsed && item.name}</div>
                    {item.hasSubmenu && !sidebarCollapsed && <ChevronDown size={14} style={{ transform: expandedSubmenus[item.submenuKey] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />}
                  </button>
                  
                  {item.hasSubmenu && expandedSubmenus[item.submenuKey] && !sidebarCollapsed && (
                    <div style={{ paddingLeft: '16px', marginTop: '4px', borderLeft: '1px solid #1e293b', marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {item.subItems.map((sub) => {
                        const isSubSelected = activeModule === (sub.id === 'trial_balance' ? 'Trial Balance' : sub.name);
                        return (
                          <button key={sub.id} 
                            onClick={() => { 
                              if (sub.id === 'trial_balance') {
                                setActiveModule('Trial Balance'); // 🔥 Direct Module Set for Trial Balance
                                if (setActiveReport) setActiveReport('trial_balance');
                              } else {
                                setActiveModule('Reports');
                                if (setActiveReport) setActiveReport(sub.id);
                              }
                            }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '6px 12px',
                              fontSize: '12px', 
                              color: isSubSelected ? '#818cf8' : '#64748b', 
                              fontWeight: isSubSelected ? 'bold' : 'normal',
                              background: 'none', border: 'none', textAlign: 'left',
                              cursor: 'pointer', borderRadius: '6px', transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#818cf8'}
                            onMouseLeave={(e) => e.target.style.color = isSubSelected ? '#818cf8' : '#64748b'}
                          >
                            <sub.icon size={13} /> {sub.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
export default Sidebar;