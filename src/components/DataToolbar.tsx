import React, { useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { Maximize2, Type, RefreshCw } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { SettingsMenu } from "./SettingsMenu";
import { ColorPicker } from "./ColorPicker";

interface DataToolbarProps {
  onRefresh?: () => void;
  onAddNew?: () => void;
}

export function DataToolbar({ 
  onRefresh,
}: DataToolbarProps) {
  const { 
    spacing,
    updateSpacing,
    fontSize,
    updateFontSize,
    accentColor,
    isDarkMode
  } = useTheme();

  // Style object that uses AG Grid's CSS variables
  const toolbarStyle = useMemo(() => ({
    backgroundColor: isDarkMode ? '#181818' : '#f8f8f8',
    color: isDarkMode ? '#fff' : '#000',
    borderBottom: `1px solid ${isDarkMode ? '#444' : '#d1d5db'}`,
    borderRadius: '2px 2px 0 0'
  }), [isDarkMode]);

  // High contrast value style
  const valueStyle = useMemo(() => ({
    color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
    fontWeight: 600,
    textShadow: isDarkMode ? '0 0 1px rgba(0,0,0,0.5)' : 'none' // Better readability in dark mode
  }), [isDarkMode]);

  // Higher contrast icon style
  const iconStyle = useMemo(() => ({
    color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'
  }), [isDarkMode]);

  // Higher contrast label style
  const labelStyle = useMemo(() => ({
    color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
    fontWeight: 500
  }), [isDarkMode]);

  // Add custom stylesheet for sliders and other elements
  useEffect(() => {
    const styleId = 'ag-toolbar-custom-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    // Create styles based on current theme
    // Higher contrast slider and button styles - matching profile label colors
    const thumbColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)';
    const trackColor = isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.15)';
    const buttonTextColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)';
    const buttonHoverBg = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    const buttonHoverColor = isDarkMode ? '#ffffff' : '#000000';
    const borderColor = isDarkMode ? '#666' : '#a3a3a3'; // Higher contrast borders
    
    styleElement.textContent = `
      .ag-toolbar-slider {
        -webkit-appearance: none;
        appearance: none;
        background: ${trackColor};
        border-radius: 2px;
        height: 4px; /* Slightly thicker track */
        outline: none;
      }
      .ag-toolbar-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%; 
        background: ${thumbColor};
        cursor: pointer;
        box-shadow: 0 0 2px rgba(0,0,0,0.5); /* Add shadow for better visibility */
      }
      .ag-toolbar-slider::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: ${thumbColor};
        cursor: pointer;
        border: none;
        box-shadow: 0 0 2px rgba(0,0,0,0.5); /* Add shadow for better visibility */
      }
      .ag-toolbar-btn {
        color: ${buttonTextColor};
        background: transparent;
        font-weight: 500;
      }
      .ag-toolbar-btn:hover {
        color: ${buttonHoverColor};
        background: ${buttonHoverBg};
      }
      .color-swatch {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        border: 1px solid ${borderColor};
        cursor: pointer;
        transition: transform 0.15s ease;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2); /* Add shadow for better contrast */
      }
      .color-swatch:hover {
        transform: scale(1.1);
      }
      .toolbar-divider {
        background-color: ${borderColor};
      }
    `;
    
    return () => {
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [isDarkMode]); // Changed: Removed accentColor dependency

  return (
    <div style={toolbarStyle} className="flex flex-col">
      {/* Main toolbar */}
      <div className="flex items-center w-full px-4 h-10">
        <div className="flex items-center justify-between w-full">
          {/* Left group */}
          <div className="flex items-center gap-4">
            {/* Color */}
            <div className="flex items-center gap-2">
              <span className="text-xs" style={labelStyle}>Color:</span>
              <ColorPicker initialColor={accentColor} />
            </div>
            
            {/* Divider */}
            <div className="h-5 w-px toolbar-divider"></div>
            
            {/* Refresh Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRefresh}
              className="h-7 px-2 text-xs font-medium rounded-sm ag-toolbar-btn"
              style={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                fontWeight: 500
              }}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              <span>Refresh</span>
            </Button>
          </div>
          
          {/* Center group - controls */}
          <div className="flex items-center gap-6">
            {/* Spacing Control */}
            <div className="flex items-center gap-3">
              <Maximize2 className="h-3.5 w-3.5" style={iconStyle} />
              <input
                type="range"
                min="4"
                max="24"
                step="1"
                value={spacing}
                onChange={(e) => updateSpacing(parseInt(e.target.value, 10))}
                className="w-24 ag-toolbar-slider"
              />
              <span className="text-xs min-w-[25px] text-center" style={valueStyle}>{spacing}px</span>
            </div>
            
            {/* Font Size Control */}
            <div className="flex items-center gap-3">
              <Type className="h-3.5 w-3.5" style={iconStyle} />
              <input
                type="range"
                min="10"
                max="18"
                step="1"
                value={fontSize}
                onChange={(e) => updateFontSize(parseInt(e.target.value, 10))}
                className="w-24 ag-toolbar-slider"
              />
              <span className="text-xs min-w-[28px] text-center" style={valueStyle}>{fontSize}px</span>
            </div>
          </div>
          
          {/* Right group - presets */}
          <div className="flex items-center">
            <SettingsMenu />
          </div>
        </div>
      </div>
    </div>
  );
}