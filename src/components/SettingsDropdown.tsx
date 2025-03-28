import React, { useState } from 'react';
import { Settings, ChevronDown, Sliders, Columns, Layers, Calculator, Palette, Zap, Filter, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../context/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { GeneralSettingsDialog } from "./GeneralSettingsDialog";

interface SettingsDropdownProps {
  className?: string;
}

export function SettingsDropdown({ className }: SettingsDropdownProps) {
  const { isDarkMode } = useTheme();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showGeneralSettings, setShowGeneralSettings] = useState(false);

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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Open settings menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowGeneralSettings(true)}>
            General Settings
          </DropdownMenuItem>
          <DropdownMenuItem>Keyboard Shortcuts</DropdownMenuItem>
          <DropdownMenuItem>About</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <GeneralSettingsDialog 
        open={showGeneralSettings} 
        onOpenChange={setShowGeneralSettings} 
      />
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
    </>
  );
} 