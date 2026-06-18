import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Number of page buttons to show

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`glass px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed text-text-secondary"
            : "text-text-primary hover:border-primary-accent hover:text-primary-accent"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </motion.button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 sm:gap-2">
        {pageNumbers.map((page, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: page === "..." ? 1 : 1.1 }}
            whileTap={{ scale: page === "..." ? 1 : 0.95 }}
            onClick={() => page !== "..." && onPageChange(page)}
            disabled={page === "..." || page === currentPage}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-sm sm:text-base font-medium transition-all duration-300 ${
              page === currentPage
                ? "bg-gradient-to-r from-primary-accent to-secondary-accent text-background shadow-lg shadow-primary-accent/20"
                : page === "..."
                ? "text-text-secondary cursor-default"
                : "glass text-text-primary hover:border-primary-accent hover:text-primary-accent"
            }`}
          >
            {page}
          </motion.button>
        ))}
      </div>

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`glass px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed text-text-secondary"
            : "text-text-primary hover:border-primary-accent hover:text-primary-accent"
        }`}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
};

export default Pagination;
