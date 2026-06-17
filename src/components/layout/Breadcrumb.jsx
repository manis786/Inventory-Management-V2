import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumb() {
  const { breadcrumbs, setActiveModule } = useApp();

  return (
    <nav className="flex select-none" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1.5 md:space-x-2.5">
        <li className="inline-flex items-center">
          <button
            onClick={() => setActiveModule('Dashboard')}
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 cursor-pointer transition-colors duration-150"
          >
            <Home className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            Home
          </button>
        </li>
        {breadcrumbs.map((crumb, index) => {
          // Skip the first one if it matches "Home" or "MartPro ERP" to avoid duplication
          if (index === 0 && (crumb.label === 'Home' || crumb.label === 'MartPro ERP')) return null;

          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={index} className="inline-flex items-center">
              <ChevronRight className="w-3 h-3 text-slate-350 dark:text-slate-600 mx-1 shrink-0" />
              {isLast ? (
                <span className="text-xs font-bold text-slate-805 dark:text-slate-100 tracking-tight">
                  {crumb.label}
                </span>
              ) : (
                <button
                  onClick={() => {
                    // Normalize back to sidebar module names
                    setActiveModule(crumb.label);
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 cursor-pointer transition-colors duration-150"
                >
                  {crumb.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
export default Breadcrumb;
