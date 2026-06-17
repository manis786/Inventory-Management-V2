import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { ToastContainer } from '../ui/Toast';
import { useApp } from '../../context/AppContext';

export function AppShell({ children }) {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-250">
      {/* Sidebar Panel Navigation */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Global Toast Alert notifications */}
      <ToastContainer />
    </div>
  );
}
export default AppShell;
