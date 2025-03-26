import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { useTheme } from "../context/ThemeContext";

interface ColorOption {
  name: string;
  value: string;
}

// Predefined color options suitable for trading/financial apps
const colorOptions: ColorOption[] = [
  { name: 'Blue', value: '#2563eb' },  // Blue-600
  { name: 'Indigo', value: '#4f46e5' }, // Indigo-600
  { name: 'Purple', value: '#7c3aed' }, // Purple-600
  { name: 'Green', value: '#16a34a' },  // Green-600
  { name: 'Teal', value: '#0d9488' },   // Teal-600
  { name: 'Cyan', value: '#0891b2' },   // Cyan-600
  { name: 'Orange', value: '#ea580c' }, // Orange-600
  { name: 'Red', value: '#dc2626' },    // Red-600
  { name: 'Gray', value: '#4b5563' },   // Gray-600
];

interface ColorPickerProps {
  initialColor?: string;
  onColorChange?: (color: string) => void;
}

export function ColorPicker({ initialColor, onColorChange }: ColorPickerProps) {
  const { updateAccentColor, accentColor } = useTheme();
  const [open, setOpen] = useState(false);
  
  const handleColorSelect = (color: string) => {
    if (updateAccentColor) {
      updateAccentColor(color);
    }
    if (onColorChange) {
      onColorChange(color);
    }
    setOpen(false);
  };

  const currentColor = accentColor || initialColor || colorOptions[0].value;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-10 h-10 p-0 border-2"
          style={{ backgroundColor: currentColor }}
        >
          <span className="sr-only">Pick a color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="flex flex-col space-y-2">
          <h4 className="font-medium text-sm">Grid Accent Color</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorSelect(color.value)}
                className={`w-6 h-6 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentColor === color.value ? 'ring-2 ring-offset-2 ring-black dark:ring-white' : ''}`}
                style={{ backgroundColor: color.value, boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.1)' }}
                title={color.name}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
