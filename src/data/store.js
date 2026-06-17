// Store & Configuration
export const STORE_INFO = {
  name: "MartPro",
  tagline: "Smart Retail, Simplified",
  fullName: "MartPro Supermart",
  address: "Plot 12, Block-C, Main Boulevard, Gulshan-e-Iqbal, Karachi",
  phone: "021-34567890",
  email: "admin@martpro.pk",
  ntn: "NTN-9876543-2",
  owner: "Muhammad Bashir",
  currency: "PKR",
  currencySymbol: "Rs",
  branches: [
    { id: 'BR001', name: 'Main Branch — Gulshan', address: 'Block-C, Gulshan-e-Iqbal', isActive: true },
    { id: 'BR002', name: 'North Nazimabad', address: 'Block-D, North Nazimabad', isActive: true },
    { id: 'BR003', name: 'Clifton Branch', address: 'Block-5, Clifton', isActive: false },
  ],
};

export const formatPKR = (amount) => {
  if (amount == null) return 'Rs 0';
  return `Rs ${Number(amount).toLocaleString('en-PK')}`;
};

export const formatNumber = (num) => {
  if (num == null) return '0';
  return Number(num).toLocaleString('en-PK');
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
};
