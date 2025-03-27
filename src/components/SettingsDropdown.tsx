import React from 'react';
import { Settings, ChevronDown, Sliders, Columns, Layers, Calculator, Palette, Zap, Filter, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';

interface SettingsDropdownProps {
  className?: string;
}

export function SettingsDropdown({ className }: SettingsDropdownProps) {
  const { isDarkMode } = useTheme();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const menuItems = [
    { icon: Sliders, label: 'General Settings' },
    { icon: Columns, label: 'Column Customization' },
    { icon: Layers, label: 'Column Groups' },
    { icon: Calculator, label: 'Calculated Columns' },
    { icon: Palette, label: 'Conditional Styling' },
    { icon: Zap, label: 'Cell Flashing Rules' },
    { icon: Filter, label: 'Named Filters' },
    { icon: Edit, label: 'Editing Rules' },
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="ag-toolbar-btn transition-all duration-200"
        style={{
          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
          background: showDropdown 
            ? (isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)') 
            : 'transparent',
          height: '28px',
          padding: '0 12px',
          fontSize: '12px',
          borderRadius: '3px',
          fontWeight: 500,
          border: isDarkMode 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: showDropdown 
            ? (isDarkMode ? '0 0 0 1px rgba(255, 255, 255, 0.1)' : '0 0 0 1px rgba(0, 0, 0, 0.05)')
            : 'none',
        }}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Settings className="h-3.5 w-3.5 mr-1.5" />
        <span>Settings</span>
        <ChevronDown 
          className="h-3 w-3 ml-1 transition-transform duration-300" 
          style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0)' }}
        />
      </Button>

      {showDropdown && (
        <>
          <div 
            className="absolute right-0 top-8 w-48 py-1 rounded-md shadow-lg z-50"
            style={{
              backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
              border: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`,
              boxShadow: isDarkMode ? 
                '0 6px 16px rgba(0, 0, 0, 0.3), 0 3px 6px rgba(0, 0, 0, 0.2)' : 
                '0 6px 16px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.05)',
            }}
          >
            {menuItems.map((item, index) => (
              <button
                key={item.label}
                className="w-full px-3 py-1.5 text-left text-xs flex items-center hover:bg-opacity-10 transition-colors"
                style={{
                  color: isDarkMode ? '#e0e0e0' : '#333',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => {
                  // Handle menu item click
                  console.log(`Clicked: ${item.label}`);
                  setShowDropdown(false);
                }}
              >
                <item.icon className="h-3.5 w-3.5 mr-2" style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }} />
                {item.label}
              </button>
            ))}
          </div>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
        </>
      )}
    </div>
  );
} 