'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchOption {
  id: string;
  label: string;
  type?: string;
}

interface SearchSelectProps {
  options: SearchOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchSelect({ options, value, onChange, placeholder = 'Search...', className }: SearchSelectProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.id === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHighlightedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
      case 'Tab':
        if (filteredOptions[highlightedIndex]) {
          e.preventDefault();
          onChange(filteredOptions[highlightedIndex].id);
          setQuery('');
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <div 
        className="relative flex items-center w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 cursor-text"
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
        {selectedOption && !isOpen ? (
          <div className="flex-1 truncate">
            {selectedOption.type === 'unit' ? '📚 ' : selectedOption.type === 'topic' ? '📄 ' : '- '}
            {selectedOption.label}
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            className="flex-1 outline-none bg-transparent min-w-0"
            placeholder={selectedOption ? selectedOption.label : placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
          />
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-slate-500">No results found.</div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.id}
                className={cn(
                  "cursor-pointer px-3 py-2 text-sm flex items-center gap-2",
                  highlightedIndex === index ? "bg-indigo-50 text-indigo-900" : "text-slate-700 hover:bg-slate-50"
                )}
                onClick={() => {
                  onChange(option.id);
                  setQuery('');
                  setIsOpen(false);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <span className="shrink-0 text-slate-400">
                  {option.type === 'unit' ? '📚' : option.type === 'topic' ? '📄' : '•'}
                </span>
                <span className="truncate">{option.label}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
