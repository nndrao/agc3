import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// List of monospace fonts optimized for trading applications
const TRADING_FONTS = [
  { name: 'JetBrains Mono', value: 'JetBrains Mono, monospace' },
  { name: 'Fira Code', value: 'Fira Code, monospace' },
  { name: 'IBM Plex Mono', value: 'IBM Plex Mono, monospace' },
  { name: 'Roboto Mono', value: 'Roboto Mono, monospace' },
  { name: 'Inconsolata', value: 'Inconsolata, monospace' },
  { name: 'Source Code Pro', value: 'Source Code Pro, monospace' },
  { name: 'Consolas', value: 'Consolas, monospace' },
  { name: 'Monaco', value: 'Monaco, monospace' },
  { name: 'Courier New', value: 'Courier New, monospace' }
];

export function FontSelect() {
  const { fontFamily, updateFontFamily, isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the current font display name
  const currentFont = TRADING_FONTS.find(font => 
    fontFamily.includes(font.name)
  )?.name || fontFamily;

  const handleSelectFont = (fontValue: string) => {
    updateFontFamily(fontValue);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 h-7 px-2 text-xs font-medium rounded-sm ag-toolbar-btn transition-all duration-200"
        style={{
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
          fontWeight: 500,
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="max-w-[120px] truncate" style={{ fontFamily }}>
          {currentFont}
        </span>
        <ChevronDown
          className="h-3 w-3 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-48 rounded-sm py-1 shadow-lg"
          style={{
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            border: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`,
            boxShadow: isDarkMode ? 
              '0 6px 16px rgba(0, 0, 0, 0.3), 0 3px 6px rgba(0, 0, 0, 0.2)' : 
              '0 6px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.05)',
          }}
        >
          {TRADING_FONTS.map((font) => (
            <button
              key={font.name}
              className="w-full text-left px-3 py-1.5 text-xs"
              style={{ 
                backgroundColor: font.value === fontFamily ? 
                  (isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') : 
                  'transparent',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                fontFamily: font.value,
                fontWeight: 400
              }}
              onClick={() => handleSelectFont(font.value)}
            >
              <div className="flex items-center justify-between">
                <span>{font.name}</span>
                {font.value === fontFamily && (
                  <span style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)' }}>✓</span>
                )}
              </div>
              <div 
                className="mt-1 text-xs" 
                style={{ 
                  opacity: 0.7,
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
                }}
              >
                123.45 -0.67% 890.12
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 