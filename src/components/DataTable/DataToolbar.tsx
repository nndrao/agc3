import React, { useEffect, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import { RefreshCw } from "lucide-react";
import { ColorPicker } from "./ColorPicker";
import { FontSelect } from "./FontSelect";
import { SettingsDropdown } from "./SettingsDropdown";

interface DataToolbarProps {
  onRefresh?: () => void;
}

export function DataToolbar({ 
  onRefresh,
}: DataToolbarProps) {
  const { 
    spacing,
    updateSpacing,
    fontSize,
    updateFontSize,
    isDarkMode
  } = useTheme();

  // Style object that uses AG Grid's CSS variables
  const toolbarStyle = useMemo(() => ({
    backgroundColor: isDarkMode ? 'rgba(24, 24, 24, 0.8)' : 'rgba(248, 248, 248, 0.8)',
    backdropFilter: 'blur(8px)',
    color: isDarkMode ? '#fff' : '#000',
    borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
    borderRadius: '8px 8px 0 0',
    boxShadow: isDarkMode 
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
      : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    position: 'relative' as const,
    zIndex: 10
  }), [isDarkMode]);

  // High contrast value style
  const valueStyle = useMemo(() => ({
    color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
    fontWeight: 600,
    textShadow: isDarkMode ? '0 0 1px rgba(0,0,0,0.5)' : 'none'
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
    const thumbColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)';
    const trackColor = isDarkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.15)';
    const buttonTextColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)';
    const buttonHoverBg = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    const buttonHoverColor = isDarkMode ? '#ffffff' : '#000000';
    const borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    styleElement.textContent = `
      .ag-toolbar-slider {
        -webkit-appearance: none;
        appearance: none;
        background: ${trackColor};
        border-radius: 4px;
        height: 4px;
        outline: none;
        transition: all 0.2s ease;
      }
      .ag-toolbar-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: ${thumbColor};
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        transition: all 0.2s ease;
      }
      .ag-toolbar-slider::-webkit-slider-thumb:hover {
        transform: scale(1.1);
      }
      .ag-toolbar-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: ${thumbColor};
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        transition: all 0.2s ease;
      }
      .ag-toolbar-slider::-moz-range-thumb:hover {
        transform: scale(1.1);
      }
      .ag-toolbar-btn {
        color: ${buttonTextColor};
        background: transparent;
        font-weight: 500;
        transition: all 0.2s ease;
        border-radius: 4px;
      }
      .ag-toolbar-btn:hover {
        color: ${buttonHoverColor};
        background: ${buttonHoverBg};
        transform: translateY(-1px);
      }
      .color-swatch {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        border: 2px solid ${borderColor};
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .color-swatch:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      }
      .toolbar-divider {
        background-color: ${borderColor};
        height: 24px;
        width: 1px;
        margin: 0 8px;
      }
      /* Ensure dropdowns appear above ag-grid */
      .settings-dropdown,
      .settings-menu {
        position: relative;
        z-index: 100;
      }
      .settings-dropdown [role="menu"],
      .settings-menu [role="menu"] {
        z-index: 1000;
      }
      
      /* Custom styling for cell alignment and colors */
      .ag-right-aligned-cell {
        text-align: right;
      }
      
      .ag-right-aligned-header {
        text-align: right;
      }
      
      .ag-cell-positive {
        color: #00FFBA;
        background-color: rgba(0, 255, 186, 0.1);
      }
      
      .ag-cell-negative {
        color: #FF3B3B;
        background-color: rgba(255, 59, 59, 0.1);
      }
      
      /* Force font size on cells */
      .ag-theme-quartz,
      .ag-theme-quartz-dark {
        --ag-font-size: ${fontSize}px !important;
        font-size: ${fontSize}px !important;
      }
      
      .ag-theme-quartz .ag-header-cell,
      .ag-theme-quartz-dark .ag-header-cell,
      .ag-theme-quartz .ag-header-group-cell,
      .ag-theme-quartz-dark .ag-header-group-cell {
        font-size: ${fontSize}px !important;
      }
      
      .ag-theme-quartz .ag-cell,
      .ag-theme-quartz-dark .ag-cell {
        font-size: ${fontSize}px !important;
      }
    `;
    
    return () => {
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [isDarkMode, fontSize]);

  // Add CSS for spacing variables
  useEffect(() => {
    const styleId = 'ag-grid-spacing-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    // Force spacing variables with !important
    styleElement.textContent = `
      .ag-theme-quartz,
      .ag-theme-quartz-dark {
        --ag-grid-size: ${spacing}px !important;
        --ag-cell-horizontal-padding: ${spacing}px !important;
        --ag-row-height: ${spacing * 3}px !important;
        --ag-header-height: ${spacing * 3}px !important;
      }
    `;
    
    return () => {
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [spacing]);

  // Remove the font and spacing application useEffects since they're now controlled by theme directly

  return (
    <div style={toolbarStyle} className="flex flex-col">
      {/* Main toolbar */}
      <div className="flex items-center w-full px-6 h-12">
        <div className="flex items-center justify-between w-full">
          {/* Left group */}
          <div className="flex items-center gap-6">
            {/* Color */}
            <div className="flex items-center gap-3">
              <span className="text-sm" style={labelStyle}>Color</span>
              <ColorPicker />
            </div>
            
            {/* Divider */}
            <div className="toolbar-divider"></div>
            
            {/* Font selector */}
            <div className="flex items-center gap-3">
              <span className="text-sm" style={labelStyle}>Font</span>
              <FontSelect />
            </div>
            
            {/* Divider */}
            <div className="toolbar-divider"></div>
            
            {/* Font Size slider */}
            <div className="flex items-center gap-3">
              <span className="text-sm" style={labelStyle}>Size</span>
              <input
                type="range"
                className="ag-toolbar-slider w-24"
                min="6"
                max="18"
                step="1"
                value={fontSize}
                onChange={(e) => {
                  const newSize = parseInt(e.target.value);
                  console.log('Font size changed:', newSize);
                  updateFontSize(newSize);
                  
                  // Dispatch event to notify grid of theme changes
                  document.dispatchEvent(new CustomEvent('theme-changed', {
                    detail: { fontSize: newSize, forceRedraw: true }
                  }));
                }}
              />
              <span className="text-xs" style={valueStyle}>{fontSize}px</span>
            </div>
            
            {/* Divider */}
            <div className="toolbar-divider"></div>
            
            {/* Spacing slider */}
            <div className="flex items-center gap-3">
              <span className="text-sm" style={labelStyle}>Spacing</span>
              <input
                type="range"
                className="ag-toolbar-slider w-24"
                min="4"
                max="16"
                step="1"
                value={spacing}
                onChange={(e) => {
                  const newSpacing = parseInt(e.target.value);
                  console.log('Spacing changed:', newSpacing);
                  updateSpacing(newSpacing);
                  
                  // Dispatch event to notify grid of theme changes
                  document.dispatchEvent(new CustomEvent('theme-changed', {
                    detail: { 
                      spacing: newSpacing,
                      rowHeight: newSpacing * 3,
                      headerHeight: newSpacing * 3,
                      forceRedraw: true
                    }
                  }));
                }}
              />
              <span className="text-xs" style={valueStyle}>{spacing}px</span>
            </div>
            
            {/* Divider */}
            <div className="toolbar-divider"></div>
            
            {/* Refresh Button */}
            <button 
              onClick={onRefresh}
              className="h-8 px-3 text-sm font-medium rounded-md ag-toolbar-btn flex items-center"
              style={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                fontWeight: 500
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Right group */}
          <div className="flex items-center gap-2">
            {/* Settings menu */}
            <SettingsDropdown />
          </div>
        </div>
      </div>
    </div>
  );
} 