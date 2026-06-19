async function testAll() {
  try {
    const products = (await import('../src/data/products.js')).PRODUCTS;
    const categories = (await import('../src/data/categories.js')).CATEGORIES;
    const transactions = (await import('../src/data/transactions.js')).TRANSACTIONS;
    const expenses = (await import('../src/data/expenses.js')).EXPENSES;
    const { ACCOUNTS, JOURNAL_ENTRIES } = await import('../src/data/finance.js');
    const users = (await import('../src/data/users.js')).USERS;
    const suppliers = (await import('../src/data/suppliers.js')).SUPPLIERS;
    const customers = (await import('../src/data/customers.js')).CUSTOMERS;
    const purchases = (await import('../src/data/purchases.js')).PURCHASE_ORDERS;
    const store = (await import('../src/data/store.js')).STORE_INFO;

    console.log({
      products: products.length,
      categories: categories.length,
      transactions: transactions.length,
      expenses: expenses.length,
      accounts: ACCOUNTS.length,
      journalEntries: JOURNAL_ENTRIES.length,
      users: users.length,
      suppliers: suppliers.length,
      customers: customers.length,
      purchases: purchases.length,
      store: Object.keys(store)
    });
  } catch (err) {
    console.error('Failed to import ESM:', err);
  }
}
testAll();
