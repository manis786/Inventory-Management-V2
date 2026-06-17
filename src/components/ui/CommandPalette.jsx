import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Monitor, Moon, Sun, ShoppingBag, LayoutDashboard, Calculator, Warehouse, Wallet, Receipt, Users, Settings, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CommandPalette() {
  const {
    activeModule,
    setActiveModule,
    theme,
    toggleTheme,
    users,
    loginAsUser,
    addToast
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef(null);

  // Toggle Command Palette with Ctrl + K
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

  // Reset indices
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Define commands
  const commands = [
    // Module Navigation
    { id: 'nav_dash', label: 'Go to Dashboard', category: 'Navigation', shortcut: 'G D', icon: LayoutDashboard, action: () => { setActiveModule('Dashboard'); setIsOpen(false); } },
    { id: 'nav_pos', label: 'Go to POS Sales', category: 'Navigation', shortcut: 'G P', icon: Calculator, action: () => { setActiveModule('POS Sales'); setIsOpen(false); } },
    { id: 'nav_prod', label: 'Go to Products Management', category: 'Navigation', shortcut: 'G R', icon: ShoppingBag, action: () => { setActiveModule('Products'); setIsOpen(false); } },
    { id: 'nav_inv', label: 'Go to Inventory Movement', category: 'Navigation', shortcut: 'G I', icon: Warehouse, action: () => { setActiveModule('Inventory'); setIsOpen(false); } },
    { id: 'nav_fin', label: 'Go to Finance Ledger', category: 'Navigation', shortcut: 'G F', icon: Wallet, action: () => { setActiveModule('Finance'); setIsOpen(false); } },
    { id: 'nav_exp', label: 'Go to Expenses', category: 'Navigation', shortcut: 'G E', icon: Receipt, action: () => { setActiveModule('Expenses'); setIsOpen(false); } },
    { id: 'nav_user', label: 'Go to Users & Roles', category: 'Navigation', shortcut: 'G U', icon: Users, action: () => { setActiveModule('Users & Roles'); setIsOpen(false); } },
    { id: 'nav_sett', label: 'Go to General Settings', category: 'Navigation', shortcut: 'G S', icon: Settings, action: () => { setActiveModule('Settings'); setIsOpen(false); } },

    // Preferences
    { id: 'pref_theme', label: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, category: 'System', shortcut: 'T T', icon: theme === 'light' ? Moon : Sun, action: () => { toggleTheme(); setIsOpen(false); } },

    // User Roles Switch (Simulation)
    ...users.map((u) => ({
      id: `user_${u.id}`,
      label: `Switch Session to: ${u.name} (${u.role})`,
      category: 'Switch User Session',
      shortcut: 'S U',
      icon: Users,
      action: () => {
        loginAsUser(u.id);
        setIsOpen(false);
      }
    }))
  ];

  // Filtering commands
  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard controls
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Scroll index into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  return (
    <>
      {/* Global Command Search Bar Toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg border border-slate-200
          dark:border-slate-800 bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-900/50
          dark:hover:bg-slate-800/60 text-slate-400 dark:text-slate-500 w-44 md:w-56 text-xs
          transition-all duration-205 cursor-pointer select-none
        "
      >
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5" />
          <span className="font-medium">Search commands...</span>
        </div>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 shadow-2xs">
          Ctrl K
        </kbd>
      </button>

      {/* Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh] overflow-y-auto no-print"
            onKeyDown={handleKeyDown}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.15 }}
              className="
                relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl
                border border-slate-100 dark:border-slate-800/80 overflow-hidden flex flex-col max-h-[60vh]
              "
            >
              {/* Search Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800/50">
                <Search className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or module name..."
                  className="
                    flex-1 bg-transparent border-0 outline-none text-slate-805
                    dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500
                  "
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  ESC
                </button>
              </div>

              {/* Commands List */}
              <div
                ref={listRef}
                className="flex-1 overflow-y-auto p-1.5 max-h-[40vh] divide-y divide-transparent"
              >
                {filtered.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-slate-405 dark:text-slate-500">
                    No matching commands found.
                  </div>
                ) : (
                  filtered.map((cmd, idx) => {
                    const isSelected = idx === selectedIndex;
                    const Icon = cmd.icon;

                    return (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`
                          w-full px-3.5 py-2.5 rounded-lg text-xs text-left flex items-center justify-between gap-3 transition-colors cursor-pointer
                          ${isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-705 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850/50'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                          <div className="flex flex-col">
                            <span className="font-semibold">{cmd.label}</span>
                            <span className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'}`}>
                              {cmd.category}
                            </span>
                          </div>
                        </div>
                        {cmd.shortcut && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            isSelected
                              ? 'bg-indigo-750 text-indigo-100'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          }`}>
                            {cmd.shortcut}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
