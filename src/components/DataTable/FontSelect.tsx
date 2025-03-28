import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const FONT_OPTIONS = [
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'JetBrains Mono, monospace', label: 'JetBrains Mono' },
  { value: 'Georgia, serif', label: 'Georgia' },
];

export function FontSelect() {
  const { fontFamily, updateFontFamily } = useTheme();
  
  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFont = e.target.value;
    updateFontFamily(newFont);
    
    // Dispatch theme change event
    document.dispatchEvent(new CustomEvent('theme-changed', { 
      detail: { fontFamily: newFont } 
    }));
  };
  
  return (
    <select
      value={fontFamily}
      onChange={handleFontChange}
      className="bg-transparent border rounded px-2 py-1 text-sm"
      style={{ fontFamily }}
    >
      {FONT_OPTIONS.map((font) => (
        <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
          {font.label}
        </option>
      ))}
    </select>
  );
} 