import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  themeAlpine, 
  themeQuartz, 
  themeBalham, 
  themeMaterial
} from 'ag-grid-community';
import type { Theme } from 'ag-grid-community';

export interface GridSettings {
  id: string;
  name: string;
  spacing: number;
  fontSize: number;
  fontFamily: string;
  accentColor: string;
  isDarkMode: boolean;
  columnState?: any;
  filterModel?: any;
  sortModel?: any;
}

interface ThemeOption {
  id: string;
  label: string;
  theme: Theme;
}

interface ThemeContextType {
  currentTheme: ThemeOption;
  updateTheme: (theme: ThemeOption) => void;
  spacing: number;
  updateSpacing: (value: number) => void;
  fontSize: number;
  updateFontSize: (value: number) => void;
  fontFamily: string;
  updateFontFamily: (value: string) => void;
  accentColor: string;
  updateAccentColor: (value: string) => void;
  allThemes: ThemeOption[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  savedSettings: GridSettings[];
  saveSettings: (name: string) => string; // Returns the ID of the new setting
  updateSettings: (id: string, newName?: string) => void; // Update existing setting
  deleteSettings: (id: string) => void; // Delete a setting
  loadSettings: (settingsId: string) => void;
}

// Define available themes
const themes: ThemeOption[] = [
  { id: 'quartz', label: 'Quartz', theme: themeQuartz },
  { id: 'alpine', label: 'Alpine', theme: themeAlpine },
  { id: 'balham', label: 'Balham', theme: themeBalham },
  { id: 'material', label: 'Material', theme: themeMaterial },
];

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: themes[0],
  updateTheme: () => {},
  spacing: 8,
  updateSpacing: () => {},
  fontSize: 13,
  updateFontSize: () => {},
  fontFamily: 'JetBrains Mono',
  updateFontFamily: () => {},
  accentColor: '#2563eb', // Default blue accent color
  updateAccentColor: () => {},
  allThemes: themes,
  isDarkMode: false,
  toggleDarkMode: () => {},
  savedSettings: [],
  saveSettings: () => "",
  updateSettings: () => {},
  deleteSettings: () => {},
  loadSettings: () => {}
});

// Default settings
const DEFAULT_SETTINGS: Omit<GridSettings, 'id' | 'name'> = {
  spacing: 8,
  fontSize: 13,
  fontFamily: 'JetBrains Mono',
  accentColor: '#2563eb',
  isDarkMode: false
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Fixed to Quartz theme
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>(themes.find(t => t.id === 'quartz') || themes[0]);
  const [spacing, setSpacing] = useState(DEFAULT_SETTINGS.spacing);
  const [fontSize, setFontSize] = useState(DEFAULT_SETTINGS.fontSize);
  const [fontFamily, setFontFamily] = useState(DEFAULT_SETTINGS.fontFamily);
  const [accentColor, setAccentColor] = useState(DEFAULT_SETTINGS.accentColor);
  const [isDarkMode, setIsDarkMode] = useState(DEFAULT_SETTINGS.isDarkMode);
  const [savedSettings, setSavedSettings] = useState<GridSettings[]>([]);

  // Always use Quartz theme
  useEffect(() => {
    // Force Quartz theme
    const quartzTheme = themes.find(t => t.id === 'quartz');
    if (quartzTheme) {
      setCurrentTheme(quartzTheme);
    }
    
    // Load saved settings from localStorage
    const savedSettingsStr = localStorage.getItem('grid-saved-settings');
    if (savedSettingsStr) {
      try {
        const savedPresets = JSON.parse(savedSettingsStr);
        setSavedSettings(savedPresets);
      } catch (e) {
        console.error('Failed to parse saved settings', e);
      }
    }
    
    // Load font family preference
    const savedFontFamily = localStorage.getItem('theme-font-family');
    if (savedFontFamily) {
      setFontFamily(savedFontFamily);
    }
    
    // Load accent color preference
    const savedAccentColor = localStorage.getItem('theme-accent-color');
    if (savedAccentColor) {
      setAccentColor(savedAccentColor);
    }
    
    // Load saved dark mode preference
    const savedDarkMode = localStorage.getItem('dark-mode');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDarkMode = savedDarkMode 
      ? savedDarkMode === 'true' 
      : prefersDarkMode;
    
    setIsDarkMode(initialDarkMode);
    
    // Set initial data-ag-theme-mode attribute
    document.documentElement.dataset.agThemeMode = initialDarkMode ? 'dark' : 'light';
    
    // Set initial dark mode class for Tailwind
    if (initialDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  const updateTheme = (theme: ThemeOption) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme-id', theme.id);
  };

  const updateSpacing = (value: number) => {
    setSpacing(value);
    localStorage.setItem('theme-spacing', value.toString());
  };

  const updateFontSize = (value: number) => {
    setFontSize(value);
    localStorage.setItem('theme-font-size', value.toString());
  };

  const updateFontFamily = (value: string) => {
    setFontFamily(value);
    localStorage.setItem('theme-font-family', value);
  };

  const updateAccentColor = (value: string) => {
    setAccentColor(value);
    localStorage.setItem('theme-accent-color', value);
  };
  
  // Create a new settings preset
  const saveSettings = (name: string) => {
    // Get current grid state from localStorage
    let columnState = null;
    let filterModel = null;
    let sortModel = null;
    
    try {
      const columnStateStr = localStorage.getItem('ag-grid-column-state');
      if (columnStateStr) columnState = JSON.parse(columnStateStr);
      
      const filterModelStr = localStorage.getItem('ag-grid-filter-model');
      if (filterModelStr) filterModel = JSON.parse(filterModelStr);
      
      const sortModelStr = localStorage.getItem('ag-grid-sort-model');
      if (sortModelStr) sortModel = JSON.parse(sortModelStr);
    } catch (error) {
      console.error('Error parsing grid state:', error);
    }
    
    const newSetting: GridSettings = {
      id: Date.now().toString(),
      name,
      spacing,
      fontSize,
      fontFamily,
      accentColor,
      isDarkMode,
      columnState,
      filterModel,
      sortModel
    };
    
    const updatedSettings = [...savedSettings, newSetting];
    setSavedSettings(updatedSettings);
    localStorage.setItem('grid-saved-settings', JSON.stringify(updatedSettings));
    
    console.log('Saved new preset:', newSetting);
    return newSetting.id; // Return the ID of the new setting
  };
  
  // Update an existing settings preset
  const updateSettings = (id: string, newName?: string) => {
    // Get current grid state
    let columnState = null;
    let filterModel = null;
    let sortModel = null;
    
    try {
      const columnStateStr = localStorage.getItem('ag-grid-column-state');
      if (columnStateStr) columnState = JSON.parse(columnStateStr);
      
      const filterModelStr = localStorage.getItem('ag-grid-filter-model');
      if (filterModelStr) filterModel = JSON.parse(filterModelStr);
      
      const sortModelStr = localStorage.getItem('ag-grid-sort-model');
      if (sortModelStr) sortModel = JSON.parse(sortModelStr);
    } catch (error) {
      console.error('Error parsing grid state:', error);
    }
    
    // Find the setting to update
    const updatedSettings = savedSettings.map(setting => {
      if (setting.id === id) {
        return {
          ...setting,
          name: newName || setting.name,
          spacing,
          fontSize,
          fontFamily,
          accentColor,
          isDarkMode,
          columnState,
          filterModel,
          sortModel
        };
      }
      return setting;
    });
    
    setSavedSettings(updatedSettings);
    localStorage.setItem('grid-saved-settings', JSON.stringify(updatedSettings));
    console.log('Updated preset:', id);
  };
  
  // Delete a settings preset
  const deleteSettings = (id: string) => {
    const filteredSettings = savedSettings.filter(setting => setting.id !== id);
    setSavedSettings(filteredSettings);
    localStorage.setItem('grid-saved-settings', JSON.stringify(filteredSettings));
    console.log('Deleted preset:', id);
  };
  
  const loadSettings = (settingsId: string) => {
    console.log('Loading settings with ID:', settingsId);
    const setting = savedSettings.find(s => s.id === settingsId);
    if (!setting) {
      console.error('Setting not found:', settingsId);
      return;
    }
    
    console.log('Found setting:', setting);
    
    // Apply visual theme settings
    setSpacing(setting.spacing);
    setFontSize(setting.fontSize);
    setFontFamily(setting.fontFamily);
    setAccentColor(setting.accentColor);
    setIsDarkMode(setting.isDarkMode);
    
    // Apply dark mode changes
    document.documentElement.dataset.agThemeMode = setting.isDarkMode ? 'dark' : 'light';
    
    if (setting.isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    
    // Save individual theme settings to localStorage
    localStorage.setItem('theme-spacing', setting.spacing.toString());
    localStorage.setItem('theme-font-size', setting.fontSize.toString());
    localStorage.setItem('theme-font-family', setting.fontFamily);
    localStorage.setItem('theme-accent-color', setting.accentColor);
    localStorage.setItem('dark-mode', setting.isDarkMode.toString());
    
    // Save grid state settings to localStorage so they can be picked up by the grid
    if (setting.columnState) {
      localStorage.setItem('ag-grid-column-state', JSON.stringify(setting.columnState));
    }
    
    if (setting.filterModel) {
      localStorage.setItem('ag-grid-filter-model', JSON.stringify(setting.filterModel));
    }
    
    if (setting.sortModel) {
      localStorage.setItem('ag-grid-sort-model', JSON.stringify(setting.sortModel));
    }
    
    // Refresh the grid to apply state changes if a grid is present
    // We use a timeout to ensure this runs after the current execution context
    setTimeout(() => {
      const gridElement = document.querySelector('.ag-root-wrapper');
      if (gridElement) {
        // If grid exists, find DataTable component's gridApi and call methods directly
        try {
          const event = new CustomEvent('preset-loaded');
          document.dispatchEvent(event);
        } catch (error) {
          console.error('Error refreshing grid:', error);
        }
      }
    }, 100);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      
      // Update AG Grid theme mode
      document.documentElement.dataset.agThemeMode = newMode ? 'dark' : 'light';
      
      // Update Tailwind dark mode
      if (newMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
      
      // Save preference
      localStorage.setItem('dark-mode', newMode.toString());
      
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        currentTheme,
        updateTheme,
        spacing,
        updateSpacing,
        fontSize,
        updateFontSize,
        fontFamily,
        updateFontFamily,
        accentColor,
        updateAccentColor,
        allThemes: themes,
        isDarkMode,
        toggleDarkMode,
        savedSettings,
        saveSettings,
        updateSettings,
        deleteSettings,
        loadSettings
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);