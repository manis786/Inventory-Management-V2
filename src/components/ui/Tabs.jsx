import React from 'react';

export function Tabs({
  tabs = [],
  activeTab,
  onChange,
  variant = 'pills', // pills, line, border
  className = '',
  ...props
}) {
  const containerVariants = {
    pills: 'p-1 bg-slate-100 dark:bg-slate-900 rounded-lg flex flex-wrap gap-1',
    line: 'border-b border-slate-200 dark:border-slate-800 flex gap-4',
    border: 'flex border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden'
  };

  const buttonVariants = {
    pills: (isActive) => `
      px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer
      ${isActive
        ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-sm shadow-slate-200/50 dark:shadow-none'
        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
      }
    `,
    line: (isActive) => `
      px-1 py-3 border-b-2 text-sm font-medium transition-all duration-150 -mb-[1px] cursor-pointer
      ${isActive
        ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
        : 'border-transparent text-slate-500 hover:text-slate-850 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-700'
      }
    `,
    border: (isActive) => `
      flex-1 px-4 py-2.5 text-center text-sm font-medium transition-all duration-150 cursor-pointer
      ${isActive
        ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 font-semibold'
        : 'bg-white dark:bg-slate-900 text-slate-650 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 border-r border-slate-205 last:border-r-0 dark:border-slate-800'
      }
    `
  };

  return (
    <div className={`${containerVariants[variant]} ${className}`} {...props}>
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;
        return (
          <button
            key={tab.value}
            type="button"
            className={buttonVariants[variant](isActive)}
            onClick={() => onChange(tab.value)}
          >
            {tab.icon && <span className="mr-1.5 inline-block">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && (
              <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                isActive 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' 
                  : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
