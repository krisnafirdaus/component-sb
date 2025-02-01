import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface DropdownOption {
  value: string;
  [key: string]: any;
}

interface DropdownProps {
  id?: string;
  label?: string;
  options: DropdownOption[];
  multiple?: boolean;
  withSearch?: boolean;
  withPortal?: boolean;
  optionLabel?: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  className?: string;
  zIndex?: number;
  renderOption?: (option: DropdownOption, isSelected: boolean) => React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  multiple = false,
  withSearch = true,
  withPortal = true,
  optionLabel = 'label',
  className = '',
  zIndex = 1000,
  renderOption
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;

      // Check if dropdown should open upward
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const shouldOpenUpward = spaceBelow < 260 && spaceAbove > spaceBelow;

      setPosition({
        top: shouldOpenUpward 
          ? rect.top + scrollY - (menuRef.current?.offsetHeight || 0) - 4
          : rect.bottom + scrollY + 4,
        left: rect.left + scrollX
      });
    }
  }, [isOpen]);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    String(option[optionLabel] || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected options
  const selectedOptions = options.filter(option => 
    Array.isArray(value)
      ? value.includes(option.value)
      : option.value === value
  );

  const handleOptionSelect = (optionValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const index = currentValues.indexOf(optionValue);
      if (index === -1) {
        onChange([...currentValues, optionValue]);
      } else {
        onChange(currentValues.filter(v => v !== optionValue));
      }
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleRemoveSelected = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      const newValue = (value as string[]).filter(v => v !== optionValue);
      onChange(newValue);
    } else {
      onChange('');
    }
  };

  const clearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  // Highlight matching text in options
  const highlightMatch = (text: string, search: string) => {
    if (!search) return text;
    
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === search.toLowerCase() ? (
            <span key={i} className="bg-green-200">{part}</span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  // Default option renderer
  const defaultRenderOption = (option: DropdownOption, isSelected: boolean) => (
    <div
      key={option.value}
      className={`px-4 py-3 text-sm cursor-pointer hover:bg-green-50 ${
        isSelected && 'bg-green-100'
      }`}
      onClick={() => handleOptionSelect(option.value)}
    >
      {highlightMatch(option[optionLabel], searchTerm)}
    </div>
  );

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Menu Component
  const Menu = (
    <div 
      ref={menuRef}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        width: containerRef.current?.offsetWidth,
        zIndex
      }}
      className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
    >
      {withSearch && (
        <div className="p-2 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              ref={searchInputRef}
              type="text"
              className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="max-h-60 overflow-y-auto">
        {filteredOptions.map((option) => {
          const isSelected = Array.isArray(value)
            ? value.includes(option.value)
            : value === option.value;
            
          return renderOption 
            ? renderOption(option, isSelected)
            : defaultRenderOption(option, isSelected);
        })}
        {filteredOptions.length === 0 && (
          <div className="px-4 py-3 text-sm text-gray-500">
            No options found
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-4">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 min-w-[100px]">
          {label}
        </label>
      )}
      <div 
        className={`relative flex-1 ${className}`} 
        ref={containerRef}
      >
        <div
          id={id}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className="w-full min-h-[42px] flex items-center flex-wrap gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex-1 flex items-center flex-wrap gap-2">
            {selectedOptions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedOptions.map((option) => (
                  <span 
                    key={option.value}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md"
                  >
                    {option[optionLabel]}
                    <button
                      onClick={(e) => handleRemoveSelected(option.value, e)}
                      className="p-0.5 hover:bg-gray-200 rounded-full"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-500">Select...</span>
            )}
          </div>
          {isOpen ? (
            <ChevronUp className="text-gray-400" size={20} />
          ) : (
            <ChevronDown className="text-gray-400" size={20} />
          )}
        </div>
        
        {isOpen && (
          withPortal 
            ? createPortal(Menu, document.body)
            : Menu
        )}
      </div>
    </div>
  );
};

export default Dropdown;