import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';
import { 
  ColDef,
  ModuleRegistry,
  GridOptions,
  ValueFormatterParams,
  GridApi,
  GridReadyEvent,
  Theme,
  CellStyle,
  themeQuartz
} from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import { useTheme } from '../context/ThemeContext';
import { DataToolbar } from "./DataToolbar";
import { generatePositions, formatPositionValue } from "../lib/dummyData";
import type { Position } from "../lib/dummyData";

// Register AG Grid Enterprise modules
ModuleRegistry.registerModules([AllEnterpriseModule]);

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
  const { spacing, fontSize, fontFamily, accentColor, currentTheme, isDarkMode } = useTheme();
  
  const themeParams = useMemo<GridThemeParams>(() => {
    // Calculate borderWidth once
    const borderWidth = Math.max(1, Math.floor(spacing / 8));
    
    return {
      baseTheme: currentTheme.theme,
      isDarkMode,
      fontSize,
      fontFamily,
      accentColor,
      borderRadius: 2,
      borders: true,
      cellBorders: true,
      headerBorders: true,
      columnBorder: true,
      headerColumnBorder: true,
      spacing,
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

// Custom theme configuration with dynamic parameters
const getCustomTheme = (isDarkMode: boolean, themeParams: GridThemeParams) => {
  return themeQuartz
    .withParams(
      {
        accentColor: "#8AAAA7",
        backgroundColor: "#F7F7F7",
        borderColor: "#23202029",
        browserColorScheme: "light",
        buttonBorderRadius: 2,
        cellTextColor: "#000000",
        checkboxBorderRadius: 2,
        columnBorder: true,
        fontFamily: {
          googleFont: "Inter",
        },
        fontSize: themeParams.fontSize,
        headerBackgroundColor: "#EFEFEFD6",
        headerFontFamily: {
          googleFont: "Inter",
        },
        headerFontSize: themeParams.fontSize,
        headerFontWeight: 500,
        iconButtonBorderRadius: 1,
        iconSize: 12,
        inputBorderRadius: 2,
        oddRowBackgroundColor: "#EEF1F1E8",
        spacing: themeParams.spacing,
        wrapperBorderRadius: 2,
      },
      "light"
    )
    .withParams(
      {
        accentColor: "#8AAAA7",
        backgroundColor: "#1f2836",
        borderRadius: 2,
        checkboxBorderRadius: 2,
        columnBorder: true,
        fontFamily: {
          googleFont: "Inter",
        },
        browserColorScheme: "dark",
        chromeBackgroundColor: {
          ref: "foregroundColor",
          mix: 0.07,
          onto: "backgroundColor",
        },
        fontSize: themeParams.fontSize,
        foregroundColor: "#FFF",
        headerFontFamily: {
          googleFont: "Inter",
        },
        headerFontSize: themeParams.fontSize,
        iconSize: 12,
        inputBorderRadius: 2,
        oddRowBackgroundColor: "#2A2E35",
        spacing: themeParams.spacing,
        wrapperBorderRadius: 2,
      },
      "dark"
    );
};

// ----- Modular Components -----

// Custom Column Types
const useColumnTypes = () => {
  return useMemo(() => ({
    customNumeric: {
      filter: "agNumberColumnFilter",
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value != null ? params.value.toFixed(2) : "-";
      },
      headerClass: 'ag-right-aligned-header',
      cellStyle: (params: ValueFormatterParams) => ({ 
        textAlign: 'right',
        color: params.value >= 0 ? '#00FFBA' : '#FF3B3B'
      }) as CellStyle
    },
    customCurrency: {
      filter: "agNumberColumnFilter",
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value != null ? "$" + params.value.toFixed(2) : "-";
      },
      headerClass: 'ag-right-aligned-header',
      cellStyle: (params: ValueFormatterParams) => ({ 
        textAlign: 'right',
        color: params.value >= 0 ? '#00FFBA' : '#FF3B3B'
      }) as CellStyle
    },
    customPercent: {
      filter: "agNumberColumnFilter",
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value != null ? params.value.toFixed(2) + "%" : "-";
      },
      headerClass: 'ag-right-aligned-header',
      cellStyle: (params: ValueFormatterParams) => ({ 
        textAlign: 'right',
        color: params.value >= 0 ? '#00FFBA' : '#FF3B3B'
      }) as CellStyle
    },
  }), []);
};

// Column Definitions
const useColumnDefs = () => {
  return useMemo<ColDef<Position>[]>(() => [
    {
      field: "symbol",
      headerName: "Symbol",
      pinned: "left",
      initialWidth: 100,
    },
    {
      field: "name",
      headerName: "Name",
      pinned: "left",
      initialWidth: 150,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      initialWidth: 100,
      type: 'customNumeric',
      valueFormatter: (params) => formatPositionValue(params.value, 'number'),
      cellStyle: { textAlign: 'right' } as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "avgPrice",
      headerName: "Avg Price",
      initialWidth: 120,
      type: 'customCurrency',
      valueFormatter: (params) => formatPositionValue(params.value, 'currency'),
      cellStyle: { textAlign: 'right' } as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "currentPrice",
      headerName: "Current Price",
      initialWidth: 120,
      type: 'customCurrency',
      valueFormatter: (params) => formatPositionValue(params.value, 'currency'),
      cellStyle: { textAlign: 'right' } as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "marketValue",
      headerName: "Market Value",
      initialWidth: 120,
      type: 'customCurrency',
      valueFormatter: (params) => formatPositionValue(params.value, 'currency'),
      cellStyle: { textAlign: 'right' } as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "pnl",
      headerName: "PnL",
      initialWidth: 120,
      type: 'customCurrency',
      valueFormatter: (params) => formatPositionValue(params.value, 'currency'),
      cellStyle: (params) => ({ 
        textAlign: 'right',
        backgroundColor: params.value >= 0 ? 'rgba(0, 255, 186, 0.1)' : 'rgba(255, 59, 59, 0.1)',
        color: params.value >= 0 ? '#00FFBA' : '#FF3B3B'
      }) as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "pnlPercentage",
      headerName: "PnL %",
      initialWidth: 120,
      type: 'customPercent',
      valueFormatter: (params) => formatPositionValue(params.value, 'percentage'),
      cellStyle: (params) => ({ 
        textAlign: 'right',
        backgroundColor: params.value >= 0 ? 'rgba(0, 255, 186, 0.1)' : 'rgba(255, 59, 59, 0.1)',
        color: params.value >= 0 ? '#00FFBA' : '#FF3B3B'
      }) as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "dailyPnL",
      headerName: "Daily PnL",
      initialWidth: 120,
      type: 'customCurrency',
      valueFormatter: (params) => formatPositionValue(params.value, 'currency'),
      cellStyle: (params) => ({ 
        textAlign: 'right',
        backgroundColor: params.value >= 0 ? 'rgba(0, 255, 186, 0.1)' : 'rgba(255, 59, 59, 0.1)',
        color: params.value >= 0 ? '#00FFBA' : '#FF3B3B'
      }) as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "dailyPnLPercentage",
      headerName: "Daily PnL %",
      initialWidth: 120,
      type: 'customPercent',
      valueFormatter: (params) => formatPositionValue(params.value, 'percentage'),
      cellStyle: (params) => ({ 
        textAlign: 'right',
        backgroundColor: params.value >= 0 ? 'rgba(0, 255, 186, 0.1)' : 'rgba(255, 59, 59, 0.1)',
        color: params.value >= 0 ? '#00FFBA' : '#FF3B3B'
      }) as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "volume",
      headerName: "Volume",
      initialWidth: 120,
      type: 'customNumeric',
      valueFormatter: (params) => formatPositionValue(params.value, 'number'),
      cellStyle: (params) => ({ 
        textAlign: 'right',
        color: params.value >= 0 ? '#00FFBA' : '#FF3B3B'
      }) as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "openInterest",
      headerName: "Open Interest",
      initialWidth: 120,
      type: 'customNumeric',
      valueFormatter: (params) => formatPositionValue(params.value, 'number'),
      cellStyle: (params) => ({ 
        textAlign: 'right',
        color: params.value >= 0 ? '#00FFBA' : '#FF3B3B'
      }) as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "delta",
      headerName: "Delta",
      initialWidth: 120,
      type: 'customNumeric',
      valueFormatter: (params) => formatPositionValue(params.value, 'number'),
      cellStyle: (params) => ({ 
        textAlign: 'right',
        color: params.value >= 0 ? '#00FFBA' : '#FF3B3B'
      }) as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "gamma",
      headerName: "Gamma",
      initialWidth: 120,
      type: 'customNumeric',
      valueFormatter: (params) => formatPositionValue(params.value, 'number'),
      cellStyle: (params) => ({ 
        textAlign: 'right',
        color: params.value >= 0 ? '#00FFBA' : '#FF3B3B'
      }) as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "theta",
      headerName: "Theta",
      initialWidth: 120,
      type: 'customNumeric',
      valueFormatter: (params) => formatPositionValue(params.value, 'number'),
      cellStyle: (params) => ({ 
        textAlign: 'right',
        color: params.value >= 0 ? '#00FFBA' : '#FF3B3B'
      }) as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "vega",
      headerName: "Vega",
      initialWidth: 120,
      type: 'customNumeric',
      valueFormatter: (params) => formatPositionValue(params.value, 'number'),
      cellStyle: (params) => ({ 
        textAlign: 'right',
        color: params.value >= 0 ? '#00FFBA' : '#FF3B3B'
      }) as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "impliedVolatility",
      headerName: "IV",
      initialWidth: 120,
      type: 'customPercent',
      valueFormatter: (params) => formatPositionValue(params.value, 'percentage'),
      cellStyle: (params) => ({ 
        textAlign: 'right',
        color: params.value >= 0 ? '#00FFBA' : '#FF3B3B'
      }) as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "realizedVolatility",
      headerName: "RV",
      initialWidth: 120,
      type: 'customPercent',
      valueFormatter: (params) => formatPositionValue(params.value, 'percentage'),
      cellStyle: (params) => ({ 
        textAlign: 'right',
        color: params.value >= 0 ? '#00FFBA' : '#FF3B3B'
      }) as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "beta",
      headerName: "Beta",
      initialWidth: 120,
      type: 'customNumeric',
      valueFormatter: (params) => formatPositionValue(params.value, 'number'),
      cellStyle: (params) => ({ 
        textAlign: 'right',
        color: params.value >= 0 ? '#00FFBA' : '#FF3B3B'
      }) as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "correlation",
      headerName: "Correlation",
      initialWidth: 120,
      type: 'customNumeric',
      valueFormatter: (params) => formatPositionValue(params.value, 'number'),
      cellStyle: (params) => ({ 
        textAlign: 'right',
        color: params.value >= 0 ? '#00FFBA' : '#FF3B3B'
      }) as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "sharpeRatio",
      headerName: "Sharpe",
      initialWidth: 120,
      type: 'customNumeric',
      valueFormatter: (params) => formatPositionValue(params.value, 'number'),
      cellStyle: (params) => ({ 
        textAlign: 'right',
        color: params.value >= 0 ? '#00FFBA' : '#FF3B3B'
      }) as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "sortinoRatio",
      headerName: "Sortino",
      initialWidth: 120,
      type: 'customNumeric',
      valueFormatter: (params) => formatPositionValue(params.value, 'number'),
      cellStyle: (params) => ({ 
        textAlign: 'right',
        color: params.value >= 0 ? '#00FFBA' : '#FF3B3B'
      }) as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "maxDrawdown",
      headerName: "Max DD",
      initialWidth: 120,
      type: 'customPercent',
      valueFormatter: (params) => formatPositionValue(params.value, 'percentage'),
      cellStyle: { 
        textAlign: 'right',
        color: '#FF3B3B' // Always red for drawdown
      } as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "var95",
      headerName: "VaR 95%",
      initialWidth: 120,
      type: 'customCurrency',
      valueFormatter: (params) => formatPositionValue(params.value, 'currency'),
      cellStyle: { 
        textAlign: 'right',
        color: '#FF3B3B' // Always red for VaR
      } as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "var99",
      headerName: "VaR 99%",
      initialWidth: 120,
      type: 'customCurrency',
      valueFormatter: (params) => formatPositionValue(params.value, 'currency'),
      cellStyle: { 
        textAlign: 'right',
        color: '#FF3B3B' // Always red for VaR
      } as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "expectedShortfall",
      headerName: "ES",
      initialWidth: 120,
      type: 'customCurrency',
      valueFormatter: (params) => formatPositionValue(params.value, 'currency'),
      cellStyle: { 
        textAlign: 'right',
        color: '#FF3B3B' // Always red for ES
      } as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
    {
      field: "stressTestLoss",
      headerName: "Stress Loss",
      initialWidth: 120,
      type: 'customCurrency',
      valueFormatter: (params) => formatPositionValue(params.value, 'currency'),
      cellStyle: { 
        textAlign: 'right',
        color: '#FF3B3B' // Always red for stress loss
      } as CellStyle,
      headerClass: 'ag-right-aligned-header',
    },
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

// Sample Data Provider
const useSampleData = () => {
  const [rowData, setRowData] = useState<Position[]>([]);
  
  useEffect(() => {
    // Generate initial data
    setRowData(generatePositions(20));
  }, []);
  
  return { rowData };
};

// ----- Main Component and Types -----

export function DataTable() {
  const { isDarkMode } = useTheme();
  const { gridApiRef, saveGridState, restoreGridState } = useGridState();
  const themeParams = useGridThemeParams();
  const { rowData } = useSampleData();
  const columnTypes = useColumnTypes();
  const columnDefs = useColumnDefs();

  // Grid options with dynamic theme
  const gridOptions = useMemo<GridOptions>(() => ({
    suppressCellFocus: false,
    rowModelType: "clientSide",
    rowSelection: {
      mode: "multiRow",
      enableClick: false
    },
    cellSelection: true,
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
    theme: getCustomTheme(isDarkMode, themeParams),
    className: isDarkMode ? 'ag-theme-quartz-dark' : 'ag-theme-quartz',
  }), [isDarkMode, themeParams]);

  const gridRef = useRef<AgGridReact<Position>>(null);
  
  // Container styles
  const containerStyle = useMemo(() => ({ 
    width: "100%", 
    height: "calc(100vh - 7rem)",
    display: "flex",
    flexDirection: "column" as const,
    padding: "1.5rem",
    gap: "1rem",
    backgroundColor: isDarkMode ? 'rgba(24, 24, 24, 0.4)' : 'rgba(248, 248, 248, 0.4)',
    backdropFilter: 'blur(8px)',
    borderRadius: '12px',
    boxShadow: isDarkMode 
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
      : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  }), [isDarkMode]);

  const gridStyle = useMemo(() => ({ 
    width: '100%',
    flex: 1,
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: isDarkMode
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
  }), [isDarkMode]);

  // Handle grid ready event
  const onGridReady = useCallback((params: GridReadyEvent) => {
    gridApiRef.current = params.api as ExtendedGridApi;
    
    // Restore previous grid state and handle column sizing
    setTimeout(() => {
      try {
        // Get saved column state
        const savedColumnState = localStorage.getItem('ag-grid-column-state');
        if (savedColumnState) {
          const columnState = JSON.parse(savedColumnState);
          // Apply saved column state
          gridApiRef.current?.applyColumnState({
            state: columnState,
            applyOrder: true
          });
        } else {
          // If no saved state, auto-size columns
          gridApiRef.current?.sizeColumnsToFit();
        }
        
        // Restore other grid state (filters, sorting)
        restoreGridState();
      } catch (error) {
        console.error("Error restoring grid state:", error);
        // Fallback to auto-sizing if state restoration fails
        gridApiRef.current?.sizeColumnsToFit();
      }
    }, 100);
  }, [restoreGridState]);

  return (
    <div style={containerStyle}>
      <DataToolbar onRefresh={() => {}} onAddNew={() => {}} />
      <div style={gridStyle}>
        <AgGridReact<Position>
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