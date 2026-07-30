import React, { useState, useEffect, useMemo } from 'react';
import { API_BASE_URL } from '../config/api';
import { formatPKR } from '../data/store';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, ComposedChart
} from 'recharts';
import {
  TrendingUp, TrendingDown, ShoppingCart, Package, Users, Truck,
  DollarSign, AlertTriangle, BarChart3, Activity, Zap, Target,
  ArrowUpRight, ArrowDownRight, Building2, Clock, Star,
  ShieldCheck, Flame, RefreshCw, ChevronRight, BoxIcon,
  CreditCard, Wallet, Banknote, Eye, MoreHorizontal,
  Layers, Store, Calendar, Award, AlertCircle
} from 'lucide-react';

// ─── Utility ────────────────────────────────────────────────────────────────
const fmtK = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n?.toLocaleString() ?? '0';
};

const pct = (a, b) => (b ? (((a - b) / b) * 100).toFixed(1) : '0.0');

// ─── Mini Spark Line ─────────────────────────────────────────────────────────
const SparkLine = ({ data, color = '#6366f1', dataKey = 'value' }) => (
  <ResponsiveContainer width="100%" height={44}>
    <LineChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 4 }}>
      <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2}
        dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

// ─── KPI Metric Card ─────────────────────────────────────────────────────────
const MetricCard = ({ title, value, sub, icon: Icon, color, trend, sparkData, sparkKey, prefix = '' }) => {
  const colors = {
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/20', spark: '#6366f1' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', spark: '#10b981' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', spark: '#f59e0b' },
    rose: { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20', spark: '#ef4444' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/20', spark: '#06b6d4' },
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-500', border: 'border-violet-500/20', spark: '#8b5cf6' },
  };
  const c = colors[color] || colors.indigo;
  const isUp = trend >= 0;

  return (
    <div className={`bg-white dark:bg-slate-900 border ${c.border} rounded-2xl p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition-all duration-300 card-shadow dark:card-shadow-dark group relative overflow-hidden`}>
      {/* Glow accent */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 ${c.bg} rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-start justify-between relative z-10">
        <div className={`p-2.5 rounded-xl ${c.bg} ${c.text}`}>
          <Icon className="w-4.5 h-4.5" size={18} />
        </div>
        <span className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${isUp ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'}`}>
          {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(trend)}%
        </span>
      </div>

      <div className="relative z-10">
        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">{title}</p>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{prefix}{value}</h2>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>
      </div>

      {sparkData && (
        <div className="relative z-10 -mb-2">
          <SparkLine data={sparkData} color={c.spark} dataKey={sparkKey || 'value'} />
        </div>
      )}
    </div>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2.5">
      <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
        <Icon size={15} className="text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{title}</h3>
        {subtitle && <p className="text-[11px] text-slate-400 dark:text-slate-500">{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
);

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, prefix = 'Rs ' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl text-xs">
      <p className="text-slate-400 mb-2 font-bold">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="text-white font-bold">
            {typeof p.value === 'number' && p.value > 1000 ? `${prefix}${fmtK(p.value)}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Alert Row ────────────────────────────────────────────────────────────────
const AlertRow = ({ type, title, desc, time }) => {
  const cfg = {
    critical: { bg: 'bg-rose-50 dark:bg-rose-950/20', icon: 'bg-rose-500', border: 'border-rose-200 dark:border-rose-900/40', dot: 'bg-rose-500' },
    warning: { bg: 'bg-amber-50 dark:bg-amber-950/20', icon: 'bg-amber-500', border: 'border-amber-200 dark:border-amber-900/40', dot: 'bg-amber-400' },
    info: { bg: 'bg-blue-50 dark:bg-blue-950/20', icon: 'bg-blue-500', border: 'border-blue-200 dark:border-blue-900/40', dot: 'bg-blue-400' },
    success: { bg: 'bg-emerald-50 dark:bg-emerald-950/20', icon: 'bg-emerald-500', border: 'border-emerald-200 dark:border-emerald-900/40', dot: 'bg-emerald-500' },
  };
  const s = cfg[type] || cfg.info;
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl ${s.bg} border ${s.border} group hover:scale-[1.01] transition-transform`}>
      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${s.dot} animate-pulse`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{title}</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{desc}</p>
      </div>
      <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-medium">{time}</span>
    </div>
  );
};

// ─── Combined Historical + Forecast chart data ────────────────────────────────
const buildForecastData = (monthlyAnalytics = []) => {
  const hist = monthlyAnalytics.map(m => ({
    month: (m.month || '').slice(0, 3),
    actual: m.revenue,
    profit: m.profit,
    expenses: m.expenses,
  }));
  // Static AI forecast for next 4 months (can be replaced with ML later)
  const AI_FORECASTING = [
    { month: 'Jul 2026', forecast: 2750000, upperBound: 3000000, lowerBound: 2500000 },
    { month: 'Aug 2026', forecast: 2900000, upperBound: 3200000, lowerBound: 2600000 },
    { month: 'Sep 2026', forecast: 3200000, upperBound: 3550000, lowerBound: 2850000 },
    { month: 'Oct 2026', forecast: 3050000, upperBound: 3400000, lowerBound: 2700000 },
  ];
  const fore = AI_FORECASTING.slice(0, 4).map(f => ({
    month: f.month.slice(0, 3),
    forecast: f.forecast,
    upper: f.upperBound,
    lower: f.lowerBound,
  }));
  return [...hist, ...fore];
};

// ─── Dashboard Component ──────────────────────────────────────────────────────
export function Dashboard() {
  // 1. SAARE HOOKS (STATES) TOP PAR
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('revenue');

  // 2. FETCH DATA EFFECT
  useEffect(() => {
    let isMounted = true;

    const getDashboardData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/dashboard/summary`);
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        const data = await res.json();
        if (isMounted) {
          setDashboardData(data);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        if (isMounted) {
          setError(err.message || 'Connection failed');
          setLoading(false);
        }
      }
    };

    getDashboardData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(getDashboardData, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // 3. TIME INTERVAL EFFECT
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  
  // 4. USE-MEMO KO 'IF (LOADING)' SE UPAR RAKH DIYA (RULES OF HOOKS SAFE)
const kpis = useMemo(() => {
    if (!dashboardData) {
      return {
        curMonth: { revenue: 0, profit: 0, expenses: 0, transactions: 0 },
        prevMonth: { revenue: 0, profit: 0, expenses: 0, transactions: 0 },
        totalRevenue: 0, totalProfit: 0, totalExpenses: 0, totalTxns: 0,
        lowStock: 0, outStock: 0, activeSuppliers: 0, pendingPOs: 0,
        activeCustomers: 0, totalPayable: 0, totalReceivable: 0, grossMargin: '0'
      };
    }

    const { products, customers, suppliers, purchases, sales, monthlyAnalytics = [] } = dashboardData;

    const calculateTotal = (data, targetStatus) => {
      if (!Array.isArray(data)) return 0;
      return data.reduce((sum, item) => {
        if (item.status?.toLowerCase() === targetStatus.toLowerCase()) {
          const amount = item.remainingAmount || item.totalAmount || 0;
          return sum + Number(amount);
        }
        return sum;
      }, 0);
    };

    // Dynamic Analytics from real DB data
    const curMonth = monthlyAnalytics[monthlyAnalytics.length - 1] || { revenue: 0, profit: 0, expenses: 0, transactions: 0 };
    const prevMonth = monthlyAnalytics[monthlyAnalytics.length - 2] || { revenue: 0, profit: 0, expenses: 0, transactions: 0 };
    const totalRevenue = monthlyAnalytics.reduce((s, m) => s + m.revenue, 0);
    const totalProfit = monthlyAnalytics.reduce((s, m) => s + m.profit, 0);
    const totalExpenses = monthlyAnalytics.reduce((s, m) => s + m.expenses, 0);
    const totalTxns = monthlyAnalytics.reduce((s, m) => s + m.transactions, 0);

    // Operational KPIs
    const activeSuppliers = Array.isArray(suppliers) ? suppliers.filter(s => s.status === 'active').length : 0;
    const activeCustomers = Array.isArray(customers) ? customers.filter(c => c.status === 'active').length : 0;
    const pendingPOs = Array.isArray(purchases) ? purchases.filter(p => p.status?.toLowerCase() === 'pending').length : 0;
    const lowStock = Array.isArray(products) ? products.filter(p => p.stock > 0 && p.stock <= (p.minStock || 10)).length : 0;
    const outStock = Array.isArray(products) ? products.filter(p => p.stock === 0).length : 0;

    // Financial totals
    const totalPayable = calculateTotal(purchases, 'approved');
    const totalReceivable = calculateTotal(sales, 'approved');
    const grossMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';

    return {
      curMonth, prevMonth, totalRevenue, totalProfit, totalExpenses, totalTxns,
      totalPayable, totalReceivable, lowStock, outStock, activeSuppliers,
      pendingPOs, activeCustomers, grossMargin
    };
  }, [dashboardData]);
  // 5. AB SAARE HOOKS KHATAM HONE KE BAAD LOADING CHECK LAGAYEIN
  // if (loading) return <div className="p-20 text-center text-slate-500 font-bold">Loading Matrix ERP...</div>;
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse tracking-wide">
          Loading Dashboard Data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-4">
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl text-center max-w-md">
          <p className="text-rose-600 dark:text-rose-400 font-bold text-sm mb-1">⚠️ Dashboard Load Failed</p>
          <p className="text-rose-500 dark:text-rose-500 text-xs mb-3">{error}</p>
          <button
            onClick={() => { window.location.reload(); }}
            className="text-xs font-bold bg-rose-600 text-white px-4 py-1.5 rounded-lg hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return <div className="p-20 text-center text-rose-500">Data not found</div>;

  // Destructure dynamic data from API
  const { products, customers, suppliers } = dashboardData;
  const purchases = dashboardData.purchases || [];
  const monthlyAnalytics = dashboardData.monthlyAnalytics || [];
  const weeklySales = dashboardData.weeklySales || [];
  const categoryDistribution = dashboardData.categoryDistribution || [];
  const paymentMethodShare = dashboardData.paymentMethodShare || [];
  const stockLevels = dashboardData.stockLevels || [];
  const recentTransactions = dashboardData.recentTransactions || [];

  const forecastData = buildForecastData(monthlyAnalytics);

  // ── Revenue Tab Data (Dynamic) ───────────────────────────────────────────────
  const tabData = {
    revenue: monthlyAnalytics.map(m => ({ name: (m.month || '').slice(0, 3), value: m.revenue })),
    profit: monthlyAnalytics.map(m => ({ name: (m.month || '').slice(0, 3), value: m.profit })),
    expenses: monthlyAnalytics.map(m => ({ name: (m.month || '').slice(0, 3), value: m.expenses })),
    transactions: monthlyAnalytics.map(m => ({ name: (m.month || '').slice(0, 3), value: m.transactions })),
  };

  // ── Operational Alerts (Dynamic from real data) ──────────────────────────────
  const latestTxn = recentTransactions[0];
  const alerts = [
    ...(kpis.outStock > 0 ? [{
      type: 'critical', title: `${kpis.outStock} Products Out of Stock`,
      desc: 'Immediate replenishment required to prevent revenue loss.', time: 'Now'
    }] : []),
    ...(kpis.lowStock > 0 ? [{
      type: 'warning', title: `${kpis.lowStock} Products Below Minimum Level`,
      desc: 'Stock levels approaching critical threshold — raise purchase orders.', time: '5m'
    }] : []),
    ...(kpis.pendingPOs > 0 ? [{
      type: 'warning', title: `${kpis.pendingPOs} Purchase Orders Pending`,
      desc: 'Supplier orders awaiting dispatch confirmation and receipt.', time: '1h'
    }] : []),
    ...(latestTxn ? [{
      type: 'success', title: `Latest Sale: ${latestTxn.id}`,
      desc: `Rs ${(latestTxn.total || 0).toLocaleString()} · ${latestTxn.paymentType} · ${latestTxn.branch || 'HQ'}`, time: latestTxn.time || 'Today'
    }] : []),
    {
      type: 'info', title: 'Dashboard synced from live database',
      desc: `${monthlyAnalytics.length} months of data loaded · ${products.length} products tracked`, time: 'Just now'
    },
  ];

  // ── Category Distribution (Dynamic) ─────────────────────────────────────────
  const topCategories = categoryDistribution.slice(0, 6);
  const maxCatValue = topCategories.length > 0 ? Math.max(...topCategories.map(c => c.value)) : 1;

  // ── Payment Methods (Dynamic) ────────────────────────────────────────────────
  const totalPaymentValue = paymentMethodShare.reduce((s, p) => s + p.value, 0);

  // ── Branch Comparison (Static - single branch system) ────────────────────────
  const branchData = [
    { name: 'Karachi HQ', Sales: kpis.totalRevenue, Expenses: kpis.totalExpenses, Profit: kpis.totalProfit }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-6">

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
              LIVE — All Systems Operational
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              {currentTime.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Enterprise Command Center
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            MartPro Supermart · Karachi HQ · {currentTime.toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Quick stats ribbon */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label: 'Products', val: products.length, color: 'text-indigo-600 dark:text-indigo-400' },
            { label: 'Customers', val: kpis.activeCustomers, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Suppliers', val: kpis.activeSuppliers, color: 'text-amber-600 dark:text-amber-400' },
          ].map(item => (
            <div key={item.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-center card-shadow">
              <p className={`text-base font-black ${item.color}`}>{item.val}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Row 1: 6 KPI Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="YTD Revenue"
          value={`Rs ${fmtK(kpis.totalRevenue)}`}
          sub={`Jun: Rs ${fmtK(kpis.curMonth?.revenue)}`}
          icon={DollarSign}
          color="indigo"
          trend={+pct(kpis.curMonth?.revenue, kpis.prevMonth?.revenue)}
          sparkData={monthlyAnalytics}
          sparkKey="revenue"
        />
        <MetricCard
          title="Net Profit"
          value={`Rs ${fmtK(kpis.totalProfit)}`}
          sub={`Margin: ${kpis.grossMargin}%`}
          icon={TrendingUp}
          color="emerald"
          trend={+pct(kpis.curMonth?.profit, kpis.prevMonth?.profit)}
          sparkData={monthlyAnalytics}
          sparkKey="profit"
        />
        <MetricCard
          title="Total Expenses"
          value={`Rs ${fmtK(kpis.totalExpenses)}`}
          sub={`Jun: Rs ${fmtK(kpis.curMonth?.expenses)}`}
          icon={Wallet}
          color="rose"
          trend={-pct(kpis.curMonth?.expenses, kpis.prevMonth?.expenses)}
          sparkData={monthlyAnalytics}
          sparkKey="expenses"
        />
        <MetricCard
          title="Transactions"
          value={kpis.totalTxns.toLocaleString()}
          sub={`Avg: Rs ${fmtK(kpis.totalRevenue / kpis.totalTxns)} / txn`}
          icon={ShoppingCart}
          color="cyan"
          trend={+pct(kpis.curMonth?.transactions, kpis.prevMonth?.transactions)}
          sparkData={monthlyAnalytics}
          sparkKey="transactions"
        />
        <MetricCard
          title="Receivables"
          value={`${formatPKR(kpis.totalReceivable)}`}
          sub={`${customers.filter(c => c.balance > 0).length} active debtors`}
          icon={CreditCard}
          color="amber"
          trend={-2.4}
        />
        <MetricCard
          title="Payables"
          value={`${formatPKR(kpis.totalPayable)}`}
          sub={kpis.pendingPOs > 0 ? `${kpis.pendingPOs} pending orders` : 'No pending orders'}
          icon={Truck}
          color="violet"
          trend={-5.1}
        />
      </div>

      {/* ── Row 2: Main Revenue Chart (2/3) + Alerts (1/3) ──────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Revenue & Profit + Forecast Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 card-shadow dark:card-shadow-dark">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Revenue, Profit & AI Forecast</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Jan 2026 – Dec 2026 (Q3–Q4 are AI projections)</p>
            </div>
            <div className="flex gap-1.5">
              {['revenue', 'profit', 'expenses', 'transactions'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors capitalize ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={270}>
            <ComposedChart data={forecastData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.08)" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${fmtK(v)}`} width={44} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x="Jun" stroke="#6366f1" strokeDasharray="4 2" strokeWidth={1} label={{ value: 'TODAY', position: 'top', fontSize: 9, fill: '#6366f1', fontWeight: 700 }} />
              <Area type="monotone" dataKey="actual" stroke="#6366f1" fill="url(#gradRevenue)" strokeWidth={2.5} name="Revenue" dot={false} activeDot={{ r: 4, fill: '#6366f1' }} />
              <Area type="monotone" dataKey="profit" stroke="#10b981" fill="url(#gradProfit)" strokeWidth={2} name="Profit" dot={false} />
              <Area type="monotone" dataKey="forecast" stroke="#8b5cf6" fill="url(#gradForecast)" strokeWidth={2} strokeDasharray="5 3" name="AI Forecast" dot={false} />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '12px' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Operational Alerts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 card-shadow dark:card-shadow-dark flex flex-col">
          <SectionHeader
            icon={AlertCircle}
            title="Operational Alerts"
            subtitle={`${alerts.filter(a => a.type === 'critical' || a.type === 'warning').length} action required`}
            action={
              <button className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View All</button>
            }
          />
          <div className="space-y-2 flex-1 overflow-y-auto">
            {alerts.map((alert, i) => (
              <AlertRow key={i} {...alert} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 3: Inventory Health + Category Distribution ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">

      {/* Dynamic Inventory Health Logic */}

        {/* Weekly Sales Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 card-shadow dark:card-shadow-dark">
          <SectionHeader icon={BarChart3} title="Weekly Sales Volume" subtitle="Current week performance by day" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklySales} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.08)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} stroke="#94a3b8" tickFormatter={v => fmtK(v)} width={36} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" name="Sales" radius={[6, 6, 0, 0]} maxBarSize={32}>
                {weeklySales.map((entry, index) => (
                  <Cell key={index} fill={entry.day === 'Sat' ? '#6366f1' : entry.day === 'Fri' ? '#818cf8' : '#e0e7ff'} className="dark:[fill:#1e3a5f]" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Revenue Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 card-shadow dark:card-shadow-dark">
          <SectionHeader icon={Layers} title="Category Revenue Mix" subtitle="Top performing product categories" />
          <div className="space-y-2.5">
            {topCategories.map((cat, i) => (
              <div key={cat.name} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate max-w-[150px]">{cat.name}</span>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{formatPKR(cat.value)}</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(cat.value / maxCatValue) * 100}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 card-shadow dark:card-shadow-dark">
          <SectionHeader icon={CreditCard} title="Payment Breakdown" subtitle="Revenue by payment method" />
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={paymentMethodShare}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={54}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {paymentMethodShare.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {paymentMethodShare.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: p.color }} />
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{p.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {((p.value / totalPaymentValue) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Total */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Total Collected</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100">{formatPKR(totalPaymentValue)}</span>
          </div>
        </div>
      </div>

      {/* ── Row 4: Branch Performance + Inventory Health + Top Products ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Branch Comparison Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 card-shadow dark:card-shadow-dark">
          <SectionHeader
            icon={Building2}
            title="Branch Performance"
            subtitle="Comparative sales, expenses & profit by location"
          />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={branchData} margin={{ top: 5, right: 0, left: -10, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.08)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} stroke="#94a3b8" tickFormatter={v => fmtK(v)} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
              <Bar dataKey="Sales" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Profit" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>

          {/* Branch Summary Card (dynamic from real data) */}
          <div className="grid grid-cols-1 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Store size={12} className="text-indigo-500" />
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Karachi HQ</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                <div>
                  <p className="text-slate-400 dark:text-slate-500">Revenue</p>
                  <p className="font-bold text-slate-700 dark:text-slate-300">Rs {fmtK(kpis.totalRevenue)}</p>
                </div>
                <div>
                  <p className="text-slate-400 dark:text-slate-500">Expenses</p>
                  <p className="font-bold text-slate-700 dark:text-slate-300">Rs {fmtK(kpis.totalExpenses)}</p>
                </div>
                <div>
                  <p className="text-slate-400 dark:text-slate-500">Profit</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">Rs {fmtK(kpis.totalProfit)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Health Grid */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 card-shadow dark:card-shadow-dark">
          <SectionHeader
            icon={Package}
            title="Inventory Health"
            subtitle={`${products.length} total products tracked`}
            action={
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${kpis.outStock > 0 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'}`}>
                {kpis.outStock > 0 ? `${kpis.outStock} CRITICAL` : 'HEALTHY'}
              </span>
            }
          />

          {/* Stock Level Donut */}
          <div className="flex items-center gap-6 mb-4">
            <ResponsiveContainer width={100} height={100}>
              <PieChart>
                <Pie data={stockLevels} cx="50%" cy="50%" innerRadius={30} outerRadius={48} paddingAngle={3} dataKey="value">
                  {stockLevels.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2.5">
              {[
                { label: 'In Stock', val: products.filter(p => p.stock > (p.minStock || 10)).length, color: 'bg-emerald-500', textColor: 'text-emerald-700 dark:text-emerald-400' },
                { label: 'Low Stock', val: kpis.lowStock, color: 'bg-amber-400', textColor: 'text-amber-700 dark:text-amber-400' },
                { label: 'Out of Stock', val: kpis.outStock, color: 'bg-rose-500', textColor: 'text-rose-700 dark:text-rose-400' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{s.label}</span>
                  </div>
                  <span className={`text-[11px] font-black ${s.textColor}`}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Products Table */}
          {kpis.lowStock > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Critical Stock Items</p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {products
                  .filter(p => p.stock <= (p.minStock || 10))
                  .slice(0, 6)
                  .map(p => {
                    // FIX: Check if name/category are objects
                    const nameDisplay = typeof p.name === 'object' ? (p.name?.name || "Unknown") : (p.name || "Unknown");
                    const catDisplay = typeof p.category === 'object' ? (p.category?.name || "N/A") : (p.category || "N/A");

                    return (
                      <div key={p.id || p.id} className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{p.image || '📦'}</span>
                          <div>
                            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">{nameDisplay}</p>
                            <p className="text-[10px] text-slate-400">{catDisplay}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-[11px] font-black ${p.stock === 0 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                            {p.stock} {p.unit}
                          </p>
                          <p className="text-[10px] text-slate-400">min: {p.minStock || 10}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Inventory Value KPI */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3">
            <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-xl p-3">
              <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Stock Value</p>
              <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                {formatPKR(products.reduce((s, p) => s + (p.costPrice * p.stock), 0))}
              </p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-3">
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Retail Value</p>
              <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                {formatPKR(products.reduce((s, p) => s + (p.salePrice * p.stock), 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 5: Financial Summary Scorecards ──────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            title: 'Gross Margin',
            value: `${kpis.grossMargin}%`,
            sub: 'Annual profit rate',
            icon: Target,
            color: 'from-indigo-600 to-indigo-700',
            textColor: 'text-indigo-100',
          },
          {
            title: 'Sales Velocity',
            value: `${fmtK(kpis.curMonth?.transactions)} txn/mo`,
            sub: 'Avg monthly transactions',
            icon: Zap,
            color: 'from-amber-500 to-orange-600',
            textColor: 'text-amber-100',
          },
          {
            title: 'Customer LTV',
            value: formatPKR(customers.length > 0 ? Math.round(customers.reduce((s, c) => s + (c.totalSpent || 0), 0) / customers.length) : 0),
            sub: 'Avg lifetime value',
            icon: Users,
            color: 'from-emerald-500 to-teal-600',
            textColor: 'text-emerald-100',
          },
          {
            title: 'Supplier Score',
            value: `${suppliers.length > 0 ? (suppliers.reduce((s, sup) => s + (sup.rating || 5), 0) / suppliers.length).toFixed(1) : '5.0'}/5.0`,
            sub: 'Avg vendor rating',
            icon: Star,
            color: 'from-violet-600 to-purple-700',
            textColor: 'text-violet-100',
          },
        ].map((card, i) => (
          <div key={i} className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white relative overflow-hidden group hover:-translate-y-0.5 transition-all duration-300 shadow-lg`}>
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:bg-white/15 transition-colors" />
            <div className="absolute -bottom-6 -left-2 w-16 h-16 bg-white/5 rounded-full blur-lg" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <card.icon size={18} className="opacity-80" />
                <ShieldCheck size={12} className="opacity-50" />
              </div>
              <h3 className={`text-xl font-black tracking-tight mb-1`}>{card.value}</h3>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">{card.title}</p>
              <p className={`text-[10px] ${card.textColor} opacity-70 mt-0.5`}>{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 6: Recent Purchases + Top Customers ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Purchase Orders */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 card-shadow dark:card-shadow-dark">
          <SectionHeader
            icon={Truck}
            title="Recent Purchase Orders"
            subtitle={`${kpis.pendingPOs} pending, ${purchases.filter(p => p.status === 'Received').length} received`}
            action={<span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">View All →</span>}
          />
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {purchases.slice(0, 6).map(po => {
              const statusCfg = {
                'Received': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
                'Pending': 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
                'Partial': 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
                'Cancelled': 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500',
              };
              return (
                <div key={po._id || po.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <BoxIcon size={13} className="text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{po.id}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{po.supplier} · {po.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{formatPKR(po.total)}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusCfg[po.status] || statusCfg['Pending']}`}>
                      {po.status}
                    </span>
                  </div>
                </div>
              );
            })}
            {purchases.length === 0 && (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">No purchase orders found</div>
            )}
          </div>
        </div>

        {/* Top Customers by Spend */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 card-shadow dark:card-shadow-dark">
          <SectionHeader
            icon={Users}
            title="Top Customers by Revenue"
            subtitle={`${kpis.activeCustomers} active · ${customers.filter(c => c.isKhata).length} khata accounts`}
          />
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {[...customers]
              .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
              .slice(0, 6)
              .map((c, i) => (
                <div key={c._id || c.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center text-sm font-black text-indigo-700 dark:text-indigo-400">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{c.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{c.totalTransactions || 0} orders · {c.isKhata ? '🏷️ Khata' : '💰 Paid'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{formatPKR(c.totalSpent || 0)}</p>
                    {c.balance > 0 && (
                      <p className="text-[10px] font-medium text-rose-500 dark:text-rose-400">Due: {formatPKR(c.balance)}</p>
                    )}
                  </div>
                </div>
              ))}
            {customers.length === 0 && (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">No customer data found</div>
            )}
          </div>
        </div>
      </div>

      {/* ── Row 7: Supplier Ledger + Activity Feed ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Active Suppliers */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 card-shadow dark:card-shadow-dark">
          <SectionHeader
            icon={Truck}
            title="Supplier Ledger Status"
            subtitle={`Total payable: ${formatPKR(kpis.totalPayable)}`}
          />
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {suppliers.slice(0, 6).map(s => (
              <div key={s._id || s.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                    <Truck size={13} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{s.name}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{s.city || s.contact} · {s.totalOrders || 0} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[11px] font-bold ${s.balance > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {s.balance > 0 ? `Due: ${formatPKR(s.balance)}` : '✓ Settled'}
                  </p>
                  <div className="flex items-center justify-end gap-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={8} className={star <= (s.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-700'} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {suppliers.length === 0 && (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">No suppliers found</div>
            )}
          </div>
        </div>

        {/* System Activity Feed - DYNAMIC from real transactions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 card-shadow dark:card-shadow-dark">
          <SectionHeader icon={Activity} title="Live Activity Feed" subtitle={`${recentTransactions.length} recent transactions`} />
          <div className="space-y-3 max-h-56 overflow-y-auto">
            {recentTransactions.length > 0 ? recentTransactions.map((txn, i) => (
              <div key={txn.id || i} className="flex items-start gap-3 group hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-xl px-2 py-1.5 -mx-2 transition-colors">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 shrink-0 mt-0.5">
                  <ShoppingCart size={12} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">POS Sale — {txn.id}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                    Rs {(txn.total || 0).toLocaleString()} · {txn.paymentType} · {txn.customer || 'Walk-In'} · {txn.branch || 'HQ'}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-medium">{txn.time || txn.date}</span>
              </div>
            )) : (
              <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">No recent transactions</div>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between py-2 px-1 border-t border-slate-200 dark:border-slate-800">
        <p className="text-[10px] text-slate-400 dark:text-slate-600 font-medium">
          MartPro ERP v2.0 · Data refreshes every 60 seconds · Last sync: {currentTime.toLocaleTimeString('en-PK')}
        </p>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-500 font-bold">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          All services nominal
        </div>
      </div>
    </div>
  );
}

export default Dashboard;