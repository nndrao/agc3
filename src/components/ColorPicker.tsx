import React, { useState, useEffect, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { useTheme } from "../context/ThemeContext";

interface ColorOption {
  name: string;
  value: string;
}

interface ColorCollection {
  name: string;
  colors: ColorOption[];
}

// Define multiple color collections
const colorCollections: ColorCollection[] = [
  {
    name: "Pastel",
    colors: [
      { name: 'Sky Blue', value: '#90cdf4' },   // Soft sky blue
      { name: 'Mint', value: '#9ae6b4' },       // Fresh mint green
      { name: 'Lavender', value: '#d6bcfa' },   // Soft lavender
      { name: 'Peach', value: '#fed7aa' },      // Gentle peach
      { name: 'Aqua', value: '#81e6d9' },       // Soft aqua/teal
      { name: 'Rose', value: '#fbb6ce' },       // Soft rose pink
      { name: 'Lilac', value: '#c4b5fd' },      // Delicate lilac
      { name: 'Coral', value: '#fed7d7' },      // Light coral
      { name: 'Butter', value: '#fef3c7' }      // Soft butter yellow
    ]
  },
  {
    name: "Vibrant",
    colors: [
      { name: 'Red', value: '#f56565' },        // Bright red
      { name: 'Orange', value: '#ed8936' },     // Vibrant orange
      { name: 'Yellow', value: '#ecc94b' },     // Bright yellow
      { name: 'Green', value: '#48bb78' },      // Vibrant green
      { name: 'Teal', value: '#38b2ac' },       // Bright teal
      { name: 'Blue', value: '#4299e1' },       // Vibrant blue
      { name: 'Indigo', value: '#667eea' },     // Rich indigo
      { name: 'Purple', value: '#9f7aea' },     // Bright purple
      { name: 'Pink', value: '#ed64a6' }        // Vibrant pink
    ]
  },
  {
    name: "Neutral",
    colors: [
      { name: 'Gray 50', value: '#f9fafb' },    // Lightest gray
      { name: 'Gray 100', value: '#f3f4f6' },   // Very light gray
      { name: 'Gray 200', value: '#e5e7eb' },   // Light gray
      { name: 'Gray 300', value: '#d1d5db' },   // Gray
      { name: 'Gray 400', value: '#9ca3af' },   // Medium gray
      { name: 'Gray 500', value: '#6b7280' },   // Medium-dark gray
      { name: 'Gray 600', value: '#4b5563' },   // Dark gray
      { name: 'Gray 700', value: '#374151' },   // Very dark gray
      { name: 'Gray 800', value: '#1f2937' }    // Almost black
    ]
  }
];

interface ColorPickerProps {
  initialColor?: string;
  onColorChange?: (color: string) => void;
}

export function ColorPicker({ initialColor, onColorChange }: ColorPickerProps) {
  const { updateAccentColor, accentColor, isDarkMode } = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activeCollection, setActiveCollection] = useState(0);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    
    // Clear any existing timeout
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    // Set a small delay for visual feedback before closing
    animationRef.current = setTimeout(() => {
      if (updateAccentColor) {
        updateAccentColor(color);
      }
      if (onColorChange) {
        onColorChange(color);
      }
      setOpen(false);
      setSelectedColor(null);
      animationRef.current = null;
    }, 300);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  // Add CSS animations
  useEffect(() => {
    if (open) {
      const styleEl = document.createElement('style');
      styleEl.id = 'color-picker-animations';
      styleEl.textContent = `
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .color-option {
          opacity: 0;
          animation: fadeInScale 0.2s ease-out forwards;
        }
        
        .color-option:nth-child(1) { animation-delay: 0.02s; }
        .color-option:nth-child(2) { animation-delay: 0.04s; }
        .color-option:nth-child(3) { animation-delay: 0.06s; }
        .color-option:nth-child(4) { animation-delay: 0.08s; }
        .color-option:nth-child(5) { animation-delay: 0.10s; }
        .color-option:nth-child(6) { animation-delay: 0.12s; }
        .color-option:nth-child(7) { animation-delay: 0.14s; }
        .color-option:nth-child(8) { animation-delay: 0.16s; }
        .color-option:nth-child(9) { animation-delay: 0.18s; }
      `;
      document.head.appendChild(styleEl);
      
      return () => {
        const existingStyle = document.getElementById('color-picker-animations');
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, [open]);

  const currentColor = accentColor || initialColor || colorCollections[0].colors[0].value;

  // Calculate contrasting text color for preview swatch label
  const getContrastTextColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Use white text for dark colors, black text for light colors
    return luminance > 0.6 ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)';
  };

  // Get the active colors from the current collection
  const activeColors = colorCollections[activeCollection].colors;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="h-5 w-5 p-0 rounded-full border transition-all duration-300 hover:scale-110 focus:scale-110"
          style={{ 
            backgroundColor: currentColor,
            borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
            boxShadow: isDarkMode 
              ? `0 0 0 1px rgba(255,255,255,0.05), 0 1px 3px rgba(0,0,0,0.2)` 
              : `0 0 0 1px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.05)`
          }}
        >
          <span className="sr-only">Pick a color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-48 p-2 rounded-lg shadow-lg"
        style={{
          backgroundColor: isDarkMode ? 'rgba(28, 28, 32, 0.95)' : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
          boxShadow: isDarkMode 
            ? '0 8px 20px rgba(0, 0, 0, 0.35)' 
            : '0 8px 20px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between mb-0.5">
            <h4 
              className="font-medium text-xs"
              style={{ 
                color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
              }}
            >
              Accent Color
            </h4>
            
            {/* Small preview swatch */}
            <div 
              className="w-3 h-3 rounded-full transition-colors duration-300"
              style={{ 
                backgroundColor: selectedColor || currentColor,
                boxShadow: `0 0 0 1px ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
              }}
            />
          </div>
          
          {/* Collection tabs */}
          <div className="flex border-b mb-1" style={{ 
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'
          }}>
            {colorCollections.map((collection, index) => (
              <button
                key={collection.name}
                onClick={() => setActiveCollection(index)}
                className={`
                  text-[9px] px-1.5 py-0.5 
                  transition-colors duration-100
                  ${activeCollection === index ? 'font-medium' : 'font-normal'}
                  ${index !== 0 ? 'ml-1' : ''}
                `}
                style={{ 
                  color: activeCollection === index 
                    ? (isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)') 
                    : (isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'),
                  borderBottom: activeCollection === index 
                    ? `1.5px solid ${currentColor}` 
                    : '1.5px solid transparent'
                }}
              >
                {collection.name}
              </button>
            ))}
          </div>
          
          {/* Color grid */}
          <div className="grid grid-cols-5 gap-1 py-0.5">
            {activeColors.map((color, index) => (
              <button
                key={color.value}
                onClick={() => handleColorSelect(color.value)}
                className={`
                  color-option
                  w-6 h-6 rounded-full cursor-pointer 
                  transition-all duration-200 
                  focus:outline-none focus:ring-1 focus:ring-offset-1
                  hover:transform hover:scale-110
                  ${selectedColor === color.value ? 'scale-90' : ''}
                  ${currentColor === color.value ? 'ring-1 ring-offset-1' : ''}
                `}
                style={{ 
                  backgroundColor: color.value,
                  boxShadow: isDarkMode
                    ? 'inset 0 0 0 1px rgba(255, 255, 255, 0.15)'
                    : 'inset 0 0 0 1px rgba(0, 0, 0, 0.05)',
                  transform: selectedColor === color.value ? 'scale(0.9)' : '',
                  opacity: selectedColor && selectedColor !== color.value ? 0.7 : 1,
                }}
                title={color.name}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
          
          <div 
            className="text-center pt-0.5"
            style={{ 
              fontSize: '8px',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'
            }}
          >
            {selectedColor 
              ? "Applying..." 
              : activeColors.find(c => c.value === currentColor)?.name || 
                colorCollections.flatMap(c => c.colors).find(c => c.value === currentColor)?.name || 
                'Select a color'
            }
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
