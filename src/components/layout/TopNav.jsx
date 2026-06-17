import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CommandPalette } from '../ui/CommandPalette';
import { DropdownMenu } from '../ui/DropdownMenu';
import { Breadcrumb } from './Breadcrumb';
import {
  Bell,
  Sun,
  Moon,
  Menu,
  User,
  LogOut,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

export function TopNav() {
  const {
    theme,
    toggleTheme,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    notifications,
    setNotifications,
    currentUser,
    addToast
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // 1. Dynamic Dark/Light Mode Side-Effect (Core Tailwind Class Injection)
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  // Unread notifications count
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'info');
  };

  const clearNotifications = () => {
    setNotifications([]);
    addToast('Notifications cleared', 'info');
  };

  // Standard Logout Functionality
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    addToast('Logging out... Goodbye!', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotifIcon = (type) => {
    switch (type) {
      case 'warning': return <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'success': return <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'error': return <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />;
      default: return <Bell className="w-4 h-4 text-cyan-500 shrink-0" />;
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-5 bg-white border-b border-slate-205 dark:bg-slate-900 dark:border-slate-800/80 sticky top-0 z-30 card-shadow no-print transition-colors duration-200">
      {/* Left side: Hamburger (Mobile) and Breadcrumb */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <Breadcrumb />
        </div>
      </div>

      {/* Right side: Search, Theme Toggle, Notifications, User Profile */}
      <div className="flex items-center gap-3.5">
        {/* Command Palette search box */}
        <CommandPalette />

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="
            p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-550
            dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors duration-150 cursor-pointer
          "
        >
          {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-600" />}
        </button>

        {/* Notification Bell Widget */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="
              p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-550
              dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors duration-150 relative cursor-pointer
            "
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse notification-badge" />
            )}
          </button>

          {/* Notifications Panel */}
          {notifOpen && (
            <div className="absolute right-0 mt-2.5 w-80 rounded-lg shadow-xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 z-40 overflow-hidden animate-scale-in card-shadow dark:card-shadow-dark">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Notifications ({unreadCount} unread)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={markAllRead}
                    className="text-[10px] font-semibold text-indigo-650 hover:underline dark:text-indigo-400 cursor-pointer"
                  >
                    Mark read
                  </button>
                  <button
                    onClick={clearNotifications}
                    className="text-[10px] font-semibold text-rose-550 hover:underline dark:text-rose-400 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-slate-405 dark:text-slate-500">
                    No new notifications.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`
                        p-3 flex items-start gap-2.5 transition-colors
                        ${notif.read ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-850/20'}
                      `}
                    >
                      {getNotifIcon(notif.type)}
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-relaxed text-slate-707 dark:text-slate-205 ${notif.read ? 'font-normal' : 'font-semibold'}`}>
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-slate-405 dark:text-slate-500 mt-1 block">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Updated Standard User Profile Dropdown */}
        <DropdownMenu
          align="right"
          trigger={
            <button className="flex items-center gap-2 p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer select-none">
              <div className="w-7 h-7 rounded-md bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-base border border-slate-150 dark:border-indigo-950">
                {currentUser?.avatar || '👤'}
              </div>
              <div className="hidden lg:block text-left pr-1 min-w-[70px]">
                <h4 className="text-[11px] font-black text-slate-700 dark:text-slate-200 truncate leading-none">
                  {currentUser?.name || 'Muhammad Anis'}
                </h4>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 leading-none">
                  {currentUser?.role || 'ADMIN'}
                </span>
              </div>
            </button>
          }
          items={[
            { label: 'Logged-in Session', divider: true },
            { label: `User: ${currentUser?.name || 'Muhammad Anis'}`, icon: <User className="w-3.5 h-3.5 text-indigo-500" />, onClick: () => {} },
            { label: `Role: ${currentUser?.role || 'ADMIN'}`, icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />, onClick: () => {} },
            { label: 'Account Actions', divider: true },
            { 
              label: 'Sign Out of ERP', 
              icon: <LogOut className="w-3.5 h-3.5 text-rose-500" />, 
              onClick: handleLogout 
            }
          ]}
        />
      </div>
    </header>
  );
}

export default TopNav;