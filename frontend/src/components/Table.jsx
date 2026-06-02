import React from 'react';

const Table = ({
  headers,
  data,
  columns,
  actions = null,
  loading = false,
  pagination = null,
  onPageChange = null,
}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800/40 text-left text-sm text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50/50 dark:bg-slate-950/20 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className="px-6 py-4">
                  {header}
                </th>
              ))}
              {actions && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
            {loading ? (
              <tr>
                <td colSpan={headers.length + (actions ? 1 : 0)} className="px-6 py-10 text-center">
                  <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                  <p className="mt-2 text-slate-400">Loading records...</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={headers.length + (actions ? 1 : 0)} className="px-6 py-10 text-center text-slate-400">
                  📂 No records found matching the current criteria.
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/30 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 font-medium whitespace-nowrap">
                      {typeof col === 'function' ? col(row) : row[col] ?? '—'}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">{actions(row)}</div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination && onPageChange && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-xs text-slate-500">
            Showing Page <span className="font-semibold text-slate-700 dark:text-slate-300">{pagination.page}</span> of{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">{pagination.totalPages}</span> ({pagination.total} total)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
