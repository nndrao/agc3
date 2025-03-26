import React, { useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { Maximize2, Type, RefreshCw } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { SettingsMenu } from "./SettingsMenu";

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
    backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
    color: isDarkMode ? '#fff' : '#333',
    borderBottom: `1px solid ${isDarkMode ? '#333' : '#e5e7eb'}`,
    borderRadius: '2px 2px 0 0'
  }), [isDarkMode]);

  const valueStyle = useMemo(() => ({
    color: accentColor || '#3b82f6', // Blue accent for values
    fontWeight: 500
  }), [accentColor]);

  const iconStyle = useMemo(() => ({
    color: isDarkMode ? '#aaa' : '#666'
  }), [isDarkMode]);

  const labelStyle = useMemo(() => ({
    color: isDarkMode ? '#aaa' : '#666'
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
    const thumbColor = accentColor || '#3b82f6';
    const trackColor = isDarkMode ? '#333' : '#e5e7eb';
    const buttonTextColor = isDarkMode ? '#aaa' : '#666';
    const buttonHoverBg = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    const buttonHoverColor = isDarkMode ? 'white' : 'black';
    const borderColor = isDarkMode ? '#444' : '#d1d5db';
    
    styleElement.textContent = `
      .ag-toolbar-slider {
        -webkit-appearance: none;
        appearance: none;
        background: ${trackColor};
        border-radius: 2px;
        height: 3px;
        outline: none;
      }
      .ag-toolbar-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px;
        height: 12px;
        border-radius: 50%; 
        background: ${thumbColor};
        cursor: pointer;
      }
      .ag-toolbar-slider::-moz-range-thumb {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: ${thumbColor};
        cursor: pointer;
        border: none;
      }
      .ag-toolbar-btn {
        color: ${buttonTextColor};
        background: transparent;
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
  }, [isDarkMode, accentColor]);

  return (
    <div style={toolbarStyle} className="flex flex-col">
      {/* Main toolbar */}
      <div className="flex items-center w-full px-4 h-10">
        <div className="flex items-center justify-between w-full">
          {/* Left group */}
          <div className="flex items-center gap-4">
            {/* Color */}
            <div className="flex items-center gap-2">
              <span className="text-xs" style={labelStyle}>Color</span>
              <div className="color-swatch" style={{ backgroundColor: accentColor || '#3b82f6' }}></div>
            </div>
            
            {/* Divider */}
            <div className="h-5 w-px toolbar-divider"></div>
            
            {/* Refresh Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRefresh}
              className="h-7 px-2 text-xs font-medium rounded-sm ag-toolbar-btn"
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