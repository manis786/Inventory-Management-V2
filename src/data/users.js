// Users, Roles, Permissions, and User Activity Logs
export const ROLES = {
  ADMIN: {
    name: 'Administrator',
    description: 'Full system access to all modules and configurations.',
    modules: ['*'] // all modules
  },
  MANAGER: {
    name: 'Branch Manager',
    description: 'Manages inventory, purchases, expenses, sales, and reports for their branch.',
    modules: ['Dashboard', 'POS Sales', 'Products', 'Categories', 'Inventory', 'Purchases', 'Suppliers', 'Customers', 'Expenses', 'Reports', 'Settings']
  },
  CASHIER: {
    name: 'Cashier',
    description: 'Access to POS Billing counter and customer registers.',
    modules: ['Dashboard', 'POS Sales', 'Customers', 'Products']
  },
  AUDITOR: {
    name: 'Financial Auditor',
    description: 'Read-only access to finance, reports, and ledger operations.',
    modules: ['Dashboard', 'Finance', 'Expenses', 'Reports', 'Suppliers', 'Customers']
  }
};

export const USERS = [
  { id: 'USR001', name: 'Muhammad Anis', email: 'manees@martpro.pk', username: 'manees.admin', role: 'ADMIN', status: 'active', branch: 'Karachi HQ', phone: '0333-1234567', lastLogin: '2026-06-13 08:30', avatar: '👩‍💼' },
  { id: 'USR002', name: 'Mohammad Ali', email: 'ali@martpro.pk', username: 'ali.manager', role: 'MANAGER', status: 'active', branch: 'Karachi HQ', phone: '0321-7654321', lastLogin: '2026-06-13 09:00', avatar: '👨‍💼' },
  { id: 'USR003', name: 'Hamza Mughal', email: 'hamza@martpro.pk', username: 'hamza.lahore', role: 'MANAGER', status: 'active', branch: 'Lahore Branch', phone: '0300-9876543', lastLogin: '2026-06-13 08:45', avatar: '👨‍💼' },
  { id: 'USR004', name: 'Rahat Jamil', email: 'rahat@martpro.pk', username: 'rahat.cashier1', role: 'CASHIER', status: 'active', branch: 'Karachi HQ', phone: '0345-1239874', lastLogin: '2026-06-13 11:00', avatar: '👨‍💻' },
  { id: 'USR005', name: 'Sajid Anwar', email: 'sajid@martpro.pk', username: 'sajid.cashier2', role: 'CASHIER', status: 'active', branch: 'Karachi HQ', phone: '0312-4567890', lastLogin: '2026-06-13 13:40', avatar: '👨‍💻' },
  { id: 'USR006', name: 'Ayesha Omer', email: 'ayesha@martpro.pk', username: 'ayesha.cashier3', role: 'CASHIER', status: 'inactive', branch: 'Lahore Branch', phone: '0322-1122334', lastLogin: '2026-06-10 17:30', avatar: '👩‍💻' },
  { id: 'USR007', name: 'Sarah Ahmed', email: 'sarah@martpro.pk', username: 'sarah.audit', role: 'AUDITOR', status: 'active', branch: 'Karachi HQ', phone: '0334-9087654', lastLogin: '2026-06-12 10:15', avatar: '👩‍🔬' },
  { id: 'USR008', name: 'Bilal Siddiqui', email: 'bilal@martpro.pk', username: 'bilal.cashier4', role: 'CASHIER', status: 'active', branch: 'Lahore Branch', phone: '0301-4455667', lastLogin: '2026-06-13 08:50', avatar: '👨‍💻' }
];

export const USER_ACTIVITIES = [
  { id: 'ACT001', userId: 'USR001', userName: 'Zainab Fatima', action: 'Approved Supplier Invoice Payment', module: 'Suppliers', time: '2026-06-13 17:30', ipAddress: '192.168.1.10', details: 'Paid Rs. 120,000 to National Foods' },
  { id: 'ACT002', userId: 'USR002', userName: 'Mohammad Ali', action: 'Created Stock Adjustment', module: 'Inventory', time: '2026-06-13 17:00', ipAddress: '192.168.1.15', details: 'Damaged Olper UHT milk boxes voided' },
  { id: 'ACT003', userId: 'USR005', userName: 'Sajid Anwar', action: 'Completed POS checkout sale', module: 'POS Sales', time: '2026-06-13 15:45', ipAddress: '192.168.2.12', details: 'Sale of Rs. 1,450, ID: TXN-118' },
  { id: 'ACT004', userId: 'USR002', userName: 'Mohammad Ali', action: 'Added New Product Item', module: 'Products', time: '2026-06-13 15:10', ipAddress: '192.168.1.15', details: 'Added: Shan Malai Boti Masala' },
  { id: 'ACT005', userId: 'USR004', userName: 'Rahat Jamil', action: 'Completed POS checkout sale', module: 'POS Sales', time: '2026-06-13 14:10', ipAddress: '192.168.2.11', details: 'Sale of Rs. 870, ID: TXN-115' },
  { id: 'ACT006', userId: 'USR001', userName: 'Zainab Fatima', action: 'Modified Branch General Settings', module: 'Settings', time: '2026-06-13 13:00', ipAddress: '192.168.1.10', details: 'Updated FBR tax percentage to 18%' },
  { id: 'ACT007', userId: 'USR003', userName: 'Hamza Mughal', action: 'Received Goods Shipment', module: 'Purchases', time: '2026-06-13 11:45', ipAddress: '192.168.5.20', details: 'Confirmed PO-044 receiving check' },
  { id: 'ACT008', userId: 'USR001', userName: 'Zainab Fatima', action: 'Added New Staff Account', module: 'Users & Roles', time: '2026-06-13 10:30', ipAddress: '192.168.1.10', details: 'Created user: Bilal Siddiqui' },
  { id: 'ACT009', userId: 'USR007', userName: 'Sarah Ahmed', action: 'Exported Financial Trial Balance', module: 'Reports', time: '2026-06-12 16:45', ipAddress: '192.168.1.44', details: 'Simulated Excel download for May' },
  { id: 'ACT010', userId: 'USR002', userName: 'Mohammad Ali', action: 'Created Purchase Order', module: 'Purchases', time: '2026-06-12 14:20', ipAddress: '192.168.1.15', details: 'Drafted PO-054 for Dalda Foods' },
  { id: 'ACT011', userId: 'USR003', userName: 'Hamza Mughal', action: 'Added Expense Item', module: 'Expenses', time: '2026-06-12 11:30', ipAddress: '192.168.5.20', details: 'Added: Lahore Generator fuel bills' },
  { id: 'ACT012', userId: 'USR001', userName: 'Zainab Fatima', action: 'Updated Customer Credit Limit', module: 'Customers', time: '2026-06-12 10:30', ipAddress: '192.168.1.10', details: 'Extended credit to Haji Amjad Ali' },
  { id: 'ACT013', userId: 'USR001', userName: 'Zainab Fatima', action: 'User Sign-in Successful', module: 'System Login', time: '2026-06-13 08:30', ipAddress: '192.168.1.10', details: 'Admin console dashboard entry' },
  { id: 'ACT014', userId: 'USR008', userName: 'Bilal Siddiqui', action: 'User Sign-in Successful', module: 'System Login', time: '2026-06-13 08:50', ipAddress: '192.168.5.22', details: 'Lahore POS terminal active' },
  { id: 'ACT015', userId: 'USR003', userName: 'Hamza Mughal', action: 'User Sign-in Successful', module: 'System Login', time: '2026-06-13 08:45', ipAddress: '192.168.5.20', details: 'Manager console active' }
];

export const checkPermission = (userRole, moduleName) => {
  const roleInfo = ROLES[userRole];
  if (!roleInfo) return false;
  if (roleInfo.modules.includes('*')) return true;
  return roleInfo.modules.includes(moduleName);
};

export const getActiveUsers = () => USERS.filter(u => u.status === 'active');
