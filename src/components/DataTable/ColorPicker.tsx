import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const PRESET_COLORS = [
  '#8AAAA7', // Default teal
  '#5D8CAE', // Blue
  '#6B7280', // Gray
  '#8B5CF6', // Purple
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
];

export function ColorPicker() {
  const { accentColor, updateAccentColor } = useTheme();
  
  const handleColorChange = (color: string) => {
    updateAccentColor(color);
    
    // Dispatch theme change event
    document.dispatchEvent(new CustomEvent('theme-changed', { 
      detail: { accentColor: color } 
    }));
  };
  
  return (
    <div className="flex gap-1">
      {PRESET_COLORS.map((color) => (
        <div
          key={color}
          className="color-swatch"
          style={{ 
            backgroundColor: color,
            border: color === accentColor ? '2px solid white' : '1px solid transparent',
            boxShadow: color === accentColor ? '0 0 0 1px rgba(0,0,0,0.2)' : 'none'
          }}
          onClick={() => handleColorChange(color)}
        />
      ))}
    </div>
  );
} 