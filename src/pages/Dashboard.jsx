import React from 'react';
import { useApp } from '../context/AppContext';
import { KPICard } from '../components/ui/KPICard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ChartTooltip } from '../components/charts/ChartTooltip';
import { formatPKR, formatNumber } from '../data/store';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Banknote,
  TrendingUp,
  Receipt,
  Package,
  AlertTriangle,
  ArrowRight,
  Calculator,
  PlusCircle,
  Activity,
  Wallet,
  Landmark
} from 'lucide-react';
import {
  MONTHLY_ANALYTICS,
  WEEKLY_SALES,
  HOURLY_SALES,
  CATEGORY_DISTRIBUTION,
  PAYMENT_METHOD_SHARE,
  BRANCH_ANALYTICS
} from '../data/analytics';

export function Dashboard() {
  const {
    products,
    transactions,
    expenses,
    financeAccounts, // Destructured vault accounts from App Context
    setActiveModule,
    currentUser,
    addToast
  } = useApp();

  // Dynamic KPI calculations
  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalExpenses = expenses.reduce((sum, e) => e.status === 'Paid' ? sum + e.amount : sum, 0);

  // Compute total inventory asset value
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.costPrice * p.stock), 0);

  // Estimated gross profit (transactions total sale - transactions total cost)
  const totalCOGS = transactions.reduce((sum, t) => {
    const txnCOGS = t.items?.reduce((s, item) => s + ((item.cost || item.price * 0.75) * item.quantity), 0) || 0;
    return sum + txnCOGS;
  }, 0);
  const estimatedGrossProfit = totalRevenue - totalCOGS;
  const netProfit = estimatedGrossProfit - totalExpenses;

  // Alerts
  const lowStockProducts = products.filter(p => p.stock <= p.minStock && p.status === 'active');
  const recentTxns = transactions.slice(0, 5);

  // Pie colors
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#38bdf8', '#fb923c', '#a3a3a3'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome & Context Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            Supermart Operations Center
          </h1>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
            Real-time branch tracking and transaction records for Karachi HQ & Lahore Branch
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={Calculator}
            onClick={() => setActiveModule('POS Sales')}
          >
            Launch POS Counter
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={PlusCircle}
            onClick={() => setActiveModule(`Products`)}
          >
            New Product
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Gross Revenue"
          value={formatPKR(totalRevenue)}
          icon={Banknote}
          trend={{ value: '+14.2%', type: 'up' }}
          color="indigo"
        />
        <KPICard
          title="Estimated Net Profit"
          value={formatPKR(netProfit)}
          icon={TrendingUp}
          trend={{ value: '+8.4%', type: 'up' }}
          color="emerald"
        />
        <KPICard
          title="Total Expenses"
          value={formatPKR(totalExpenses)}
          icon={Receipt}
          trend={{ value: '+2.1%', type: 'down' }}
          color="rose"
        />
        <KPICard
          title="Warehouse Stock Asset"
          value={formatPKR(totalInventoryValue)}
          icon={Package}
          trend={{ value: '-3.8%', type: 'down' }}
          color="amber"
        />
      </div>

      {/* ======================================================== */}
      {/* CASH & BANK VAULTS DASHBOARD LAYER                        */}
      {/* ======================================================== */}
      {financeAccounts && financeAccounts.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-1.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-indigo-500" /> Cash Vaults & Financial Liquidity
            </h3>
            <button 
              onClick={() => setActiveModule('Finance')}
              className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Open Ledger Account
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {financeAccounts.map((acc) => (
              <Card key={acc.id} hoverEffect className="border border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900 shadow-sm">
                <CardContent className="p-4 flex justify-between items-center gap-3">
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block truncate">
                      {acc.name}
                    </span>
                    <h4 className="text-base font-black text-slate-800 dark:text-white tracking-tight font-mono">
                      {formatPKR(acc.balance)}
                    </h4>
                    <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate">
                      {acc.bank} | {acc.accountNo !== 'N/A' ? acc.accountNo : 'Physical Cash Chest'}
                    </p>
                  </div>
                  
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 shrink-0">
                    {acc.subType === 'Bank' || acc.type?.toLowerCase().includes('bank') ? (
                      <Landmark className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Primary Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Revenue & Profit Trend (Area) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Sales Revenue vs Net Profit</CardTitle>
              <p className="text-[10px] text-slate-400">Monthly gross sales and profit projections</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
              Jan - Jun 2026
            </span>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_ANALYTICS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area name="Sales Revenue" type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area name="Net Profit" type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProf)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 2: Category distribution (Pie) */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Category Share</CardTitle>
          </CardHeader>
          <CardContent className="h-72 flex flex-col justify-center items-center">
            <div className="w-full h-[80%]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DISTRIBUTION.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {CATEGORY_DISTRIBUTION.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full mt-2 text-[10px] font-semibold text-slate-500">
              {CATEGORY_DISTRIBUTION.slice(0, 4).map((entry, idx) => (
                <div key={idx} className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: entry.color || COLORS[idx] }} />
                  <span className="truncate">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Analytics Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Chart 3: Weekly POS Sales (Bar) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>POS Weekly Traffic (Sales)</CardTitle>
          </CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_SALES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar name="Sales Total" dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 4: Hourly Sales Curve (Line) */}
        <Card>
          <CardHeader>
            <CardTitle>Hourly Sales Load</CardTitle>
          </CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HOURLY_SALES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={8} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={8} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line name="Hourly Sales" type="monotone" dataKey="sales" stroke="#06b6d4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 5: Branch Sales comparison (Pie) */}
        <Card>
          <CardHeader>
            <CardTitle>Branch Share comparison</CardTitle>
          </CardHeader>
          <CardContent className="h-60 flex flex-col justify-center items-center">
            <div className="w-full h-[80%]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={BRANCH_ANALYTICS}
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="sales"
                    nameKey="name"
                  >
                    <Cell fill="#6366f1" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-[10px] font-semibold text-slate-500 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block bg-indigo-500" />
                <span>Karachi HQ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block bg-amber-500" />
                <span>Lahore Branch</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Row: Low Stock Alerts & Recent Transactions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Low Stock Alerts */}
        <Card className="xl:col-span-1 border-rose-100 dark:border-rose-950/20">
          <CardHeader className="bg-rose-50/20 dark:bg-rose-950/5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <CardTitle className="text-rose-700 dark:text-rose-400">Critical Stock Warnings</CardTitle>
            </div>
            {lowStockProducts.length > 0 && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-rose-500 text-white">
                {lowStockProducts.length}
              </span>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
              {lowStockProducts.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">
                  No stock items below threshold level.
                </div>
              ) : (
                lowStockProducts.slice(0, 6).map((item) => (
                  <div key={item.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/20">
                    <div className="flex items-center gap-3">
                      <span className="text-base leading-none">{item.image}</span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          Min Stock threshold: {item.minStock} {item.unit}s
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-black ${item.stock === 0 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {item.stock} left
                      </span>
                      <button
                        onClick={() => {
                          setActiveModule('Inventory');
                        }}
                        className="block text-[9px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer mt-0.5"
                      >
                        Adjust Stock
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-indigo-550" />
              <CardTitle>Recent POS Transactions</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs p-1 h-auto"
              icon={ArrowRight}
              onClick={() => setActiveModule('Reports')}
            >
              All Sales
            </Button>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Invoice ID</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Pay Method</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {recentTxns.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 text-slate-700 dark:text-slate-200">
                    <td className="p-3.5 font-bold">{t.id}</td>
                    <td className="p-3.5 truncate max-w-[120px]">{t.customerName}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        t.paymentMethod === 'Cash'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : t.paymentMethod === 'Udhaar'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400'
                            : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400'
                      }`}>
                        {t.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400">{t.branch}</td>
                    <td className="p-3.5 font-black text-right">{formatPKR(t.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;