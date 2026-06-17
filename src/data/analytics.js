// Monthly Sales, Category Distributions, Forecasts, and Branch Metrics
export const MONTHLY_ANALYTICS = [
  { month: 'Jan 2026', revenue: 2100000, profit: 420000, expenses: 1100000, transactions: 1240 },
  { month: 'Feb 2026', revenue: 2300000, profit: 480000, expenses: 1150000, transactions: 1380 },
  { month: 'Mar 2026', revenue: 3100000, profit: 680000, expenses: 1400000, transactions: 1890 }, // Ramadan increase
  { month: 'Apr 2026', revenue: 3800000, profit: 890000, expenses: 1650000, transactions: 2400 }, // Eid shopping peak
  { month: 'May 2026', revenue: 2600000, profit: 540000, expenses: 1200000, transactions: 1600 },
  { month: 'Jun 2026', revenue: 2900000, profit: 590000, expenses: 1300000, transactions: 1750 }, // June projected
];

export const WEEKLY_SALES = [
  { day: 'Mon', sales: 85000, count: 52 },
  { day: 'Tue', sales: 92000, count: 58 },
  { day: 'Wed', sales: 110000, count: 66 },
  { day: 'Thu', sales: 95000, count: 60 },
  { day: 'Fri', sales: 155000, count: 98 }, // Weekend start
  { day: 'Sat', sales: 220000, count: 142 }, // Peak day
  { day: 'Sun', sales: 185000, count: 115 }
];

export const HOURLY_SALES = [
  { hour: '09:00', sales: 15000 },
  { hour: '10:00', sales: 28000 },
  { hour: '11:00', sales: 42000 },
  { hour: '12:00', sales: 55000 },
  { hour: '13:00', sales: 38000 }, // Lunch dip
  { hour: '14:00', sales: 48000 },
  { hour: '15:00', sales: 60000 },
  { hour: '16:00', sales: 85000 },
  { hour: '17:00', sales: 110000 }, // Evening rush
  { hour: '18:00', sales: 135000 },
  { hour: '19:00', sales: 160000 }, // Peak hour
  { hour: '20:00', sales: 145000 },
  { hour: '21:00', sales: 98000 },
  { hour: '22:00', sales: 65000 },
  { hour: '23:00', sales: 30000 },
];

export const CATEGORY_DISTRIBUTION = [
  { name: 'Dairy & Eggs', value: 380000, color: '#3b82f6' },
  { name: 'Beverages', value: 290000, color: '#06b6d4' },
  { name: 'Snacks & Chips', value: 240000, color: '#f59e0b' },
  { name: 'Cooking Oil & Ghee', value: 410000, color: '#eab308' },
  { name: 'Rice & Flour', value: 320000, color: '#a3a3a3' },
  { name: 'Personal Care', value: 150000, color: '#ec4899' },
  { name: 'Household & Cleaning', value: 130000, color: '#8b5cf6' },
  { name: 'Biscuits & Bakery', value: 110000, color: '#d97706' },
  { name: 'Frozen & Refrigerated', value: 95000, color: '#38bdf8' },
  { name: 'Others', value: 85000, color: '#6b7280' }
];

export const PAYMENT_METHOD_SHARE = [
  { name: 'Cash', value: 1245000, color: '#10b981' },
  { name: 'Credit Card', value: 380000, color: '#3b82f6' },
  { name: 'Bank Transfer / EasyPaisa', value: 145000, color: '#f59e0b' },
  { name: 'Store Credit (Udhaar)', value: 95000, color: '#ef4444' }
];

export const BRANCH_ANALYTICS = [
  { name: 'Karachi HQ', sales: 1845000, expenses: 840000, profit: 461250, employees: 12, transactions: 1140 },
  { name: 'Lahore Branch', sales: 985000, expenses: 388500, profit: 246250, employees: 6, transactions: 610 }
];

export const STOCK_LEVELS = [
  { name: 'In Stock', value: 412, color: '#10b981' },
  { name: 'Low Stock', value: 68, color: '#f59e0b' },
  { name: 'Out of Stock', value: 20, color: '#ef4444' }
];

export const AI_FORECASTING = [
  { month: 'Jul 2026', historical: null, forecast: 2750000, lowerBound: 2500000, upperBound: 3000000 },
  { month: 'Aug 2026', historical: null, forecast: 2900000, lowerBound: 2600000, upperBound: 3200000 },
  { month: 'Sep 2026', historical: null, forecast: 3200000, lowerBound: 2850000, upperBound: 3550000 }, // Eid-ul-Adha season adjustment
  { month: 'Oct 2026', historical: null, forecast: 3050000, lowerBound: 2700000, upperBound: 3400000 },
  { month: 'Nov 2026', historical: null, forecast: 3300000, lowerBound: 2900000, upperBound: 3700000 }, // Winter shift
  { month: 'Dec 2026', historical: null, forecast: 3600000, lowerBound: 3100000, upperBound: 4100000 }  // Year-end holiday peak
];

export const getSalesSummary = () => {
  const totalSales = BRANCH_ANALYTICS.reduce((sum, b) => sum + b.sales, 0);
  const totalExpenses = BRANCH_ANALYTICS.reduce((sum, b) => sum + b.expenses, 0);
  const totalProfit = totalSales * 0.22 - totalExpenses; // estimate 22% gross margin minus operational expense
  return {
    totalSales,
    totalExpenses,
    totalProfit,
    avgTransaction: totalSales / (BRANCH_ANALYTICS.reduce((sum, b) => sum + b.transactions, 0))
  };
};
