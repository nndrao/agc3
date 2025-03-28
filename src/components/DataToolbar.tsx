import React, { useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { Maximize2, Type, RefreshCw } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { SettingsMenu } from "./SettingsMenu";
import { ColorPicker } from "./ColorPicker";
import { FontSelect } from "./FontSelect";
import { SettingsDropdown } from "./SettingsDropdown";

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
    fontFamily,
    updateFontFamily,
    accentColor,
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
    `;
    
    return () => {
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [isDarkMode]);

  // Apply selected font to AG Grid
  useEffect(() => {
    const rootEl = document.documentElement;
    if (rootEl) {
      rootEl.style.setProperty('--ag-font-family', fontFamily);
      
      // Also set a data attribute that can be used for styling
      rootEl.setAttribute('data-font', fontFamily.split(',')[0].trim());
      
      // Apply font to custom elements (like inputs, etc)
      const styleId = 'ag-grid-font-styles';
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      
      styleElement.textContent = `
        .ag-theme-quartz,
        .ag-theme-quartz-dark {
          --ag-font-family: ${fontFamily};
          font-family: ${fontFamily};
        }
        
        .ag-theme-quartz .ag-header-cell,
        .ag-theme-quartz-dark .ag-header-cell {
          font-family: ${fontFamily};
        }
        
        .ag-theme-quartz .ag-cell,
        .ag-theme-quartz-dark .ag-cell {
          font-family: ${fontFamily};
        }
        
        .ag-theme-quartz input,
        .ag-theme-quartz-dark input {
          font-family: ${fontFamily};
        }
      `;
    }
  }, [fontFamily]);

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
              <ColorPicker initialColor={accentColor} />
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
            
            {/* Refresh Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRefresh}
              className="h-8 px-3 text-sm font-medium rounded-md ag-toolbar-btn"
              style={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                fontWeight: 500
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              <span>Refresh</span>
            </Button>
          </div>
          
          {/* Center group - controls */}
          <div className="flex items-center gap-8">
            {/* Spacing Control */}
            <div className="flex items-center gap-4">
              <Maximize2 className="h-4 w-4" style={iconStyle} />
              <input
                type="range"
                min="4"
                max="24"
                step="1"
                value={spacing}
                onChange={(e) => updateSpacing(parseInt(e.target.value, 10))}
                className="w-32 ag-toolbar-slider"
              />
              <span className="text-sm min-w-[30px] text-center" style={valueStyle}>{spacing}px</span>
            </div>
            
            {/* Font Size Control */}
            <div className="flex items-center gap-4">
              <Type className="h-4 w-4" style={iconStyle} />
              <input
                type="range"
                min="10"
                max="18"
                step="1"
                value={fontSize}
                onChange={(e) => updateFontSize(parseInt(e.target.value, 10))}
                className="w-32 ag-toolbar-slider"
              />
              <span className="text-sm min-w-[35px] text-center" style={valueStyle}>{fontSize}px</span>
            </div>
          </div>

          {/* Right group */}
          <div className="flex items-center gap-3">
            <SettingsMenu />
            <SettingsDropdown />
          </div>
        </div>
      </div>
    </div>
  );
}