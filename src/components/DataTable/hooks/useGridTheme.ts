import { useMemo } from 'react';
import { Theme, themeQuartz } from 'ag-grid-community';
import { DataTableTheme } from '../types';

// Default theme values
const DEFAULT_THEME: Required<DataTableTheme> = {
  isDarkMode: false,
  fontSize: 14,
  fontFamily: 'Inter',
  accentColor: '#2563eb',
  positiveColor: '#00FFBA',
  negativeColor: '#FF3B3B',
  spacing: 6,
  baseTheme: themeQuartz
};

/**
 * Generates a theme configuration for AG Grid
 */
export function useGridTheme(themeOptions: Partial<DataTableTheme> = {}): {
  theme: Theme;
  gridClassName: string;
  themeParams: Required<DataTableTheme>;
} {
  // Merge default theme with provided options
  const themeParams = useMemo(() => {
    return {
      ...DEFAULT_THEME,
      ...themeOptions,
    };
  }, [themeOptions]);

  // Determine the grid class name based on dark mode
  const gridClassName = useMemo(() => {
    return themeParams.isDarkMode 
      ? 'ag-theme-quartz-dark' 
      : 'ag-theme-quartz';
  }, [themeParams.isDarkMode]);

  // Create a customized theme (simplified for brevity)
  const theme = useMemo(() => {
    return themeQuartz;
  }, []);

  return { theme, gridClassName, themeParams };
} 