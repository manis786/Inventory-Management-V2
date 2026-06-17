import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AppShell from './components/layout/AppShell';

// Import Pages
import Dashboard from './pages/Dashboard';
import POSSales from './pages/POSSales';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Inventory from './pages/Inventory';
import Purchases from './pages/Purchases';
import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import Finance from './pages/Finance';
import HumanResources from './pages/HumanResources';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import UsersRoles from './pages/UsersRoles';
import Settings from './pages/Settings';

// Login Page Import
import Login from './pages/Login';

function ERPContent() {
  const { activeModule, currentUser } = useApp();

  // 1. Frontend Auth Check
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

  // 2. Standard Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.reload(); // State refresh karke login block active karne ke liye
  };

  // 3. Agar user logged in nahi hai, to seedha Login page dikhayein
  if (!isAuthenticated) {
    return <Login />;
  }

  // 4. Active module render switch
  const renderModule = () => {
    switch (activeModule) {
      case 'Dashboard':
        return <Dashboard />;
      case 'POS Sales':
        return <POSSales />;
      case 'Products':
        return <Products />;
      case 'Categories':
        return <Categories />;
      case 'Inventory':
        return <Inventory />;
      case 'Purchases':
        return <Purchases />;
      case 'Suppliers':
        return <Suppliers />;
      case 'Customers':
        return <Customers />;
      case 'Finance':
        return <Finance />;
      case 'Expenses':
        return <Expenses />;
      case 'Reports':
        return <Reports />;
      case 'Human Resources':
        return <HumanResources />;
      case 'Users & Roles':
        return <UsersRoles />;
      case 'Settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  /* 5. AppShell ko active user data aur logout function pass kar rahe hain.
       Agar aapka layout/header direct AppShell ke andar handle ho raha hai,
       toh yeh props wahan header ko update kar denge.
  */
  return (
    <AppShell
      user={currentUser || { name: 'Admin User', role: 'Administrator' }}
      onLogout={handleLogout}
    >
      {renderModule()}
    </AppShell>
  );
}

function App() {
  return (
    <AppProvider>
      <ERPContent />
    </AppProvider>
  );
}

export default App;