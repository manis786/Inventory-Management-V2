import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, Calculator, ShoppingBag, Layers, Warehouse, ClipboardCheck,
  Truck, Users, Wallet, BarChart3, ChevronLeft, ChevronRight, Store, 
  ChevronDown, Scale, FileText, TrendingUp, PackageCheck, History, BookOpen, 
  RefreshCw, Coins, PieChart, Clock, FileX, PackageSearch, BarChart4, 
  TrendingDown, Award, AlertTriangle, Landmark, BadgePercent, ArrowRightLeft, 
  Briefcase, FileSpreadsheet, ArrowRight, ShieldCheck, Sliders, Contact2, UserCheck
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
        { name: 'Categories', icon: Layers }, // Naya Add kiya
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
    },
    {
      title: 'System',
      items: [
        { name: 'Users & Roles', icon: ShieldCheck },
        { name: 'Settings', icon: Sliders }
      ]
    }
  ];

  return (
    <aside className={`fixed md:sticky top-0 bottom-0 left-0 z-40 h-screen flex flex-col bg-slate-900 text-slate-300 border-r border-slate-800/20 ${sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'}`}>
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white"><Store className="w-5 h-5" /></div>
          {!sidebarCollapsed && <span className="font-black text-white">Exclusive Mart</span>}
        </div>
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-slate-400">
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!sidebarCollapsed && <div className="px-3 text-[10px] font-black uppercase text-slate-600 tracking-wider mb-2">{group.title}</div>}
            {group.items.map((item) => (
              <div key={item.name} className="relative group">
                <button
                  onClick={(e) => {
                    if (item.hasSubmenu) {
                      toggleSubmenu(item.submenuKey, e);
                    } else {
                      setActiveModule(item.name);
                      setActiveReport(null);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${activeModule === item.name ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800/50 text-slate-400'}`}
                >
                  <div className="flex items-center gap-3"><item.icon size={16} /> {!sidebarCollapsed && item.name}</div>
                  {item.hasSubmenu && !sidebarCollapsed && <ChevronDown size={14} className={`transition-transform ${expandedSubmenus[item.submenuKey] ? 'rotate-180' : ''}`} />}
                </button>
                
                {/* Submenu Logic */}
                {item.hasSubmenu && expandedSubmenus[item.submenuKey] && !sidebarCollapsed && (
                  <div className="pl-4 mt-1 border-l border-slate-800 ml-5 space-y-0.5">
                    {item.subItems.map((sub) => (
                      <button key={sub.id} onClick={() => { setActiveModule('Reports'); setActiveReport(sub.id); }}
                        className="group flex items-center justify-between w-full px-3 py-1.5 text-[11px] text-slate-500 hover:text-indigo-400 transition-all rounded-md hover:bg-slate-800/50">
                        <span className="flex items-center gap-2"><sub.icon size={13} /> {sub.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
export default Sidebar