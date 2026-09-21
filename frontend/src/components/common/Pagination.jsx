import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page = 1, totalPages = 1, totalItems = 0, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-xs">
      <div className="text-slate-400">
        Page <span className="font-mono font-semibold text-slate-200">{page}</span> of{' '}
        <span className="font-mono font-semibold text-slate-200">{totalPages}</span>
        {totalItems > 0 && (
          <span className="ml-2 font-mono text-slate-500">({totalItems} total scans)</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40"
          aria-label="Next Page"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
