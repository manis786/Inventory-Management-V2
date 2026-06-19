const mongoose = require('mongoose');
const {
  User, Category, Product, Transaction, Expense, Supplier,
  Customer, PurchaseOrder, FinanceAccount, JournalEntry, StoreSettings
} = require('./models');

async function seedDatabase() {
  console.log('Checking database seed status...');

  // 1. Seed StoreSettings
  const settingsCount = await StoreSettings.countDocuments();
  if (settingsCount === 0) {
    console.log('Seeding Store Settings...');
    const { STORE_INFO } = await import('../src/data/store.js');
    await StoreSettings.create({
      key: 'general',
      name: STORE_INFO.name,
      tagline: STORE_INFO.tagline,
      fullName: STORE_INFO.fullName,
      address: STORE_INFO.address,
      phone: STORE_INFO.phone,
      email: STORE_INFO.email,
      ntn: STORE_INFO.ntn,
      owner: STORE_INFO.owner,
      currency: STORE_INFO.currency,
      currencySymbol: STORE_INFO.currencySymbol,
      branches: STORE_INFO.branches,
      cartTaxPercent: 17
    });
  }

  // 2. Seed Users
  const usersCount = await User.countDocuments();
  if (usersCount === 0) {
    console.log('Seeding Users...');
    const { USERS } = await import('../src/data/users.js');
    
    // Add default logins with passwords
    const usersToCreate = USERS.map(user => {
      let pwd = 'password123';
      // For demo compatibility:
      if (user.username === 'manees.admin' || user.role === 'ADMIN') {
        pwd = 'admin123';
      }
      return {
        ...user,
        password: pwd
      };
    });

    // Also inject the specific demo email mentioned on the login page
    // if not already present
    const hasDemoAdmin = usersToCreate.some(u => u.email === 'admin@supermart.com');
    if (!hasDemoAdmin) {
      usersToCreate.push({
        id: 'USR000',
        name: 'Demo Admin',
        email: 'admin@supermart.com',
        username: 'admin',
        password: 'admin123',
        role: 'ADMIN',
        status: 'active',
        branch: 'Karachi HQ',
        phone: '0300-1234567',
        lastLogin: '',
        avatar: '👑'
      });
    }

    await User.insertMany(usersToCreate);
  }

  // 3. Seed Categories
  const categoriesCount = await Category.countDocuments();
  if (categoriesCount === 0) {
    console.log('Seeding Categories...');
    const { CATEGORIES } = await import('../src/data/categories.js');
    await Category.insertMany(CATEGORIES);
  }

  // 4. Seed Products
  const productsCount = await Product.countDocuments();
  if (productsCount === 0) {
    console.log('Seeding Products...');
    const { PRODUCTS } = await import('../src/data/products.js');
    await Product.insertMany(PRODUCTS);
  }

  // 5. Seed Suppliers
  const suppliersCount = await Supplier.countDocuments();
  if (suppliersCount === 0) {
    console.log('Seeding Suppliers...');
    const { SUPPLIERS } = await import('../src/data/suppliers.js');
    await Supplier.insertMany(SUPPLIERS);
  }

  // 6. Seed Customers
  const customersCount = await Customer.countDocuments();
  if (customersCount === 0) {
    console.log('Seeding Customers...');
    const { CUSTOMERS } = await import('../src/data/customers.js');
    await Customer.insertMany(CUSTOMERS);
  }

  // 7. Seed Expenses
  const expensesCount = await Expense.countDocuments();
  if (expensesCount === 0) {
    console.log('Seeding Expenses...');
    const { EXPENSES } = await import('../src/data/expenses.js');
    await Expense.insertMany(EXPENSES);
  }

  // 8. Seed Purchases (Purchase Orders)
  const purchasesCount = await PurchaseOrder.countDocuments();
  if (purchasesCount === 0) {
    console.log('Seeding Purchase Orders...');
    const { PURCHASE_ORDERS } = await import('../src/data/purchases.js');
    await PurchaseOrder.insertMany(PURCHASE_ORDERS);
  }

  // 9. Seed Transactions (Sales)
  const transactionsCount = await Transaction.countDocuments();
  if (transactionsCount === 0) {
    console.log('Seeding Sales Transactions...');
    const { TRANSACTIONS } = await import('../src/data/transactions.js');
    await Transaction.insertMany(TRANSACTIONS);
  }

  // 10. Seed Finance Accounts
  const accountsCount = await FinanceAccount.countDocuments();
  if (accountsCount === 0) {
    console.log('Seeding Finance Accounts...');
    const { ACCOUNTS } = await import('../src/data/finance.js');
    await FinanceAccount.insertMany(ACCOUNTS);
  }

  // 11. Seed Journal Entries
  const journalCount = await JournalEntry.countDocuments();
  if (journalCount === 0) {
    console.log('Seeding Journal Entries...');
    const { JOURNAL_ENTRIES } = await import('../src/data/finance.js');
    await JournalEntry.insertMany(JOURNAL_ENTRIES);
  }

  console.log('Database seeding checks completed successfully!');
}

module.exports = { seedDatabase };
