import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // hide if only 1 page

  // Cap totalPages at 100
  const maxPages = 100;
  const cappedTotalPages = Math.min(totalPages, maxPages);

  // Determine which page numbers to show (e.g., 2 3 4 5 ...)
  const visiblePages = [];
  const maxVisible = 5; // maximum number of page buttons to show

  let startPage = Math.max(2, currentPage - 2);
  let endPage = Math.min(cappedTotalPages - 1, startPage + maxVisible - 1);

  // Adjust start if endPage reaches cappedTotalPages-1
  startPage = Math.max(2, endPage - maxVisible + 1);

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return (
    <div className="flex justify-center mt-6 gap-2 flex-wrap">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md border ${
          currentPage === 1
            ? "text-gray-400 border-gray-200 cursor-not-allowed"
            : "text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
      >
        Previous
      </button>

      {/* First page */}
      <button
        onClick={() => onPageChange(1)}
        className={`px-3 py-1 rounded-md border ${
          currentPage === 1
            ? "bg-blue-500 text-white border-blue-500"
            : "text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
      >
        1
      </button>

      {/* Ellipsis if startPage > 2 */}
      {startPage > 2 && <span className="px-2 py-1">...</span>}

      {/* Visible page numbers */}
      {visiblePages.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`px-3 py-1 rounded-md border ${
            num === currentPage
              ? "bg-blue-500 text-white border-blue-500"
              : "text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {num}
        </button>
      ))}

      {/* Ellipsis if endPage < cappedTotalPages-1 */}
      {endPage < cappedTotalPages - 1 && <span className="px-2 py-1">...</span>}

      {/* Last page */}
      {cappedTotalPages > 1 && (
        <button
          onClick={() => onPageChange(cappedTotalPages)}
          className={`px-3 py-1 rounded-md border ${
            currentPage === cappedTotalPages
              ? "bg-blue-500 text-white border-blue-500"
              : "text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {cappedTotalPages}
        </button>
      )}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === cappedTotalPages}
        className={`px-3 py-1 rounded-md border ${
          currentPage === cappedTotalPages
            ? "text-gray-400 border-gray-200 cursor-not-allowed"
            : "text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
