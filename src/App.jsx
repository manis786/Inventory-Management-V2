import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import AppShell from './components/layout/AppShell';
import { Toaster } from 'react-hot-toast';

// Import Pages
import Dashboard from './pages/Dashboard';
import POSSales from './pages/POSSales';
import CreditSales from './pages/CreditSales';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Inventory from './pages/Inventory';
import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import Finance from './pages/Finance';
import HumanResources from './pages/HumanResources';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import UsersRoles from './pages/UsersRoles';
import Settings from './pages/Settings';
import { FinanceDashboard } from './pages/FinanceDashboard';
import { ChartOfAccounts } from './pages/chartofAccounts';
import Purchases from './pages/Purchases.jsx';

// Component Imports
import { PurchaseManager } from './components/ui/PurchaseManager.jsx';
import  TrialBalance  from './components/ui/TrialBalance.jsx';

// Login Page Import
import Login from './pages/Login.jsx';

function ERPContent() {
  // 🔥 FIXED: activeReport extract kar liya context se
  const { activeModule, activeReport, currentUser } = useApp();
  const navigate = useNavigate();

  // 1. Frontend Auth Check
  const isAuthenticated = !!localStorage.getItem('token');

  // 2. Standard Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  // 3. Auth Guard
  if (!isAuthenticated) {
    return <Login />;
  }

  // 4. Active module render switch
  const renderModule = () => {
    // 🔥 FIXED: Direct 'Trial Balance' module ka check
    if (activeModule === 'Trial Balance') {
      return <TrialBalance />;
    }

    switch (activeModule) {
      case 'Dashboard':
        return <Dashboard />;
      case 'POS Sales':
        return <POSSales />;
      case 'Credit Sales': 
        return <CreditSales />;
      case 'Products':
        return <Products />;
      case 'Categories':
        return <Categories />;
      case 'Inventory':
        return <Inventory />;
      case 'Purchase Manager':
        return <PurchaseManager />;
      case 'Purchases':
        return <Purchases />;
      case 'Suppliers':
        return <Suppliers />;
      case 'Customers':
        return <Customers />;
      case 'Finance Dashboard':
        return <FinanceDashboard />;
      case 'Chart of Accounts':
        return <ChartOfAccounts />;
      case 'Finance':
        return <Finance />;
      case 'Expenses':
        return <Expenses />;
      case 'Reports':
        // 🔥 FIXED: Jab Sidebar se Reports click ho aur subItem 'trial_balance' ho
        if (activeReport === 'trial_balance') {
          return <TrialBalance />;
        }
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

  return (
    <AppShell
      user={currentUser || { name: 'Admin User', role: 'Administrator' }}
      onLogout={handleLogout}
    >
      {renderModule()}
    </AppShell>
  );
}

// Clean App wrapper without double Router crash
function App() {
  return (
    <AppProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/*" element={<ERPContent />} />
        <Route path="/reports/trial-balance" element={<TrialBalance />} />
      </Routes>
    </AppProvider>
  );
}

export default App;