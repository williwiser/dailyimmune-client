import React, { useState, useCallback } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  onSearch,
  onClear,
  className = "",
  disabled = false,
  autoFocus = false,
}) => {
  const [query, setQuery] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setQuery("");
    onSearch?.("");
    onClear?.();
  }, [onSearch, onClear]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSearch?.(query);
      }
      if (e.key === "Escape") {
        handleClear();
      }
    },
    [query, onSearch, handleClear]
  );

  return (
    <div className={`relative w-full max-w-lg ${className}`}>
      <div
        className={`
        relative flex items-center
        bg-white border-1 rounded-full
        transition-all duration-200 ease-in-out
        ${isFocused ? "border-blue-500 shadow-lg" : "border-gray-300"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-gray-400"}
      `}
      >
        <Search
          className="absolute left-3 text-gray-400 transition-colors duration-200"
          size={20}
        />

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`
            w-full pl-10 pr-10 py-3
            bg-transparent border-none outline-none
            text-gray-900 placeholder-gray-500
            ${disabled ? "cursor-not-allowed" : "cursor-text"}
          `}
        />

        {query && (
          <button
            onClick={handleClear}
            disabled={disabled}
            className={`
              absolute right-3 p-1 rounded-full
              text-gray-400 hover:text-gray-600 hover:bg-gray-100
              transition-all duration-200 ease-in-out
              ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
            `}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
