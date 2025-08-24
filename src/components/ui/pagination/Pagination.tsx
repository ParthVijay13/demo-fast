"use client";
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  itemsShown: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  itemsShown,
  onPageChange,
  onPageSizeChange
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show current page with context
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);
      
      // Adjust if we're near the beginning or end
      if (currentPage <= 3) {
        endPage = Math.min(5, totalPages);
      }
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages.map((page) => (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`px-3 py-1 text-sm rounded ${
          page === currentPage
            ? 'bg-blue-600 text-white'
            : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
        }`}
      >
        {page}
      </button>
    ));
  };

  return (
    <div className="bg-white px-6 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
      {/* Items info */}
      <div className="flex items-center space-x-2 text-sm text-gray-700 mb-3 sm:mb-0">
        <span>Showing</span>
        <span className="font-medium">{startItem} - {endItem}</span>
        <span>of</span>
        <span className="font-medium">{totalItems}</span>
        <span className="hidden sm:inline">|</span>
        <span className="hidden sm:inline">Show</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="hidden sm:inline">per page</span>
      </div>
      
      {/* Navigation */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>
        
        <div className="hidden sm:flex items-center space-x-1">
          {renderPageNumbers()}
        </div>
        
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Go to</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            placeholder="Page"
            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt((e.target as HTMLInputElement).value);
                if (page >= 1 && page <= totalPages) {
                  onPageChange(page);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
