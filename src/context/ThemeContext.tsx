import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  themeAlpine, 
  themeQuartz, 
  themeBalham, 
  themeMaterial
} from 'ag-grid-community';
import type { Theme } from 'ag-grid-community';

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
  allThemes: ThemeOption[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
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
  allThemes: themes,
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to Quartz theme
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>(themes[0]);
  const [spacing, setSpacing] = useState(8); // Default AG Grid spacing
  const [fontSize, setFontSize] = useState(13); // Default AG Grid font size
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    const savedThemeId = localStorage.getItem('theme-id');
    if (savedThemeId) {
      const savedTheme = themes.find(t => t.id === savedThemeId);
      if (savedTheme) {
        setCurrentTheme(savedTheme);
      }
    }
    
    // Reset to default AG Grid spacing
    setSpacing(8);
    // Reset to default AG Grid font size
    setFontSize(13);
    
    // Clear any saved spacing and font size preferences to ensure defaults are used
    localStorage.removeItem('theme-spacing');
    localStorage.removeItem('theme-font-size');

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
        allThemes: themes,
        isDarkMode,
        toggleDarkMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);