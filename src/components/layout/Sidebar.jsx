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
    <aside
      className={`
        sticky top-0 left-0 z-40 h-screen flex flex-col
        bg-slate-900 dark:bg-slate-950 text-slate-400
        border-r border-slate-800 dark:border-slate-800/80
        transition-[width] duration-200 ease-in-out sidebar-shadow
        ${sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'}
      `}
    >
      {/* Logo / Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 dark:border-slate-800/80 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white flex items-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-black text-white text-[15px] whitespace-nowrap">Exclusive Mart</span>
          )}
        </div>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="text-slate-500 hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-slate-800 cursor-pointer shrink-0"
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-5">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="flex flex-col gap-1">
            {!sidebarCollapsed && (
              <div className="px-3 text-[10px] font-black uppercase text-slate-600 tracking-widest mb-1">
                {group.title}
              </div>
            )}
            {group.items.map((item) => {
              const isSelected = activeModule === item.name;
              return (
                <div key={item.name} className="relative">
                  <button
                    onClick={(e) => {
                      if (item.hasSubmenu) {
                        toggleSubmenu(item.submenuKey, e);
                      } else {
                        setActiveModule(item.name);
                        if (setActiveReport) setActiveReport(null);
                      }
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium
                      border-none cursor-pointer transition-all duration-150
                      ${isSelected
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/40'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <item.icon size={16} className="shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </div>
                    {item.hasSubmenu && !sidebarCollapsed && (
                      <ChevronDown
                        size={14}
                        className={`shrink-0 transition-transform duration-200 ${expandedSubmenus[item.submenuKey] ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>

                  {/* Sub-menu */}
                  {item.hasSubmenu && expandedSubmenus[item.submenuKey] && !sidebarCollapsed && (
                    <div className="pl-4 mt-1 ml-5 border-l border-slate-800 flex flex-col gap-0.5">
                      {item.subItems.map((sub) => {
                        const isSubSelected = activeModule === (sub.id === 'trial_balance' ? 'Trial Balance' : sub.name);
                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              if (sub.id === 'trial_balance') {
                                setActiveModule('Trial Balance');
                                if (setActiveReport) setActiveReport('trial_balance');
                              } else {
                                setActiveModule('Reports');
                                if (setActiveReport) setActiveReport(sub.id);
                              }
                            }}
                            className={`
                              flex items-center gap-2 w-full px-3 py-1.5 rounded-md text-[12px]
                              border-none text-left cursor-pointer transition-all duration-150
                              ${isSubSelected
                                ? 'text-indigo-400 font-semibold bg-indigo-950/30'
                                : 'text-slate-500 font-normal hover:text-indigo-300 hover:bg-slate-800/50'
                              }
                            `}
                          >
                            <sub.icon size={13} className="shrink-0" />
                            <span className="truncate">{sub.name}</span>
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