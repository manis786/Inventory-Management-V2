// 100+ Sales Transactions
import PRODUCTS from './products';

const CUSTOMER_NAMES = [
  'Haji Amjad Ali','Kamran Sheikh','Shagufta Begum','Raheem Ahmed','Walk-In Customer',
  'Syed Asad Hussain','Fatima Bibi','Mohammad Saleem','Rubina Parveen','Tariq Mehmood',
  'Nazia Khan','Abdul Rasheed','Saima Akram','Waseem Baig','Bushra Siddiqui',
  'Imran Qasim','Zainab Faisal','Ghulam Mustafa','Asif Javed','Nasreen Akhtar',
];

const PAYMENT_TYPES = ['Cash','Cash','Cash','Cash','Card','UPI/JazzCash','Udhaar'];
const CASHIERS = ['Admin','Bilal (Cashier)','Saad (Cashier)','Admin'];

function generateTransactions() {
  const txns = [];
  const today = new Date('2026-06-13');

  for (let i = 0; i < 120; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);

    const numItems = Math.floor(Math.random() * 5) + 1;
    const items = [];
    const usedIds = new Set();

    for (let j = 0; j < numItems; j++) {
      let pIdx;
      do { pIdx = Math.floor(Math.random() * Math.min(160, PRODUCTS.length)); } while (usedIds.has(pIdx));
      usedIds.add(pIdx);
      const p = PRODUCTS[pIdx];
      const qty = Math.floor(Math.random() * 4) + 1;
      items.push({ productId: p.id, name: p.name, qty, price: p.salePrice, costPrice: p.costPrice });
    }

    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const discount = Math.random() > 0.7 ? Math.round(subtotal * (Math.random() * 0.08)) : 0;
    const tax = Math.random() > 0.85 ? Math.round(subtotal * 0.05) : 0;
    const total = subtotal - discount + tax;
    const paymentType = PAYMENT_TYPES[Math.floor(Math.random() * PAYMENT_TYPES.length)];
    const custIdx = Math.floor(Math.random() * CUSTOMER_NAMES.length);
    const customer = CUSTOMER_NAMES[custIdx];
    const customerId = `C${String(custIdx + 1).padStart(3, '0')}`;

    txns.push({
      id: `TXN-${String(i + 1).padStart(3, '0')}`,
      date: date.toISOString().split('T')[0],
      time: `${String(8 + Math.floor(Math.random() * 12)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      customer,
      customerId,
      items,
      subtotal,
      discount,
      tax,
      total,
      paymentType,
      status: paymentType === 'Udhaar' ? 'Unpaid' : 'Paid',
      cashier: CASHIERS[Math.floor(Math.random() * CASHIERS.length)],
      branch: 'BR001',
    });
  }

  return txns.sort((a, b) => b.date.localeCompare(a.date));
}

export const TRANSACTIONS = generateTransactions();

export const getTodaySales = () => {
  const today = '2026-06-13';
  return TRANSACTIONS.filter(t => t.date === today);
};

export const getDailySalesTotal = (date) => {
  return TRANSACTIONS.filter(t => t.date === date).reduce((s, t) => s + t.total, 0);
};

export const getRecentTransactions = (count = 10) => TRANSACTIONS.slice(0, count);
