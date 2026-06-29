import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext'; // Ensure path is correct
import { CommandPalette } from '../ui/CommandPalette';
import { DropdownMenu } from '../ui/DropdownMenu';
import { Breadcrumb } from './Breadcrumb';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Sun, Moon, Menu, User, LogOut,
  ShieldCheck, ShieldAlert
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
  } = useApp(); // Ab ye AppContext se directly link ho gaya
const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // Notifications logic (Mark read / Clear)
  const unreadCount = notifications ? notifications.filter((n) => !n.read).length : 0;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'info');
  };

  const clearNotifications = () => {
    setNotifications([]);
    addToast('Notifications cleared', 'info');
  };

  const handleLogout = () => {
   localStorage.removeItem('token');
  localStorage.removeItem('isLoggedIn');
    setTimeout(() => {
      navigate('/login'); 
    window.location.reload()
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

  return (
    <header className="h-16 flex items-center justify-between px-5 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800 sticky top-0 z-30 transition-colors duration-200">
      <div className="flex items-center gap-3.5">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <Breadcrumb />
        </div>
      </div>

      <div className="flex items-center gap-3.5">
        <CommandPalette />

        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Widget */}
        <div ref={notifRef} className="relative">
          <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 relative hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <Bell className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />}
          </button>
        </div>

        {/* Profile Dropdown */}
        <DropdownMenu
          align="right"
          trigger={
            <button className="flex items-center gap-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <div className="w-7 h-7 rounded-md bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
            </button>
          }
          items={[
            { label: 'Sign Out', icon: <LogOut className="w-4 h-4" />, onClick: handleLogout }
          ]}
        />
      </div>
    </header>
  );
}

export default TopNav;