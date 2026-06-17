import React from 'react';
import { User, Key, Settings, ShoppingBag, PlusCircle, AlertCircle, RefreshCw } from 'lucide-react';

export function ActivityTimeline({ activities = [], className = '' }) {
  const getIcon = (module) => {
    const iconStyles = 'w-4 h-4 text-white';
    switch (module) {
      case 'System Login':
        return <div className="p-1.5 rounded-lg bg-indigo-500">{<Key className={iconStyles} />}</div>;
      case 'Settings':
        return <div className="p-1.5 rounded-lg bg-slate-550">{<Settings className={iconStyles} />}</div>;
      case 'Products':
      case 'POS Sales':
        return <div className="p-1.5 rounded-lg bg-emerald-500">{<ShoppingBag className={iconStyles} />}</div>;
      case 'Inventory':
        return <div className="p-1.5 rounded-lg bg-amber-500">{<AlertCircle className={iconStyles} />}</div>;
      default:
        return <div className="p-1.5 rounded-lg bg-indigo-650">{<User className={iconStyles} />}</div>;
    }
  };

  return (
    <div className={`flow-root ${className}`}>
      <ul className="-mb-8 select-none">
        {activities.map((activity, activityIdx) => (
          <li key={activity.id || activityIdx}>
            <div className="relative pb-8">
              {activityIdx !== activities.length - 1 ? (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3.5">
                <div className="relative shrink-0">
                  {getIcon(activity.module)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-bold text-slate-805 dark:text-slate-200">
                      {activity.userName || activity.user || 'System User'}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {activity.time || activity.date}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-650 dark:text-slate-350">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {activity.action}
                    </span>{' '}
                    — {activity.details || activity.description}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ActivityTimeline;
