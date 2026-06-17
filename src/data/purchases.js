// 50+ Purchase Orders
import { SUPPLIERS } from './suppliers';

const PO_STATUSES = ['Received','Received','Received','Pending','Partial','Cancelled'];

function generatePurchaseOrders() {
  const orders = [];
  const today = new Date('2026-06-13');

  const productSamples = [
    ["Olper's Milk 1L x50","Nurpur Butter x30","Everyday Milk x20"],
    ["Tapal Danedar 450g x40","Vital Tea 430g x25","Lipton Yellow Label x30"],
    ["Surf Excel 1kg x20","Lux Soap x100","Sunsilk Shampoo x30","Dove Shampoo x15"],
    ["Pepsi 1.5L x60","Coca-Cola 1.5L x50","Sting Energy x80","Mountain Dew x40"],
    ["Dalda Oil 5L x15","Sufi Oil 3L x10","Habib Oil 5L x12"],
    ["Guard Rice 5kg x18","Sunridge Atta 10kg x25","Maida 1kg x30"],
    ["Oreo 120g x40","Cadbury 40g x50","KitKat x80","Snickers x30"],
    ["Kolson Slanty x60","Lays Classic x80","Kurkure x50","Cheetos x40"],
    ["P&G Baby Diapers x15","Johnson Baby Powder x20","Cerelac x12"],
    ["Shan Biryani x50","National Ketchup x30","Mehran Chili Powder x40"],
  ];

  for (let i = 0; i < 55; i++) {
    const daysAgo = Math.floor(Math.random() * 120);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);

    const sup = SUPPLIERS[i % SUPPLIERS.length];
    const items = productSamples[i % productSamples.length];
    const subtotal = Math.floor(Math.random() * 80000) + 15000;
    const status = PO_STATUSES[Math.floor(Math.random() * PO_STATUSES.length)];

    orders.push({
      id: `PO-${String(i + 1).padStart(3, '0')}`,
      date: date.toISOString().split('T')[0],
      supplier: sup.name,
      supplierId: sup.id,
      items: items.map(name => ({ name, amount: Math.floor(subtotal / items.length) })),
      subtotal,
      tax: Math.round(subtotal * 0.05),
      total: Math.round(subtotal * 1.05),
      status,
      receivedDate: status === 'Received' ? new Date(date.getTime() + 3 * 86400000).toISOString().split('T')[0] : null,
      paymentStatus: status === 'Received' ? (Math.random() > 0.3 ? 'Paid' : 'Pending') : 'Pending',
      notes: '',
      branch: 'BR001',
    });
  }

  return orders.sort((a, b) => b.date.localeCompare(a.date));
}

export const PURCHASE_ORDERS = generatePurchaseOrders();

export const getPendingPurchases = () => PURCHASE_ORDERS.filter(p => p.status === 'Pending');
export const getRecentPurchases = (count = 10) => PURCHASE_ORDERS.slice(0, count);
