import React, { useMemo } from "react";
import { Button } from "./ui/button";
import { Maximize2, Type, Plus, RefreshCw, Palette } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { ColorPicker } from "./ColorPicker";

interface DataToolbarProps {
  onRefresh?: () => void;
  onAddNew?: () => void;
}

type PartSelectorProps<T extends { id: string } | null> = {
  options: T[];
  value: T;
  setValue: (value: T) => void;
  label?: string;
};

// Simple theme selector component
const ThemeSelector = <T extends { id: string; label?: string } | null>({
  options,
  value,
  setValue,
  label
}: PartSelectorProps<T>) => (
  <div className="flex items-center gap-2">
    {label && <span className="text-sm">{label}:</span>}
    <select
      className="rounded px-2 py-1 text-sm border"
      onChange={(e) =>
        setValue(options.find((t) => t?.id === e.currentTarget.value)! || null)
      }
      value={value?.id}
      style={{ 
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        borderColor: 'var(--border)'
      }}
    >
      {options.map((option, i) => (
        <option key={i} value={option?.id}>
          {option?.label || option?.id || "(unchanged)"}
        </option>
      ))}
    </select>
  </div>
);

export function DataToolbar({ 
  onRefresh, 
  onAddNew,
}: DataToolbarProps) {
  const { 
    currentTheme,
    allThemes,
    updateTheme,
    spacing,
    updateSpacing,
    fontSize,
    updateFontSize
  } = useTheme();

  // Get current theme colors for styling
  const getColor = (variable: string): string => {
    return getComputedStyle(document.documentElement).getPropertyValue(variable);
  };

  // Colors for UI elements
  const colors = useMemo(() => ({
    background: getColor('--background') || '#ffffff',
    backgroundSecondary: getColor('--secondary-background') || '#f8f9fa',
    text: getColor('--foreground') || '#181d1f',
    border: getColor('--border') || '#dde2eb',
    accent: getColor('--accent') || '#00c2a8',
  }), []);

  // Set custom CSS variables based on the selected theme
  useMemo(() => {
    document.documentElement.style.setProperty('--background', colors.background);
    document.documentElement.style.setProperty('--foreground', colors.text);
    document.documentElement.style.setProperty('--border', colors.border);
  }, [colors.background, colors.text, colors.border]);

  return (
    <div 
      className="flex flex-col rounded-t-md overflow-hidden p-3"
      style={{ backgroundColor: colors.background }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          {/* Theme Selector removed */}
          
          {/* Spacing Control */}
          <div className="flex items-center gap-2">
            <Maximize2 className="h-4 w-4" style={{ color: colors.text }} />
            <span className="text-sm" style={{ color: colors.text }}>Spacing:</span>
            <input
              type="range"
              min="4"
              max="24"
              step="1"
              defaultValue="8"
              value={spacing}
              onChange={(e) => updateSpacing(parseInt(e.target.value, 10))}
              className="w-24"
            />
            <span className="text-sm min-w-8 text-center" style={{ color: colors.text }}>
              {spacing}
            </span>
          </div>
          
          {/* Font Size Control */}
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4" style={{ color: colors.text }} />
            <span className="text-sm" style={{ color: colors.text }}>Font:</span>
            <input
              type="range"
              min="10"
              max="18"
              step="1"
              defaultValue="13"
              value={fontSize}
              onChange={(e) => updateFontSize(parseInt(e.target.value, 10))}
              className="w-24"
            />
            <span className="text-sm min-w-12 text-center" style={{ color: colors.text }}>
              {fontSize}px
            </span>
          </div>
          
          {/* Accent Color Picker */}
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" style={{ color: colors.text }} />
            <span className="text-sm" style={{ color: colors.text }}>Color:</span>
            <ColorPicker />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRefresh}
            className="flex items-center gap-1 px-3 py-1 rounded"
            style={{ 
              color: colors.text,
              borderColor: colors.border 
            }}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="text-xs">Refresh</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onAddNew}
            className="flex items-center gap-1 px-3 py-1 rounded"
            style={{ 
              color: colors.text,
              borderColor: colors.border 
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="text-xs">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
} 