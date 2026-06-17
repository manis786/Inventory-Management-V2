import React from 'react';
import { Card, CardContent } from './Card';
import { TrendingDown, TrendingUp } from 'lucide-react';

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = 'vs last month',
  color = 'indigo', // indigo, emerald, rose, amber, cyan
  className = '',
  loading = false,
  ...props
}) {
  const colorSchemes = {
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400',
      glow: 'hover:shadow-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-950'
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-650 dark:bg-emerald-950/40 dark:text-emerald-400',
      glow: 'hover:shadow-emerald-500/10 hover:border-emerald-200 dark:hover:border-emerald-950'
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-650 dark:bg-rose-950/40 dark:text-rose-400',
      glow: 'hover:shadow-rose-500/10 hover:border-rose-200 dark:hover:border-rose-950'
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-605 dark:bg-amber-950/40 dark:text-amber-400',
      glow: 'hover:shadow-amber-500/10 hover:border-amber-200 dark:hover:border-amber-950'
    },
    cyan: {
      iconBg: 'bg-cyan-50 text-cyan-650 dark:bg-cyan-950/40 dark:text-cyan-400',
      glow: 'hover:shadow-cyan-500/10 hover:border-cyan-200 dark:hover:border-cyan-950'
    }
  };

  const current = colorSchemes[color] || colorSchemes.indigo;

  return (
    <Card hoverEffect className={`group ${current.glow} ${className}`} {...props}>
      <CardContent className="p-5 flex items-center justify-between">
        {loading ? (
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 bg-slate-100 dark:bg-slate-800 rounded skeleton" />
            <div className="h-7 w-2/3 bg-slate-150 dark:bg-slate-800 rounded skeleton" />
            <div className="h-3.5 w-1/2 bg-slate-100 dark:bg-slate-800 rounded skeleton" />
          </div>
        ) : (
          <>
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {title}
              </span>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                {value}
              </h2>
              {trend && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span
                    className={`
                      flex items-center gap-0.5 font-bold rounded-md px-1.5 py-0.5
                      ${trend.type === 'up'
                        ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30'
                        : trend.type === 'down'
                          ? 'text-rose-700 bg-rose-50 dark:text-rose-455 dark:bg-rose-950/30'
                          : 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-800'
                      }
                    `}
                  >
                    {trend.type === 'up' ? (
                      <TrendingUp className="w-3 h-3 shrink-0" />
                    ) : trend.type === 'down' ? (
                      <TrendingDown className="w-3 h-3 shrink-0" />
                    ) : null}
                    {trend.value}
                  </span>
                  <span className="text-slate-450 dark:text-slate-500 font-medium">{trendLabel}</span>
                </div>
              )}
            </div>

            {Icon && (
              <div
                className={`
                  p-3.5 rounded-xl transition-all duration-300
                  ${current.iconBg} group-hover:scale-110 group-hover:rotate-3 shadow-xs
                `}
              >
                <Icon className="w-5.5 h-5.5 shrink-0" />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
