import { useState, useEffect } from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const [inputValue, setInputValue] = useState(currentPage.toString());

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

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      const value = parseInt(inputValue);
      if (value >= 1 && value <= totalPages) {
        onPageChange(value);
      } else {
        setInputValue(currentPage.toString());
      }
    }
  };

  // Update input value when currentPage changes from parent
  useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  return (
    <div className="pagination flex items-center justify-center gap-3 py-8">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="cursor-pointer rounded-full bg-gray-700 h-10 w-10 disabled:opacity-50 disabled:cursor-not-allowed text-white hover:text-mainblue transition-colors"
      >
        <i className="fa-solid fa-chevron-left text-lg"></i>
      </button>

      <div className="flex bg-gray-700 items-center justify-center h-10 rounded-full p-6 text-white">
        {/* Page Label */}
        <span className="text-sm">Trang</span>

        {/* Page Input */}
        <input
          type="number"
          min="1"
          max={totalPages}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          className="w-12 h-8 mx-2 px-2 py-1 bg-gray-800 text-white border border-gray-600 text-center rounded text-sm focus:outline-none focus:ring-1 focus:ring-mainblue appearance-none"
          style={{
            WebkitAppearance: 'textfield',
            MozAppearance: 'textfield'
          }}
        />

        {/* Total Pages */}
        <span className="text-sm">/ {totalPages}</span>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        className="cursor-pointer rounded-full bg-gray-700 h-10 w-10 disabled:opacity-50 disabled:cursor-not-allowed text-white hover:text-mainblue transition-colors"
      >
        <i className="fa-solid fa-chevron-right text-lg"></i>
      </button>
    </div>
  );
}

export default Pagination;
