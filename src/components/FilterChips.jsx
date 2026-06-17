// فیلرتر چب میسازه
// برای فیلتر ها
import { useRef } from "react";
import { motion } from "framer-motion";

const FilterChips = ({ options, selected, onSelect, label }) => {
  const scrollRef = useRef(null);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-secondary">
        {label}
      </label>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {options.map((option) => (
          <motion.button
            key={option}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(option)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              selected === option
                ? "bg-primary-accent text-background"
                : "bg-card-background border border-border text-text-secondary hover:border-primary-accent"
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default FilterChips;
