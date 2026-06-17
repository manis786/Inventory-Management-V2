import React from 'react';

export function Badge({
  children,
  variant = 'secondary',
  outline = false,
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide';

  const solidVariants = {
    primary: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
    secondary: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    info: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300'
  };

  const outlineVariants = {
    primary: 'border border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-400',
    secondary: 'border border-slate-200 text-slate-650 dark:border-slate-700 dark:text-slate-300',
    success: 'border border-emerald-250 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400',
    danger: 'border border-rose-200 text-rose-700 dark:border-rose-850 dark:text-rose-400',
    warning: 'border border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400',
    info: 'border border-cyan-200 text-cyan-750 dark:border-cyan-800 dark:text-cyan-400'
  };

  const styleClass = outline ? outlineVariants[variant] : solidVariants[variant];

  return (
    <span className={`${base} ${styleClass} ${className}`} {...props}>
      {children}
    </span>
  );
}
