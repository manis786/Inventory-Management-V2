import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumb() {
  const { breadcrumbs, setActiveModule } = useApp();

  // Helper function to handle module navigation
  const handleNavigate = (label) => {
    setActiveModule(label);
  };

  return (
    <nav className="flex select-none" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1.5 md:space-x-2.5">
        {/* Home Button */}
        <li className="inline-flex items-center">
          <button
            onClick={() => handleNavigate('Dashboard')}
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors duration-150"
          >
            <Home className="w-3.5 h-3.5 mr-1.5" />
            Home
          </button>
        </li>

        {/* Dynamic Breadcrumbs */}
        {breadcrumbs?.map((crumb, index) => {
          // Avoid duplicate 'Home' in the list
          if (crumb.label === 'Home' || crumb.label === 'Dashboard') return null;

          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={index} className="inline-flex items-center">
              <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600 mx-1.5" />
              
              {isLast ? (
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                  {crumb.label}
                </span>
              ) : (
                <button
                  onClick={() => handleNavigate(crumb.label)}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors duration-150"
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