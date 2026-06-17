import React from 'react';

export function ChartTooltip({ active, payload, label, currency = 'Rs' }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 dark:bg-slate-950/95 border border-slate-800 dark:border-slate-800 text-slate-100 rounded-lg p-3 shadow-xl text-xs backdrop-blur-xs select-none">
        <p className="font-bold text-slate-300 mb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4 font-semibold">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                {item.name}:
              </span>
              <span className="text-white">
                {currency ? `${currency} ` : ''}
                {Number(item.value).toLocaleString('en-PK')}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
export default ChartTooltip;
