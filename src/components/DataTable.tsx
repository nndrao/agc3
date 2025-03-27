import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';
import { 
  ColDef,
  ModuleRegistry,
  GridOptions,
  ValueFormatterParams,
  CellClassParams,
  GridApi,
  GridReadyEvent,
  Theme
} from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import { useTheme } from '../context/ThemeContext';
import { DataToolbar } from "./DataToolbar";

// Register AG Grid Enterprise modules
ModuleRegistry.registerModules([AllEnterpriseModule]);

// ----- Modular Components -----

// Custom Column Types
const useColumnTypes = () => {
  return useMemo(() => ({
    numberColumn: {
      filter: "agNumberColumnFilter",
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value != null ? params.value.toFixed(2) : "-";
      },
      cellClass: (params: CellClassParams) => {
        if (params.value === null) return "";
        return params.value >= 0 ? "positive-value" : "negative-value";
      },
      headerClass: 'ag-right-aligned-header',
      cellStyle: { textAlign: 'right' }
    },
    currencyColumn: {
      filter: "agNumberColumnFilter",
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value != null ? "$" + params.value.toFixed(2) : "-";
      },
      cellClass: (params: CellClassParams) => {
        if (params.value === null) return "";
        return params.value >= 0 ? "positive-value" : "negative-value";
      },
      headerClass: 'ag-right-aligned-header',
      cellStyle: { textAlign: 'right' }
    },
    percentColumn: {
      filter: "agNumberColumnFilter",
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value != null ? params.value.toFixed(2) + "%" : "-";
      },
      cellClass: (params: CellClassParams) => {
        if (params.value === null) return "";
        return params.value >= 0 ? "positive-value" : "negative-value";
      },
      headerClass: 'ag-right-aligned-header',
      cellStyle: { textAlign: 'right' }
    },
  }), []);
};

// Column Definitions
const useColumnDefs = () => {
  return useMemo<ColDef<RowData>[]>(() => [
    { headerName: "Athlete", field: "athlete", filter: true },
    { headerName: "Age", field: "age", filter: true, width: 100, type: 'numberColumn' },
    { headerName: "Country", field: "country", filter: true },
    { headerName: "Year", field: "year", filter: true, width: 100, type: 'numberColumn' },
    { headerName: "Sport", field: "sport", filter: true },
    { headerName: "Gold", field: "gold", filter: true, width: 100, type: 'numberColumn' },
    { headerName: "Silver", field: "silver", filter: true, width: 100, type: 'numberColumn' },
    { headerName: "Bronze", field: "bronze", filter: true, width: 100, type: 'numberColumn' },
    { headerName: "Total", field: "total", filter: true, width: 100, type: 'numberColumn' }
  ], []);
};

// Define extended GridApi interface that includes the missing methods
interface ExtendedGridApi extends GridApi {
  getSortModel?: () => { colId: string; sort: string }[];
  setSortModel?: (model: { colId: string; sort: string }[]) => void;
}

// Grid State Management Hook
const useGridState = () => {
  const gridApiRef = useRef<ExtendedGridApi | null>(null);

  // Save grid state to localStorage
  const saveGridState = useCallback(() => {
    if (!gridApiRef.current) return;
    
    try {
      // Save column state (visibility, order, width, etc)
      const columnState = gridApiRef.current.getColumnState();
      localStorage.setItem('ag-grid-column-state', JSON.stringify(columnState));
      
      // Save filter model
      const filterModel = gridApiRef.current.getFilterModel();
      localStorage.setItem('ag-grid-filter-model', JSON.stringify(filterModel));
      
      // Save sort model - note: some versions use different method names
      let sortModel;
      if (gridApiRef.current.getSortModel) {
        sortModel = gridApiRef.current.getSortModel();
      } else if (typeof gridApiRef.current.getColumnState === 'function') {
        // Extract sort info from column state
        sortModel = gridApiRef.current.getColumnState()
          .filter(col => col.sort)
          .map(col => ({
            colId: col.colId,
            sort: col.sort
          }));
      }
      
      if (sortModel) {
        localStorage.setItem('ag-grid-sort-model', JSON.stringify(sortModel));
      }
    } catch (error) {
      console.error('Error saving grid state:', error);
    }
  }, []);
  
  // Restore grid state from localStorage
  const restoreGridState = useCallback(() => {
    if (!gridApiRef.current) return;
    
    try {
      // Restore column state
      const savedColumnState = localStorage.getItem('ag-grid-column-state');
      if (savedColumnState) {
        const columnState = JSON.parse(savedColumnState);
        gridApiRef.current.applyColumnState({
          state: columnState,
          applyOrder: true
        });
      }
      
      // Restore filter model
      const savedFilterModel = localStorage.getItem('ag-grid-filter-model');
      if (savedFilterModel) {
        const filterModel = JSON.parse(savedFilterModel);
        gridApiRef.current.setFilterModel(filterModel);
      }
      
      // Restore sort model
      const savedSortModel = localStorage.getItem('ag-grid-sort-model');
      if (savedSortModel && gridApiRef.current.setSortModel) {
        try {
          const sortModel = JSON.parse(savedSortModel);
          gridApiRef.current.setSortModel(sortModel);
        } catch (e) {
          console.warn('Could not set sort model:', e);
        }
      } else if (savedSortModel) {
        // Alternative approach to restore sorting
        try {
          const sortModel = JSON.parse(savedSortModel);
          const columnState = gridApiRef.current.getColumnState().map(col => {
            const sortInfo = sortModel.find((sm: {colId: string; sort: string}) => sm.colId === col.colId);
            if (sortInfo) {
              return { ...col, sort: sortInfo.sort };
            }
            return col;
          });
          
          gridApiRef.current.applyColumnState({
            state: columnState,
            applyOrder: true
          });
        } catch (e) {
          console.warn('Could not restore sort model via column state:', e);
        }
      }
    } catch (error) {
      console.error('Error restoring grid state:', error);
    }
  }, []);

  return {
    gridApiRef,
    saveGridState,
    restoreGridState
  };
};

// Grid Theme Parameters Hook
interface GridThemeParams {
  baseTheme: Theme;
  isDarkMode: boolean;
  fontSize: number;
  fontFamily: string;
  accentColor: string;
  borderRadius: number;
  borders: boolean;
  cellBorders: boolean;
  headerBorders: boolean;
  columnBorder: boolean;
  headerColumnBorder: boolean;
  spacing: number;
  rowHeight: number;
  headerHeight: number;
  listItemHeight: number;
  gridSize: number;
  borderWidth: number;
  cellHorizontalPadding: number;
  sideBarWidth: number;
}

const useGridThemeParams = (): GridThemeParams => {
  const { currentTheme, isDarkMode, spacing, fontSize, fontFamily, accentColor } = useTheme();
  
  const themeParams = useMemo<GridThemeParams>(() => {
    // Calculate borderWidth once
    const borderWidth = Math.max(1, Math.floor(spacing / 8));
    
    return {
      // Basic theme parameters
      baseTheme: currentTheme.theme,
      isDarkMode,
      fontSize,
      fontFamily,
      accentColor,
      
      // Fixed visual parameters
      borderRadius: 2,
      borders: true,
      cellBorders: true,
      headerBorders: true,
      columnBorder: true,
      headerColumnBorder: true,
      
      // Dynamic spacing parameter (kept separate for slider)
      spacing,
      
      // Derived spacing values
      rowHeight: spacing * 3,
      headerHeight: spacing * 3,
      listItemHeight: spacing * 2.5,
      gridSize: Math.max(4, spacing / 2),
      borderWidth,
      cellHorizontalPadding: spacing,
      sideBarWidth: 200 + spacing * 5,
    };
  }, [currentTheme.theme, isDarkMode, spacing, fontSize, fontFamily, accentColor]);
  
  return themeParams;
};

// Sample Data Provider
const useSampleData = () => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  
  React.useEffect(() => {
    // Use local data instead of fetch to simplify debugging
    setRowData([
      { athlete: "Michael Phelps", age: 23, country: "United States", year: 2008, sport: "Swimming", gold: 8, silver: 0, bronze: 0, total: 8 },
      { athlete: "Natalie Coughlin", age: 25, country: "United States", year: 2008, sport: "Swimming", gold: 1, silver: 2, bronze: 3, total: 6 },
      { athlete: "Aleksey Nemov", age: 24, country: "Russia", year: 2000, sport: "Gymnastics", gold: 2, silver: 1, bronze: 3, total: 6 },
      { athlete: "Alicia Coutts", age: 24, country: "Australia", year: 2012, sport: "Swimming", gold: 1, silver: 3, bronze: 1, total: 5 },
      { athlete: "Missy Franklin", age: 17, country: "United States", year: 2012, sport: "Swimming", gold: 4, silver: 0, bronze: 1, total: 5 },
      { athlete: "Ryan Lochte", age: 27, country: "United States", year: 2012, sport: "Swimming", gold: 2, silver: 2, bronze: 1, total: 5 },
      { athlete: "Allison Schmitt", age: 22, country: "United States", year: 2012, sport: "Swimming", gold: 3, silver: 1, bronze: 1, total: 5 },
      { athlete: "Natalie Coughlin", age: 21, country: "United States", year: 2004, sport: "Swimming", gold: 2, silver: 2, bronze: 1, total: 5 }
    ]);
  }, []);
  
  return { rowData };
};

// ----- Main Component and Types -----

interface RowData {
  athlete: string;
  age: number;
  country: string;
  year: number;
  sport: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export function DataTable() {
  const { spacing, fontSize, fontFamily, accentColor, currentTheme } = useTheme();
  const { gridApiRef, saveGridState, restoreGridState } = useGridState();
  const themeParams = useGridThemeParams();
  const { rowData } = useSampleData();
  const columnTypes = useColumnTypes();
  const columnDefs = useColumnDefs();

  // Handle theme changes
  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      const { isDarkMode: newDarkMode } = event.detail;
      if (gridApiRef.current) {
        // Update AG Grid theme by updating the container class
        const gridElement = document.querySelector('.ag-theme-quartz, .ag-theme-quartz-dark');
        if (gridElement) {
          gridElement.classList.remove('ag-theme-quartz', 'ag-theme-quartz-dark');
          gridElement.classList.add(newDarkMode ? 'ag-theme-quartz-dark' : 'ag-theme-quartz');
        }
      }
    };

    // Listen for theme changes
    document.addEventListener('theme-changed', handleThemeChange as EventListener);
    
    return () => {
      document.removeEventListener('theme-changed', handleThemeChange as EventListener);
    };
  }, [gridApiRef]);

  // Grid options
  const gridOptions = useMemo<GridOptions>(() => ({
    suppressCellFocus: false,
    rowModelType: "clientSide",
    suppressRowClickSelection: true,
    rowSelection: "multiple",
    enableRangeSelection: true,
    enableCellTextSelection: true,
    pagination: true,
    paginationAutoPageSize: true,
    animateRows: true,
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 60,
    },
    theme: currentTheme.theme,
  }), [currentTheme.theme, spacing, fontSize, fontFamily, accentColor]);

  const gridRef = useRef<AgGridReact<RowData>>(null);
  
  // Container styles
  const containerStyle = useMemo(() => ({ 
    width: "100%", 
    height: "calc(100vh - 7rem)",
    display: "flex",
    flexDirection: "column" as const,
    padding: "1rem",
  }), []);

  const gridStyle = useMemo(() => ({ 
    width: '100%',
    flex: 1,
    borderRadius: '2px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  }), []);

  // Function to apply theme parameters to the grid (defined before it's used in onGridReady)
  const applyGridTheme = useCallback(() => {
    if (!gridApiRef.current) return;
    
    try {
      const { 
        baseTheme, fontSize, fontFamily, accentColor, 
        borderRadius, headerColumnBorder, columnBorder,
        rowHeight, headerHeight, gridSize,
        cellHorizontalPadding, listItemHeight, sideBarWidth
      } = themeParams;
      
      // Create a safe set of parameters that won't crash AG Grid
      const safeParams = {
        fontSize,
        fontFamily,
        accentColor,
        borderRadius,
        headerColumnBorder,
        columnBorder,
        rowHeight,
        headerHeight,
        gridSize,
        cellHorizontalPadding,
        listItemHeight,
        sideBarWidth,
        wrapperBorderRadius: borderRadius,
        inputBorderRadius: borderRadius,
        cardRadius: borderRadius,
        modalRadius: borderRadius
      };
      
      // Apply theme via API
      const theme = baseTheme.withParams(safeParams);
      gridApiRef.current.setGridOption('theme', theme);
    } catch (error) {
      console.error("Error in applyGridTheme:", error);
    }
  }, [themeParams]);

  // Handle grid ready event (defined after applyGridTheme)
  const onGridReady = useCallback((params: GridReadyEvent) => {
    gridApiRef.current = params.api as ExtendedGridApi;
    
    // Set the grid mode (light/dark) immediately
    document.documentElement.dataset.agThemeMode = themeParams.isDarkMode ? 'dark' : 'light';
    
    // Apply initial theme with a small delay to ensure grid is ready
    setTimeout(() => {
      try {
        if (gridApiRef.current) {
          applyGridTheme();
        }
      } catch (error) {
        console.error("Error applying initial theme:", error);
      }
    }, 50);
    
    // Restore previous grid state
    setTimeout(() => {
      try {
        restoreGridState();
      } catch (error) {
        console.error("Error restoring grid state:", error);
      }
    }, 100);
    
    // Force the grid to calculate its dimensions correctly after initialization
    setTimeout(() => {
      try {
        if (gridApiRef.current) {
          gridApiRef.current.sizeColumnsToFit();
        }
      } catch (error) {
        console.error("Error sizing columns:", error);
      }
    }, 200);
  }, [themeParams.isDarkMode, restoreGridState, applyGridTheme]);

  // Update theme when relevant parameters change
  React.useEffect(() => {
    try {
      // Only run this after grid initialization
      if (gridApiRef.current) {
        applyGridTheme();
      }
    } catch (error) {
      console.error("Error updating theme:", error);
    }
  }, [themeParams, applyGridTheme]);

  // Register preset loaded listener
  React.useEffect(() => {
    const handlePresetLoaded = () => {
      console.log('Preset loaded event received - restoring grid state');
      restoreGridState();
    };
    
    document.addEventListener('preset-loaded', handlePresetLoaded);
    
    return () => {
      document.removeEventListener('preset-loaded', handlePresetLoaded);
    };
  }, [restoreGridState]);

  return (
    <div style={containerStyle}>
      <DataToolbar onRefresh={() => {}} onAddNew={() => {}} />
      <div style={gridStyle} className="mt-3">
        <AgGridReact<RowData>
          {...gridOptions}
          ref={gridRef}
          rowData={rowData}
          sideBar={true}
          columnDefs={columnDefs}
          columnTypes={columnTypes}
          onGridReady={onGridReady}
          loadThemeGoogleFonts={true}
          onFilterChanged={saveGridState}
          onSortChanged={saveGridState}
          onColumnMoved={saveGridState}
          onColumnResized={saveGridState}
          onColumnVisible={saveGridState}
          onColumnPinned={saveGridState}
        />
      </div>
    </div>
  );
}