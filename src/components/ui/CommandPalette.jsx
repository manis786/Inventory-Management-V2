import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ShoppingBag, LayoutDashboard, Calculator, Warehouse, Wallet, Receipt, Users, Settings, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CommandPalette() {
  const {
    activeModule,
    setActiveModule,
    theme,
    toggleTheme,
    users = [], // Default empty array to avoid undefined errors
    loginAsUser,
    addToast
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef(null);

  // Ctrl + K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset selected index on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Command Definitions
  const commands = [
    { id: 'nav_dash', label: 'Go to Dashboard', category: 'Navigation', icon: LayoutDashboard, action: () => { setActiveModule('Dashboard'); setIsOpen(false); } },
    { id: 'nav_pos', label: 'Go to POS Sales', category: 'Navigation', icon: Calculator, action: () => { setActiveModule('POS Sales'); setIsOpen(false); } },
    { id: 'nav_prod', label: 'Go to Products Management', category: 'Navigation', icon: ShoppingBag, action: () => { setActiveModule('Products'); setIsOpen(false); } },
    { id: 'nav_inv', label: 'Go to Inventory Movement', category: 'Navigation', icon: Warehouse, action: () => { setActiveModule('Inventory'); setIsOpen(false); } },
    { id: 'nav_fin', label: 'Go to Finance Ledger', category: 'Navigation', icon: Wallet, action: () => { setActiveModule('Finance'); setIsOpen(false); } },
    { id: 'nav_exp', label: 'Go to Expenses', category: 'Navigation', icon: Receipt, action: () => { setActiveModule('Expenses'); setIsOpen(false); } },
    { id: 'nav_user', label: 'Go to Users & Roles', category: 'Navigation', icon: Users, action: () => { setActiveModule('Users & Roles'); setIsOpen(false); } },
    { id: 'nav_sett', label: 'Go to General Settings', category: 'Navigation', icon: Settings, action: () => { setActiveModule('Settings'); setIsOpen(false); } },
    { id: 'pref_theme', label: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, category: 'System', icon: theme === 'light' ? Moon : Sun, action: () => { toggleTheme(); setIsOpen(false); } },
    
    // User sessions from context
    ...users.map((u) => ({
      id: `user_${u.id}`,
      label: `Switch Session to: ${u.name}`,
      category: 'Switch User Session',
      icon: Users,
      action: () => { loginAsUser(u.id); setIsOpen(false); addToast(`Switched to ${u.name}`, 'success'); }
    }))
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((prev) => (prev + 1) % filtered.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[selectedIndex]) filtered[selectedIndex].action(); }
    else if (e.key === 'Escape') { setIsOpen(false); }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all text-xs">
        <Search className="w-3.5 h-3.5" />
        <span>Search...</span>
        <kbd className="hidden sm:inline-block text-[10px] bg-slate-200 dark:bg-slate-700 px-1 rounded">Ctrl K</kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh]" onKeyDown={handleKeyDown}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              {/* Search input and List stay same as your original design */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <Search className="w-4 h-4 text-slate-400" />
                <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type a command..." className="flex-1 bg-transparent border-none outline-none text-sm dark:text-white" />
              </div>
              <div ref={listRef} className="max-h-[40vh] overflow-y-auto p-1.5">
                {filtered.map((cmd, idx) => (
                  <button key={cmd.id} onClick={cmd.action} className={`w-full px-3 py-2 text-xs flex items-center gap-3 rounded-lg ${idx === selectedIndex ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300'}`}>
                    <cmd.icon className="w-4 h-4" /> {cmd.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}