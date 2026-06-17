import React from 'react';
import { Badge } from '../ui/Badge';

export function StatusBadge({ status, className = '' }) {
  if (!status) return null;

  const mapping = {
    // General
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'danger', label: 'Inactive' },

    // Financial Transactions / Expenses
    Paid: { variant: 'success', label: 'Paid' },
    Pending: { variant: 'warning', label: 'Pending' },
    Voided: { variant: 'danger', label: 'Voided' },

    // Purchases / Supply Chain
    Received: { variant: 'success', label: 'Received' },
    Partial: { variant: 'info', label: 'Partial' },
    Cancelled: { variant: 'danger', label: 'Cancelled' },
    Draft: { variant: 'secondary', label: 'Draft' },

    // Stock
    instock: { variant: 'success', label: 'In Stock' },
    lowstock: { variant: 'warning', label: 'Low Stock' },
    outofstock: { variant: 'danger', label: 'Out of Stock' }
  };

  const key = String(status).trim();
  const match = mapping[key] || { variant: 'secondary', label: status };

  return (
    <Badge variant={match.variant} outline className={`${className} font-bold text-[10px]`}>
      {match.label}
    </Badge>
  );
}
export default StatusBadge;
