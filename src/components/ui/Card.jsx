import React from 'react';

export function Card({
  children,
  className = '',
  hoverEffect = false,
  glass = false,
  ...props
}) {
  const shadowClass = 'card-shadow dark:card-shadow-dark';
  const hoverClass = hoverEffect ? 'hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300 ease-out' : '';
  const bgClass = glass
    ? 'glass dark:glass-dark'
    : 'bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60';

  return (
    <div
      className={`rounded-xl overflow-hidden ${bgClass} ${shadowClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div
      className={`px-5 py-4 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between gap-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3
      className={`font-semibold text-slate-800 dark:text-slate-100 tracking-tight text-base ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p
      className={`text-xs text-slate-500 dark:text-slate-400 mt-0.5 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div
      className={`px-5 py-3.5 bg-slate-50/50 dark:bg-slate-850/10 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
