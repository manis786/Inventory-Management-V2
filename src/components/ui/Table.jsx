import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, AlertCircle } from 'lucide-react';
import { Button } from './Button';

export function Table({
  columns = [],
  data = [],
  sortColumn,
  sortDirection,
  onSort,
  emptyMessage = 'No records found.',
  pagination = false,
  totalItems = 0,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
  isLoading = false,
  className = ''
}) {
  const handleSort = (column) => {
    if (!column.sortable || !onSort) return;
    const isAsc = sortColumn === column.key && sortDirection === 'asc';
    onSort(column.key, isAsc ? 'desc' : 'asc');
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900">
        <table className="w-full text-left border-collapse text-slate-650 dark:text-slate-300 text-sm">
          <thead className="bg-slate-50/75 dark:bg-slate-950/40 text-xs font-semibold text-slate-505 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-800/60 uppercase tracking-wider select-none">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col)}
                  className={`
                    px-5 py-3.5 font-semibold transition-colors
                    ${col.sortable ? 'hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer' : ''}
                    ${col.className || ''}
                  `}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && onSort && (
                      <span className="text-slate-400">
                        {sortColumn === col.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-indigo-550 dark:text-indigo-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-indigo-550 dark:text-indigo-400" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5 text-slate-350 dark:text-slate-600" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx}>
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-5 py-4">
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded skeleton" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
                    <AlertCircle className="w-8 h-8" />
                    <p className="font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rIdx) => (
                <tr
                  key={row.id || rIdx}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-5 py-3.5 text-slate-700 dark:text-slate-205 align-middle ${col.className || ''}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-1 select-none">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-855 dark:text-slate-200">{Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)}</span> to{' '}
            <span className="font-semibold text-slate-855 dark:text-slate-200">{Math.min(totalItems, currentPage * itemsPerPage)}</span> of{' '}
            <span className="font-semibold text-slate-855 dark:text-slate-200">{totalItems}</span> results
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Previous
            </Button>

            <div className="hidden md:flex gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                // Simple page collapse logic
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  Math.abs(pageNum - currentPage) <= 1
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`
                        w-8 h-8 flex items-center justify-center rounded-md text-xs font-semibold border transition-all cursor-pointer
                        ${currentPage === pageNum
                          ? 'bg-indigo-650 text-white border-indigo-650 shadow-sm'
                          : 'bg-white text-slate-600 hover:bg-slate-55 border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800'
                        }
                      `}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === 2 || pageNum === totalPages - 1) {
                  return (
                    <span key={pageNum} className="w-8 text-center text-slate-400 text-xs">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
