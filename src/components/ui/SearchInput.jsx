import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

export function SearchInput({
  value: initialValue,
  onChange,
  debounceTime = 300,
  placeholder = 'Search...',
  className = '',
  ...props
}) {
  const [value, setValue] = useState(initialValue || '');
  const debouncedValue = useDebounce(value, debounceTime);

  useEffect(() => {
    setValue(initialValue || '');
  }, [initialValue]);

  useEffect(() => {
    if (onChange) {
      onChange(debouncedValue);
    }
  }, [debouncedValue]);

  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="
          block w-full pl-9 pr-8 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs
          bg-white dark:bg-slate-900/50 text-slate-805 dark:text-slate-100 placeholder:text-slate-400
          dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20
          focus:border-indigo-500 transition-all duration-150
        "
        {...props}
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 cursor-pointer"
        >
          <X className="h-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
