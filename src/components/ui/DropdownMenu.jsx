import React, { useState, useRef, useEffect } from 'react';

export function DropdownMenu({
  trigger,
  items = [],
  align = 'right', // left, right
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignments = {
    left: 'left-0 origin-top-left',
    right: 'right-0 origin-top-right'
  };

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`
            absolute mt-1.5 w-48 rounded-lg shadow-lg bg-white dark:bg-slate-900
            border border-slate-150 dark:border-slate-800/80 z-40 py-1
            animate-scale-in card-shadow dark:card-shadow-dark
            ${alignments[align]}
          `}
        >
          {items.map((item, idx) => {
            if (item.divider) {
              return <hr key={idx} className="my-1 border-slate-100 dark:border-slate-800" />;
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (item.onClick) item.onClick();
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-2 text-xs text-left flex items-center gap-2.5 transition-colors cursor-pointer
                  ${item.danger
                    ? 'text-rose-600 hover:bg-rose-50 dark:text-rose-455 dark:hover:bg-rose-950/20'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                  }
                `}
              >
                {item.icon && <span className="text-slate-400 dark:text-slate-500 shrink-0">{item.icon}</span>}
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
