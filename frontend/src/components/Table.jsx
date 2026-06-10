// Reusable Brutalist Table component with built-in loading and pagination states
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
      <div className="overflow-x-auto rounded-none border-2 border-black dark:border-white bg-[#EAE7DC] dark:bg-zinc-950 shadow-brutalist-lg dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.85)]">
        <table className="min-w-full divide-y-2 divide-black dark:divide-white text-left text-sm text-black dark:text-white">
          <thead className="bg-[#D8D4C7] dark:bg-zinc-900 text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white border-b-2 border-black dark:border-white">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className="px-6 py-4">
                  {header}
                </th>
              ))}
              {actions && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/20 dark:divide-white/20">
            {loading ? (
              <tr>
                <td colSpan={headers.length + (actions ? 1 : 0)} className="px-6 py-10 text-center">
                  <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-crimson border-t-transparent"></div>
                  <p className="mt-2 font-mono text-xs font-bold text-black/60 dark:text-white/60">LOADING RECORDS...</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={headers.length + (actions ? 1 : 0)} className="px-6 py-10 text-center font-mono text-xs font-bold text-black/60 dark:text-white/60">
                  📂 NO RECORDS FOUND MATCHING THE CURRENT CRITERIA
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-[#D8D4C7]/40 dark:hover:bg-zinc-900/40 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 font-semibold whitespace-nowrap">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-2">
          <span className="font-mono text-xs font-bold text-black/60 dark:text-white/60">
            SHOWING PAGE {pagination.page} OF {pagination.totalPages} ({pagination.total} TOTAL)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-4 py-2 rounded-none border-2 border-black dark:border-white text-xs font-mono uppercase font-bold bg-[#EAE7DC] dark:bg-black hover:bg-[#D8D4C7] dark:hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-all duration-150 transform hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutalist-sm dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.85)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              PREVIOUS
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-4 py-2 rounded-none border-2 border-black dark:border-white text-xs font-mono uppercase font-bold bg-[#EAE7DC] dark:bg-black hover:bg-[#D8D4C7] dark:hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-all duration-150 transform hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutalist-sm dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.85)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              NEXT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
