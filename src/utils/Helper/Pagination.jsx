import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, limit = 5, onLimitChange = () => {} }) => {
  // Helper: generate page numbers
  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  console.log("[DEBUG] Testing Log limit===========================>", limit);

  return (
    <div className="pagination">
      <div className="pagination_left">
        <span>Show rows</span>
        <select
          id="limit"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[5, 10, 20].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      {/* Prev button */}
      <div className="page-numbers">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          {"<"}
        </button>

        {/* Page numbers */}
        {getPages().map((page) => (
          <button
            key={page}
            className={`rounded ${page === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {/* Next button */}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
