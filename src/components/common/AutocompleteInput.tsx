import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check, X, PlusCircle, AlertCircle } from 'lucide-react';

export interface AutocompleteItem {
  label: string;
  value: string;
  subtitle?: string;
  badge?: string;
  category?: string;
}

interface AutocompleteInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: Array<string | AutocompleteItem>;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Type to search...',
  required = false,
  helperText,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Normalize options to AutocompleteItem
  const normalizedOptions: AutocompleteItem[] = options.map((opt) => {
    if (typeof opt === 'string') {
      return { label: opt, value: opt };
    }
    return opt;
  });

  // Filter options based on user input
  const query = value.trim().toLowerCase();
  const filteredOptions = query.length > 0
    ? normalizedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(query) ||
        (opt.subtitle && opt.subtitle.toLowerCase().includes(query)) ||
        (opt.badge && opt.badge.toLowerCase().includes(query))
      )
    : normalizedOptions.slice(0, 15); // Show first 15 when focused

  const exactMatch = normalizedOptions.some(
    (opt) => opt.value.toLowerCase() === query || opt.label.toLowerCase() === query
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[highlightedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleSelectOption = (selected: AutocompleteItem) => {
    onChange(selected.value);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === 'Enter') {
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        e.preventDefault();
        handleSelectOption(filteredOptions[highlightedIndex]);
      } else if (isOpen && query.length > 0 && !exactMatch) {
        e.preventDefault();
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="relative space-y-1">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {value && (
          <span className="text-[10px] text-slate-400 font-mono">
            {exactMatch ? 'Configured in dataset' : 'Manual Entry'}
          </span>
        )}
      </div>

      <div className="relative">
        {icon ? (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        ) : (
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        )}

        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full text-xs pl-9 pr-14 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all shadow-2xs font-medium text-slate-800"
          autoComplete="off"
        />

        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setIsOpen(true);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Clear entry"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            tabIndex={-1}
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      )}

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-1">
          <div className="p-2 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between text-[11px] text-slate-500 px-3">
            <span>
              {query
                ? `Matching ${label.toLowerCase()}s (${filteredOptions.length})`
                : `Suggested ${label.toLowerCase()}s`}
            </span>
            <span className="text-[10px] text-slate-400">Use &uarr;&darr; keys to navigate</span>
          </div>

          <ul ref={listRef} className="max-h-64 overflow-y-auto py-1 text-xs divide-y divide-slate-50">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => {
                const isSelected = value.toLowerCase() === option.value.toLowerCase();
                const isHighlighted = idx === highlightedIndex;

                return (
                  <li
                    key={idx}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => handleSelectOption(option)}
                    className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isHighlighted
                        ? 'bg-indigo-50 text-indigo-900 font-semibold'
                        : isSelected
                        ? 'bg-indigo-50/50 text-indigo-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0 pr-2 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium text-slate-900">{option.label}</span>
                        {option.badge && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      {option.subtitle && (
                        <p className="text-[11px] text-slate-500 truncate">{option.subtitle}</p>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-indigo-600 shrink-0 ml-2" />
                    )}
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-3 text-center text-slate-500 space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-slate-400 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>No matching {label.toLowerCase()} found</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Select "Enter manually" below to use your custom entry.
                </p>
              </li>
            )}
          </ul>

          {/* Manual Entry Option */}
          {value.trim().length > 0 && !exactMatch && (
            <div className="p-2 border-t border-slate-100 bg-slate-50">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 rounded-xl bg-white hover:bg-indigo-50/70 border border-slate-200 text-left text-xs font-semibold text-indigo-700 flex items-center justify-between transition-colors shadow-2xs cursor-pointer group"
              >
                <div className="flex items-center gap-2 truncate">
                  <PlusCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">
                    Enter manually: <strong>"{value.trim()}"</strong>
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 shrink-0">
                  Custom
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
