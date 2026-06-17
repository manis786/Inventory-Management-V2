import React from 'react';

export function Skeleton({ className = '', variant = 'rect', ...props }) {
  const base = 'skeleton animate-pulse rounded bg-slate-200 dark:bg-slate-800';
  const variants = {
    rect: 'h-4 w-full',
    circle: 'rounded-full shrink-0',
    card: 'h-32 w-full rounded-xl',
  };

  return <div className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <Skeleton
          key={idx}
          className={`h-3.5 ${
            idx === lines - 1 && lines > 1 ? 'w-2/3' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}
